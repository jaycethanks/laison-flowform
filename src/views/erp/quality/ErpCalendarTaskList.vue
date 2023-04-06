<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="6">
            <a-form-item label="查询时间">
              <a-range-picker :default-value="queryTimeDefaultValue" @change="queryTimeChange" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="6">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">{{ $t('common.query') }}</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">{{ $t('common.reset') }}</a-button>
              <download-excel v-if="showExport()" class="export-excel-wrapper" :data="exportDatas" :fields="exportJsonFiled" :before-generate="startDownload" type="xls" name="ErpCalendarTaskList.xls">
                <a-button type="primary" icon="download"> {{ $t('common.export') }} </a-button>
              </download-excel>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" v-show="show" type="primary" icon="plus">{{ $t('common.add') }}</a-button>
      <a-button v-if="showExport()" type="primary" v-show="show" icon="download" @click="handleExportXls">{{ $t('common.export') }}</a-button>
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
      <a-table e ref="table" size="middle" :scroll="{ x: true }" bordered rowKey="id" :columns="columns" :dataSource="dataSource" :pagination="pageInfo" :loading="loading" @change="handleTableChange">
        <span slot="enclosure" slot-scope="text, record">
          <div class="dd-cover" @click="onOrderFileClick(record, text)">
            <JEllipsis :value="text" :length="25"></JEllipsis>
          </div>
        </span>

        <span slot="content" slot-scope="text, record">
          <JEllipsis :value="text" :length="35"></JEllipsis>
        </span>

        <span slot="promptType" slot-scope="text, record">
          {{ text === 0 ? '秒' : text === 1 ? '分' : text === 2 ? '时' : '天' }}
        </span>

        <span slot="enable" slot-scope="text, record">
          {{ text ? '启用' : '禁用' }}
        </span>

        <span slot="status" slot-scope="text, record">
          {{ text === 0 ? '未开始' : text === 1 ? '执行中' : '已结束' }}
        </span>
        <span slot="action" slot-scope="text, record">
          <a href="javascript:;" @click="handleDetail(record)">{{ $t('common.detail') }}</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)">{{ $t('common.edit') }}</a>
          <a-divider type="vertical" />
          <!-- <a-popconfirm v-if="showDelete(record)" :title="$t('common.delete')" @confirm="() => handleDelete(record.id)">
            <a>{{ $t('common.delete') }}</a>
          </a-popconfirm> -->
          <a-popconfirm v-if="showRealDel()" :title="$t('common.delete')" @confirm="() => handleRealDelete(record.id)">
            <a>{{ $t('common.delete') }}</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <erp-calendar-task-modal ref="modalForm" @ok="modalFormOk"></erp-calendar-task-modal>
  </a-card>
</template>

<script>
import ErpCalendarTaskModal from './modules/ErpCalendarTaskModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JEllipsis from '@/components/jeecg/JEllipsis'
import API from '@/api/ErpCalendarTask'
import moment from 'moment'
export default {
  name: 'ErpCalendarTaskList',
  mixins: [JeecgListMixin],
  components: {
    JEllipsis,
    ErpCalendarTaskModal,
  },
  data() {
    return {
      description: 'ErpCalendarTask管理',
      // 新增修改按钮是否显示
      orderByClause: 'update_time desc',
      show: true,
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'left',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        // {
        //   title: '任务编号',
        //   align: 'left',
        //
        //   dataIndex: 'id',
        // },
        {
          title: '任务标题',
          align: 'left',

          dataIndex: 'title',
        },
        {
          title: '任务内容',
          align: 'left',

          dataIndex: 'content',
        },
        {
          title: '提醒时间',
          align: 'left',
          dataIndex: 'promptTime',
        },
        {
          title: '附件内容',
          align: 'left',

          dataIndex: 'enclosure',
          scopedSlots: { customRender: 'enclosure' },
        },
        {
          title: '任务优先级',
          align: 'left',

          dataIndex: 'level',
        },
        {
          title: '最大提醒次数',
          align: 'left',

          dataIndex: 'maxPromptTimes',
        },
        {
          title: '当前提醒次数',
          align: 'left',

          dataIndex: 'curPromptTimes',
        },
        {
          title: '提醒时间间隔',
          align: 'left',

          dataIndex: 'promptInterval',
        },
        {
          title: '间隔类型',
          align: 'left',

          dataIndex: 'promptType',
          scopedSlots: { customRender: 'promptType' },
        },
        // {
        //   title: this.$t('ErpCalendarTask.delFlag'),
        //   align: 'center',
        //
        //   dataIndex: 'delFlag',
        // },
        {
          title: '运行状态',
          align: 'left',

          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
        },

        {
          title: '启用状态',
          align: 'left',

          dataIndex: 'enable',
          scopedSlots: { customRender: 'enable' },
        },

        {
          title: '创建时间',
          align: 'left',

          dataIndex: 'createTime',
        },
        {
          title: '创建人',
          align: 'left',

          dataIndex: 'createByName',
        },
        {
          title: '更新时间',
          align: 'left',

          dataIndex: 'updateTime',
        },
        {
          title: '更新人',
          align: 'left',

          dataIndex: 'updateByName',
        },
        {
          title: this.$t('common.operation'),
          dataIndex: 'action',
          align: 'center',
          width: 150,
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
    this.pageInfo.condition.startTime = this.moment().locale('en_US').add(-2, 'y').startOf('day').format('YYYY-MM-DD HH:mm:ss') //开始时间是当前时间减去3个月
    this.pageInfo.condition.endTime = this.moment().locale('en_US').endOf('day').format('YYYY-MM-DD HH:mm:ss') //结束时间是当天
    this.queryTimeDefaultValue[0] = this.moment(this.pageInfo.condition.startTime, 'YYYY-MM-DD')
    this.queryTimeDefaultValue[1] = this.moment(this.pageInfo.condition.endTime, 'YYYY-MM-DD')
    let config = this.$store.getters.userInfo.sysDept.config.erpCalendarTaskListFiled
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
      return this.$store.getters.userInfo.permissions.includes('erpCalendarTask:add')
    },
    showExport() {
      return this.$store.getters.userInfo.permissions.includes('erpCalendarTask:export')
    },
    showEdit(item) {
      return this.$store.getters.userInfo.permissions.includes('erpCalendarTask:update')
    },
    showDelete(item) {
      return this.$store.getters.userInfo.permissions.includes('erpCalendarTask:delete')
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
    //文件点击事件
    onOrderFileClick(record, text) {
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
    downloadFile(url, fileName) {
      window.open(url, '_blank')
      return
      console.log('url', url)
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
    },
  },
}
</script>
<style lang="less" scoped>
/** 表格不折行 */

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

.dd-cover {
  color: brown;
  cursor: pointer;
}

.dd-cover:hover {
  color: #a87474;
}

.dd-cover:active {
  color: #666666;
}
</style>