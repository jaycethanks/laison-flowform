<template>
  <!-- <div class="form-previewer-root"> -->
  <RootContainer noLogo :loading="pageLoading">
    <Container>
      <!-- @jayce -->
      <div id="operation-row">
        <a-button type="link" icon="rollback" @click="$router.go(-1)">{{
          $t("common.back")
        }}</a-button>
        <a-tooltip
          :title="$t('common.printPreview')"
          v-if="
            formInfo &&
            formInfo.config != undefined &&
            formInfo.config.enablePrint
          "
        >
          <a-button type="link" v-print="'#print-target-id'">
            <a-icon type="printer" style="font-size: 20px" />
          </a-button>
        </a-tooltip>
      </div>

      <main class="form-preview-content-area">
        <a-row type="flex" justify="center">
          <a-col :xs="24" :xl="18">
            <section
              class="form"
              id="print-target-id"
              :class="{
                'enable-print-simple-style':
                  formInfo &&
                  formInfo.config != undefined &&
                  formInfo.config.enablePrintSimpleStyle,
              }"
            >
              <k-form-build
                v-if="!wrongPage && formInfo"
                :style="computedQuery.style"
                class="form-previewer"
                @mount="handleMount"
                :value="formInfo"
                ref="kfb"
                :disabled="this.computedQuery.type === PreviewFormType.VIEW"
              />
            </section>
          </a-col>
          <a-col
            :xs="24"
            :xl="6"
            v-if="this.computedQuery.type !== PreviewFormType.APPLY"
          >
            <aside class="timeline">
              <TimeLine
                :businessId="computedQuery.businessId"
                :uniTenantId="computedQuery.uniTenantId"
                :bizToken="computedQuery.bizToken"
              />
            </aside>
          </a-col>
        </a-row>
      </main>

      <EmptyPage
        v-if="wrongPage || formInfo == null"
        :description="
          wrongPage ? $t('common.wrongPage') : $t('formPreview.parseError')
        "
      />
    </Container>

    <footer v-if="ifShowFooter" id="operation-footer-row">
      <a-space>
        <a-button
          type="primary"
          @click="handleSubmit(SubmitInfoType.APPLY)"
          v-if="computedQuery.type === PreviewFormType.APPLY"
        >
          <span>
            <SvgIconSend style="height: 14px" />
            {{ $t("formPreview.submitAndInitiateApply") }}</span
          >
        </a-button>

        <a-button
          type="primary"
          @click="handleSubmit(SubmitInfoType.PASS)"
          v-if="computedQuery.type === PreviewFormType.APPROVE"
        >
          <span>
            <a-icon type="check"></a-icon>
            {{ $t("formPreview.pass") }}</span
          >
        </a-button>
        <a-button
          v-if="computedQuery.type === PreviewFormType.APPLY"
          @click="handleSaveAsDraft"
        >
          <span>
            <SvgIconSaveDraft style="height: 14px" />
            {{ $t("formPreview.saveAsDraft") }}</span
          >
        </a-button>
        <a-button
          type="primary"
          v-if="computedQuery.type === PreviewFormType.APPROVE"
          @click="handleSubmit(SubmitInfoType.DELEGATE)"
        >
          <span>
            <a-icon type="enter" :rotate="180"></a-icon>
            {{ $t("formPreview.delegate") }}</span
          >
        </a-button>
        <a-button
          type="danger"
          v-if="computedQuery.type === PreviewFormType.APPROVE"
          @click="handleSubmit(SubmitInfoType.BACKTASK)"
        >
          <span>
            <a-icon type="close"></a-icon>
            {{ $t("formPreview.backTask") }}</span
          >
        </a-button>
      </a-space>
    </footer>

    <submitInfoModal
      :businessId="computedQuery.businessId"
      :curTaskId="computedQuery.curTaskId"
      :uniTenantId="computedQuery.uniTenantId"
      :bizToken="computedQuery.bizToken"
      :type="submitInfoModalType"
      :title="modalTitle_"
      ref="modal"
      @ok="handleSubmitInfoOk"
    />
    <!-- </div> -->
  </RootContainer>
</template>

<script>
import KFormBuild from '@/lib/kform/KFormBuild/index';
import JModal from '@/components/jeecg/JModal/index.vue';
import { parseFormWithNodeConfig } from '@/utils/kformRelatedUtils.js';
//import '@/assets/SourceHanSansCN-Regular-normal'
import EmptyPage from '@/components/FlowForm/EmptyPage/index.vue';
import PreviewFormType from '@/constants/PreviewFormType.js';
import { SubmitInfoType } from '@/constants/SubmitInfoType.js';
import handleQuery from '@/mixins/handleQuery.js';
import SvgIconSend from '@/assets/svgIcon/SvgIconSend.vue';
import SvgIconSaveDraft from '@/assets/svgIcon/SvgIconSaveDraft.vue';
import SvgIconArchive from '@/assets/svgIcon/SvgIconArchive.vue';
import { queryProcessNodeForm } from "@/api/platform/platformOpenAPI.js";
import { create, submit, edit } from "@/api/platform/businessOpenAPI.js"
import { backTask, delegateTask } from "@/api/platform/processOpenAPI.js"

