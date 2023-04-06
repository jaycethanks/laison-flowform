<template>
  <div class="card-container">
    <a-tabs default-active-key="1" size="large" type="card">
      <a-tab-pane key="1" :tab="$t('InspectStatistics.material')">
        <MaterialInspectStatistics />
      </a-tab-pane>
      <a-tab-pane key="2" :tab="$t('InspectStatistics.FactoryInstapectStatistics')" force-render>
        <FactoryInstapectStatistics />
      </a-tab-pane>
      <a-tab-pane key="3" :tab="$t('InspectStatistics.OemInstapectStatistics')">
        <OemInstapectStatistics />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import moment from 'moment'
import MaterialInspectStatistics from './MaterialInspectStatistics'
import FactoryInstapectStatistics from './FactoryInstapectStatistics'
import OemInstapectStatistics from './OemInstapectStatistics'
MaterialInspectStatistics
export default {
  name: 'InspectStatistics',
  mixins: [JeecgListMixin],
  components: {
    MaterialInspectStatistics,
    FactoryInstapectStatistics,
    OemInstapectStatistics,
  },
  data() {
    this.chartSettings = {
      area: true,
    }
    return {}
  },
  async created() {
    this.loadData()
  },

  computed: {},
  methods: {
    moment,
    loadData() {},
  },
}
</script>
<style scoped lang="less">
.bordered--wt {
  border: 1px solid #efefef;
}

.gap--common {
  margin: 0 0 20px 0;
  padding: 20px;
}

.section--filter-query {
  // border: 1px solid red;
}
.section--summary {
  // border: 1px solid blue;
}
.section--echart {
  display: flex;
  justify-content: space-between;
  // border: 4px solid yellow;
}
.section--table {
  border: none;
  margin: 0;
  padding: 0;
}
/deep/ .ant-descriptions-item-content {
  font-size: 28px;
  color: rgba(0, 0, 0, 0.85);
  margin-left: 12px;
}

/deep/ tr.ant-descriptions-row:nth-child(1) td {
  &::before {
    background-color: #71bcfe;
    border-radius: 50%;
    content: '';
    display: inline-block;
    vertical-align: middle;
    width: 6px;
    height: 6px;
    margin-right: 6px;
  }
  &:nth-child(1)::before {
    background-color: #71bcfe;
  }
  &:nth-child(2)::before {
    background-color: #4d92ff;
  }
  &:nth-child(3)::before {
    background-color: #78a8ff;
  }
  &:nth-child(4)::before {
    background-color: #64d6fc;
  }
}
</style>

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
<style scoped>
/* tabs-style */
>>> .card-container {
  background: #f5f5f5;
  overflow: hidden;
  padding: 24px;
}
>>> .card-container > .ant-tabs-card > .ant-tabs-content {
  height: 120px;
  margin-top: -16px;
}

>>> .card-container > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
  background: #fff;
  padding: 16px;
}

>>> .ant-tabs-bar {
  margin: 0;
}
>>> .card-container > .ant-tabs-card > .ant-tabs-bar {
  border-color: #fff;
}

>>> .card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
  border-color: transparent;
  background: transparent;
}

>>> .card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
  border-color: #fff;
  background: #fff;
}
</style>
