<template>
  <div class="search">
    <a-card>
      <!--头部搜索和查询-->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter.native="handleSearch">
          <a-row :gutter="24">
            <a-col :md="6" :sm="8">
              <a-form-item :label="$t('OrderStats.orderNo')" prop="name">
                <a-input
                  type="text"
                  allowClear
                  v-model="ipagination.condition.orderNo"
                  :placeholder="$t('order.pleaseInput')"
                />
              </a-form-item>
            </a-col>
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-col :md="12" :sm="12">
                <a-button type="primary" style="left: 10px" @click="handleSearch" icon="search">
                  {{ $t('order.search') }}
                </a-button>
                <a-button type="primary" @click="handleReset" icon="reload" style="margin-left: 8px; left: 10px">
                  {{ $t('order.reset') }}
                </a-button>
                <download-excel
                  class="export-excel-wrapper"
                  :data="exportDatas"
                  :fields="exportJsonFiled"
                  :before-generate="startDownload"
                  type="xls"
                  :name="'我的代办' + new Date().getTime() + '.xls'"
                >
                  <a-button type="primary" icon="download"> {{ $t('common.export') }} </a-button>
                </download-excel>
              </a-col>
            </span>
          </a-row>
        </a-form>
      </div>
      <!--table列表-->
      <a-row>
        <a-table
          :scroll="{ x: true }"
          bordered
          :loading="loading"
          rowKey="taskId"
          :dataSource="dataSource"
          :pagination="ipagination"
          @change="handleTableChange"
          ref="table"
        >
          <a-table-column :title="$t('OrderStats.orderNo')" dataIndex="orderNo" align="center">
            <template slot-scope="t, r, i">
              <span> {{ t }} </span>
            </template>
          </a-table-column>
          <a-table-column :title="$t('OrderStats.title')" dataIndex="orderTitle" align="center">
            <template slot-scope="t, r, i">
              <j-ellipsis :value="t" :length="11" />
            </template>
          </a-table-column>
          <a-table-column :title="$t('order.taskName')" dataIndex="taskName" align="center">
            <template slot-scope="t">
              <span> {{ t }} </span>
            </template>
          </a-table-column>
          <a-table-column :title="$t('order.processOf')" dataIndex="processName" align="center">
            <template slot-scope="t, r, i">
              <span> {{ t }} </span>
            </template>
          </a-table-column>
          <a-table-column :title="$t('OrderStats.groupOf')" dataIndex="groupName" align="center">
            <template slot-scope="t">
              <span> {{ t }} </span>
            </template>
          </a-table-column>
          <a-table-column :title="$t('OrderStats.applyer')" dataIndex="applyerName" align="center">
            <template slot-scope="t">
              <span> {{ t }} </span>
            </template>
          </a-table-column>
          <a-table-column :title="$t('order.taskClient')" dataIndex="ownerName" align="center">
            <template slot-scope="t">
              <span> {{ t }} </span>
            </template>
          </a-table-column>
          <a-table-column :title="$t('order.createTime')" dataIndex="createTime" align="center">
            <template slot-scope="t">
              <span>{{ t }}</span>
            </template>
          </a-table-column>
          -->
          <a-table-column :title="$t('common.operation')" dataIndex="action" align="center" fixed="right" :width="220">
            <template slot-scope="t, r, i">
              <a href="javascript:void(0);" @click="passTask(r)">
                {{ $t('order.previewAndHandle') }}
              </a>
              <a-divider type="vertical" />
              <span
                v-if="Boolean(r.isSuspended)"
                style="cursor: no-drop; color: #999999"
                :title="$t('order.processHangup')"
              >
                {{ $t('order.previewAndHandle') }} <a-divider type="vertical" /> {{ $t('order.delegeOtherHandle') }}
                <a-divider type="vertical" />
              </span>
              <span v-else>
                <a href="javascript:void(0);" @click="backTask(r)">{{ $t('order.reject') }}</a>
                <a-divider type="vertical" />
                <a href="javascript:void(0);" @click="delegateTask(r)">{{ $t('order.delegeOtherHandle') }}</a>
                <a-divider type="vertical" />
              </span>
              <a href="javascript:void(0);" @click="progressTask(r)">{{ $t('erp.progress') }}</a>
            </template>
          </a-table-column>
        </a-table>
      </a-row>
      <!--表单数据-->
      <!-- <form-show ref='lcfs' v-model='node' @apply_success='submitTask' :clickable='disabled'></form-show> -->
      <!--流程表单-->
      <LaisonCustomeFormShow2
        ref="lcfs"
        v-model="node"
        :opts="opts"
        @apply_success="submitTask"
      ></LaisonCustomeFormShow2>

      <!--提交通过信息-->
      <submit-order
        :suggest-label="$t('order.confirmRemark')"
        :suggest-label-warn="$t('order.confirmRemarkError')"
        ref="modalSubmit"
        @submitOk="submitOk"
      ></submit-order>
      <!--驳回任务-->
      <back-order ref="modalBack" @backOk="backOk"></back-order>
      <!--委托任务-->
      <delegate-order ref="modalDelegate" @delegateOk="delegateOk"></delegate-order>
      <!--任务进度-->
      <j-modal-erp :title="buildProgressTitle()" :visible="showTaskProgress" @cancel="showTaskProgress = false">
        <div v-if="showTaskProgress">
          <component :is="TaskProgressBpmn" :value="taskProgress"></component>
        </div>
      </j-modal-erp>
    </a-card>
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin';
import { activitiMixin } from '@/views/activiti/mixins/activitiMixin';
import ErpTask from '@/api/ErpTask';
import ErpConfig from '@/api/ErpConfig';
import ErpBusiness from '@/api/ErpBusiness';
import LaisonCustomeFormShow2 from '@comp/laison/LaisonCustomeFormShow2';
import SubmitOrder from '@views/activiti/form/SubmitOrder';
import BackOrder from '@views/activiti/form/BackOrder';
import DelegateOrder from '@views/activiti/form/DelegateOrder';
import JModalErp from '@/views/erp/ordermanager/modal/JModalErp.vue';
const ExcelExportFields = [
  {
    title: '品质审批完成时间',
    dataIndex: 'auditTime',
  },
  {
    title: '订单编号',
    dataIndex: 'orderNo',
  },
  {
    title: '订单类型',
    dataIndex: 'orderType',
  },
  {
    title: '下单人员',
    dataIndex: 'applyName',
  },
  {
    title: '下单部门',
    dataIndex: 'applyDeptName',
  },
  {
    title: '客户名称',
    dataIndex: 'customerName',
  },
  {
    title: '终端客户名称',
    dataIndex: 'endCustomerName',
  },
  {
    title: '排序',
    dataIndex: 'sortNo',
  },
  {
    title: '存货编码',
    dataIndex: 'stockCode',
  },

  {
    title: '存货名称',
    dataIndex: 'stockName',
  },
  {
    title: '规格型号',
    dataIndex: 'specificationMode',
  },
  {
    title: '规格描述',
    dataIndex: 'specificationIntro',
  },
  {
    title: '销售数量',
    dataIndex: 'saleCount',
  },
  {
    title: '赠送数量',
    dataIndex: 'giftCount',
  },
  {
    title: '合计',
    dataIndex: 'totalCount',
  },
  {
    title: '期望出货日期',
    dataIndex: 'expectedTime',
  },
];

