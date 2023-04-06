<template>
  <j-modal
    :title="$t('erp.selectStock')"
    width="90vw"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    fullscreen
    @ok="handleOk"
    @cancel="handleCancel"
    :body-style="{ maxHeight: '70vh' }"
  >
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery(false)">
        <a-row :gutter="[24, 8]" align="middle" justify="space-between" type="flex">
          <a-col>
            <a-row :gutter="[24, 8]" align="middle" type="flex">
              <a-col>
                <a-form-item :label="$t('erp.stockInfo')">
                  <a-input style="width: 300px" v-model="searchContent" :placeholder="$t('erp.inputStockInfo')">
                    <a-icon slot="prefix" type="user" />
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col>
                <a-button
                  class="table-page-search-submitButtons"
                  type="primary"
                  @click="searchQuery(true)"
                  icon="search"
                >
                  {{ $t('erp.searchAccurate') }}
                </a-button>
              </a-col>
              <a-col>
                <a-button
                  class="table-page-search-submitButtons"
                  type="primary"
                  @click="searchQuery(false)"
                  icon="search"
                >
                  {{ $t('erp.searchFuzzy') }}
                </a-button>
              </a-col>
              <a-col>
                <a-button class="table-page-search-submitButtons" type="primary" @click="searchReset" icon="reload">
                  {{ $t('common.reset') }}
                </a-button>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        :scroll="buildDyScroll"
        bordered
        rowKey="stockCode"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pageInfo"
        :loading="loading"
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          type: 'radio',
        }"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a href="javascript:;" @click="handleDetail(record)">{{ $t('common.detail') }}</a>
          <a-divider type="vertical" v-if="showEdit(record)" />
          <a @click="handleEdit(record)" v-if="showEdit(record)">{{ $t('common.edit') }}</a>
          <a-divider type="vertical" v-if="showDelete(record)" />
          <a-popconfirm v-if="showDelete(record)" :title="$t('common.delete')" @confirm="() => handleDelete(record.id)">
            <a>{{ $t('common.delete') }}</a>
          </a-popconfirm>
          <a-divider type="vertical" v-if="showRealDel()" />
          <a-popconfirm
            v-if="showRealDel()"
            :title="$t('common.realDelete')"
            @confirm="() => handleRealDelete(record.id)"
          >
            <a>{{ $t('common.realDelete') }}</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
  </j-modal>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin';
import { JEditableTableMixin } from '@/mixins/JEditableTableMixin';
import JEllipsis from '@comp/jeecg/JEllipsis';
import API from '@/api/ErpStock';
import moment from 'moment';

export default {
  name: 'SelectStockModal',
  mixins: [JeecgListMixin, JEditableTableMixin],
  components: {
    JEllipsis,
  },
  data() {
    return {
      description: 'ErpStock管理',
      // 新增修改按钮是否显示
      orderByClause: 'create_time desc',
      searchContent: '',
      buildDyScroll: {},
      // 表头
      columns: [
        {
          title: this.$t('ErpStock.stockCode'),
          align: 'center',
          width: 100,
          dataIndex: 'stockCode',
        },
        {
          title: this.$t('ErpStock.specificationMode'),
          align: 'center',
          width: 160,
          dataIndex: 'specificationMode',
        },
        {
          title: this.$t('ErpStock.stockName'),
          align: 'center',
          width: 150,
          dataIndex: 'stockName',
        },
        {
          title: this.$t('ErpStock.specificationIntro'),
          align: 'center',
          width: 180,
          dataIndex: 'specificationIntro',
        },
        {
          title: this.$t('ErpStock.meterInfo'),
          align: 'center',
          width: 160,
          dataIndex: 'meterInfo',
        },
        {
          title: this.$t('ErpStock.elecMoudle'),
          align: 'center',
          width: 120,
          dataIndex: 'elecMoudle',
        },
        {
          title: this.$t('ErpStock.flow'),
          align: 'center',
          width: 90,
          dataIndex: 'flow',
        },
        {
          title: this.$t('ErpStock.pulse'),
          align: 'center',
          width: 90,
          dataIndex: 'pulse',
        },
        {
          title: this.$t('ErpStock.deliveryFactory'),
          align: 'center',
          width: 120,
          dataIndex: 'deliveryFactory',
        },
        {
          title: this.$t('ErpStock.drawingNo'),
          align: 'center',
          width: 120,
          dataIndex: 'drawingNo',
        },
        {
          title: this.$t('ErpStock.warehouseId'),
          align: 'center',
          width: 120,
          dataIndex: 'warehouseId',
        },
        {
          title: this.$t('common.operation'),
          dataIndex: 'action',
          align: 'center',
          width: 120,
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
        },
      ],
    };
  },
  mounted() {
    this.buildScrollInfo();
  },
  created() {
    this.pageInfo.condition.orderByClause = this.orderByClause;
    if (this.$store.getters.userInfo.id != '1') {
      this.pageInfo.condition.delFlag = 0;
    }
    this.loadData();
  },
  computed: {},
  methods: {
    moment,
    loadData() {
      this.loading = true;
      API.searchByPage(this.pageInfo).then((res) => {
        this.dataSource = res.list;
        this.pageInfo.total = res.total;
        this.loading = false;
      });
    },
    searchQuery(accurate) {
      let content = this.searchContent;
      if (accurate) {
        content = this.clearEmpty(content);
      }
      this.pageInfo.condition.content = content;
      this.pageInfo.current = 1;
      this.loadData();
    },
    searchReset() {
      this.pageInfo.current = 1;
      this.pageInfo.condition = { orderByClause: this.orderByClause };
      this.searchContent = '';
      this.loadData();
    },
    buildScrollInfo() {
      let x = 0;
      for (let i = 0; i < this.columns.length; i++) {
        let column = this.columns[i];
        x += column.width;
      }
      this.buildDyScroll = { x: x };
    },
    async startDownload() {
      this.loading = true;
      this.exportDatas = await API.findByAll(this.pageInfo);
      this.loading = false;
    },
    handleAdd: function () {
      let obj = Object.assign({}, API.defaultObject);
      this.$refs.modalForm.add(obj);
      this.$refs.modalForm.title = "$t('form.add)'";
      this.$refs.modalForm.disableSubmit = false;
    },
    handleDelete(id) {
      //要真删除用 API.realDeleteById(id)
      API.deleteById(id).then((res) => {
        if (res.code === 0) {
          this.$message.success(res.msg);
        } else {
          this.$message.warning(res.errors);
        }
        this.searchQuery();
      });
    },
    handleRealDelete(id) {
      API.realDeleteById(id).then((res) => {
        if (res.code === 0) {
          this.$message.success(res.msg);
        } else {
          this.$message.warning(res.errors);
        }
        this.searchQuery();
      });
    },
    showAdd(item) {
      return this.$store.getters.userInfo.permissions.includes('erpStock:add');
    },
    showExport() {
      return this.$store.getters.userInfo.permissions.includes('erpStock:export');
    },
    showEdit(item) {
      return this.$store.getters.userInfo.permissions.includes('erpStock:update');
    },
    showDelete(item) {
      return this.$store.getters.userInfo.permissions.includes('erpStock:delete');
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
