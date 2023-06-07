<template>
  <div class="timeline-wrapper">
    <a-timeline>
      <a-timeline-item
        v-for="operateItem in operateRecord"
        :key="operateItem.nodeId"
        :color="getColor(operateItem.taskType)"
      >
        <p>{{ operateItem.nodeName }}</p>
        <p class="userName">
          <SvgIconPersonPin style="height: 14px; width: 14px" />{{
            operateItem.userName
          }}
        </p>
        <div class="comment">{{ operateItem.comment }}</div>

        <p v-if="operateItem.enclosurePaths" class="link-files">
          <SvgIconLinkedFiles style="height: 14px; width: 14px" />附件
        </p>
        <div v-if="operateItem.enclosurePaths" class="addons">
          <div class="addon-item" v-for="addon in circulateFiles(operateItem.enclosurePaths)" :key="addon.name">
            <a href="#" @click="download(addon.path,addon.name)">{{addon.name}}</a>
          </div>
        </div>

        <p class="time-stamp">{{ operateItem.createTime }}</p>
      </a-timeline-item>
    </a-timeline>
  </div>
</template>
<script>

const colors = {
  create: '#9ec5fe',
  pass: '#a3cfbb',
  cancel: '#58151c',
  back: '#ffe69c',
  delegate: "#4d94ff",
  change: "#c4c8cb"
}
import SvgIconPersonPin from "@/assets/svgIcon/SvgIconPersonPin.vue"
import SvgIconLinkedFiles from "@/assets/svgIcon/SvgIconLinkedFiles.vue"
import {downloadFile} from "@/utils/downloadFile.js"
const _fileUrl = process.env.VUE_APP_FILE_URL;

export default {
  props: {
    operations: {
      type: Object,
    }
  },
  data() {
    return {
    }
  },
  components: {
    SvgIconPersonPin,
    SvgIconLinkedFiles
  },
  computed: {
    operateRecord: function () {
      if (this.operations.operateRecord) {
        return this.operations.operateRecord
      }
      return []
    }

  },
  methods: {
    getColor(type) {
      return colors[type]
    },
    circulateFiles(filePaths){
      if(!filePaths) return [];
      return filePaths.split(',').map(path=>({
        name:path.substring(path.lastIndexOf('/') + 1),
        path
      }))
    },
    download(path, fileName) {
      const link = document.createElement('a')
      const url = _fileUrl + path;
      // const url = "http://192.168.3.47/file/1314/1547/wallhaven-578d73.jpg"

      downloadFile(url,fileName)

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
    max-width: 24em;
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
    max-width: 24em;
    min-width: 24em;
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
