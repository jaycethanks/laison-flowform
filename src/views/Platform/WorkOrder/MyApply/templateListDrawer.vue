<template>
  <a-drawer
    width="400"
    title="选择流程"
    placement="right"
    :closable="false"
    :visible="visible"
    :after-visible-change="afterVisibleChange"
    @close="onClose"
  >
    <template>
      <section v-for="group in list" :key="group.groupId">
        <TitleRow size="small" :title="group.groupName" bold />
        <a-list item-layout="horizontal" :data-source="group.list">
          <a-list-item @click="handleFlowSelect(item.id)" class="list-item" slot="renderItem" slot-scope="item, index">
            <a-list-item-meta :description="item.designDes">
              <p style="margin:0" slot="title">{{item.designName}}</p>
              <!-- <TitleRow slot="title" size="small" :title="item.designName" bold /> -->
              <ffIcon slot="avatar" :bgc="item.designColor" :icon="item.designIcon" size="small" />
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </section>
    </template>
  </a-drawer>
</template>
<script>
import { myApplyList } from "@/api/platform/processOpenAPI.js"
import ffIcon from "@/components/FlowForm/ffIcon/index.vue"
import TitleRow from "@/components/base/TitleRow/index.vue"
import mock from "./listMock"
export default {
  name: "TemplateListDrawer",
  components: {
    ffIcon, TitleRow
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      list: []
    }
  },
  methods: {
    afterVisibleChange(val) {
      if (val === true) {
        this.loadData()
      }
    },
    onClose() {
      this.$emit("close")
    },
    async loadData() {
      const res = await Promise.resolve(mock)
      this.list = res.data
    },
    handleFlowSelect(id){
      this.$emit("close")
      this.$emit("select",id)
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep .ant-list-item{
  padding: 6px 0
}
::v-deep .ant-list-item-meta{
  align-items: center;
}
::v-deep .ant-list-item-meta-title{
    line-height: 14px;
  }
::v-deep .ant-list-item-meta-description{
    line-height: 14px;
    font-size: 12px;
}
.list-item{
  cursor: pointer;
  padding: 8px 12px;
  &:hover{
    background-color: rgb(247, 247, 247);
  }
}
</style>
