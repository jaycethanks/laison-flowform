<template>
  <a-modal
    :bodyStyle="{ maxHeight: '500px' }"
    :visible="visible"
    title="选择流程模板"
    @ok="$emit('ok')"
    @cancel="$emit('close')"
  >
    <a-input placeholder="按照名称过滤" @blur="showFilterList = false" @focus="showFilterList = true"></a-input>

    <a-tabs default-active-key="1" tab-position="left" @prevClick="() => {}" @nextClick="() => {}">
      <a-tab-pane v-for="i in 30" :key="i" :tab="`Tab-${i}`"> Content of tab {{ i }} </a-tab-pane>
    </a-tabs>

    <a-list v-show="showFilterList" size="small" item-layout="horizontal" :data-source="flatenArray">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <!-- <a-button
          @click="handleRemoveListItem(item.designKey)"
          slot="actions"
          type="link"
          title="从选中列表移除"
        >
          <a-icon type="delete" style="color: #ff4d4f"></a-icon>
        </a-button> -->
        <a-list-item-meta :description="ellipsis(item.designDes, 10)">
          <span slot="title" :title="item.designName" style="white-space: nowrap">{{
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

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: { ffIcon },
  computed: {
    flatenArray: function () {
      return this.list
        .map((group) => group.formTemplates)
        .reduce((prev, curr) => {
          return prev.concat(curr);
        }, []);
    },
  },
  data() {
    return {
      list: [],
      showFilterList: false,
      // visible: false,
    };
  },
  created() {
    this.list = mock.data;
  },
  methods: {
    ellipsis: (str, max) => ellipsis(str, max),

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
