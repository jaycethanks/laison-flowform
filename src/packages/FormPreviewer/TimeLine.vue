<template>
  <div class="timeline-wrapper">
    <p style="text-align: end">
      <a-button type="link" @click="handleCheckFlowDiagram">
        <span style="display: inline-flex; align-items: center; gap: 0.2em">
          <SvgIconFlow style="height: 1.2em; width: 1.2em" />
          {{ $t("formPreview.checkFlowDiagram") }}
        </span>
      </a-button>
    </p>
    <a-timeline>
      <a-timeline-item
        v-for="(operateItem, index) in operateRecord"
        :key="index"
        :color="getColor(operateItem.taskType).bg"
      >
        <p
          :style="{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '.2em .6em',
          }"
        >
          <span style="font-weight: bold">
            {{ operateItem.nodeName }}
          </span>
          <span :style="{ color: getColor(operateItem.taskType).text }">{{
            circulateTaskType(operateItem.taskType)
          }}</span>
        </p>
        <p class="userName">
          <SvgIconPersonPin style="height: 14px; width: 14px" />{{
            operateItem.executorName
          }}
        </p>
        <div v-if="operateItem.comment" class="comment">
          {{ operateItem.comment }}
        </div>

        <p v-if="operateItem.enclosurePaths" class="link-files">
          <SvgIconLinkedFiles style="height: 14px; width: 14px" />{{
            $t("submitInfoModal.enclosure")
          }}
        </p>
        <div v-if="operateItem.enclosurePaths" class="addons">
          <div
            class="addon-item"
            v-for="(addon, index) in circulateFiles(operateItem.enclosurePaths)"
            :key="addon.name"
          >
            <ffFilePreviewer :label="addon.name" :url="'/file' + addon.path" />
          </div>
        </div>

        <p class="time-stamp">{{ operateItem.createTime }}</p>
      </a-timeline-item>
    </a-timeline>
    <j-modal
      width="1200px"
      :visible="flowPreviewerModalVisible"
      switchFullscreen
      :title="$t('formPreview.flowChart')"
      @ok="() => {}"
      @cancel="flowPreviewerModalVisible = false"
      :maskClosable="false"
      :footer="null"
      @fullScreenEvent="() => {}"
    >
      <!-- :ok-button-props="{ props: { disabled: this.okBtnDisabled } }" -->
      <!-- @fullScreenEvent="isFullScreen = $event" -->

      <FlowPreviewer :flowPreviewerData="flowPreviewerData" />
    </j-modal>
  </div>
</template>
<script>
import SvgIconPersonPin from "@/assets/svgIcon/SvgIconPersonPin.vue"
import SvgIconLinkedFiles from "@/assets/svgIcon/SvgIconLinkedFiles.vue"
import SvgIconFlow from "@/assets/svgIcon/SvgIconFlow.vue"
import FlowPreviewer from "@/packages/FlowPreviewer/index.vue"
import baseStyle from '@/components/base/baseStyle'
import JModal from "@/components/jeecg/JModal/index.vue"
import { taskProgress } from "@/api/platform/processOpenAPI.js"
import ffFilePreviewer from "@/components/FlowForm/ffFilePreviewer/index.vue"
const _fileUrl = process.env.VUE_APP_FILE_URL;
const colors = {
  create: baseStyle.$primary,
  pass: baseStyle.$success,
  cancel: baseStyle.$danger,
  back: baseStyle.$danger,
  delegate: baseStyle.$info,
  change: baseStyle.$dark,
  todo: baseStyle.$warning
}
export default {
  props: {
    operations: {
      type: Object,
    },
    businessId: {
      type: String,
      required: true,
    },
    uniTenantId: {
      type: String,
      required: true,
    },
    bizToken: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      flowPreviewerModalVisible: false,
      operateRecord: [],
      flowPreviewerData: null,
      taskTypes: {
        // todo: 多语言支持
        create: "创建",
        pass: "通过",
        cancel: "撤回",
        back: "驳回",
        delegate: "委托",
        change: "变更",
        todo: "待办"
      }
    }
  },
  components: {
    SvgIconPersonPin,
    SvgIconLinkedFiles,
    SvgIconFlow,
    JModal,
    FlowPreviewer,
    ffFilePreviewer
  },
  created() {
    this.loadOperationRecord()
  },
  methods: {
    // handleAddonClick(addon) {
    //   if (addon.isImg) {
    //     const url = _fileUrl + addon.path;
    //     this.handlePreview(url)
    //   } else {
    //     this.download(addon.path, addon.name)
    //   }
    // },
    // handleCancel() {
    //   this.previewVisible = false;
    // },

    circulateTaskType(typeString) {
      return this.taskTypes[typeString]
    },

    handleCheckFlowDiagram() {
      this.flowPreviewerModalVisible = true
    },
    async loadOperationRecord() {
      const res = await taskProgress({
        businessId: this.businessId,
        uniTenantId: this.uniTenantId,
        bizToken: this.bizToken,

      });
      if (res.status == 200) {
        this.operateRecord = res.data.operateRecord
        this.flowPreviewerData = res.data.processProgress
      } else {
        this.$message.error(res.msg)
      }
    },
    getColor(type) {
      return colors[type]
    },
    circulateFiles(filePaths) {
      if (!filePaths) return [];
      return filePaths.split('|').map(path => ({
        name: path.substring(path.lastIndexOf('/') + 1),
        path,
      }))
    },

  }

}
</script>
<style scoped lang="scss">
.timeline-wrapper {
  box-shadow: 0px 0px 7px 3px #f4f4f4;
  padding: 20px 16px;
  background-color: #fff;
  .userName {
    font-size: 14px;
    line-height: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    gap: 0.2em;
  }
  .link-files {
    font-size: 14px;
    line-height: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    margin: 2em 0 1em 0;
    gap: 0.2em;
  }
  .comment {
    // max-width: 24em;
    font-size: 12px;
    background-color: #f7f7f7;
    padding: 0.6rem 1.2rem;
    border-radius: 6px;
  }
  .time-stamp {
    font-size: 12px;
    text-align: end;
    color: #b1b1b1;
    margin-top: 0.2em;
  }
  .addons {
    // max-width: 24em;
    // min-width: 24em;
    font-size: 12px;
    .addon-item {
      margin-bottom: 0.2em;
      // background-color: #f5f8ff;
      // color: #979797;
      padding: 0.2rem 1.2rem;
      border-radius: 6px;
    }
  }
}
</style>
