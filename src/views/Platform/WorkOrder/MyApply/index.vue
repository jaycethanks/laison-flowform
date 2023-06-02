<template>
  <RootContainer>
    <a-form layout="inline" @keyup.enter.native="handleQuery" @submit.prevent="handleQuery">
      <a-row :gutter="24" style="margin: 0">
        <a-form-item label="工单编号">
          <a-input v-model="pageInfo.condition.name"></a-input>
        </a-form-item>
        <a-form-item label="状态">
          <a-input v-model="pageInfo.condition.bizTenantId"></a-input>
        </a-form-item>
        <!-- <a-col :md="6" :sm="8"> </a-col>
        <a-col :md="6" :sm="8">
          <span style="float: left; overflow: hidden" class="table-page-search-submitButtons"> </span>
        </a-col> -->
      </a-row>

      <a-row type="flex" justify="space-between" :gutter="24" style="margin: 0">
        <a-col>
          <a-form-item>
            <a-button type="primary" html-type="submit" icon="search">查询</a-button>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="resetSearch" icon="reload">重置</a-button>
          </a-form-item>
        </a-col>
        <a-col>
          <a-form-item label="">
            <a-button type="primary" @click="templateListVisible = true" icon="caret-right">发起申请 </a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-table
      :loading="pageInfo.loading"
      @change="handleTableChange"
      :columns="columns"
      :data-source="dataSource"
      rowKey="id"
      :pagination="pageInfo.pagination"
    >
      <a slot="name" slot-scope="text">{{ text }}</a>
      <a slot="delFlag" slot-scope="text">
        <a-tag :color="text ? 'red' : 'green'">{{ text ? '已删除' : '正常' }} </a-tag>
      </a>

      <template slot="action" slot-scope="text, record">
        <a-space>
          <a
            slot="action"
            @click="
              modalTitle = '编辑 - ' + record.name;
              $refs.modal.show(record);
            "
            >编辑</a
          >
        </a-space>
      </template>
    </a-table>
    <!-- <platformRegistrationModal :title="modalTitle" ref="modal" @ok="handleOk" submitLoading /> -->
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
const columns = [
  {
    title: '平台id',
    dataIndex: 'uniTenantId',
    key: 'uniTenantId',
  },
  {
    title: '平台名称',
    dataIndex: 'name',
    key: 'name',
    width: 120,
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '租户ID',
    dataIndex: 'bizTenantId',
    key: 'bizTenantId',
  },
  {
    title: 'baseUrl',
    dataIndex: 'baseUrl',
    key: 'baseUrl',
  },

  {
    title: '时区',
    dataIndex: 'timezone',
    key: 'timezone',
    ellipsis: true,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    ellipsis: true,
  },
  {
    title: '状态',
    dataIndex: 'delFlag',
    key: 'delFlag',
    scopedSlots: { customRender: 'delFlag' },

    width: 100,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 100,
    scopedSlots: { customRender: 'action' },
  },
];
export default {
  name:"MyApply",
  mixins: [searchTableMixin,handleQuery],
  components:{
    Container,
    RootContainer,
    TemplateListDrawer
  },
    data() {
    return {
      columns,
      findPage,
      modalTitle: '新增',
      templateListVisible:false,
      query: {
        // 查看handleQuery的使用文档 src/mixins/handleQuery.md
        // query 的初始化全部值，都必须在这里指定， 如果需要指明那一个query字段是必须的，
        // 那么，需要将该字段初始化为一对象,例如 type: {value: 初始化值}
        uniTenantId: {
          type:String
        },
        bizToken: {
          type:String
        },
      },
    };
  },
    mounted() {
    this.loadData();
  },
  methods: {
    handleQuery() {
      this.loadData();
    },
    handleSelect(id){
      this.$router.push({
        path: '/platform/formPreviewer',
        query: {
          type:PreviewFormType.APPLY,
          flowformId:id,
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
      this.loadData();
    },
  },
};
</script>
<style></style>
