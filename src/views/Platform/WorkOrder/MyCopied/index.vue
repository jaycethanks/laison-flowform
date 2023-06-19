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
      </a-row>

      <a-row type="flex" justify="space-between" :gutter="24" style="margin: 0">
        <a-col>
          <a-form-item>
            <a-button type="primary" html-type="submit" icon="search">{{$t("common.query")}}</a-button>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="resetSearch" icon="reload">{{$t("common.reset")}}</a-button>
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
        rowKey="id"
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
            <template>
              <a @click="handleCheckDetail(record)">{{ $t("common.check") }}</a>
            </template>
          </a-space>
        </template>
      </a-table>
    </a-card>

    <!-- <submitInfoModal :title="modalTitle" ref="modal" @ok="handleSubmitInfoOk" /> -->

    <!-- <Container> -->
  </RootContainer>
</template>
<script>
import Container from "@/components/base/Container"
import RootContainer from "@/components/base/RootContainer"
import platformRegistrationModal from '@/views/System/PlatformManagement/PlatformRegistration/platformRegistrationModal.vue';
import searchTableMixin from '@/mixins/searchTableMixin.js';
import { findPage, saveOrUpdate } from '@/api/system/platformManage.js';
import handleQuery from '@/mixins/handleQuery.js';
import ProcessResultType from "@/constants/ProcessResultType.js"

import PreviewFormType from "@/constants/PreviewFormType.js"
import { ProcessStatusType, StatusOptions } from "@/constants/ProcessStatusType.js"


import { myCopy } from "@/api/platform/processOpenAPI.js"
import ffStatus from "@/components/FlowForm/ffStatus/index.vue"
// import submitInfoModal from "@/components/FlowForm/SubmitInfoModal/submitInfoModal.vue"
import { deleteById } from "@/api/platform/businessOpenAPI.js"
import handleLanguage from "@/mixins/handleLanguage.js"

export default {
  name: "myCopy",
  mixins: [searchTableMixin, handleQuery, handleLanguage],
  components: {
    Container,
    RootContainer,
    ffStatus,
    // submitInfoModal
  },
  computed: {
    modalTitle: function(){return this.$t('empty')},
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
          title: this.$t('common.table.copyNode'),
          dataIndex: 'nodeName',
          key: 'nodeName',
        },
        {
          title: this.$t('common.table.copyBy'),
          dataIndex: 'copyBy',
          key: 'copyBy',
        },
        {
          title: this.$t('common.table.copyTime'),
          dataIndex: 'copyTime',
          key: 'copyTime',
        },
        {
          title: this.$t('common.table.action'),
          dataIndex: 'action',
          key: 'action',
          fixed: 'right',
          width: 160,
          scopedSlots: { customRender: 'action' },
        },
      ];
    }
  },
  data() {
    return {
      ProcessResultType,
      ProcessStatusType,
      StatusOptions,
      findPage: myCopy,
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
        lang:'en'
      },
    };
  },
  mounted() {
    this.loadData({
      uniTenantId: this.computedQuery.uniTenantId,
      bizToken: this.computedQuery.bizToken,
    });
  },
  methods: {
    handleQuery() {
      this.loadData({
        uniTenantId: this.computedQuery.uniTenantId,
        bizToken: this.computedQuery.bizToken,
      });
    },
    handleCheckDetail({ businessId, publishId, procDefId, nodeId }) {
      this.$router.push({
        path: '/platform/formPreviewer',
        query: {
          type: PreviewFormType.VIEW,
          publishId,
          procDefId,
          businessId,
          nodeId,
          uniTenantId: this.computedQuery.uniTenantId,
          bizToken: this.computedQuery.bizToken
        }
      });
    },
    handleRowEdit({ businessId, publishId, procDefId }) {
      this.$router.push({
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
      this.loadData({
        uniTenantId: this.computedQuery.uniTenantId,
        bizToken: this.computedQuery.bizToken,
      });
    },
    handleSelect({ publishId, procDefId }) {
      this.$router.push({
        path: '/platform/formPreviewer',
        query: {
          type: PreviewFormType.APPLY,
          publishId,
          procDefId,
          uniTenantId: this.computedQuery.uniTenantId,
          bizToken: this.computedQuery.bizToken
        }
      });
    },


    // async handleOk(formFieldsValue, isEdit) {
    //   let fn = saveOrUpdate;
    //   const res = await fn(formFieldsValue);
    //   if (res.status === 200) {
    //     this.$message.success('添加成功');
    //     this.$refs.modal.hide();
    //   } else {
    //     this.$message.warn(res.msg);
    //   }
    //   this.loadData({
    //     uniTenantId: this.computedQuery.uniTenantId,
    //     bizToken: this.computedQuery.bizToken,
    //   });

    // },

    async handleSubmitInfoOk(submitInfo) {
      // const formData = await this.getFormData()
      // const res = await submit({
      //   businessId:this.computedQuery.businessId || '',// 业务ID，从草稿提交时需要携带
      //   formData,
      //   curTaskId:this.computedQuery.curTaskId || '',// 审批时需要携带
      //   uniTenantId: this.computedQuery.uniTenantId,
      //   publishId:this.computedQuery.publishId,
      //   bizToken: this.computedQuery.bizToken,
      //   submitInfo
      // })
      // console.log('[res]: ',res)
    },
  },
};
</script>
<style scoped>
>>> .ant-table td {
  white-space: nowrap;
}
</style>
