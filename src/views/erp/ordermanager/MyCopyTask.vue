<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <!--订单编号-->
          <a-col :md="6" :sm="8">
            <a-form-item :label="$t('OrderStats.orderNo')">
              <a-input :placeholder="$t('OrderStats.inputOrderNo')" v-model="pageInfo.condition.orderNo"></a-input>
            </a-form-item>
          </a-col>
          <!--订单标题-->
          <a-col :md="6" :sm="8">
            <a-form-item :label="$t('erp.orderTitle')">
              <a-input :placeholder="$t('erp.inputOrderTitle')" v-model="pageInfo.condition.title"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item :label="$t('order.result')">
              <a-select v-model="pageInfo.condition.result" :placeholder="$t('order.pleaseSelect')" :allowClear="true">
                <a-select-option value="0">{{ $t('order.notSubmit') }}</a-select-option>
                <a-select-option value="1">{{ $t('order.inAudit') }}</a-select-option>
                <a-select-option value="2">{{ $t('order.finished') }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!--重置-->
          <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
            <a-col :md="18" :sm="12">
              <a-button type="primary" @click="searchQuery" icon="search">{{ $t('common.query') }}</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 10px">{{
                $t('common.reset')
              }}</a-button>
            </a-col>
          </span>
        </a-row>
      </a-form>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        :scroll="{ x: true }"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pageInfo"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <!--历史/进度-->
          <a href="javascript:;" v-if="record.status !== 0" @click="onProgressOrder(record)">
            {{ record.status === 1 || record.status === 4 ? $t('erp.progress') : $t('erp.history') }}
          </a>
          <a-divider type="vertical" v-if="record.status !== 0" />
          <!--详情-->
          <a href="javascript:;" @click="onDetailOrder(record)">
            {{ $t('erp.detail') }}
          </a>
        </span>
      </a-table>
    </div>
    <!--流程表单-->
    <!--流程表单-->
    <LaisonCustomeFormShow2
      ref="lcfs"
      v-model="node"
      :opts="{ type: 4 }"
      @apply_success="applyok"
    ></LaisonCustomeFormShow2>
    <!-- 
     type:
      0:创建-applyOrder 
      1-翻单 
      2-复制 （订单类型）-CopyTask
      3-编辑-edit
      4-查看-DoneTask
      5-审批-TodoTask
     -->

    <!-- 任务历史 -->
    <j-modal-erp :title="buildProgressTitle()" :visible="showTaskProgress" @cancel="showTaskProgress = false">
      <div v-if="showTaskProgress">
        <component :is="TaskProgressBpmn" :value="taskProgress"></component>
      </div>
    </j-modal-erp>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin';
import { activitiMixin } from '@/views/activiti/mixins/activitiMixin';
import JEllipsis from '@/components/jeecg/JEllipsis';
import API from '@/api/ErpBusiness';
import TaskApi from '@/api/ErpTask';
import ConfigApi from '@/api/ErpConfig';
import moment from 'moment';
import LaisonCustomeFormShow2 from '@/components/laison/LaisonCustomeFormShow2';
import TaskProgressBpmn from '@views/activiti/TaskProgressBpmn';
import JModalErp from '@/views/erp/ordermanager/modal/JModalErp.vue';