export default {
  name: 'MyTodoTask',
  mixins: [JeecgListMixin, activitiMixin],
  components: { LaisonCustomeFormShow2, SubmitOrder, BackOrder, DelegateOrder, JModalErp },
  data() {
    return {
      // isFullScreen: false,
      columns: [
        {
          title: this.$t('OrderStats.orderNo'),
          dataIndex: 'orderNo',
          align: 'center',
        },
        {
          title: this.$t('OrderStats.title'),
          ellipsis: true,
          dataIndex: 'taskName',
          align: 'center',
        },
        {
          title: this.$t('order.taskName'),
          dataIndex: 'orderTitle',
          align: 'center',
        },
        {
          title: this.$t('order.processOf'),
          dataIndex: 'processName',
          align: 'center',
        },
        {
          title: this.$t('OrderStats.groupOf'),
          dataIndex: 'groupName',
          align: 'center',
        },
        {
          title: this.$t('OrderStats.applyer'),
          dataIndex: 'applyerName',
          align: 'center',
        },
        {
          title: this.$t('order.taskClient'),
          dataIndex: 'ownerName',
          align: 'center',
        },
        {
          title: this.$t('order.createTime'),
          dataIndex: 'createTime',
          align: 'center',
        },
        {
          title: this.$t('common.operation'),
          // dataIndex: 'action',
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
        },
      ],
      opts: { type: 3 },
    };
  },
  mounted() {},
  created() {
    this.loadData();
    let config = this.$store.getters.userInfo.sysDept.config.erpOrderStatsListFiled;
    config = config === undefined ? 0 : config;
    ExcelExportFields.forEach((v, index) => {
      //生成导出字段
      if (v.dataIndex == 'stockCode') {
        let f = {
          field: 'stockCode',
          callback: (value) => {
            return value + '&nbsp';
          },
        };
        this.exportJsonFiled[v.title] = f;
      } else {
        this.exportJsonFiled[v.title] = v.dataIndex;
      }
    });
    // for (let i = 0; i < 30; i++) {
    //   let j = 1 << i
    //   if ((config & j) !== 0) {
    //     //为真说明这个字段需要删除
    //     let filedname = API.filedList[i]
    //     this.columns.forEach((v, index) => {
    //       if (v.dataIndex === filedname) {
    //         this.columns.splice(index, 1)
    //         delete this.exportJsonFiled[v.title] //去掉不需要的导出字段
    //       }
    //     })
    //   }
    // }
  },
  methods: {
    handleSearch() {
      this.loadData();
    },
    handleReset() {
      this.ipagination.condition.orderNo = '';
      this.loadData();
    },
    async startDownload() {
      this.loading = true;
      let temp = await ErpTask.buildTodoExportData(this.ipagination);
      if (!temp) {
        this.$message.error('导出错误');
        this.loading = false;

        return;
      } else if (temp.code != 0) {
        this.$message.info('暂无导出数据');
        this.loading = false;

        return;
      }

      this.exportDatas = temp.data;
      this.loading = false;
    },
    loadData(page) {
      this.ipagination.current = page ? page : 1;
      this.loading = true;
      this.dataSource = [];
      ErpTask.myTodoTask(this.ipagination)
        .then((res) => {
          this.loading = false;
          if (res.success) {
            this.dataSource = res.data.list || [];
            this.ipagination.total = res.data.total;
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    //分页、排序、筛选变化时触发
    handleTableChange(pagination, filters, sorter) {
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field;
        this.isorter.order = 'ascend' === sorter.order ? 'asc' : 'desc';
      }
      this.ipagination = pagination;
      this.loadData(pagination.current);
    },
    /**
     * 通过任务
     * 第一步获取提交的表单数据
     * 第二步如果填写表单完成后，则弹出部分录入信息
     * 第三步将所有填写的信息提交给服务端
     */
    async passTask(task) {
      this.opts.type = 3;

      this.loading = true;
      let res = await ErpConfig.findPreNodeDesignFormInfo(task);
      this.loading = false;
      let formInfo = res.data;
      formInfo.taskId = task.taskId;

      this.showLcfsForm(formInfo);
    },
    submitTask(task) {
      this.$refs.modalSubmit.show(task);
    },
    submitOk(task) {
      //提交数据
      if (!task) return;
      this.loading = true;
      if (task.erpFormVal) {
        task.formData = task.erpFormVal.formData;
      }
      ErpBusiness.submit(task)
        .then((res) => {
          if (res.success) {
            this.loadData();
          } else {
            this.loading = false;
            this.$message.error(res.errors);
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    //驳回任务
    backTask(task) {
      this.$refs.modalBack.show(task);
    },
    backOk(task) {
      if (!task) return;
      console.log('SELECT_tASK', task);
      this.loading = true;
      ErpTask.backTask(task)
        .then((res) => {
          if (res.success) {
            this.loadData();
          } else {
            this.loading = false;
            this.$message.error(res.errors);
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    //委托任务
    delegateTask(task) {
      this.$refs.modalDelegate.show(task);
    },
    delegateOk(task) {
      if (!task) return;
      this.loading = true;
      ErpTask.delegateTask(task)
        .then((res) => {
          if (res.success) {
            this.loadData();
            this.$message.success(this.$t('order.delegateSuccess'));
          } else {
            this.loading = false;
            this.$message.error(res.errors);
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },

    //任务执行历史记录
    async progressTask(task) {
      let res = await ErpTask.taskProgress({ procDefId: task.procDefId, procInstId: task.procInstId });
      this.showTaskProgress = res.success;
      this.taskProgress = res.data;
    },
  },
};
</script>

<style lang="less" scoped>
.export-excel-wrapper {
  display: inline-block;
  margin-left: 19px;
}
</style>
