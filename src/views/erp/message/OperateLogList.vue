<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item :label="$t('Statistics.operator')">
              <!--                  <a-input hidden v-model="pageInfo.condition.userId"></a-input>-->
              <a-input v-model="pageInfo.condition.realname" @click="showUserSelect" allow-clear @change="userChange"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item :label="$t('OperateLog.uri')">
              <a-input v-model="pageInfo.condition.uri" :maxLength="100" allow-clear></a-input>
              <!-- <a-select :options="ruiItem" v-model="pageInfo.condition.uri" :placeholder="$t('OperateLog.uri')"> </a-select> -->
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="6">
            <a-form-item :label="$t('OperateLog.queryTime')">
              <a-range-picker :default-value="queryTimeDefaultValue" @change="queryTimeChange" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="6">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="loadData" icon="search">{{ $t('common.query') }}</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">{{ $t('common.reset') }}</a-button>
              <download-excel class="export-excel-wrapper" :data="exportDatas" :fields="exportJsonFiled" :before-generate="startDownload" type="xls" name="OperateLogList.xls">
                <a-button type="primary"> {{ $t('common.export') }} </a-button>
              </download-excel>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button v-if="showAdd()" @click="handleAdd" v-show="show" type="primary" icon="plus">{{ $t('common.add') }}</a-button>
      <a-button v-if="showExport()" type="primary" v-show="show" icon="download" @click="handleExportXls">{{ $t('common.export') }}</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table ref="table" size="middle" :scroll="{ x: 1500 }" bordered rowKey="id" :columns="columns" :dataSource="dataSource" :pagination="pageInfo" :loading="loading" @change="handleTableChange">
        <span slot="paramBtn" slot-scope="text, record">
          <a-button @click="paramInfo(record)" type="primary" style="border-radius: 30px">
            <a-icon type="message" theme="twoTone" style="font-size: 24px;" />
          </a-button>
        </span>
        <span slot="resultBtn" slot-scope="text, record">
          <a-button @click="resultInfo(record)" type="primary" style="border-radius: 30px">
            <a-icon type="message" theme="twoTone" style="font-size: 24px;" />
          </a-button>
        </span>
        <span slot="ip" slot-scope="ip">
          <a-tag color="green">
            {{ ip }}
          </a-tag>
        </span>
        <span slot="uri" slot-scope="uri">
          <a-popover trigger="hover">
            <template slot="content">
              <a-tag color="blue">
                {{ uri }}
              </a-tag>
            </template>

            <a-icon type="link" style="font-size: 24px;" />
          </a-popover>
        </span>
        <span slot="consumeTime" slot-scope="consumeTime">
          <a-tag color="orange"> {{ consumeTime }}ms </a-tag>
        </span>

        <span slot="action" slot-scope="text, record">
          <a-divider type="vertical" v-if="showEdit(record)" />
          <a @click="handleEdit(record)" v-if="showEdit(record)">{{ $t('common.edit') }}</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <!--    <operate-log-modal ref="modalForm" @ok="modalFormOk"></operate-log-modal>-->
    <LaisonUserSelect ref="userSelect" @ok="userSelected"></LaisonUserSelect>
  </a-card>
</template>