export default {
  name: 'OrderStats',
  mixins: [JeecgListMixin, activitiMixin],
  components: {
    JEllipsis,
    LaisonCustomeFormShow2,
    TaskProgressBpmn,
    JModalErp,
  },
  data() {
    return {
      description: '我的发起',
      // 新增修改按钮是否显示
      orderByClause: 'create_time desc',
      show: true,
      clickable: false,
      // 表头
      labelCol: {
        xs: { span: 4 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 20 },
      },
      // 表头
      columns: [
        {
          title: this.$t('OrderStats.orderNo'),
          align: 'center',
          width: '160',
          dataIndex: 'orderNo',
        },
        {
          title: this.$t('OrderStats.title'),
          align: 'center',
          width: '160',
          dataIndex: 'title',
        },
        {
          title: this.$t('erp.taskName'),
          align: 'center',
          width: '160',
          dataIndex: 'nodeName',
        },
        {
          title: this.$t('OrderStats.status'),
          align: 'center',
          width: '140',
          dataIndex: 'statusName',
        },
        {
          title: this.$t('OrderStats.result'),
          align: 'center',
          width: '140',
          dataIndex: 'resultName',
        },
        {
          title: this.$t('OrderStats.applyer'),
          align: 'center',
          width: '120',
          dataIndex: 'applyName',
        },
        {
          title: this.$t('OrderStats.applyTime'),
          align: 'center',
          width: '150',
          dataIndex: 'applyTime',
        },
        {
          title: this.$t('common.operation'),
          dataIndex: 'action',
          fixed: 'right',
          align: 'center',
          width: '160',
          scopedSlots: { customRender: 'action' },
        },
      ],
    };
  },
  created() {
    this.pageInfo.condition.orderByClause = this.orderByClause;
    if (this.$store.getters.userInfo.id != '1') {
      this.pageInfo.condition.delFlag = 0;
    }

    //初始化查询条件的时间范围
    this.pageInfo.condition.startTime = this.moment()
      .locale('en_US')
      .add(-3, 'M')
      .startOf('day')
      .format('YYYY-MM-DD HH:mm:ss'); //开始时间是当前时间减去3个月
    this.pageInfo.condition.endTime = this.moment().locale('en_US').endOf('day').format('YYYY-MM-DD HH:mm:ss'); //结束时间是当天
    this.queryTimeDefaultValue[0] = this.moment(this.pageInfo.condition.startTime, 'YYYY-MM-DD');
    this.queryTimeDefaultValue[1] = this.moment(this.pageInfo.condition.endTime, 'YYYY-MM-DD');
    let config = this.$store.getters.userInfo.sysDept.config.OrderStatsListFiled;
    config = config == undefined ? 0 : config;
    this.columns.forEach((v, index) => {
      //生成导出字段
      if (v.dataIndex && v.dataIndex != 'action') {
        this.exportJsonFiled[v.title] = v.dataIndex;
      }
    });
    for (let i = 0; i < 30; i++) {
      let j = 1 << i;
      if ((config & j) != 0) {
        //为真说明这个字段需要删除
        let filedname = API.filedList[i];
        this.columns.forEach((v, index) => {
          if (v.dataIndex == filedname) {
            this.columns.splice(index, 1);
            delete this.exportJsonFiled[v.title]; //去掉不需要的导出字段
          }
        });
      }
    }
    this.loadData();
  },
  computed: {},
  methods: {
    moment,
    loadData() {
      this.loading = true;
      this.pageInfo.condition.genType = this.ORDER_TYPE;
      TaskApi.myCopyTask(this.pageInfo)
        .then((res) => {
          this.pageInfo.total = res.data.total;
          this.dataSource = res.data.list;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    /**
     * 详情
     */
    onDetailOrder(order) {
      // order.nodeType = 1
      this.findSelectDesignFormInfo(order, true);
    },

    /**
     * 数据查看
     * todo 暂时只看当前节点信息 还有首次进来不能进入
     */
    findSelectDesignFormInfo(order, unclickables) {
      this.loading = true;
      order.orderId = order.erpOrder.id;

      console.log('[order]: ', order);
      ConfigApi.findSelectDesignFormInfo(order)
        .then((res) => {
          this.loading = false;
          if (res.code !== 0) {
            this.$message.error(res.errors);
            return;
          }
          res.data.title = order.title;
          this.showLcfsForm(res.data);
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(JSON.stringify(err));
        });
    },
    hasPermission(permission) {
      return this.$store.getters.userInfo.permissions.includes(permission);
    },
    getConfig() {
      return this.$store.getters.userInfo.sysDept.config;
    },
    showFiled(filedName) {
      let config = this.$store.getters.userInfo.sysDept.config.OrderStatsAddFiled;
      config = config == undefined ? 0 : config;
      let indexOfFiled = API.filedList.indexOf(filedName);
      let flag = 1 << indexOfFiled;
      return !(config & flag);
    },
    onDateChange: function (value, dateString) {
      this.pageInfo.condition.createTime_begin = dateString[0];
      this.pageInfo.condition.createTime_end = dateString[1];
    },
    applyok() {},
  },
};
</script>
<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 3px;
}

.ant-card-body .table-operator {
  margin-bottom: 18px;
}

.ant-table-tbody .ant-table-row td {
  padding-top: 15px;
  padding-bottom: 15px;
}

.anty-row-operator button {
  margin: 0 5px;
}

.ant-btn-danger {
  background-color: #ffffff;
}

.ant-modal-cust-warp {
  height: 100%;
}

.ant-modal-cust-warp .ant-modal-body {
  height: calc(100% - 110px) !important;
  overflow-y: auto;
}

.ant-modal-cust-warp .ant-modal-content {
  height: 90% !important;
  overflow-y: hidden;
}

.export-excel-wrapper {
  display: inline-block;
  margin-left: 8px;
}
</style>
