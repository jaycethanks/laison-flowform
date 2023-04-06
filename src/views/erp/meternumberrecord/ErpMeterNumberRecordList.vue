<template>
  <a-card :bordered='false'>

    <!-- 查询区域 -->
    <div class='table-page-search-wrapper'>
      <a-form layout='inline' @keyup.enter.native='handleSearch'>
        <a-row :gutter='24'>
          <a-col :md='6' :sm='8'>
            <a-form-item :label="$t('OrderStats.orderNo')" prop='name'>
              <a-input type='text' allowClear v-model='pageInfo.condition.orderNo'
                       :placeholder="$t('order.pleaseInput')" />
            </a-form-item>
          </a-col>
          <a-col :md='6' :sm='8'>
            <a-form-item :label="$t('ErpMeterNumberRecord.stockCode')" prop='stockCode'>
              <a-input type='text' allowClear v-model='pageInfo.condition.stockCode'
                       :placeholder="$t('order.pleaseInput')" />
            </a-form-item>
          </a-col>
          <a-col :md='6' :sm='6'>
            <a-form-item :label="$t('ErpMeterNumberRecord.roleCode')">
              <a-select :placeholder="$t('ErpMeterNumberRecord.selectRoleCode')" v-model='pageInfo.condition.roleCode'>
                <a-select-option v-for='(item, i) in meterRules' :key='i' :value='item.codeNumber'>
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md='6' :sm='6'>
            <a-form-item :label="$t('ErpMeterNumberRecord.meterNumber')" prop='meterNumber'>
              <a-input type='text' allowClear v-model='pageInfo.condition.meterNumber'
                       :placeholder="$t('ErpMeterNumberRecord.inputMeterNumber')" />
            </a-form-item>
          </a-col>
          <a-col :md='6' :sm='6'>
            <a-form-item :label="$t('ErpMeterNumberRecord.state')">
              <a-select :placeholder="$t('ErpMeterNumberRecord.selectState')" v-model='pageInfo.condition.state'>
                <a-select-option v-for='(item, i) in recordStatus' :key='i' :value='item.state'>
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md='6' :sm='6'>
            <a-form-item :label="$t('ErpMeterNumberRecord.queryTime')">
              <a-range-picker :default-value='queryTimeDefaultValue' @change='queryTimeChange' />
            </a-form-item>
          </a-col>
          <span style='float: right; overflow: hidden' class='table-page-search-submitButtons'>
              <a-col :md='12' :sm='12'>
                <a-button type='primary' @click='handleAddOrEdit(0)' icon='plus'>
                  {{ $t('common.add') }}
                </a-button>
<!--                <download-excel-->
<!--                  style='margin-left: 8px'-->
<!--                  class='export-excel-wrapper'-->
<!--                  :data='exportDatas'-->
<!--                  :fields='exportJsonFiled'-->
<!--                  :before-generate='startDownload'-->
<!--                  type='xls'-->
<!--                  :name="'我的代办' + new Date().getTime() + '.xls'"-->
<!--                >-->
<!--                  <a-button icon='download'> {{ $t('common.export') }} </a-button>-->
<!--                </download-excel>-->

                <a-button type='primary' @click='searchQuery' style='margin-left: 8px' icon='search'>
                  {{ $t('common.query') }}
                </a-button>
                <a-button  @click='searchReset' icon='reload' style='margin-left: 8px'>
                  {{ $t('common.reset') }}
                </a-button>
              </a-col>
            </span>
        </a-row>
      </a-form>
    </div>
    <!-- table区域-begin -->
    <div>
      <a-table
        ref='table'
        size='middle'
        :scroll='{x:true}'
        bordered
        rowKey='id'
        :columns='columns'
        :dataSource='dataSource'
        :pagination='pageInfo'
        :loading='loading'
        @change='handleTableChange'>

        <span slot='stateName' slot-scope='text, record'>
          <a-tag
            :color="
              record.state === 0 //待提交
                ? ''
                : record.state === 1 //'处理中'
                ? 'blue'
                : 'red'
            "
          >
            {{ text }}
          </a-tag>
        </span>

        <span slot='fileUrl' slot-scope='text,record'>
           <div class='dd-cover' @click='onFileUrlClick(record, text)'>
            <j-ellipsis :value='text' :length='20' />
           </div>
        </span>

        <span slot='action' slot-scope='text, record'>
          <a href='javascript:;' @click='handleDetail(record)'>{{ $t('common.detail') }}</a>
          <a-divider type='vertical' v-if='showEdit(record)' />
          <a @click='handleAddOrEdit(1,record)' v-if='showEdit(record)'>{{ $t('common.edit') }}</a>
           <a-divider type='vertical' v-if='!!record.fileUrl' />
          <a  v-if='!!record.fileUrl' @click='downloadMeterFile(record)' >下载</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <erp-meter-number-record-modal ref='modalForm' @ok='modalFormOk'></erp-meter-number-record-modal>
    <!--新增和修改表单数据-->
    <erp-meter-number-record-add-modal ref='modalAddForm' @ok='modalAddFormOk'></erp-meter-number-record-add-modal>
  </a-card>
