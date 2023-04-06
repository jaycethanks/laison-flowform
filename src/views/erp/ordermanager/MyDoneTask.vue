<style lang="less">
@import '~@assets/less/common.less';
</style>
<template>
  <div class="search">
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :md="6" :sm="8">
              <a-form-item :label="$t('OrderStats.orderNo')" prop="name">
                <a-input
                  type="text"
                  v-model="pageInfo.condition.orderNo"
                  :placeholder="$t('order.pleaseInput')"
                  clearable
                />
              </a-form-item>
            </a-col>
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-col :md="6" :sm="12">
                <a-button @click="searchQuery" type="primary" icon="search">{{ $t('order.search') }}</a-button>
                <a-button @click="searchReset" style="margin-left: 10px">{{ $t('order.reset') }}</a-button>
              </a-col>
            </span>
          </a-row>
        </a-form>
      </div>

      <a-row>
        <a-table
          :scroll="{ x: true }"
          bordered
          :loading="loading"
          rowKey="taskId"
          :dataSource="data"
          :pagination="pageInfo"
          @change="handleTableChange"
          ref="table"
        >
          <a-table-column :title="$t('OrderStats.orderNo')" dataIndex="orderNo" align="center" :width="200">
            <template slot-scope="t">
              <span> {{ t }} </span>
            </template>
          </a-table-column>
          <a-table-column :title="$t('OrderStats.title')" dataIndex="orderTitle" :width="200" align="center">
            <template slot-scope="t, r, i">
              <j-ellipsis :value="t" :length="11" />
            </template>
          </a-table-column>
          <a-table-column :title="$t('order.taskName')" dataIndex="taskName" align="center">
            <template slot-scope="t">
              <span> {{ t }} </span>
            </template>
          </a-table-column>
          <a-table-column :title="$t('order.processOf')" dataIndex="processName" :width="150" align="center">
            <template slot-scope="t, r, i">
              <span> {{ t }} </span>
            </template>
          </a-table-column>
          <a-table-column :title="$t('OrderStats.applyer')" dataIndex="applyerName" align="center">
            <template slot-scope="t">
              <span> {{ t }} </span>
            </template>
          </a-table-column>
          <a-table-column :title="$t('order.taskClient')" dataIndex="ownerName" align="center" :width="140">
            <template slot-scope="t">
              <span> {{ t }} </span>
            </template>
          </a-table-column>
          <a-table-column :title="$t('order.auditSuggest')" dataIndex="comment" :width="180" align="center">
            <template slot-scope="t">
              <j-ellipsis :value="t" :length="20" />
            </template>
          </a-table-column>
          <a-table-column
            :title="$t('order.totalCust')"
            dataIndex="duration"
            :width="120"
            align="center"
            key="duration"
            :sorter="(a, b) => a.duration - b.duration"
          >
            <template slot-scope="t">
              <span> {{ millsToTime(t) }} </span>
            </template>
          </a-table-column>
          <a-table-column :title="$t('order.createTime')" dataIndex="createTime" align="center">
            <template slot-scope="t">
              <span> {{ t }} </span>
            </template>
          </a-table-column>
          <a-table-column :title="$t('order.endTime')" dataIndex="endTime" align="center">
            <template slot-scope="t">
              <span> {{ t }} </span>
            </template>
          </a-table-column>
          <a-table-column :title="$t('common.operation')" dataIndex="action" align="center" :width="150" fixed="right">
            <template slot-scope="t, r, i">
              <a href="javascript:void(0);" @click="onProgressOrder(r)">{{
                r.erpOrder && r.erpOrder.result === 2 ? $t('erp.history') : $t('erp.progress')
              }}</a>
              <a-divider type="vertical" />
              <a href="javascript:void(0);" @click="detail(r)">{{ $t('erp.detail') }}</a>
            </template>
          </a-table-column>
        </a-table>
      </a-row>
    </a-card>
    <!--流程表单-->
    <!--流程表单-->
    <LaisonCustomeFormShow2 ref="lcfs" v-model="node" :opts="{ type: 4 }"></LaisonCustomeFormShow2>
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
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin';
import { activitiMixin } from '@/views/activiti/mixins/activitiMixin';
import { getAction, postJSON } from '@/api/manage';
import LaisonCustomeFormShow2 from '@/components/laison/LaisonCustomeFormShow2';
import ErpTask from '@/api/ErpTask';
import ConfigAPI from '@/api/ErpConfig';
import JModalErp from '@/views/erp/ordermanager/modal/JModalErp.vue';

export default {
  name: 'MyDoneTask',
  mixins: [activitiMixin, JeecgListMixin],
  components: { LaisonCustomeFormShow2, JModalErp },
  data() {
    return {
      index: 1,
      node: {},
      loading: true, // 表单加载状态
      data: [], // 表数据
      modalLsVisible: false,
      procInstId: '',
      lcModa: {
        title: '',
        disabled: false,
        visible: false,
        formComponent: null,
        isNew: false,
      },
    };
  },
  created() {
    this.pageInfo.condition.orderByClause = this.orderByClause;
    this.loadData();
  },
  methods: {
    loadData() {
      this.loading = true;
      ErpTask.myDoneTask(this.pageInfo)
        .then((res) => {
          this.loading = false;
          this.data = res.data.list || [];
          console.log('data', this.data);
          this.pageInfo.total = res.data.total;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    /**
     * 获取数据详情
     */
    detail(r) {
      this.loading = true;
      // r.nodeType = 2
      ConfigAPI.findSelectDesignFormInfo(r)
        .then((res) => {
          if (res.success) {
            res.data.taskId = r.taskId;
            this.showLcfsForm(res.data);
          } else {
            this.loading = false;
            this.$message.error(res.errors);
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log('err', err);
        });
    },
  },
  watch: {},
};
</script>
