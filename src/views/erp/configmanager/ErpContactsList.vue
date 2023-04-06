<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="6">
            <a-form-item :label="$t('ErpContacts.name')">
              <a-input v-model="pageInfo.condition.name" :placeholder="$t('ErpContacts.name')"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="6">
            <a-form-item :label="$t('OperateLog.queryTime')">
              <a-range-picker :default-value="queryTimeDefaultValue" @change="queryTimeChange" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="6">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">{{ $t('common.query') }}</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">{{ $t('common.reset') }}</a-button>
              <download-excel v-if="showExport()" class="export-excel-wrapper" :data="exportDatas" :fields="exportJsonFiled" :before-generate="startDownload" type="xls" name="ErpContactsList.xls">
                <a-button type="primary" icon="download"> {{ $t('common.export') }} </a-button>
              </download-excel>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button v-if="showAdd()" @click="handleAdd" v-show="show" type="primary" icon="plus">{{ $t('common.add') }} </a-button>
      <a-button v-if="showExport()" type="primary" v-show="show" icon="download" @click="handleExportXls">
        {{ $t('common.export') }}
      </a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete" />
            {{ $t('common.delete') }}
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          {{ $t('common.deleteAll') }}
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table ref="table" size="middle" :scroll="{ x: true }" bordered rowKey="id" :columns="columns" :dataSource="dataSource" :pagination="pageInfo" :loading="loading" @change="handleTableChange">
        <span slot="action" slot-scope="text, record">
          <a href="javascript:;" @click="handleDetail(record)">{{ $t('common.detail') }}</a>
          <a-divider type="vertical" v-if="showEdit(record)" />
          <a @click="handleEdit(record)" v-if="showEdit(record)">{{ $t('common.edit') }}</a>
          <a-divider type="vertical" v-if="showDelete(record)" />
          <a-popconfirm v-if="showDelete(record)" :title="$t('common.delete')" @confirm="() => handleDelete(record.id)">
            <a>{{ $t('common.delete') }}</a>
          </a-popconfirm>
          <a-divider type="vertical" v-if="showRealDel()" />
          <a-popconfirm v-if="showRealDel()" :title="$t('common.realDelete')" @confirm="() => handleRealDelete(record.id)">
            <a>{{ $t('common.realDelete') }}</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <erp-contacts-modal ref="modalForm" @ok="modalFormOk"></erp-contacts-modal>
  </a-card>
</template>

<script>
import ErpContactsModal from './modules/ErpContactsModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JEllipsis from '@/components/jeecg/JEllipsis'
import API from '@/api/ErpContacts'
import moment from 'moment'

export default {
  name: 'ErpContactsList',
  mixins: [JeecgListMixin],
  components: {
    JEllipsis,
    ErpContactsModal,
  },
  data() {
    return {
      description: 'ErpContacts管理',
      // 新增修改按钮是否显示
      orderByClause: 'create_time desc',
      show: true,
      // 表头
      columns: [
        {
          title: this.$t('ErpContacts.id'),
          align: 'left',
          dataIndex: 'id',
        },
        {
          title: this.$t('ErpContacts.name'),
          align: 'left',
          dataIndex: 'name',
        },
        {
          title: this.$t('ErpContacts.mobile'),
          align: 'left',
          dataIndex: 'mobile',
        },
        {
          title: this.$t('ErpContacts.telephone'),
          align: 'left',
          dataIndex: 'telephone',
        },
        {
          title: this.$t('ErpContacts.email'),
          align: 'left',
          dataIndex: 'email',
        },
        {
          title: this.$t('ErpContacts.position'),
          align: 'left',
          dataIndex: 'position',
        },
        {
          title: this.$t('ErpContacts.regionCode'),
          align: 'left',
          dataIndex: 'regionPath',
        },
        {
          title: this.$t('ErpContacts.address'),
          align: 'left',
          dataIndex: 'address',
        },
        {
          title: this.$t('ErpContacts.status'),
          align: 'left',
          dataIndex: 'status',
          customRender: function (t, r, index) {
            return t ? '禁用' : '启用'
          },
        },
        {
          title: this.$t('ErpContacts.delFlag'),
          align: 'left',
          dataIndex: 'delFlag',
          customRender: function (t, r, index) {
            return t ? '是' : '否'
          },
        },
        {
          title: this.$t('ErpContacts.createBy'),
          align: 'left',
          dataIndex: 'createName',
        },
        {
          title: this.$t('ErpContacts.createTime'),
          align: 'left',
          dataIndex: 'createTime',
        },
        {
          title: this.$t('ErpContacts.updateBy'),
          align: 'left',
          dataIndex: 'updateBy',
        },
        {
          title: this.$t('ErpContacts.updateTime'),
          align: 'left',
          dataIndex: 'updateTime',
        },
        {
          title: this.$t('ErpContacts.deptId'),
          align: 'left',
          dataIndex: 'deptName',
        },
        {
          title: this.$t('common.operation'),
          dataIndex: 'action',
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
        },
      ],
    }
  },
  created() {
    this.pageInfo.condition.orderByClause = this.orderByClause
    if (this.$store.getters.userInfo.id != '1') {
      this.pageInfo.condition.delFlag = 0
    }

    //初始化查询条件的时间范围
    this.pageInfo.condition.startTime = this.moment().locale('en_US').add(-3, 'M').startOf('day').format('YYYY-MM-DD HH:mm:ss') //开始时间是当前时间减去3个月
    this.pageInfo.condition.endTime = this.moment().locale('en_US').endOf('day').format('YYYY-MM-DD HH:mm:ss') //结束时间是当天
    this.queryTimeDefaultValue[0] = this.moment(this.pageInfo.condition.startTime, 'YYYY-MM-DD')
    this.queryTimeDefaultValue[1] = this.moment(this.pageInfo.condition.endTime, 'YYYY-MM-DD')
    let config = this.$store.getters.userInfo.sysDept.config.erpContactsListFiled
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
    loadData() {
      this.loading = true
      API.findByPage(this.pageInfo).then((res) => {
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
    handleAdd: function () {
      let obj = Object.assign({}, API.defaultObject)
      this.$refs.modalForm.add(obj)
      this.$refs.modalForm.title = "$t('form.add)'"
      this.$refs.modalForm.disableSubmit = false
    },
    handleDelete(id) {
      //要真删除用 API.realDeleteById(id)
      API.deleteById(id).then((res) => {
        if (res.code === 0) {
          this.$message.success(res.msg)
        } else {
          this.$message.warning(res.errors)
        }
        this.loadData()
      })
    },
    handleRealDelete(id) {
      API.realDeleteById(id).then((res) => {
        if (res.code === 0) {
          this.$message.success(res.msg)
        } else {
          this.$message.warning(res.errors)
        }
        this.loadData()
      })
    },
    showAdd(item) {
      return this.$store.getters.userInfo.permissions.includes('erpContacts:add')
    },
    showExport() {
      return this.$store.getters.userInfo.permissions.includes('erpContacts:export')
    },
    showEdit(item) {
      return this.$store.getters.userInfo.permissions.includes('erpContacts:update')
    },
    showDelete(item) {
      return this.$store.getters.userInfo.permissions.includes('erpContacts:delete')
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
      let config = this.$store.getters.userInfo.sysDept.config.erpContactsAddFiled
      config = config == undefined ? 0 : config
      let indexOfFiled = API.filedList.indexOf(filedName)
      let flag = 1 << indexOfFiled
      return !(config & flag)
    },
  },
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
