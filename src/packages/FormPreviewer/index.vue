<template>
  <div class="form-previewer-root">
    <k-form-build
      :style="style"
      class="container form-previewer"
      @mount="handleMount"
      :value="formInfo"
      ref="kfb"
      :disabled="false"
    />
    <!-- :rootCompent="this" -->
    <!-- :disabled="allDisabled"
      :showType="0" -->
  </div>
</template>

<script>
// import { JeecgListMixin } from '@/mixins/JeecgListMixin';
// import { activitiMixin } from '@/views/activiti/mixins/activitiMixin';
import KFormBuild from '@/lib/kform/KFormBuild/index';
import JModal from '@/components/jeecg/JModal/index.vue';
import { message } from 'ant-design-vue';
import mock from './mock';
import { parseFormWidthNodeConfig } from '@/utils/kformRelatedUtils.js';
//import '@/assets/SourceHanSansCN-Regular-normal'
export default {
  name: 'FormPreviewer',
  // mixins: [JeecgListMixin, activitiMixin],
  components: {
    KFormBuild,
    JModal,
  },
  props: {
    value: {
      type: Object,
      default: function () {
        return {};
      },
    },
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'title is not defined',
    },

    opts: {
      type: Object,
      default: () => {
        type: 0;
      },
    },
  },
  data() {
    return {
      okBtnDisabled: true,
      allDisabled: true,
      formInfo: null, //表单定义
      formdataObj: {}, //表单数据
      isFullScreen: false,
      style: {
        maxWidth: 'auto',
        minWidth: 'auto',
      },
    };
  },

  created() {
    const { query } = this.$route;
    const { maxWidth, minWidth } = query;
    this.style.maxWidth = maxWidth;
    this.style.minWidth = minWidth;
    // 真正展示的时候,需要先知道当前审批结点的类型, 是任务审批结点, 还是抄送结点,还是查看结点, 不同的结点配置对字段的控制不同, 所以需要将formInfo 按照规则洗一遍
    // 解析示例：
    const parsedFormInfo = parseFormWidthNodeConfig(mock);
    console.log('[parsedFormInfo]: ', parsedFormInfo);
    this.formInfo = parsedFormInfo;
  },
  methods: {
    closeModal: function () {
      this.$emit('close');
    },
    typeHandler(type) {
      switch (type) {
        case 0: //申请 add
          this.okBtnDisabled = false;
          this.allDisabled = false; //只要这个属性时true里面所有的字段全部禁用，里面任何逻辑都无法修改这个状态
          break;
        case 1: //申请 edit
          this.okBtnDisabled = false;
          this.allDisabled = false;
          break;
        case 2: //翻单 edit
          this.okBtnDisabled = false;
          this.allDisabled = false; //因为审核状态下有些字段可以编辑 ，所以里面的组件要自己写逻辑禁用哪些字段
          break;
        case 3: //审核
          this.okBtnDisabled = false;
          this.allDisabled = false; ////因为审核状态下有些字段可以编辑 ，所以里面的组件要自己写逻辑禁用哪些字段
          break;
        case 4: //查看-DoneTask
          this.okBtnDisabled = true;
          this.allDisabled = true;
          break;
        case 5: //订单的补充修改-DoneTask
          this.okBtnDisabled = false;
          this.allDisabled = true;
          break;
        default:
          this.okBtnDisabled = true;
          this.allDisabled = true;
          break;
      }
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
          this.visible = false;
        })
        .catch((e) => {
          console.error(e, '--line240');
        });
    },

    handleCancel() {
      this.visible = false;
      window.kfb = this.$refs.kfb;
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
.form-previewer-root {
  width: 100vw;
  padding: 20px;
  .form-previewer {
    padding: 1rem;
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
