<template>
  <RootContainer>
    <a-form layout="inline" @keyup.enter.native="handleQuery" @submit.prevent="handleQuery">
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
        <a-col>
          <a-form-item label="">
            <a-button
              type="primary"
              @click="templateListVisible = true"
              icon="caret-right"
              >{{ $t("apply.initiateApply") }}</a-button
            >
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

            <!-- 草稿 编辑|提交 -->
            <template v-if="[ProcessResultType.TOSUBMIT].includes(record.result)">
              <a @click="handleRowEdit(record)">{{ $t("common.edit") }}</a>
              <!-- <a-divider type="vertical" /> -->
              <a @click="handleRowSubmit(record)">{{ $t("common.submit") }}</a>
            </template>
            <template>
              <a
                v-if="
                  [ProcessResultType.DEALING].includes(record.status) &&
                  [1].includes(ProcessStatusType.TODO)
                "
                @click="handleCancelTask(record)"
                >{{ $t("common.revoke") }}</a
              >
            </template>

            <template>
              <a
                v-if="[ProcessResultType.DEALING].includes(record.result)"
                @click="handleRemainderTask(record)"
                >{{ $t("apply.urge") }}</a
              >
            </template>

            <!-- 草稿 删除 -->
            <a-popconfirm
              v-if="[ProcessResultType.TOSUBMIT].includes(record.result)"
              placement="rightBottom"
              ok-text="Yes"
              cancel-text="No"
              @confirm="handleDelete(record)"
            >
              <template slot="title"> {{ $t("common.ensureDelete") }}?</template>
              <a-button style="color: #ff4d4f" type="link">{{
                $t("common.delete")
              }}</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-card>

    <submitInfoModal :type="submitInfoModalType" :title="modalTitle_" ref="modal" @ok="handleSubmitInfoOk" />

    <TemplateListDrawer @select="handleSelect" :visible="templateListVisible" @close="templateListVisible = false" />
    <!-- <Container> -->
  </RootContainer>
</template>
<script>
import Container from "@/components/base/Container"
import RootContainer from "@/components/base/RootContainer"
import TemplateListDrawer from "./templateListDrawer.vue"
import platformRegistrationModal from '@/views/System/PlatformManagement/PlatformRegistration/platformRegistrationModal.vue';
import searchTableMixin from '@/mixins/searchTableMixin.js';
import { findPage, saveOrUpdate } from '@/api/system/platformManage.js';
import handleQuery from '@/mixins/handleQuery.js';
import PreviewFormType from "@/constants/PreviewFormType.js"
import { SubmitInfoType } from "@/constants/SubmitInfoType.js"
import ProcessResultType from "@/constants/ProcessResultType.js"
import { ProcessStatusType, StatusOptions } from "@/constants/ProcessStatusType.js"
import { myApply, remainderTask, cancelTask } from "@/api/platform/processOpenAPI.js"

import ffStatus from "@/components/FlowForm/ffStatus/index.vue"
import submitInfoModal from "@/components/FlowForm/SubmitInfoModal/submitInfoModal.vue"
import { deleteById, submit } from "@/api/platform/businessOpenAPI.js"
import handleLanguage from "@/mixins/handleLanguage.js"



export default {
  name: "MyApply",
  mixins: [searchTableMixin, handleQuery, handleLanguage],
  components: {
    Container,
    RootContainer,
    TemplateListDrawer,
    ffStatus,
    submitInfoModal
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
          width: 160,
          scopedSlots: { customRender: 'action' },
        },
      ]
    },
    FN: function () {
      return {
        [SubmitInfoType.APPLY]: {
          fn: submit,
          subTitle: this.$t('apply.initiateApply')
        },
        [SubmitInfoType.CANCELTASK]: {
          fn: cancelTask,
          subTitle: this.$t('apply.drawBackApply')
        },
      }
    }
  },
  data() {
    return {


      ProcessResultType,
      ProcessStatusType,
      StatusOptions,
      findPage: myApply,
      modalTitle_: '',
      modalTitle: '发起流程',
      businessId: undefined,
      submitInfoModalType: NaN,//submitInfoModal可根据type 不同去动态渲染需要录入的字段
      templateListVisible: false,
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
        lang: 'zh'
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
      });
    },
    handleQuery() {
      this._loadData()

    },
    handleCheckDetail({ businessId, publishId, procDefId }) {
      this.$router.replace({
        path: '/platform/formPreviewer',
        query: {
          type: PreviewFormType.VIEW,
          publishId,
          procDefId,
          businessId,
          uniTenantId: this.computedQuery.uniTenantId,
          bizToken: this.computedQuery.bizToken
        }
      });
    },
    handleRowSubmit({ businessId }) {
      this.submitInfoModalType = SubmitInfoType.APPLY
      const target = this.FN[SubmitInfoType.APPLY];
      const { fn, subTitle } = target;
      this.fn = fn;
      this.modalTitle_ = this.modalTitle + " - " + subTitle
      this.$refs.modal.show()
      this.businessId = businessId
    },

    handleCancelTask({ businessId }) {
      this.submitInfoModalType = SubmitInfoType.CANCELTASK
      const target = this.FN[SubmitInfoType.CANCELTASK];
      const { fn, subTitle } = target;
      this.fn = fn;
      this.modalTitle_ = this.modalTitle + " - " + subTitle
      this.$refs.modal.show()
      this.businessId = businessId
    },
    handleRowEdit({ businessId, publishId, procDefId }) {
      this.$router.replace({
        path: '/platform/formPreviewer',
        query: {
          type: PreviewFormType.APPLY,
          publishId,
          procDefId,
          businessId,
          uniTenantId: this.computedQuery.uniTenantId,
          bizToken: this.computedQuery.bizToken
        }
      });
    },
    async handleRemainderTask({ businessId }) {
      const res = await remainderTask({
        businessId,
        uniTenantId: this.computedQuery.uniTenantId,
        bizToken: this.computedQuery.bizToken
      })
      if (res.status === 200) {
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
      }
      this._loadData()

    },
    async handleDelete(record) {
      const { businessId } = record
      const res = await deleteById({
        businessId,
        uniTenantId: this.computedQuery.uniTenantId,
        bizToken: this.computedQuery.bizToken
      })
      if (res.status === 200) {
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
      }
      this._loadData()

    },
    handleSelect({ publishId, procDefId }) {
      this.$router.replace({
        path: '/platform/formPreviewer',
        query: {
          type: PreviewFormType.APPLY,
          publishId,
          procDefId,
          lang: this.computedQuery.lang,
          uniTenantId: this.computedQuery.uniTenantId,
          bizToken: this.computedQuery.bizToken
        }
      });
    },
    async handleOk(formFieldsValue, isEdit) {
      let fn = saveOrUpdate;
      const res = await fn(formFieldsValue);
      if (res.status === 200) {
        this.$message.success('添加成功');
        this.$refs.modal.hide();
      } else {
        this.$message.warn(res.msg);
      }
      this._loadData()


    },

    async handleSubmitInfoOk(submitInfo) {
      const res = await this.fn({
        businessId: this.businessId || '',// 业务ID，从草稿提交时需要携带
        formData: null,
        uniTenantId: this.computedQuery.uniTenantId,
        bizToken: this.computedQuery.bizToken,
        submitInfo
      })
      if (res.status === 200) {
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
      }
      this._loadData()

    },
  },
};
</script>
<style scoped>
>>> .ant-table td {
  white-space: nowrap;
}
</style>
