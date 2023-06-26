<template>
  <RootContainer>
    <a-form
      layout="inline"
      @keyup.enter.native="handleQuery"
      @submit.prevent="handleQuery"
    >
      <a-row :gutter="24" style="margin: 0">
        <a-form-item :label="$t('common.table.businessId')">
          <a-input v-model="pageInfo.condition.name"></a-input>
        </a-form-item>
        <a-form-item :label="$t('common.status')">
          <a-select
            style="min-width: 100px"
            v-model="pageInfo.condition.status"
            :allowClear="true"
            :options="StatusOptions"
          >
          </a-select>
        </a-form-item>

        <a-form-item :label="$t('common.table.orderType')">
          <a-select
            style="min-width: 100px"
            v-model="pageInfo.condition.orderType"
            :allowClear="true"
            :options="sampleCondition_.orderTypes"
          >
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('common.table.applyUser')">
          <a-select
            style="min-width: 100px"
            v-model="pageInfo.condition.applicant"
            :allowClear="true"
            :options="sampleCondition_.applyList"
          >
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('common.table.timeRange')">
          <a-range-picker
            :locale="locale_"
            v-model="timeRange_"
            :show-time="false"
            format="YYYY-MM-DD"
          />
        </a-form-item>
        <!-- <a-col :md="6" :sm="8"> </a-col>
        <a-col :md="6" :sm="8">
          <span style="float: left; overflow: hidden" class="table-page-search-submitButtons"> </span>
        </a-col> -->
      </a-row>

      <a-row type="flex" justify="space-between" :gutter="24" style="margin: 0">
        <a-col>
          <a-form-item>
            <a-button type="primary" html-type="submit" icon="search">{{
              $t("common.query")
            }}</a-button>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="resetSearch" icon="reload">{{
              $t("common.reset")
            }}</a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-card :bordered="false" style="margin-top: 1rem">
      <a-table
        size="small"
        :loading="pageInfo.loading"
        @change="handleTableChange"
        :columns="columns"
        :data-source="dataSource"
        rowKey="businessId"
        :pagination="pageInfo.pagination"
        :scroll="{ x: true }"
      >
        <a slot="name" slot-scope="text">{{ text }}</a>
        <span slot="result" slot-scope="text">
          <ff-status :statusCode="text" isTag />
        </span>

        <span slot="status" slot-scope="text">
          <ff-status :statusCode="text" />
        </span>

        <template slot="action" slot-scope="text, record">
          <a-space>
            <!-- 公有 -->
            <template>
              <a @click="handleCheckDetail(record)">{{ $t("common.check") }}</a>
            </template>
          </a-space>
        </template>
      </a-table>
    </a-card>

    <!-- <Container> -->
  </RootContainer>
</template>
<script>
import RootContainer from "@/components/base/RootContainer"
import searchTableMixin from '@/mixins/searchTableMixin.js';
import handleQuery from '@/mixins/handleQuery.js';
import Container from "@/components/base/Container"
import PreviewFormType from "@/constants/PreviewFormType.js"
import ProcessResultType from "@/constants/ProcessResultType.js"
import { ProcessStatusType, StatusOptions } from "@/constants/ProcessStatusType.js"
import { myStats, remainderTask, cancelTask } from "@/api/platform/processOpenAPI.js"

import ffStatus from "@/components/FlowForm/ffStatus/index.vue"
import handleLanguage from "@/mixins/handleLanguage.js"



export default {
  name: "MyApply",
  mixins: [searchTableMixin, handleQuery, handleLanguage],
  components: {
    Container,
    RootContainer,
    ffStatus,
  },
  computed: {
    // 语言的设定是在,created 阶段 handleLanguage mixin 这个过程又依赖handleQuery(会访问data.query) 不要直接将columns 和 FN 依赖 $t 的属性放在data中
    columns: function () {
      return [
        {
          title: this.$t('common.table.title'),
          dataIndex: 'title',
          key: 'title',
        },
        {
          title: this.$t('common.table.businessId'),
          dataIndex: 'businessId',
          key: 'businessId',
        },
        {
          title: this.$t('common.table.orderType'),
          dataIndex: 'orderType',
          key: 'orderType',
        },
        {
          title: this.$t('common.table.status'),
          dataIndex: 'status',
          key: 'status',
          width: 100,
          scopedSlots: { customRender: 'status' },
        },
        {
          title: this.$t('common.table.updateBy'),
          dataIndex: 'updateBy',
          key: 'updateBy',
        },
        {
          title: this.$t('common.table.createTime'),
          dataIndex: 'createTime',
          key: 'createTime',
        },
        {
          title: this.$t('common.table.updateTime'),
          dataIndex: 'updateTime',
          key: 'updateTime',
        },
        {
          title: this.$t('common.table.delegator'),
          dataIndex: 'delegator',
          key: 'delegator',
        },

        {
          title: this.$t('common.table.action'),
          dataIndex: 'action',
          key: 'action',
          fixed: 'right',
          width: 60,
          scopedSlots: { customRender: 'action' },
        },
      ]
    },

  },
  data() {
    return {
      ProcessResultType,
      ProcessStatusType,
      StatusOptions,
      findPage: myStats,
      modalTitle: '发起流程',
      businessId: undefined,
      submitInfoModalType: NaN,//submitInfoModal可根据type 不同去动态渲染需要录入的字段
      fn: null,
      query: {
        // 查看handleQuery的使用文档 src/mixins/handleQuery.md
        // query 的初始化全部值，都必须在这里指定， 如果需要指明那一个query字段是必须的，
        // 那么，需要将该字段初始化为一对象,例如 type: {value: 初始化值}
        uniTenantId: {
          type: String
        },
        bizToken: {
          type: String
        },
        lang: 'zh',
        statsLevel: 3
      },
    };
  },
  mounted() {
    this._loadData()

  },
  methods: {

    _loadData: function () {
      this.loadData({
        uniTenantId: this.computedQuery.uniTenantId,
        bizToken: this.computedQuery.bizToken,
        statsLevel: this.computedQuery.statsLevel,
      });
    },
    handleQuery() {
      this._loadData()

    },
    handleCheckDetail({ businessId, publishId, procDefId }) {
      this.$router.push({
        path: '/platform/formPreviewer',
        query: {
          type: PreviewFormType.VIEW,
          publishId,
          procDefId,
          businessId,
          uniTenantId: this.computedQuery.uniTenantId,
          bizToken: this.computedQuery.bizToken,
          lang: this.computedQuery.lang

        }
      });
    },



  },
};
</script>
<style scoped>
>>> .ant-table td {
  white-space: nowrap;
}
</style>
