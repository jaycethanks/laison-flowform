<template>
  <div class="timeline-wrapper">
    <p style="text-align: end">
      <a-button type="link" @click="handleCheckFlowDiagram">
        <span style="display: inline-flex; align-items: center; gap: 0.2em">
          <SvgIconFlow style="height: 1.2em; width: 1.2em" />
          查看流程图
        </span>
      </a-button>
    </p>
    <a-timeline>
      <a-timeline-item
        v-for="operateItem in operateRecord"
        :key="operateItem.createTime"
        :color="getColor(operateItem.taskType).bg"
      >
        <p
          :style="{display:'flex',justifyContent:'space-between',padding:'.2em .6em',backgroundColor:getColor(operateItem.taskType).bg_light}"
        >
          <span>
            {{ operateItem.nodeName }}
          </span>
          <span :style="{color:getColor(operateItem.taskType).text}"
            >[{{ circulateTaskType(operateItem.taskType) }}]</span
          >
        </p>
        <p class="userName">
          <SvgIconPersonPin style="height: 14px; width: 14px" />{{
            operateItem.executorName
          }}
        </p>
        <div class="comment">{{ operateItem.comment }}</div>

        <p v-if="operateItem.enclosurePaths" class="link-files">
          <SvgIconLinkedFiles style="height: 14px; width: 14px" />附件
        </p>
        <div v-if="operateItem.enclosurePaths" class="addons">
          <div class="addon-item" v-for="addon in circulateFiles(operateItem.enclosurePaths)" :key="addon.name">
            <a href="#" @click="download(addon.path, addon.name)">{{
              addon.name
            }}</a>
          </div>
        </div>

        <p class="time-stamp">{{ operateItem.createTime }}</p>
      </a-timeline-item>
    </a-timeline>
    <j-modal
      width="1200px"
      :visible="flowPreviewerModalVisible"
      switchFullscreen
      title="流程图"
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
import { downloadFile } from "@/utils/downloadFile.js"
import baseStyle from '@/components/base/baseStyle'
import JModal from "@/components/jeecg/JModal/index.vue"
import { taskProgress } from "@/api/platform/processOpenAPI.js"
const _fileUrl = process.env.VUE_APP_FILE_URL;
const colors = {
  create: baseStyle.$primary,
  pass: baseStyle.$success,
  cancel: baseStyle.$warning,
  back: baseStyle.$danger,
  delegate: baseStyle.$info,
  change: baseStyle.$dark
}


export default {
  props: {
    operations: {
      type: Object,
    },
    businessId:{
      type:String,
      required: true,
    },
    uniTenantId:{
      type:String,
      required: true,
    },
    bizToken:{
      type:String,
      required: true,
    },
  },
  data() {
    return {
      flowPreviewerModalVisible: false,
      operateRecord:[],
      flowPreviewerData:null,
      taskTypes:{
        // todo: 多语言支持
        create: "创建",
        pass: "通过",
        cancel: "撤回",
        back: "驳回",
        delegate: "委托",
        change: "变更"
      }
    }
  },
  components: {
    SvgIconPersonPin,
    SvgIconLinkedFiles,
    SvgIconFlow,
    JModal,
    FlowPreviewer
  },
  created(){
    this.loadOperationRecord()
  },
  methods: {
    circulateTaskType(typeString){
      return this.taskTypes[typeString]
    },

    handleCheckFlowDiagram() {
      this.flowPreviewerModalVisible = true
    },
    async loadOperationRecord(){
      const res = await taskProgress({
        businessId: this.businessId,
        uniTenantId: this.uniTenantId,
        bizToken: this.bizToken,

      });
      if(res.status == 200){
        this.operateRecord = res.data.operateRecord
        this.flowPreviewerData = res.data.processProgress
      }else{
        this.$message.error(res.msg)
      }
    },
    getColor(type) {
      return colors[type]
    },
    circulateFiles(filePaths) {
      if (!filePaths) return [];
      return filePaths.split(',').map(path => ({
        name: path.substring(path.lastIndexOf('/') + 1),
        path
      }))
    },
    download(path, fileName) {
      const link = document.createElement('a')
      const url = _fileUrl + path;
      // const url = "http://192.168.3.47/file/1314/1547/wallhaven-578d73.jpg"

      downloadFile(url, fileName)

      return
      link.style.display = 'none'
      link.setAttribute('target', '_blank')
      /**
       * download的属性是HTML5新增的属性
       * href属性的地址必须是非跨域的地址，如果引用的是第三方的网站或者说是前后端分离的项目(调用后台的接口)，这时download就会不起作用。
       * 此时，如果是下载浏览器无法解析的文件，例如.exe,.xlsx..那么浏览器会自动下载，但是如果使用浏览器可以解析的文件，比如.txt,.png,.pdf....浏览器就会采取预览模式
       * 所以，对于.txt,.png,.pdf等的预览功能我们就可以直接不设置download属性(前提是后端响应头的Content-Type: application/octet-stream，如果为application/pdf浏览器则会判断文件为 pdf ，自动执行预览的策略)
       */
      fileName && link.setAttribute('download', fileName)
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
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
