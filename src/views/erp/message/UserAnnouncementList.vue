<template>
  <a-card :bordered='false'>
    <!-- 查询区域 -->
    <div class='table-page-search-wrapper'>
      <a-form layout='inline' @keyup.enter.native='searchQuery'>
        <a-row :gutter='24'>
          <!--标题-->
          <a-col :span='6'>
            <a-form-item :label="$t('order.label')">
              <a-input :placeholder="$t('order.inputTitle')" v-model='pageInfo.condition.title'></a-input>
            </a-form-item>
          </a-col>
          <!--业务类型-->
          <a-col :md='6' :sm='6'>
            <a-form-item :label="$t('AfterStats.genType')">
              <a-select :placeholder="$t('AfterStats.selectGenType')" v-model='pageInfo.condition.genType'>
                <a-select-option v-for='(item, i) in genTypes' :key='i' :value='item.genType'>
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!--发送人员-->
          <a-col :md='6' :sm='6'>
            <a-form-item :label="$t('order.sender')">
              <a-select :placeholder="$t('AfterStats.selectSender')" v-model='pageInfo.condition.sender'>
                <a-select-option v-for='(item, i) in senders' :key='i' :value='item.id'>
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md='6' :sm='6'>
            <span style='float: left;overflow: hidden;' class='table-page-search-submitButtons'>
              <a-button type='primary' @click='searchQuery' icon='search'>{{ $t('order.search') }}</a-button>
              <a-button type='primary' @click='searchReset' icon='reload'
                        style='margin-left: 8px'>{{ $t('common.reset') }}</a-button>
                <a-button type='primary' @click='readAll' icon='book'
                          style='margin-left: 8px'>{{ $t('order.allRead') }}</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-table
      ref='table'
      size='default'
      :scroll='{ x: true }'
      bordered
      rowKey='id'
      :columns='columns'
      :dataSource='dataSource'
      :pagination='pageInfo'
      :loading='loading'
      @change='handleTableChange'>

      <span slot='action' slot-scope='text, record'>
        <a @click='showAnnouncement(record)'>{{ $t('order.preview') }}</a>
      </span>

    </a-table>
    <show-announcement ref='ShowAnnouncement'></show-announcement>
    <dynamic-notice ref='showDynamNotice' :path='openPath' :formData='formData' />
  </a-card>
</template>

<script>
import { filterObj } from '@/utils/util'
import { getAction, postAction, putAction, postJSON } from '@/api/manage'
import ShowAnnouncement from '@/components/tools/ShowAnnouncement'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import DynamicNotice from '@/components/tools/DynamicNotice'

export default {
  name: 'UserAnnouncementList',
  mixins: [JeecgListMixin],
  components: {
    DynamicNotice,
    ShowAnnouncement
  },
  data() {
    return {
      description: this.$t('order.customerTypeId'),
      queryParam: {},
      genTypes: [],
      senders: [],
      columns: [
        {
        title: this.$t('order.label'),
        dataIndex: 'title'
      },
        {
          title: this.$t('AfterStats.genType'),
          align: 'center',
          dataIndex: 'genTypeName'
        },
        {
          title: this.$t('order.sender'),
          align: 'center',
          dataIndex: 'realname'
        },
        {
          title: this.$t('order.sendTime'),
          align: 'center',
          dataIndex: 'sendTime'
        },
        {
          title: this.$t('order.readState'),
          dataIndex: 'readFlag',
          align: 'center',
          customRender: (text) => {
            if (text === '0') {
              return this.$t('order.notRead')
            } else if (text === '1') {
              return this.$t('order.hadRead')
            } else {
              return text
            }
          }
        },
        {
          title: this.$t('ErpConfig.remark'),
          dataIndex: 'remark'
        },
        {
          title: this.$t('common.operation'),
          dataIndex: 'action',
          align: 'center',
          width: 90,
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }],
      url: {
        condition: '/actMsg/getMyAnnouncementCondition',
        list: '/actMsg/getMyAnnouncementSend',
        editCementSend: '/actMsg/editByAnntIdAndUserId',
        readAllMsg: '/actMsg/readAll'
      },
      loading: false,
      openPath: '',
      formData: ''
    }
  },
  methods: {
    searchReset() {
      this.pageInfo.condition = {
        orderByClause: this.orderByClause
      }
      if (this.$store.getters.userInfo.id != '1') {
        this.pageInfo.condition.delFlag = 0
      }
      this.initPageInfo()
      this.loadData()
    },
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error(this.$t('order.pleaseSetUrl'))
        return
      }
      this.loadCondition()
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.pageInfo.current = 1
      }
      this.loading = true
      postJSON(this.url.list, this.pageInfo).then((res) => {
        if (res.success) {
          this.dataSource = res.data.list
          if (res.data.total) {
            this.pageInfo.total = res.data.total
          }
          //update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
        }
        if (res.code === 500) {
          this.$message.warning(res.errors)
        }
        this.loading = false
      })
    },
    async loadCondition() {
      let res = await getAction(this.url.condition)
      if (res && res.success && res.data) {
        this.genTypes = res.data.genTypes
        this.senders = res.data.senders
      }
    },

    handleDetail: function(record) {
      this.$refs.sysAnnouncementModal.detail(record)
      this.$refs.sysAnnouncementModal.title = this.$t('order.preview')
    },
    showAnnouncement(record) {
      putAction(this.url.editCementSend, { anntId: record.anntId }).then((res) => {
        if (res.success) {
          //重新加载数据
          this.loadData()
          //同步消息
          this.syncHeadNotic(record.anntId)
        }
      })
      if (record.openType === 'component') {
        this.openPath = record.openPage
        this.formData = { id: record.busId }
        this.$refs.showDynamNotice.detail()
      } else {
        this.$refs.ShowAnnouncement.detail(record)
      }
    },
    syncHeadNotic(anntId) {
      getAction('actMsg/syncNotic', { anntId: anntId })
    },
    readAll() {
      var that = this
      that.$confirm({
        title: this.$t('order.confirmOperate'),
        content: this.$t('order.confirmAllRead'),
        onOk: function() {
          postAction(that.url.readAllMsg).then((res) => {
            if (res.success) {
              that.$message.success(res.data.msg)
              that.loadData()
              that.syncHeadNotic()
            }
          })
        }
      })
    },
    initPageInfo() {
      this.pageInfo = {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          // return range[0] + "-" + range[1] +  this.$t('common.total') + total + this.$t('common.item')
          return this.$t('common.total') + ' ' + total + ' ' + this.$t('common.item')
        },
        condition: {
          orderByClause: 'level asc , sort_no desc' || 'create_time desc'
        },//搜索条件
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      }
    }
  },
  created() {
    this.loadData()
  }
}
</script>
<style scoped>
.ant-card-body .table-operator {
  margin-bottom: 18px;
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
</style>