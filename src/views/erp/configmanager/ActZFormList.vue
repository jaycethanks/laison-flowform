<template>
  <a-card :bordered='false'>

    <!-- 查询区域 -->
    <div class='table-page-search-wrapper'>
      <a-form layout='inline' @keyup.enter.native='searchQuery'>
        <a-row :gutter='24'>

          <a-col :md='6' :sm='8'>
            <a-form-item :label="$t('ActZForm.name')">
              <a-input v-model='pageInfo.condition.name'></a-input>
            </a-form-item>
          </a-col>

          <a-col :md='6' :sm='6'>
            <span style='float: left;overflow: hidden;' class='table-page-search-submitButtons'>
              <a-button type='primary' @click='searchQuery' icon='search'>{{ $t('common.query') }}</a-button>
              <a-button type='primary' @click='searchReset' icon='reload'
                        style='margin-left: 8px'>{{ $t('common.reset') }}</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class='table-operator'>
      <a-button @click='handleAdd' v-show='show' type='primary' icon='plus'>{{ $t('common.add') }}</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> {{$t('common.alreadyChoose')}} <a style="font-weight: 600">{{
        selectedRowKeys.length }}</a> {{$t('common.item')}}
        <a style="margin-left: 24px" @click="onClearSelected"> {{$t('common.clearAll')}} </a>
      </div> -->
      <a-table ref='table' size='middle' :scroll='{x:true}' bordered rowKey='id' :columns='columns'
               :dataSource='dataSource' :pagination='pageInfo' :loading='loading' @change='handleTableChange'>

        <span slot='action' slot-scope='text, record'>
          <a href='javascript:;' @click='handleDetail(record)'>{{ $t('common.detail') }}</a>
          <a-divider type='vertical' />
          <a @click='handleEdit(record)'>{{ $t('common.edit') }}</a>
          <a-divider type='vertical' />
          <a @click='copyItem(record)'>{{ $t('common.copy') }}</a>
          <a-divider type='vertical' />
          <a-popconfirm :title="$t('common.delete')" @confirm='() => handleDelete(record.id)'>
            <a>{{ $t('common.delete') }}</a>
          </a-popconfirm>
          <a-divider type='vertical' v-if='showRealDel()' />

        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <a-modal :maskClosable='false' v-model='visible' centered :width='modalWidth'
             :dialogStyle="{minWidth:'1000px',padding:'0'}" class='hello' @ok='customFormOk' @cancel='handlerClose'
             :body-style="{padding:'0'}" :footer='null'>
      <template slot='title'>
        <p style='position:relative'>
          <span>表单设计器</span>
        <div class='icon-wrapper' @click='fullscreenToggle'>
          <a-icon class='icon-hover' v-if='fullscreen' type='fullscreen-exit' />
          <a-icon class='icon-hover' v-else type='fullscreen' />
        </div>
        </p>
      </template>
      <DesignForm :height='modalHeight' @operatOK='recordSave' ref='DesignForm'></DesignForm>
    </a-modal>

    <previewModal ref='previewModal' />
  </a-card>
</template>

<script>

import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JEllipsis from '@/components/jeecg/JEllipsis'
import API from '@/api/ActZForm'
import moment from 'moment'
import DesignForm from '@comp/designform/DesignForm'
import previewModal from '@/components/kform/KFormPreview/index'

