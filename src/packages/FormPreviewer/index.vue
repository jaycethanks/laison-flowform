<template>
  <div class="form-previewer-root">
    <EmptyPage
      v-if="wrongPage || formInfo == null"
      :description="wrongPage ? 'Wrong Page!' : 'Error When Parse Form!'"
    />

    <k-form-build
      v-if="!wrongPage && formInfo"
      :style="computedQuery.style"
      class="container form-previewer"
      @mount="handleMount"
      :value="formInfo"
      ref="kfb"
      :disabled="kfb.disabled"
    />

    <footer v-if="!wrongPage && !(computedQuery.type === PreviewFormType.COPY)" id="operation-footer-row">
      <a-space>
        <a-button type="primary">
          <span v-if="computedQuery.type === PreviewFormType.APPLY">
            <SvgIconSend style="height: 14px" /> 发起流程</span
          >
          <span v-if="computedQuery.type === PreviewFormType.TODO">
            <a-icon type="check"></a-icon>
            审批通过</span
          >
          <span v-if="computedQuery.type === PreviewFormType.ARCHIVE"
            ><SvgIconArchive style="height: 14px" /> 归档</span
          >
        </a-button>
        <a-button type="primary" v-if="computedQuery.type === PreviewFormType.TODO">
          <span>
            <a-icon type="enter" rotate="180"></a-icon>
            委托</span
          >
        </a-button>
        <a-button type="danger" v-if="computedQuery.type === PreviewFormType.TODO">
          <span>
            <a-icon type="close"></a-icon>
            驳回</span
          >
        </a-button>
      </a-space>
    </footer>
  </div>
</template>

