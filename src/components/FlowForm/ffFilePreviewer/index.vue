<template>
  <div>
    <div v-if="isImg" class="img-viewer">
      <div class="viewer-img-box">
        <img class="img" :src="url" />
        <div class="img-hover-mask" @click="handlePreview">
          <a-icon type="eye" />
        </div>
      </div>
      <a @click="download(url, label)">{{ label }}</a>
    </div>

    <div v-else class="none-img-file">
      <a @click="download(url, label)">{{ label }}</a>
    </div>

    <a-modal
      width="max-content"
      :visible="previewVisible"
      :footer="null"
      :closable="false"
      @cancel="handleCancel"
    >
      <!-- svg 图片没有高度会直接坍塌 -->
      <img
        :alt="label"
        style="
          min-height: 200px;
          min-width: 200px;
          max-width: 80vw;
          max-height: 80vh;
        "
        :src="url"
      />
      <!-- <img alt="example" :src="url" /> -->
    </a-modal>
  </div>
</template>
<script>
import { downloadFile } from "@/utils/downloadFile.js"

export default {
  name: "ffFilePreviewer",
  props: {
    url: {
      type: String
    },
    label: {
      type: String
    },


  },
  data() {
    return {
      previewImage: '',
      previewVisible: false,
    }
  },
  computed: {
    isImg: function () { return /\.(jpe?g|png|gif|bmp|svg)$/.test(this.label) ? true : false }
  },
  methods: {
    async handlePreview() {
      // if (!file.url && !file.preview) {
      //   file.preview = await getBase64(file.originFileObj);
      // }
      this.previewImage = this.url;
      // this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleCancel() {
      this.previewVisible = false;
    },
    download(path, fileName) {
      // const link = document.createElement('a')
      // const url = "http://192.168.3.47/file/1314/1547/wallhaven-578d73.jpg"
      downloadFile(path, fileName)

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
.img-viewer {
  background-color: #f7f7f7;
  border-radius: 6px;
  display: flex;
  align-items: center;

  .viewer-img-box {
    width: 50px;
    height: 50px;
    padding: 8px;
    position: relative;
    .img {
      height: 100%;
      width: 100%;
      background-color: #fff;
    }
    .img-hover-mask {
      position: absolute;
      inset: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #00000015;
      opacity: 0;
      transition: all 0.3s linear;
      &:hover {
        opacity: 1;
      }
    }
  }
}
.none-img-file {
}
</style>