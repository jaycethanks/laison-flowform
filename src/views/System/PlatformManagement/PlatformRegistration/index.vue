<template>
  <div class="root">
    <a-form layout="inline" @keyup.enter.native="searchQuery" @submit.prevent="handleSubmit">
      <a-form-item :label="$t('dept.name')">
        <a-input v-model="pageInfo.condition.deptName"></a-input>
      </a-form-item>
      <!-- <a-row :gutter="24">
        <a-col :md="6" :sm="8">
        </a-col>
        <a-col :md="6" :sm="8">
          <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
          </span>
        </a-col>
      </a-row> -->
      <a-form-item>
        <a-button type="primary" @click="loadData" html-type="submit" icon="search">{{ $t('common.query') }}</a-button>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">{{
          $t('common.reset')
        }}</a-button>
      </a-form-item>
    </a-form>
    <a-table :columns="columns" :data-source="data">
      <a slot="name" slot-scope="text">{{ text }}</a>
    </a-table>
  </div>
</template>
<script>
import searchFieldMixin from '@/mixins/searchFieldMixin.js';
import tableMixin from '@/mixins/tableMixin.js';

export default {
  name: 'PlatformRegistration',
  mixin: [searchFieldMixin, tableMixin],
  data() {
    return {};
  },
  methods: {
    loadData() {},
    searchReset() {},
    searchQuery() {},
    handleSubmit(e) {
      console.log('[e]: ', e);
    },
  },
};
</script>
<style></style>