</template>

<script>
import ErpMeterNumberRecordModal from './modules/ErpMeterNumberRecordModal'
import ErpMeterNumberRecordAddModal from './modules/ErpMeterNumberRecordAddModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JEllipsis from '@/components/jeecg/JEllipsis'
import API from '@/api/ErpMeterNumberRecord'
import moment from 'moment'
import ErpConfig from '../../../api/ErpConfig'

export default {
  name: 'ErpMeterNumberRecordList',
  mixins: [JeecgListMixin],
  components: {
    JEllipsis,
    ErpMeterNumberRecordModal,
    ErpMeterNumberRecordAddModal
  },
  data() {
    return {
      description: 'ErpMeterNumberRecord管理',
      // 新增修改按钮是否显示
      orderByClause: 'create_time desc',
      show: true,
      recordStatus: [
        {
          id: 0,
          state: 1,
          name: '使用中'
        },
        {
          id: 1,
          state: 2,
          name: '已作废'
        },
        {
          id: 2,
          state: 0,
          name: '未使用'
        }
      ],
      meterRules: [],
      // 表头
      columns: [
        // {
        //   title: this.$t('ErpMeterNumberRecord.id'),
        //   dataIndex: 'id'
        // },
        {
          title: this.$t('ErpMeterNumberRecord.orderId'),
          dataIndex: 'orderNo'
        },
        {
          title: this.$t('ErpMeterNumberRecord.stockCode'),
          dataIndex: 'stockCode'
        },
        {
          title: this.$t('ErpMeterNumberRecord.state'),
          dataIndex: 'stateName',
          sorter: (a, b) => a.state - b.state,
          scopedSlots: { customRender: 'stateName' }
        },
        {
          title: this.$t('ErpMeterNumberRecord.roleCode'),
          dataIndex: 'roleCodeName'
        },
        {
          title: this.$t('ErpMeterNumberRecord.length'),
          dataIndex: 'length'
        },
        {
          title: this.$t('ErpMeterNumberRecord.numberCount'),
          dataIndex: 'numberCount'
        },
        {
          title: this.$t('ErpMeterNumberRecord.prifix'),
          dataIndex: 'prifix'
        },
        // {
        //   title: this.$t('ErpMeterNumberRecord.serialNumberLength'),
        //   dataIndex: 'serialNumberLength'
        // },

        {
          title: this.$t('ErpMeterNumberRecord.startNumber'),
          dataIndex: 'startNumber'
        },
        {
          title: this.$t('ErpMeterNumberRecord.endNumber'),
          dataIndex: 'endNumber'
        },
        {
          title: this.$t('ErpMeterNumberRecord.fileUrl'),
          dataIndex: 'fileUrl',
          scopedSlots: { customRender: 'fileUrl' }
        },
        {
          title: this.$t('ErpMeterNumberRecord.createTime'),
          dataIndex: 'createTime'
        },
        {
          title: this.$t('ErpMeterNumberRecord.createBy'),
          dataIndex: 'createByName'
        },
        {
          title: this.$t('ErpMeterNumberRecord.deptId'),
          dataIndex: 'deptName'
        },
        {
          title: this.$t('common.operation'),
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: '140',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  created() {
    this.pageInfo.condition.orderByClause = this.orderByClause
    if (this.$store.getters.userInfo.id != '1') {
      this.pageInfo.condition.delFlag = 0
    }

    //初始化查询条件的时间范围
    this.pageInfo.condition.startTime = this.moment().locale('en_US').add(-3, 'M').startOf('day').format('YYYY-MM-DD HH:mm:ss')//开始时间是当前时间减去3个月
    this.pageInfo.condition.endTime = this.moment().locale('en_US').endOf('day').format('YYYY-MM-DD HH:mm:ss')//结束时间是当天
    this.queryTimeDefaultValue[0] = this.moment(this.pageInfo.condition.startTime, 'YYYY-MM-DD')
    this.queryTimeDefaultValue[1] = this.moment(this.pageInfo.condition.endTime, 'YYYY-MM-DD')
    let config = this.$store.getters.userInfo.sysDept.config.erpMeterNumberRecordListFiled
    config = config == undefined ? 0 : config
    this.columns.forEach((v, index) => {//生成导出字段
      if (v.dataIndex && v.dataIndex != 'action') {
        this.exportJsonFiled[v.title] = v.dataIndex
      }
    })
    for (let i = 0; i < 30; i++) {
      let j = (1 << i)
      if ((config & j) != 0) {  //为真说明这个字段需要删除
        let filedname = API.filedList[i]
        this.columns.forEach((v, index) => {
          if (v.dataIndex == filedname) {
            this.columns.splice(index, 1)
            delete this.exportJsonFiled[v.title] //去掉不需要的导出字段
          }
        })
      }
    }
    this.initMeterRule()
    this.loadData()
  },
  computed: {},
  methods: {
    moment,
    downloadMeterFile(record){
      let url = window._CONFIG['fileURL'] + record.fileUrl
      // console.log("record",downloadUrl)
      const a = document.createElement('a')
      a.href = url
      a.download = url.split('/').pop()
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },

    //新增记录 0-新增 1-编辑
    handleAddOrEdit(operateType, record) {
      this.$refs.modalAddForm.title = operateType === 0 ? this.$t('common.add') : this.$t('common.edit')
      this.$refs.modalAddForm.disableSubmit = false
      this.$refs.modalAddForm.type = operateType === 0 ? 'add' : 'edit'
      this.$refs.modalAddForm.show(operateType, operateType === 0 ? {} : record)
    },
    modalAddFormOk() {
      this.loadData()
    },
    onFileUrlClick(record, text) {
      if (text) {
        let jsonValue = text.split(',')
        if (jsonValue) {
          if (jsonValue.length === 1) {
            //直接下载
            let url = jsonValue[0]
            this.downloadFile(window._CONFIG['fileURL'] + url, url.substring(url.lastIndexOf('/') + 1))
          } else {
            //弹窗选择下载，可以全选下载
          }
        }
      }
    },
    async initMeterRule() {
      let res = await ErpConfig.findByCode('bhgz')
      if (res && res.configJson) {
        this.meterRules = JSON.parse(res.configJson)
      }
    },
    loadData() {
      this.loading = true
      API.findByPage(this.pageInfo).then(
        (res) => {
          this.dataSource = res.list
          this.pageInfo.total = res.total
          this.loading = false
        }
      )
    },
    async startDownload() {
      this.loading = true
      this.exportDatas = await API.findByAll(this.pageInfo)
      this.loading = false

    },
    handleAdd: function() {
      let obj = Object.assign({}, API.defaultObject)
      this.$refs.modalForm.add(obj)
      this.$refs.modalForm.title = '$t(\'form.add)\''
      this.$refs.modalForm.disableSubmit = false
    },
    handleDelete(id) {
      //要真删除用 API.realDeleteById(id)
      API.deleteById(id).then(
        (res) => {
          if (res.code === 0) {
            this.$message.success(res.msg)
          } else {
            this.$message.warning(res.errors)
          }
          this.loadData()
        }
      )
    },
    handleRealDelete(id) {
      API.realDeleteById(id).then(
        (res) => {
          if (res.code === 0) {
            this.$message.success(res.msg)
          } else {
            this.$message.warning(res.errors)
          }
          this.loadData()
        }
      )
    },
    showAdd(item) {
      return this.$store.getters.userInfo.permissions.includes('erpMeterNumberRecord:add')
    },
    showExport() {
      return this.$store.getters.userInfo.permissions.includes('erpMeterNumberRecord:export')
    },
    showEdit(item) {
      let handleOrderNo = item.handleOrderNo
      return !!(handleOrderNo && handleOrderNo.length > 0 && this.$store.getters.userInfo.deptId === item.deptId);

    },
    showDelete(item) {
      return this.$store.getters.userInfo.permissions.includes('erpMeterNumberRecord:delete')
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
    },
    downloadFile(url, fileName) {
      window.open(url, '_blank')
      return
      const el = document.createElement('a')
      el.style.display = 'none'
      el.setAttribute('target', '_blank')
      /**
       * download的属性是HTML5新增的属性
       * href属性的地址必须是非跨域的地址，如果引用的是第三方的网站或者说是前后端分离的项目(调用后台的接口)，这时download就会不起作用。
       * 此时，如果是下载浏览器无法解析的文件，例如.exe,.xlsx..那么浏览器会自动下载，但是如果使用浏览器可以解析的文件，比如.txt,.png,.pdf....浏览器就会采取预览模式
       * 所以，对于.txt,.png,.pdf等的预览功能我们就可以直接不设置download属性(前提是后端响应头的Content-Type: application/octet-stream，如果为application/pdf浏览器则会判断文件为 pdf ，自动执行预览的策略)
       */
      fileName && el.setAttribute('download', fileName)
      el.href = url
      console.log(el)
      document.body.appendChild(el)
      el.click()
      document.body.removeChild(el)
    }
  }
}
</script>
<style lang='less' scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 3px
}

.ant-card-body .table-operator {
  margin-bottom: 18px;
}

.ant-table-tbody .ant-table-row td {
  padding-top: 15px;
  padding-bottom: 15px;
}

.anty-row-operator button {
  margin: 0 5px
}

.ant-btn-danger {
  background-color: #ffffff
}

.ant-modal-cust-warp {
  height: 100%
}

.ant-modal-cust-warp .ant-modal-body {
  height: calc(100% - 110px) !important;
  overflow-y: auto
}

.ant-modal-cust-warp .ant-modal-content {
  height: 90% !important;
  overflow-y: hidden
}

.export-excel-wrapper {
  display: inline-block;
  margin-left: 8px;
}

.dd-cover {
  color: dodgerblue;
  cursor: pointer;
}

.dd-cover:hover {
  color: deepskyblue;
}

.dd-cover:active {
  color: #666666;
}
</style>