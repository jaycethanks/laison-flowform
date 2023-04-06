<template>
  <a-card :bordered="false">
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" v-show="show" type="primary" icon="plus">{{ $t('common.add') }} </a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        :scroll="{ x: 1500 }"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pageInfo"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)" v-if="showEdit(record)">查看修改</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <erp-config-modal ref="modalForm" @ok="loadData()"></erp-config-modal>
  </a-card>
</template>

<script>
import ErpConfigModal from './modules/ErpConfigModal';
import { JeecgListMixin } from '@/mixins/JeecgListMixin';
import JEllipsis from '@comp/jeecg/JEllipsis';
import API from '@/api/ErpConfig';
import extendJsonConfigModal from '@views/system/modules/extendJsonConfigModal.vue';
import LaisonInputEdit from '@comp/laison/LaisonInputEdit';

LaisonInputEdit;
import moment from 'moment';

export default {
  name: 'ErpConfigList',
  mixins: [JeecgListMixin],
  components: {
    JEllipsis,
    ErpConfigModal,
    extendJsonConfigModal,
    LaisonInputEdit,
  },
  data() {
    return {
      description: 'ErpConfig管理',
      // 新增修改按钮是否显示
      orderByClause: 'id asc',
      show: true,
      // 表头
      columns: [
        {
          title: this.$t('ErpConfig.id'),
          align: 'center',
          dataIndex: 'id',
        },
        {
          title: this.$t('ErpConfig.configName'),
          align: 'center',
          dataIndex: 'configName',
          customRender: (text, record, index) => {
            let that = this;
            let props = {};
            props['value'] = record.configName;
            let a = <LaisonInputEdit {...{ props }} />;
            let callBack = function (data) {
              record.configName = data;
              API.update(record).then((res) => that.loadData());
            };

            // //a.componentOptions = {}
            a.componentOptions.listeners = {};
            a.componentOptions.listeners.input = callBack;
            return a;
          },
        },
        {
          title: this.$t('ErpConfig.configCode'),
          align: 'center',
          dataIndex: 'configCode',
          customRender: (text, record, index) => {
            let that = this;
            let props = {};
            props['value'] = record.configCode;
            let a = <LaisonInputEdit {...{ props }} />;
            let callBack = function (data) {
              record.configCode = data;
              API.update(record).then((res) => that.loadData());
            };

            // //a.componentOptions = {}
            a.componentOptions.listeners = {};
            a.componentOptions.listeners.input = callBack;
            return a;
          },
        },
        // {
        //   title: this.$t('ErpConfig.allProps'),
        //   align: 'center',
        //   dataIndex: 'allProps',
        //   width: 250,
        //   customRender: (text, record, index) => {
        //     let props = {}
        //     let that = this
        //     props['cusProp'] = record.allProps //报数据传过去
        //     props['title'] = '点击查看编辑全部属性有哪些'
        //     let a = <extendJsonConfigModal {...{ props }} />
        //     //添加cusEvent事件函数
        //     let callBack = function (data) {
        //       record.allProps = data
        //       API.update(record).then((res) => that.loadData())
        //     }
        //     a.componentOptions.listeners = {}
        //     a.componentOptions.listeners.cusEvent = callBack

        //     return a
        //   },
        // },
        {
          title: this.$t('ErpConfig.configJson'),
          align: 'center',
          dataIndex: 'configJson',
          customRender: (text, record, index) => {
            let props = {};

            props['cusProp'] = record.configJson; //报数据传过去
            props['title'] = '点击查看数据';
            let a = <extendJsonConfigModal {...{ props }} />;
            //添加cusEvent事件函数
            let callBack = function (data) {
              console.log('返回的数据是', data, record);
            };
            a.componentOptions.listeners = {};
            a.componentOptions.listeners.cusEvent = callBack;

            return a;
          },
        },
        {
          title: this.$t('ErpConfig.deptId'),
          align: 'center',
          dataIndex: 'deptId',
        },
        {
          title: this.$t('ErpConfig.remark'),
          align: 'center',
          dataIndex: 'remark',
        },
        {
          title: this.$t('ErpConfig.columns'),
          align: 'center',
          dataIndex: 'columns',
          width: 350,
          customRender: (text, record, index) => {
            let props = {};

            props['cusProp'] = record.columns; //报数据传过去
            props['title'] = '点击查看编辑columns数据';
            let a = <extendJsonConfigModal {...{ props }} />;
            //添加cusEvent事件函数
            let that = this;
            let callBack = function (data) {
              console.log('返回的数据是', data, record);
              record.columns = data;
              API.update(record).then((res) => that.loadData());
            };
            a.componentOptions.listeners = {};
            a.componentOptions.listeners.cusEvent = callBack;
            window.x = a;
            return a;
          },
        },
        {
          title: this.$t('common.operation'),
          dataIndex: 'action',
          fixed: 'right',
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
    let config = this.$store.getters.userInfo.sysDept.config.erpConfigListFiled;
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
      API.findByPage(this.pageInfo).then((res) => {
        this.dataSource = res.list;
        this.pageInfo.total = res.total;
        this.loading = false;
        //this.$forceUpdate()
      });
    },
    async startDownload() {
      this.loading = true;
      this.exportDatas = await API.findByAll(this.pageInfo);
      this.loading = false;
    },
    handleAdd: function () {
      let data = this.dataSource;
      if (data && data.length > 0) {
        let addItem = JSON.parse(JSON.stringify(data[data.length - 1]));
        delete addItem['id'];
        API.add(addItem);
        this.loadData();
        this.$forceUpdate();
      } else {
        //无数据
      }
    },
    handleDelete(id) {
      //要真删除用 API.realDeleteById(id)
      API.deleteById(id).then((res) => {
        if (res.code === 0) {
          this.$message.success(res.msg);
        } else {
          this.$message.warning(res.errors);
        }
        this.loadData();
      });
    },
    handleRealDelete(id) {
      API.realDeleteById(id).then((res) => {
        if (res.code === 0) {
          this.$message.success(res.msg);
        } else {
          this.$message.warning(res.errors);
        }
        this.loadData();
      });
    },
    showAdd(item) {
      return this.$store.getters.userInfo.permissions.includes('erpConfig:add');
    },
    showExport() {
      return this.$store.getters.userInfo.permissions.includes('erpConfig:export');
    },
    showEdit(item) {
      return this.$store.getters.userInfo.permissions.includes('erpConfig:update');
    },
    showDelete(item) {
      return this.$store.getters.userInfo.permissions.includes('erpConfig:delete');
    },
    hasPermission(permission) {
      return this.$store.getters.userInfo.permissions.includes(permission);
    },
    showRealDel() {
      return this.$store.getters.userInfo.id == '1';
    },
    getConfig() {
      return this.$store.getters.userInfo.sysDept.config;
    },
    showFiled(filedName) {
      let config = this.$store.getters.userInfo.sysDept.config.meterTypeAddFiled;
      config = config == undefined ? 0 : config;
      let indexOfFiled = API.filedList.indexOf(filedName);
      let flag = 1 << indexOfFiled;
      return !(config & flag);
    },
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