<script>
import KFormBuild from '@/lib/kform/KFormBuild/index';
import JModal from '@/components/jeecg/JModal/index.vue';
import mock from './mock';
import { parseFormWithNodeConfig } from '@/utils/kformRelatedUtils.js';
//import '@/assets/SourceHanSansCN-Regular-normal'
import EmptyPage from '@/components/FlowForm/EmptyPage/index.vue';
import PreviewFormType from '@/constants/PreviewFormType.js';
import handleQuery from '@/mixins/handleQuery.js';
import SvgIconSend from '@/assets/svgIcon/SvgIconSend.vue';
import SvgIconArchive from '@/assets/svgIcon/SvgIconArchive.vue';
import { queryProcessForm } from "@/api/platform/platformOpenAPI.js"
export default {
  name: 'FormPreviewer',
  mixins: [handleQuery],
  components: {
    KFormBuild,
    JModal,
    EmptyPage,
    SvgIconSend,
    SvgIconArchive,
  },
  data() {
    return {
      PreviewFormType,
      formInfo: null, //表单定义
      formdataObj: {}, //表单数据
      isFullScreen: false,
      kfb: {
        disabled: false,
      },
      fn:{
        query:null
      },
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
        uniTenantId: {
          type: String
        },
        flowformId: {
          type: String
        },
        lang:''
      },
    };
  },

  created() {
    this.handleType(this.computedQuery.type);

  },
  methods: {
    closeModal: function () {
      this.$emit('close');
    },
    async loadflowformData(flowformId) {
      //mock
      // const mock = await Promise.resolve(mock)
      const {formInfo,nodeConfigs} = mock
      const formWithNodeConfig = {
        formInfo,
        formConfigs:nodeConfigs[0].taskConfig.columnConfigs// 发起结点模拟， 这里都应该根据接口拉取
      }
      const parsedFormInfo = parseFormWithNodeConfig(formWithNodeConfig,this.computedQuery.lang);
      this.formInfo = parsedFormInfo;

      // TODO: 发起结点模拟， 这里都应该根据接口拉取
      return
      const res = await this.fn.query({ id })
      // const res = await queryProcessForm({ id })
      if (res.status === 200) {
        // 真正展示的时候,需要先知道当前审批结点的类型, 是任务审批结点, 还是抄送结点,还是查看结点, 不同的结点配置对字段的控制不同, 所以需要将formInfo 按照规则洗一遍
        // 解析示例：
        const parsedFormInfo = parseFormWithNodeConfig(mock);
        this.formInfo = parsedFormInfo;
      }else{
        this.$message.error(res.msg)
      }
    },

    handleType(type) {
      switch (type) {
        case PreviewFormType.APPLY:
          // query 为拉取发起结点配置接口
          // this.fn.query = queryApplyNodeConfig
          break;
        case PreviewFormType.TODO:
          // query 为拉取审批结点配置接口
          // this.fn.query = queryApproveNodeConfig
          break;
        case PreviewFormType.COPY:
          // this.fn.query = queryCopyNodeConfig
          this.kfb.disabled = true;
          break;
        case PreviewFormType.ARCHIVE:

          break;
        default:
          break;
      }
    this.loadflowformData(this.computedQuery.flowformId)

    },

    async handleOk() {
      // 验证整表表单
      if (this.okBtnDisabled) {
        this.$message.warning(this.$t('order.submitapp'));
        return;
      }
      try {
        await this.$refs.kfb.form.validateFields();
      } catch (e) {
        let errmsg = e.errors[Object.keys(e.errors)[0]].errors[0].message;
        this.$message.error(errmsg);
        return;
      }
      // div#LaisonStockList
      if (this.$refs.kfb.form.formItems.LaisonStockList) {
        // LaisonStockList 组件存在前提下
        // prettier-ignore
        // 验证LaisonStockList组件，table 折叠行中嵌入的k-form-design 表单
        const KFB_instance_In_LaisonOrderPropShow = this.$refs.kfb.form.formItems.LaisonStockList.$children[0].$children[0].$children[0].KFB_instance_In_LaisonOrderPropShow
        let hasError = false;
        await KFB_instance_In_LaisonOrderPropShow.forEach(async (kfb_instance) => {
          try {
            let res = await kfb_instance.form.validateFields();
          } catch (e) {
            let errmsg = e.errors[Object.keys(e.errors)[0]].errors[0].message;
            this.$message.error(errmsg);
            hasError = true;
            throw new Error(); // 为了终止forEach循环
          }
        });

        if (hasError) {
          return;
        }
      }
      window.xxx = this.$refs.kfb;
      this.$refs.kfb
        .getData()
        .then((values) => {
          // prettier-ignore
          // 如果存在LaisonStockList这个组件的前提下，且其存货为空
          if (this.$refs.kfb.form.formItems.LaisonStockList && values.LaisonStockList.tableData.length == 0) {

            this.$message.error('请至少选择一个存货')
            return
          } else if (this.$refs.kfb.form.formItems.LaisonStockList && values.LaisonStockList.tableData.length > 0) {
            window.kfkf = this.$refs.kfb.form.formItems.LaisonStockList

          }
          // console.log(this.formdataObj)
          for (let key in values) {
            this.formdataObj[key] = values[key];
          }
          let newValue = this.value;
          if (newValue.erpFormVal) {
            newValue.erpFormVal.formData = this.formdataObj;
          } else {
            newValue.erpFormVal = { formData: this.formdataObj };
          }
          //
          this.$emit('input', newValue); //其实这个就是更新value
          console.log(newValue);
          this.$emit('apply_success', newValue);
        })
        .catch((e) => {
          console.error(e, '--line240');
        });
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
  },
};
</script>

<style scoped lang="scss">
$operation-row-height: 4rem;
.form-previewer-root {
  width: 100vw;
  padding: 20px;
  min-height: 100vh;
  position: relative;
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
  .form-previewer {
    padding: 6rem;
    margin: 0 auto;
    // max-width: 100%;
    box-shadow: 0px 0px 7px 3px #f4f4f4;
  }
}
.container {
  width: 100%;
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1000px;
  }
}

// @media (min-width: 1280px) {
//   .container {
//     max-width: 1280px;
//   }
// }
// @media (min-width: 1536px) {
//   .container {
//     max-width: 1536px;
//   }
// }
</style>

<style scoped lang="scss">
// print style
// ::v-deep .ant-col{
//   border-bottom:1px solid;
//   border-right:1px solid;
// }
// ::v-deep .ant-col .ant-col{
//   border: none;
// }

::v-deep .ant-form-item-label{
  //    border-bottom:1px solid;
  // border-right:1px solid;
  // border:1px solid;

}
::v-deep .ant-form-item-control-wrapper{
  //    border-bottom:1px solid;
  // border-right:1px solid;
  // border:1px solid;
}
::v-deep .table-td{
  padding: 0!important;
}
::v-deep .kk-table-9136076486841527.bordered tr td{
  border: none!important;
}
::v-deep .ant-form-item{
  margin:0!important;
}
</style>