import RootContainer from "@/components/base/RootContainer/index.vue";
import submitInfoModal from "@/components/FlowForm/SubmitInfoModal/submitInfoModal.vue"
import { organizationStructure } from "@/api/platform/platformOpenAPI.js"

import Container from "@/components/base/Container/index.vue";
import TimeLine from "./TimeLine.vue"
import handleLanguage from "@/mixins/handleLanguage.js"

/**
 * 在审批或者发起时， 传递接口的数据结构类似， 但是有些是不同的结构， 所以这里维护了一份映射
 */


export default {
  name: 'FormPreviewer',
  mixins: [handleQuery, handleLanguage],
  components: {
    KFormBuild,
    JModal,
    EmptyPage,
    SvgIconSend,
    SvgIconSaveDraft,
    SvgIconArchive,
    TimeLine,
    RootContainer,
    Container,
    submitInfoModal,
  },

  data() {
    return {
      PreviewFormType,
      SubmitInfoType,
      pageLoading: false,
      modalTitle_: '',// modal title
      formInfo: null, //表单定义
      formData: null, // 表单数据
      formdataObj: {}, //表单数据
      submitInfoModalType: NaN,//submitInfoModal可根据type 不同去动态渲染需要录入的字段
      delegatePerson: [],
      isFullScreen: false,
      kfb: {
        disabled: false,
      },
      fn: null,
      query: {
        // query 的初始化全部值，都必须在这里指定， 如果需要指明那一个query字段是必须的，
        // 那么，需要将该字段初始化为一对象,例如 type: {value: 初始化值}
        maxWidth: 'auto',
        minWidth: 'auto',
        type: {
          type: Number,
        },
        uniTenantId: {
          type: String
        },
        bizToken: {
          type: String
        },
        publishId: {
          type: String
        },
        procDefId: {//流程定义ID
          type: String
        },
        lang: 'zh',
        businessId: undefined,
        nodeId: undefined,
        curTaskId: undefined
      },
    };
  },
  computed: {
    ifShowFooter: function () {
      return !this.wrongPage && !(this.computedQuery.type === PreviewFormType.COPY) && !(this.computedQuery.type === PreviewFormType.VIEW)
    },
    modalTitle: function () {
      const titles = {
        [PreviewFormType.APPLY]: this.$t('formPreview.apply'),
        [PreviewFormType.APPROVE]: this.$t('formPreview.flowApprove'),
      };
      return titles[this.computedQuery.type] || "未定义modal title 值！"
    },
    FN: function () {
      return {
        [SubmitInfoType.APPLY]: {
          fn: submit,
          subTitle: this.$t('formPreview.apply')
        },
        [SubmitInfoType.PASS]: {
          fn: submit,
          subTitle: this.$t('formPreview.pass')
        },
        [SubmitInfoType.DELEGATE]: {
          fn: delegateTask,
          subTitle: this.$t('formPreview.delegate')
        },
        [SubmitInfoType.BACKTASK]: {
          fn: backTask,
          subTitle: this.$t('formPreview.backTask')
        }
      }
    }
  },
  watch: {
    formData: {
      handler: function () {
        if (!this.formData) return;
        this.setFormData()
      }
    }
  },
  created() {
    this.pageLoading = true
    this.handleType(this.computedQuery.type);
  },
  methods: {
    closeModal: function () {
      this.$emit('close');
    },
    async setFormData() {
      // this.formData 数据在 created 阶段拉取， 在watch 中监听有值以后触发
      this.formData = typeof this.formData === 'string' ? JSON.parse(this.formData) : this.formData;
      this.$nextTick(async () => {
        const result = await this.$refs.kfb.setData(this.formData)
      })

    },
    async loadflowformData() {
      try {
        const res = await queryProcessNodeForm({
          businessId: this.computedQuery.businessId,
          publishId: this.computedQuery.publishId,
          procDefId: this.computedQuery.procDefId,
          nodeType: this.computedQuery.type,
          nodeId: this.computedQuery.nodeId || '',
          uniTenantId: this.computedQuery.uniTenantId,
          bizToken: this.computedQuery.bizToken,
        })
        if (res.status === 200) {
          // 真正展示的时候,需要先知道当前审批结点的类型, 是任务审批结点, 还是抄送结点,还是查看结点, 不同的结点配置对字段的控制不同, 所以需要将formInfo 按照规则洗一遍
          const { formInfo, formConfigs, formData } = res.data
          this.formData = formData;
          const formWithNodeConfig = {
            formInfo,
            formConfigs,
          }
          const parsedFormInfo = parseFormWithNodeConfig(formWithNodeConfig, this.computedQuery.lang);
          this.formInfo = parsedFormInfo;
        } else {
          this.$message.error(res.msg)
        }
      } finally {
        this.pageLoading = false
      }
    },

    handleType(type) {
      // 针对不同的 query.type 参数，作一些预处理操作
      switch (type) {
        case PreviewFormType.APPLY:
          break;
        case PreviewFormType.APPROVE:
          this.loadOrgStructAndSetStore()// 更新组织架构
          break;
        case PreviewFormType.COPY:
          this.kfb.disabled = true;
          break;
        case PreviewFormType.ARCHIVE:

          break;
        default:
          break;
      }
      this.loadflowformData()
    },
    async handleSubmitInfoOk(submitInfo) {
      // 额外处理， 后端这个字段保存的是一个逗号隔开的字符串
      if (submitInfo.backUsers) {
        submitInfo.backUsers = submitInfo.backUsers.join()
      }
      if (submitInfo.delegator) {
        submitInfo.delegator = submitInfo.delegator[0].id
      }
      // const formData = await this.getFormData()

      const res = await this.fn({
        businessId: this.computedQuery.businessId || '',// submit接口， 业务ID，从草稿提交时需要携带
        formData: this.formData,
        curTaskId: this.computedQuery.curTaskId || '',// submit接口，审批时需要携带
        uniTenantId: this.computedQuery.uniTenantId,
        publishId: this.computedQuery.publishId,
        bizToken: this.computedQuery.bizToken,
        submitInfo
      })

      if (res.status === 200) {
        this.$message.success(res.msg)
        this.$router.go(-1)
      } else {
        this.$message.error(res.msg)
      }
    },
    async handleSubmit(submitType) {
      // 获取到请求接口
      const target = this.FN[submitType];
      const { fn, subTitle } = target;
      this.fn = fn;
      this.submitInfoModalType = submitType
      this.modalTitle_ = this.modalTitle + " - " + subTitle
      this.formData = await this.getFormData()
      this.$refs.modal.show()
    },
    async handleSaveAsDraft() {
      this.formData = await this.getFormData()
      let res;
      if (this.computedQuery.businessId) {
        // 如果 businessId 存在， 则说明是编辑，走编辑接口， 否则，走创建
        res = await edit({
          businessId: this.computedQuery.businessId,
          formData: this.formData,
          uniTenantId: this.computedQuery.uniTenantId,
          bizToken: this.computedQuery.bizToken,
        })
      } else {
        res = await create({
          publishId: this.computedQuery.publishId,
          formData: this.formData,
          uniTenantId: this.computedQuery.uniTenantId,
          bizToken: this.computedQuery.bizToken,
        })
      }

      if (res.status === 200) {
        this.$message.success(res.msg)
        this.$router.go(-1)
      } else {
        this.$message.error(res.msg)
      }
    },
    async getFormData() {
      let formData = null;
      try {
        formData = await this.$refs.kfb.getData()
      } catch (e) {
        formData = null;
        this.$message.error(this.$t('formPreview.getFormDataError'))
        throw Error("获取表单数据异常")
      }
      return formData
    },


    handleMount(laisonRootFormInstance) {
      /**
       * 将根表单 注册到window 对象，以便在 src/components/kform/KFormBuild/index.vue
       * 中能够访问到根表单数据，这样，就可以写一些需求逻辑
       * 例如在，doInitJs 的时候，把根表单作为页面注入的函数钩子的参数，这样就能在注入函数
       * 中去访问，从而写一些判断逻辑
       */
      window.rootKForm = laisonRootFormInstance;
    },
    // 加载三方组织架构,并set到store
    async loadOrgStructAndSetStore() {
      const res = await organizationStructure({
        uniTenantId: this.computedQuery.uniTenantId,
        bizToken: this.computedQuery.bizToken,
      })
      if (res.status === 200) {
        this.$store.commit('SET_FLOWFORM_organizationStructure', res.data);
      }
    },
  },
};
</script>

<style scoped lang="scss">
$operation-row-height: 4rem;
// .form-previewer-root {
//   width: 100vw;
//   padding: 20px;
//   min-height: 100vh;
//   position: relative;
#operation-row {
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
#operation-footer-row {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 10px;
  bottom: 0;
  left: 0;
  right: 0;
  height: $operation-row-height;
  background-color: #fff;
  box-shadow: 0px 0px 7px 3px #f4f4f4;
  span {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
}
main {
  // display: flex;
  // justify-content: center;
  // flex-wrap: wrap;
  // gap: 1rem;

  section {
    padding: 10px;
    .form-previewer {
      background-color: white;
      padding: 4rem;
      margin: 0 auto;
      // max-width: 100%;
      box-shadow: 0px 0px 7px 3px #f4f4f4;
    }
  }
  aside {
    padding: 10px;
  }
}

// }
</style>

<style scoped lang="scss">
@import "@/lib/kform/styles/simple-print-style.scss";
</style>