<script>
import OperateLogModal from '@views/erp/message/modules/OperateLogModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JEllipsis from '@/components/jeecg/JEllipsis'
import LaisonUserSelect from '@/components/laison/LaisonUserSelect'
import API from '@/api/OperateLog'
import moment from 'moment'
export default {
  name: 'OperateLogList',
  mixins: [JeecgListMixin],
  components: {
    JEllipsis,
    OperateLogModal,
    LaisonUserSelect
  },
  data() {
    return {
      description: 'OperateLog管理',
      // 新增修改按钮是否显示
      orderByClause: 'time desc',
      show: true,
      pageInfo: {
        condition: {
          realname: ''
        }
      },
      //需要查询的uri数组
      ruiItem: [
        { value: '/index/getSuzeIndexData', label: '/index/getSuzeIndexData' },
        { value: '/actMsg/listByUser', label: '/actMsg/listByUser' },
        { value: '/statistics/trade/getOperatorList', label: '/statistics/trade/getOperatorList' }
      ],
      // 表头
      columns: [
        // {
        //     title: this.$t('AmiMeterTask.id'),
        //     dataIndex: '',
        //     key: 'rowIndex',
        //     width: 60,
        //     align: "center",
        //     customRender: function (t, r, index) {
        //     return parseInt(index) + 1;
        //     }
        // },
        {
          title: this.$t('OperateLog.userId'),
          align: 'center',
          dataIndex: 'userId',
          customRender: (text, record, index) => {
            //字典值替换通用方法
            return record.sysUser == undefined ? '' : record.sysUser.realname
          }
        },
        {
          title: this.$t('OperateLog.deptName'),
          align: 'center',
          dataIndex: 'deptId',
          customRender: (text, record, index) => {
            //字典值替换通用方法
            return record.sysDept == undefined ? '' : record.sysDept.name
          }
        },
        {
          title: this.$t('OperateLog.ip'),
          align: 'center',
          dataIndex: 'ip',
          scopedSlots: { customRender: 'ip' }
        },
        {
          title: this.$t('OperateLog.time'),
          align: 'center',
          dataIndex: 'time'
        },
        {
          title: this.$t('OperateLog.uri'),
          align: 'center',
          dataIndex: 'uri'
          //scopedSlots: { customRender: 'uri' }
        },
        {
          title: this.$t('OperateLog.param'),
          align: 'center',
          dataIndex: 'param',
          scopedSlots: { customRender: 'paramBtn' }
        },
        {
          title: this.$t('OperateLog.result'),
          align: 'center',
          dataIndex: 'result',
          scopedSlots: { customRender: 'resultBtn' }
        },
        {
          title: this.$t('OperateLog.consumeTime'),
          align: 'center',
          dataIndex: 'consumeTime',
          scopedSlots: { customRender: 'consumeTime' }
        }
      ]
    }
  },
  created() {
    this.pageInfo.condition.orderByClause = this.orderByClause

    //初始化查询条件的时间范围
    this.pageInfo.condition.startTime = this.moment()
      .add(-3, 'M')
      .startOf('day')
      .format('YYYY-MM-DD HH:mm:ss') //开始时间是当前时间减去3个月
    this.pageInfo.condition.endTime = this.moment()
      .endOf('day')
      .format('YYYY-MM-DD HH:mm:ss') //结束时间是当天
    this.queryTimeDefaultValue[0] = this.moment(this.pageInfo.condition.startTime, 'YYYY-MM-DD')
    this.queryTimeDefaultValue[1] = this.moment(this.pageInfo.condition.endTime, 'YYYY-MM-DD')

    let config = this.$store.getters.userInfo.sysDept.config.operateLogListFiled
    config = config == undefined ? 0 : config

    this.columns.forEach((v, index) => {
      //生成导出字段
      if (v.dataIndex && v.dataIndex != 'action') {
        this.exportJsonFiled[v.title] = v.dataIndex
      }
    })
    for (let i = 0; i < 30; i++) {
      let j = 1 << i
      if ((config & j) != 0) {
        //为真说明这个字段需要删除
        let filedname = API.filedList[i]
        this.columns.forEach((v, index) => {
          if (v.dataIndex == filedname) {
            this.columns.splice(index, 1)
            delete this.exportJsonFiled[v.title] //去掉不需要的导出字段
          }
        })
      }
    }

    this.loadData()
  },
  computed: {},
  methods: {
    moment,
    showUserSelect() {
      this.$refs.userSelect.show()
    },
    userChange() {
      console.log('userChange')
      if (this.pageInfo.condition.realname == '') {
        this.$set(this.pageInfo.condition, 'userId', null)
      }
    },
    userSelected(userInfo) {
      console.log('userSelected')
      if (userInfo != undefined || userInfo != null) {
        this.$set(this.pageInfo.condition, 'realname', userInfo.realname)
        this.$set(this.pageInfo.condition, 'userId', userInfo.id)
      }
    },
    paramInfo(record) {
      const h = this.$createElement
      this.$info({
        // icon: '<Icon type="">',
        title: '参数信息',
        content: h('div', {}, [record.param]),
        onOk() {}
      })
    },
    resultInfo(record) {
      const h = this.$createElement
      this.$info({
        // icon: '<Icon type="">',
        title: '结果',
        content: h('div', {}, [record.result]),
        onOk() {}
      })
    },
    loadData() {
      this.loading = true
      API.findByPage(this.pageInfo).then(res => {
        this.dataSource = res.list
        this.pageInfo.total = res.total
        this.loading = false
      })
    },
    async startDownload() {
      this.loading = true
      this.exportDatas = await API.findByAll(this.pageInfo)
      this.loading = false
    },
    handleAdd: function() {
      let obj = Object.assign({}, API.defaultObject)
      this.$refs.modalForm.add(obj)
      this.$refs.modalForm.title = "$t('form.add)'"
      this.$refs.modalForm.disableSubmit = false
    },
    handleDelete(id) {
      //要真删除用 API.realDeleteById(id)
      API.deleteById(id).then(res => {
        if (res.code === 0) {
          this.$message.success(res.msg)
        } else {
          this.$message.warning(res.errors)
        }
        this.loadData()
      })
    },
    handleRealDelete(id) {
      API.realDeleteById(id).then(res => {
        if (res.code === 0) {
          this.$message.success(res.msg)
        } else {
          this.$message.warning(res.errors)
        }
        this.loadData()
      })
    },
    showAdd(item) {
      return this.$store.getters.userInfo.permissions.includes('operateLog:add')
    },
    showExport() {
      return this.$store.getters.userInfo.permissions.includes('meterType:export')
    },
    showEdit(item) {
      return this.$store.getters.userInfo.permissions.includes('operateLog:update')
    },
    showDelete(item) {
      return this.$store.getters.userInfo.permissions.includes('operateLog:delete')
    },
    hasPermission(permission) {
      return this.$store.getters.userInfo.permissions.includes(permission)
    },
    showRealDel() {
      return this.$store.getters.userInfo.id == '1'
    },
    getConfig() {
      return this.$store.getters.userInfo.sysDept.config
    },
    showFiled(filedName) {
      let config = this.$store.getters.userInfo.sysDept.config.meterTypeAddFiled
      config = config == undefined ? 0 : config
      let indexOfFiled = API.filedList.indexOf(filedName)
      let flag = 1 << indexOfFiled
      return !(config & flag)
    }
  }
}
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