export default {
  name: 'ActZFormList',
  mixins: [JeecgListMixin],
  components: {
    JEllipsis,
    DesignForm,
    previewModal
  },
  data() {
    return {
      modalHeight: '60vh',
      fullscreen: false,
      description: 'ActZForm管理',
      // 新增修改按钮是否显示
      orderByClause: 'id desc',
      visible: false,
      show: true,
      // 表头
      columns: [
        {
          title: this.$t('ActZForm.name'),
          align: 'center',
          dataIndex: 'name',
          whith: '150'
        },
        {
          title: this.$t('ActZForm.description'),
          align: 'center',
          dataIndex: 'description',
          whith: '190'
        },
        // {
        //   title: this.$t('ActZForm.type'),
        //   align: "center",
        //   customRender: (text, record, index) => {
        //     let type = ['ActZForm.outside.batch_install_type',
        //       'ActZForm.outside.sig_install_type',
        //       'ActZForm.outside.cancel_type',
        //       'ActZForm.outside.refund_type',
        //       'ActZForm.outside.repair_type',
        //       'ActZForm.outside.change_type']
        //     return this.$t(type[record.type - 1])
        //   }
        // },
        // {
        //   title: this.$t('ActZForm.type'),
        //   align: 'center',
        //   dataIndex: 'typeName',
        //   whith: '120'
        // },
        {
          title: this.$t('ActZForm.createBy'),
          align: 'center',
          dataIndex: 'creator',
          whith: '120'
        },
        {
          title: this.$t('ActZForm.createTime'),
          align: 'center',
          dataIndex: 'createTime',
          whith: '150'
        },
        {
          title: this.$t('common.operation'),
          dataIndex: 'action',
          fixed: 'right',
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
    this.pageInfo.condition.startTime = this.moment().add(-3, 'M').startOf('day').format('YYYY-MM-DD HH:mm:ss')//开始时间是当前时间减去3个月
    this.pageInfo.condition.endTime = this.moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')//结束时间是当天
    this.queryTimeDefaultValue[0] = this.moment(this.pageInfo.condition.startTime, 'YYYY-MM-DD')
    this.queryTimeDefaultValue[1] = this.moment(this.pageInfo.condition.endTime, 'YYYY-MM-DD')
    let config = this.$store.getters.userInfo.sysDept.config.actZFormListFiled
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


    this.loadData()
  },
  computed: {
    modalWidth() {
      if (this.fullscreen) {
        return '100%'
      } else {
        return '70%'
      }
    }
  },

  methods: {
    moment,
    fullscreenToggle() {
      this.fullscreen = !this.fullscreen
      if (!this.fullscreen) {
        this.modalHeight = '60vh'
      } else {
        this.modalHeight = 'calc(100vh - 55px)'
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
    customFormOk() {
      this.visible = false
    },
    async startDownload() {
      this.loading = true
      this.exportDatas = await API.findByAll(this.pageInfo)
      this.loading = false

    },
    recordSave() {
      this.visible = false
      this.searchQuery()
    },
    handleAdd() {
      this.fullscreen = false
      this.visible = true
      this.$nextTick(() => {
        this.$refs.DesignForm.resetData()
      })

    },
    handleEdit(item) {
      this.fullscreen = false

      this.visible = true
      let record = item
      this.$nextTick(() => {
        this.$refs.DesignForm.importData(record)
      })


    },
    copyItem(item) {
      delete item['id']
      this.handleEdit(item)
    },
    onCustomFormInfoSave(record) {
      console.log('你需要去保存了', record)
    }
    ,
    handleDelete(id) {
      //要真删除用 API.realDeleteById(id)
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
    handleDetail(item) {
      this.$refs.previewModal.jsonData = JSON.parse(item.jsonForm)
      this.$refs.previewModal.previewWidth = 850
      this.$refs.previewModal.visible = true
    },
    showAdd(item) {
      return this.$store.getters.userInfo.permissions.includes('actZForm:add')
    },
    showExport() {
      return this.$store.getters.userInfo.permissions.includes('meterType:export')
    },
    showEdit(item) {
      return this.$store.getters.userInfo.permissions.includes('actZForm:update')
    },
    showDelete(item) {
      return this.$store.getters.userInfo.permissions.includes('actZForm:delete')
    },
    hasPermission(permission) {
      return this.$store.getters.userInfo.permissions.includes(permission)
    },
    showRealDel() {
      return this.$store.getters.userInfo.id === '1'
    },
    getConfig() {
      return this.$store.getters.userInfo.sysDept.config
    },
    showFiled(filedName) {
      let config = this.$store.getters.userInfo.sysDept.config.meterTypeAddFiled
      config = config === undefined ? 0 : config
      let indexOfFiled = API.filedList.indexOf(filedName)
      let flag = 1 << indexOfFiled
      return !(config & flag)
    },
    handlerClose() {
      //首先判断form设计器是否有填写的form表格信息
      let formInfo = this.$refs.DesignForm.getFormInfo()
      if (!formInfo || !formInfo.list || formInfo.list.length < 1) {
        this.visible = false
        this.$refs.DesignForm.$refs.kfd.clearData()
        return
      }
      let _this = this
      this.$confirm({
        title: _this.$t('common.warn'),
        content: _this.$t('common.formNotSave'),
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        mask: false,
        zIndex: 1200,
        onOk() {
          _this.visible = false
          _this.$refs.DesignForm.$refs.kfd.clearData()
        },
        onCancel() {
          _this.visible = true
        }
      })
    }
  }
}
</script>
<style lang='less' scoped>
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

.icon-hover {
  color: #8c8c8c;
}

.icon-wrapper:hover .icon-hover {
  color: #000000bf;
  cursor: pointer;
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  position: absolute;
  right: 56px;
  top: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>