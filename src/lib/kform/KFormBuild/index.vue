//prettier-ignore
<template>
  <a-config-provider>
    <a-form
      v-if="value.list && value.config"
      class="k-form-build-9136076486841527"
      :layout="value.config.layout"
      :hideRequiredMark="value.config.hideRequiredMark"
      :form="form"
      @submit="handleSubmit"
      :style="value.config.customStyle"
    >
      <buildBlocks
        ref="buildBlocks"
        @handleReset="reset"
        v-for="(record, index) in cvalue.list"
        :record="record"
        :dynamicData="getDynamicData"
        :config="config"
        :disabled="disabled"
        :stockRecord="stockRecord"
        :rootCompent="rootCompent"
        :formConfig="value.config"
        :validatorError="validatorError"
        :showType="showType"
        :key="index"
        :sunOfProps="sunOfProps"
        @change="handleChange"
        @input="handleInput"
      />
    </a-form>
  </a-config-provider>
</template>
<script>
import { createLogger } from 'vuex';
/*
 * author kcz
 * date 2019-11-20
 * description 将json数据构建成表单
 */
import buildBlocks from './buildBlocks';
import { expressionAnalyser } from '@/lib/kform/KExpressions/expressionsHandleFns.js';
// import moment from "moment";
export default {
  name: 'KFormBuild',
  created() {
    // console.log('lihuaxxx KForm开始渲染', this._uid, new Date())
    this.form = this.$form.createForm(this);
    let res = {};
    if (this.value.list) {
      res.list = JSON.parse(JSON.stringify(this.value.list));
      res.list.forEach((v) => {
        if (v.label) {
          v.label = this.$t(v.label);
        }
        if (v.options) {
          if (v.options.placeholder) {
            console.log('我要翻译了', this.$t(v.options.placeholder));
            v.options.placeholder = this.$t(v.options.placeholder);
          }
          if (v.options.options) {
            v.options.options.forEach((ov) => {
              ov.label = this.$t(ov.label);
            });
          }
        }
      });
    }

    this.cvalue = res;
  },
  watch: {
    value: {
      //深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        let res = {};
        if (val.list) {
          res.list = JSON.parse(JSON.stringify(val.list));
          res.list.forEach((v) => {
            if (v.label) {
              v.label = this.$t(v.label);
            }
            if (v.options) {
              if (v.options.placeholder) {
                v.options.placeholder = this.$t(v.options.placeholder);
              }
              if (v.options.options) {
                v.options.options.forEach((ov) => {
                  ov.label = this.$t(ov.label);
                });
              }
            }
          });
          this.cvalue = res;
        }
      },
      deep: false, //true 深度监听
    },
  },
  data() {
    return {
      form: this.$form.createForm(this),
      validatorError: {},
      defaultDynamicData: {},
      cvalue: {},
      tempModel: null,
    };
  },
  // props: ["value", "dynamicData"],
  props: {
    value: {
      type: Object,
      required: true,
    },
    showType: {
      type: Number,
      default: 0,
    },
    dynamicData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    config: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    sunOfProps: {
      //是否是LaisonOrderPropShow的子组件
      type: Boolean,
      default: false,
    },
    stockRecord: {
      //sunOfProps =ture  的时候  stockList里的每一项stock
      type: Object,
      default: () => {
        return null;
      },
    },
    rootCompent: {
      //根组件 可以从根组件获取完整的数据结构
      type: Object,
      default: () => {
        return null;
      },
    },
    outputString: {
      type: Boolean,
      default: false,
    },
    defaultValue: {
      type: Object,
      default: () => ({}),
    },
  },

  components: {
    buildBlocks,
  },

  computed: {
    getDynamicData() {
      return typeof this.dynamicData === 'object' && Object.keys(this.dynamicData).length
        ? this.dynamicData
        : window.$kfb_dynamicData || {};
    },
    // ---------------------------------------------------CUS START --------------------------------
    // cvalue() {
    //   let res = {}
    //   if (this.value.list && this.value.list.length > 0) {
    //     res.list = JSON.parse(JSON.stringify(this.value.list))
    //     res.list.forEach((v) => {
    //       if (v.label) {
    //         v.label = this.$t(v.label)
    //       }
    //       if (v.options) {
    //         if (v.options.placeholder) {
    //           v.options.placeholder = this.$t(v.options.placeholder)
    //         }
    //         if (v.options.options) {
    //           v.options.options.forEach((ov) => {
    //             ov.label = this.$t(ov.label)
    //           })
    //         }
    //       }
    //     })
    //   }
    //   return res
    // },
  },

  methods: {
    // moment,
    handleSubmit(e) {
      // 提交按钮触发，并触发submit函数，返回getData函数
      e.preventDefault();
      this.$emit('submit', this.getData);
    },
    reset() {
      // 重置表单
      this.form.resetFields();
    },
    getData() {
      // 提交函数，提供父级组件调用
      return new Promise((resolve, reject) => {
        try {
          this.form.validateFields(async (err, values) => {
            if (err) {
              reject(err);
              /**
               * @author: lizhichao<meteoroc@outlook.com>
               * @Description: 多容器校验时，提供error返回给多容器进行判断。
               */
              this.validatorError = err;
              return;
            }
            this.validatorError = {};
            // this.$refs.buildBlocks.forEach(async (item) => {
            // 这个地方仅设计了 KBatch 组件类型的验证
            // if (!item.validationSubform()) {
            //   reject(err)
            // }

            //@jayce 22/08/18-14:10:13 : 增强验证， 子组件为表单的情况下，支持验证
            const validates = this.$refs.buildBlocks.map((item) => {
              if (!item.validationSubform()) {
                reject(err);
              }
              return item.validateKFormItem();
            });
            await Promise.all(validates);

            if (this.outputString) {
              // 需要所有value转成字符串
              for (const key in values) {
                const type = typeof values[key];
                if (type === 'string' || type === 'undefined') {
                  continue;
                } else if (type === 'object') {
                  values[key] = `k-form-design#${type}#${JSON.stringify(values[key])}`;
                } else {
                  values[key] = `k-form-design#${type}#${String(values[key])}`;
                }
              }
              resolve(values);
            } else {
              resolve(values);
            }
          });
        } catch (err) {
          console.error(err);
          reject(err);
        }
      });
    },
    setData(json) {
      return new Promise((resolve, reject) => {
        try {
          if (this.outputString) {
            // 将非string数据还原
            for (const key in json) {
              if (!json[key].startsWith('k-form-design#')) {
                continue;
              }
              const array = json[key].split('#');
              if (array[1] === 'object') {
                json[key] = JSON.parse(array[2]);
              } else if (array[1] === 'number') {
                json[key] = Number(array[2]);
              } else if (array[1] === 'boolean') {
                json[key] = Boolean(array[2]);
              }
            }
            this.form.setFieldsValue(json);
          } else {
            this.form.setFieldsValue(json);
          }
          resolve(true);
        } catch (err) {
          console.error(err);
          reject(err);
        }
      });
    },

    // 批量设置某个option的值
    setOptions(fields, optionName, value) {
      fields = new Set(fields);

      // 递归遍历控件树
      const traverse = (array) => {
        array.forEach((element) => {
          if (fields.has(element.model)) {
            this.$set(element.options, optionName, value);
          }
          if (element.type === 'grid' || element.type === 'tabs') {
            // 栅格布局 and 标签页
            element.columns.forEach((item) => {
              traverse(item.list);
            });
          } else if (element.type === 'card' || element.type === 'batch') {
            // 卡片布局 and  动态表格
            traverse(element.list);
          } else if (element.type === 'table') {
            // 表格布局
            element.trs.forEach((item) => {
              item.tds.forEach((val) => {
                traverse(val.list);
              });
            });
          }
        });
      };
      traverse(this.value.list);
    },

    // 隐藏表单字段
    hide(fields) {
      this.setOptions(fields, 'hidden', true);
    },
    // 显示表单字段
    show(fields) {
      if (fields) {
        this.setOptions(fields, 'hidden', false);
      }
    },
    // 禁用表单字段
    disable(fields) {
      this.setOptions(fields, 'disabled', true);
    },
    // 启用表单字段
    enable(fields) {
      this.setOptions(fields, 'disabled', false);
    },
    // @jayce rewrite below
    // handleChange(value, key) {
    //   // 触发change事件
    //   this.$emit("change", value, key);
    // }

    // ----------------------------------------------------CUS START --------------------------------

    /**
 * 
  recModel(model) {
    //递归触发每个字段的handlechange事件  稍微有点耗性能
    //因为首次渲染不会调用handleChange 所以要在挂载的时候主动触发
    // let i =0;
    for (let prop in model) {
      if (typeof model[prop] === 'object') {
        this.recModel(model[prop]);
        //return
      }
      //console.log('属性' + prop, model[prop], prop, this.tempModel)
      this.handleChange(model[prop], prop, this.tempModel);
    }
  },
*/

    /**
     * i =item
     * key =变化的属性名
     * value =变化的值
     * istable=是否是table组件
     * model=当前全部的值
     */
    fixItem(i, key, value, istable, model) {
      // 执行所有的 hiddenjs 和 displayjs
      // 注： fixItem 的触发来自页面所有组件的变动

      // this.getData().then((res) => {

      //   console.log('[res]: ', res);
      // });

      if (!model) {
        model = this.form.getFieldsValue();
        console.log('[model]: ', model);
      }

      if (model[key]) {
        model[key] = value;
      }

      // 如果有从页面注入hiddenJS 字段
      if (i.options.hiddenJs) {
        if (i.label == '套餐业务') {
          // debugger
        }

        if (!i.options.hiddenJs.includes(key)) {
          return;
        }
        let funh = new Function('return ' + i.options.hiddenJs)();
        if (i.model === 'meterInfoDetails') {
          console.log(model.basicOrderType, '--line430');
          console.log(funh.toString(), '--line431');
        }
        if (istable) {
          i.options.hidden = funh(model);
          /**
           * window.rootKForm 是在src/components/laison/LaisonCustomeFormShow2.vue中
           * 注册的根表单实例
           */
          return funh(model, this, window.rootKForm || undefined);
        } else {
          //this.$set(i.options, 'hidden', funh(model))
          i.options.hidden = funh(model, this, window.rootKForm || undefined); //不知道怎么回事自定义主键无法监听到变化
        }

        return false;
      }

      // 如果有从页面注入dispalyJs字段
      if (i.options.dispalyJs) {
        let fund = new Function('return ' + i.options.dispalyJs)();
        i.options.disabled = fund(model);
      }

      return false;
    },
    handleChange(value, key, model) {
      // 触发change事件时，去执行fixItem
      this.$emit('change', value, key);
      this.handleExpression();

      this.cvalue.list.forEach((i, index) => {
        // console.log(i.options.hiddenJs, model)
        if (i.columns) {
          //遍历儿子
          i.columns.forEach((ci) => {
            if (ci.list) {
              ci.list.forEach((cci) => {
                this.fixItem(cci, key, value, false, model);
              });
            }
          });
        } else if (i.trs) {
          //如果是表格
          //判断下子是否需要隐藏

          let hiddenTable = this.fixItem(i, key, value, true, model);
          if (!hiddenTable) {
            i.trs.forEach((ci) => {
              if (ci.tds) {
                ci.tds.forEach((cci) => {
                  if (cci.list) {
                    cci.list.forEach((ccci) => {
                      this.fixItem(ccci, key, value, false, model);
                    });
                  }
                });
              }
            });
          }
        } else {
          this.fixItem(i, key, value, false, model);
        }
      });
    },
    /**
     * that就是this
     * item=某个节点
     * model = 这个form表单当前的值
     */

    /**
     * 执行mounted或者 执行show()的时候应该执行这个方法
     */
    exeInitJs(formdataObj) {
      if (formdataObj) {
        this.tempModel = formdataObj;
      } else {
        this.tempModel = this.form.getFieldsValue();
      }

      if (this.cvalue && this.cvalue.list) {
        this.cvalue.list.forEach((i, index) => {
          //console.log(i.options.hiddenJs, model)
          try {
            if (i.columns) {
              //栅格布局
              this.doInitJs(this, i, this.tempModel);

              //遍历儿子
              i.columns.forEach((ci) => {
                if (ci.list) {
                  ci.list.forEach((cci) => {
                    this.doInitJs(this, cci, this.tempModel);
                  });
                }
              });
            } else if (i.trs) {
              //如果是表格
              //判断下子是否需要隐藏
              let hiddenTable = this.doInitJs(this, i, this.tempModel);
              if (!hiddenTable) {
                i.trs.forEach((ci) => {
                  if (ci.tds) {
                    ci.tds.forEach((cci) => {
                      if (cci.list) {
                        cci.list.forEach((ccci) => {
                          this.doInitJs(this, ccci, this.tempModel);
                        });
                      }
                    });
                  }
                });
              }
            } else {
              this.doInitJs(this, i, this.tempModel);
            }
          } catch (e) {
            console.error(e, i, 'error when execute initjs');
          }

          //this.$forceUpdate()
        });
      }
    },
    doInitJs(that, item, model) {
      // console.log(item.model, this.disabled, '--line467')

      if (item.options.initJs) {
        let funh = new Function('return ' + item.options.initJs)();
        try {
          /**
           * window.rootKForm 是在src/components/laison/LaisonCustomeFormShow2.vue中
           * 注册的根表单实例
           */

          funh(that, item, model, window.rootKForm || undefined);
        } catch (e) {
          console.error(e, '--line452', item);
        }
      }
    },
    async handleInput(value) {
      //这里处理自定义组件的model赋值  这里已经用不到了  自定义组件里都emit change事件
      console.log('kformitem  监听到了  input事件');
      // this.$emit('input', value)
      // let oldData = {}

      // try {
      //   oldData = await this.getData()
      // } catch (e) {
      //   console.error(e)
      // }
      // let needAdd = true
      // for (let key in oldData) {
      //   if (key == value.model) {
      //     needAdd = false
      //     oldData[key] = value
      //   }
      // }
      // if (needAdd) {
      //   oldData[value.model] = value
      // }
      // delete value[value.model]
      // this.setData(oldData)
    },

    handleExpression() {
      /**
       * 要动态计算一个表达式,
       * 1. 首先,要找到目标字段
       * 2. 获取参数字段值
       * 3. 将参数字段值赋值给目标字段
       *
       */
      const fieldsObj = this.form.getFieldsValue();

      //bugfix setField 之前必须要getFieldDecorator,否则会报错
      Object.keys(fieldsObj).forEach((key) => {
        this.form.getFieldDecorator(key, { initialValue: fieldsObj[key] });
      });

      const { expressions } = this.value.config;
      if (!expressions) return;
      try {
        const toSetFieldVals = expressionAnalyser(fieldsObj, expressions);
        toSetFieldVals.forEach((fieldVal) => {
          this.form.setFieldsValue(fieldVal);
        });
      } catch (err) {
        this.$message.error({ content: '表达式解析错误', duration: 1 });
      }
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.setData(this.defaultValue);
      this.tempModel = this.form.getFieldsValue();
      //this.recModel(this.tempModel) //因为递归比较耗性能注释掉   所以凡是有hiddenJs和disablejs的都必须要有 initJs执行首次处理
      this.exeInitJs();
      // // @jayce jsEnhance
      // try {
      //   if (this.value.config && this.value.config.jsEnhance) {
      //     Function('"use strict";' + this.value.config.jsEnhance)();
      //   }
      // } catch (err) {
      //   console.error('accur error duaring jsEnhance execution:', err);
      // }
    });
    this.$emit('mount', this);
  },
};
</script>
<style scoped>
>>> .ant-input[disabled] {
  background-color: transparent;
  cursor: pointer;
  opacity: 1;
  color: #000;
}

>>> .ant-radio-disabled {
  background-color: transparent;
  cursor: not-allowed;
  opacity: 1;
  color: #000;
}
>>> .ant-radio-disabled + span {
  color: #000;
  cursor: not-allowed;
}

>>> .ant-radio-disabled .ant-radio-input {
  color: #000;
  cursor: not-allowed;
}

>>> .ant-radio-disabled .ant-radio-inner {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

>>> .ant-select-disabled {
  color: #000;
  cursor: not-allowed;
}

>>> .ant-radio-checked .ant-radio-inner {
  border-color: #1890ff !important;
}

>>> .ant-radio-checked .ant-radio-inner::after {
  background-color: #1890ff;
}
</style>
