<template>
  <a-modal
    :bodyStyle="{  overflow: 'hidden',padding:'10px' }"
    :visible="visible"
    title="发起流程"
    @ok="$emit('ok')"
    @cancel="$emit('close')"
  >
    <a-input
      v-model="searchText"
      placeholder="按照名称过滤"
      @blur="showFilterList = false"
      @focus="showFilterList = true"
    >
      <!-- <a-button size="small" type="link" icon="rollback" slot="addonAfter"></a-button> -->
    </a-input>

    <a-tabs
      v-show="!showFilterList"
      size="small"
      class="tab-wrapper"
      default-active-key="订单订单订单订单"
      tab-position="left"
      @prevClick="() => {}"
      @nextClick="() => {}"
    >
      <a-tab-pane class="tab-pane" v-for="group in list" :key="group.groupName" :tab="ellipsis(group.groupName, 10)">
        <a-list size="small" item-layout="horizontal" :data-source="group.formTemplates">
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a-list-item-meta style="font-size:12px">
              <span slot="description" style="font-size:12px">{{ellipsis(item.designDes, 10)}}</span>
              <span slot="title" :title="item.designName" style="white-space: nowrap;">{{
            ellipsis(item.designName, 8)
              }}</span>

              <ff-icon slot="avatar" :icon="item.designIcon" :bgc="item.designColor" />
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </a-tab-pane>
    </a-tabs>

    <a-list
      class="filter-list"
      v-show="showFilterList"
      style="height: 400px;overflow-y:auto"
      size="small"
      item-layout="horizontal"
      :data-source="flatenArray"
    >
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-list-item-meta style="font-size:12px">
          <span slot="description" style="font-size:12px">{{ellipsis(item.designDes, 10)}}</span>
          <span slot="title" :title="item.designName" style="white-space: nowrap;">{{
            ellipsis(item.designName, 8)
          }}</span>

          <ff-icon slot="avatar" :icon="item.designIcon" :bgc="item.designColor" />
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </a-modal>
</template>
<script>
import mock from './mock';
import ffIcon from '@/components/FlowForm/ffIcon/index.vue';
import ellipsis from '@/utils/ellipsis';
import icons from '@/assets/flowform_icons/index.js';

export default {
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
  },
  components: { ffIcon },
  computed: {
    flatenArray: function () {
      let _this = this
      const _flatenList = this.list
        .map((group) => group.formTemplates)
        .reduce((prev, curr) => {
          return prev.concat(curr);
        }, []);
      if(this.searchText.trim === ""){
        return _flatenList
      }else{
        return _flatenList.filter((item=>(item.designName.includes(_this.searchText) || item.designDes.includes(_this.searchText))))
      }

    },
  },
  data() {
    return {
      list: [],
      showFilterList: false,
      searchText:""
      // visible: false,
    };
  },
  created() {
    this.list = mock.data;
  },
  methods: {
    ellipsis: (str, max) => ellipsis(str, max),
    handleSearchFilter({target:{value}}){
      console.log('[value]: ',value)

    }
    //   showModal() {
    //     this.visible = true;
    //   },
    //   handleOk(e) {
    //     console.log(e);
    //     this.visible = false;
    //   },
  },
};
</script>
<style scoped lang="scss">

.tab-wrapper{
  height: 400px;
  // overflow: auto;
  .tab-pane{
    ::v-deep .ant-list-items{

      height: 400px;
      overflow-y: auto;
    }

  }

}
</style>
