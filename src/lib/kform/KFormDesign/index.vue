<template>
  <a-config-provider>
    <div class="form-designer-container-9136076486841527" :style="{ height: propModalHeight }">
      <k-header v-if="showHead" :title="title" />
      <!-- 操作区域 start -->
      <operatingArea
        v-if="toolbarsTop"
        :showToolbarsText="showToolbarsText"
        :toolbars="toolbars"
        @handleSave="handleSave"
        @handlePreview="handlePreview"
        @handleOpenImportJsonModal="handleOpenImportJsonModal"
        @handleOpenCodeModal="handleOpenCodeModal"
        @handleOpenJsonModal="handleOpenJsonModal"
        @handleReset="handleReset"
        @handleClose="handleClose"
        @handleUndo="handleUndo"
        @handleRedo="handleRedo"
        :recordList="recordList"
        :redoList="redoList"
      >
        <template slot="left-action">
          <slot name="left-action"> </slot>
        </template>

        <template slot="right-action">
          <slot name="right-action"></slot>
        </template>
      </operatingArea>
      <!-- 操作区域 end -->
      <div
        class="content"
        :class="{
          'show-head': showHead,
          'toolbars-top': toolbarsTop,
          'show-head-and-toolbars-top': toolbarsTop && showHead,
        }"
      >
        <!-- 左侧控件区域 start -->
        <aside class="left">
          <a-collapse @change="collapseChange" :defaultActiveKey="collapseDefaultActiveKey">
            <!-- 基础控件 start -->
            <a-collapse-panel v-if="basicsArray.length > 0" header="基础控件" key="1">
              <collapseItem
                :list="basicsArray"
                @generateKey="generateKey"
                @handleListPush="handleListPush"
                @start="handleStart"
              />
            </a-collapse-panel>
            <!-- 基础控件 end -->
            <!-- 自定义控件 start -->
            <a-collapse-panel v-if="customComponents.list.length > 0" :header="customComponents.title" key="3">
              <collapseItem
                :list="customComponents.list"
                @generateKey="generateKey"
                @handleListPush="handleListPush"
                @start="handleStart"
              />
            </a-collapse-panel>
            <!-- 自定义控件 end -->

            <!-- 布局控件 start -->
            <a-collapse-panel v-if="layoutArray.length > 0" header="布局控件" key="4">
              <collapseItem
                :list="layoutArray"
                @generateKey="generateKey"
                @handleListPush="handleListPush"
                @start="handleStart"
              />
            </a-collapse-panel>
            <!-- 布局控件 end -->
          </a-collapse>
        </aside>
        <!-- 左侧控件区域 end -->

        <!-- 中间面板区域 start -->
        <section>
          <!-- 操作区域 start -->
          <operatingArea
            v-if="!toolbarsTop"
            :showToolbarsText="showToolbarsText"
            :toolbars="toolbars"
            @handleSave="handleSave"
            @handlePreview="handlePreview"
            @handleOpenImportJsonModal="handleOpenImportJsonModal"
            @handleOpenCodeModal="handleOpenCodeModal"
            @handleOpenJsonModal="handleOpenJsonModal"
            @handleReset="handleReset"
            @handleClose="handleClose"
            @handleUndo="handleUndo"
            @handleRedo="handleRedo"
            :recordList="recordList"
            :redoList="redoList"
          >
            <template slot="left-action">
              <slot name="left-action"> </slot>
            </template>

            <template slot="mid-action">
              <slot name="mid-action">
                <a-radio-group v-model="data.config.currentLang" @change="handleCurrentLanguageChange">
                  <a-radio-button v-for="lang in data.config.supportedLanguages" :value="lang" :key="lang">
                    {{ languageList.find((it) => it.value === lang).name }}
                  </a-radio-button>
                </a-radio-group>
              </slot>
            </template>

            <template slot="right-action">
              <slot name="right-action">
                <a-select
                  placeholder="多语言"
                  mode="tags"
                  style="min-width: 120px"
                  @select="handleLanguageSelect"
                  @deselect="handleLanguageDeselect"
                  v-model="data.config.supportedLanguages"
                >
                  <a-select-option
                    :disabled="disabled"
                    v-for="{ name, value, disabled } in languageList"
                    :key="value"
                    :value="value"
                    >{{ name }}</a-select-option
                  >
                </a-select>
              </slot>
            </template>
          </operatingArea>
          <!-- 操作区域 end -->
          <k-form-component-panel
            :class="{ 'no-toolbars-top': !toolbarsTop }"
            :data="data"
            :selectItem="selectItem"
            :noModel="noModel"
            :hideModel="hideModel"
            :startType="startType"
            ref="KFCP"
            @handleSetSelectItem="handleSetSelectItem"
            @handleRemoveRightMenu="handleRemoveRightMenu"
          />
          <!-- 操作区域 start -->
          <k-json-modal ref="jsonModal" />
          <k-code-modal ref="codeModal" />
          <importJsonModal ref="importJsonModal" />
          <previewModal ref="previewModal" />
        </section>
        <!-- 中间面板区域 end -->

        <!-- 右侧控件属性区域 start -->
        <aside class="right">
          <a-tabs :activeKey="activeKey" @change="changeTab" :tabBarStyle="{ margin: 0 }">
            <a-tab-pane :key="1" tab="表单属性设置">
              <formProperties ref="FP" :config="data.config" :previewOptions="previewOptions" />
            </a-tab-pane>
            <a-tab-pane :key="2" tab="控件属性设置">
              <formItemProperties class="form-item-properties" :selectItem="selectItem" :hideModel="hideModel" />
            </a-tab-pane>
          </a-tabs>
        </aside>
        <!-- 右侧控件属性区域 end -->
      </div>
      <!-- <k-footer /> -->
    </div>
  </a-config-provider>
</template>
<script>
/*
 * author kcz
 * date 2019-11-20
 * description 表单设计器
 */
import kHeader from './module/header';
import operatingArea from './module/operatingArea';

// import kFooter from "./module/footer";
import kFormComponentPanel from './module/formComponentPanel';
import kJsonModal from './module/jsonModal';
import kCodeModal from './module/codeModal';
import collapseItem from './module/collapseItem';
import importJsonModal from './module/importJsonModal';
import previewModal from '../KFormPreview/index.vue';
// import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
// import LaisonInputCustomerSelect from '@/components/laison/LaisonInputCustomerSelect'

import { Revoke } from '../core/revoke';
import { basicsList, layoutList, customComponents } from './config/formItemsConfig';
import formItemProperties from './module/formItemProperties';
import formProperties from './module/formProperties';
import json from 'highlight.js/lib/languages/json';
//@jayce 23/05/11-17:05:42 : custom Start
import deepCloneObject from '@/utils/deepCloneObject';
import { translateFields } from './translate/index';
//@jayce 23/05/11-17:05:42 : custom End

export default {
  name: 'KFormDesign',
  props: {
    propModalHeight: {
      type: String,
    },
    title: {
      type: String,
      default: '表单设计器',
    },
    showHead: {
      type: Boolean,
      default: true,
    },
    hideResetHint: {
      type: Boolean,
      default: false,
    },
    toolbarsTop: {
      type: Boolean,
      default: false,
    },
    toolbars: {
      type: Array,
      default: () => ['save', 'preview', 'importJson', 'exportJson', 'exportCode', 'reset', 'undo', 'redo'],
    },
    showToolbarsText: {
      type: Boolean,
      default: false,
    },
    fields: {
      type: Array,
      default: () => [
        'input',
        'textarea',
        'number',
        'select',
        'checkbox',
        'radio',
        'date',
        'time',
        'rate',
        'slider',
        'uploadFile',
        'uploadImg',
        'cascader',
        'treeSelect',
        'batch',
        'selectInputList',
        'editor',
        'switch',
        'button',
        'alert',
        'text',
        'html',
        'divider',
        'card',
        'tabs',
        'grid',
        'table',
      ],
    },
    hideModel: {
      // 隐藏数据字段
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      customComponents,
      activeKey: 1,
      updateTime: 0,
      updateRecordTime: 0,
      startType: '',
      revoke: null,
      recordList: [],
      redoList: [],
      noModel: ['button', 'divider', 'card', 'grid', 'tabs', 'table', 'alert', 'text', 'html'],
      data: {
        list: [],
        config: {
          layout: 'horizontal',
          labelCol: { xs: 4, sm: 4, md: 4, lg: 4, xl: 4, xxl: 4 },
          labelWidth: 100,
          labelLayout: 'flex',
          wrapperCol: { xs: 18, sm: 18, md: 18, lg: 18, xl: 18, xxl: 18 },
          hideRequiredMark: false,
          customStyle: '',
          enablePrint: false, //@jayce
          Expressions: '', //@jayce
          currentLang: 'zh', //@jayce 23/05/10-09:22:11 :
          supportedLanguages: ['zh'], //@jayce 23/05/10-10:39:41 :
        },
        //@jayce 23/05/10-10:39:50 :
        predefinedLists: {
          zh: [],
        },
      },
      previewOptions: {
        width: 850,
      },
      selectItem: {
        key: '',
      },
      //@jayce 23/05/09-16:43:47 : custom start
      languageList: [
        // https://emojipedia.org/flags/
        //@jayce 23/05/11-14:43:17 : 注意，如果要新增支持的语言，也需要去支持时间选择器: src/lib/kform/KDatePicker/datePicker.vue
        {
          name: '🇨🇳中文',
          value: 'zh',
          disabled: true,
        },
        {
          name: '🇺🇸英文',
          value: 'en',
        },
        {
          name: '🇫🇷法语',
          value: 'fr',
        },
        {
          name: '🇦🇪阿拉伯语',
          value: 'ar',
        },
        {
          name: '🇵🇹葡萄牙语',
          value: 'pt',
        },
      ],

      //@jayce 23/05/09-16: custom end
    };
  },
  components: {
    kHeader,
    // kFooter,
    operatingArea,
    collapseItem,
    kJsonModal,
    kCodeModal,
    importJsonModal,
    previewModal,
    kFormComponentPanel,
    formItemProperties,
    formProperties,
    // LaisonInputCustomerSelect,
  },
  watch: {
    //@jayce 23/05/10-10:52:23 : custom Start
    // "data."
    // data: {
    //   handler(e) {
    //     /* prettier-ignore */
    //     this.$store.commit('SET_KFORM_DATA', this.data) //@jayce 21/12/23-09:26:56 : 用于监听数据变化，触发缓存内容到localStorage
    //     this.$nextTick(() => {
    //       this.revoke.push(e)
    //     })
    //   },
    //   deep: true,
    //   immediate: true,
    // },

    'data.list': {
      handler: function () {
        this.data.predefinedLists[this.data.config.currentLang] = deepCloneObject(this.data.list);
        /**
         * 更新规则是什么样的？
         * 1.所有的更新变动都会发生在 this.data.list
         * 2.this.data.list 可能和this.data.predefinedLists中的任意对象
         * 3.同步更新的规则是什么？ 并不是直接简单复制，可以列举哪些操作？
         *  - 新增组件 => 所有对象都应该新增该组件
         *  - 删除组件 => 所有对象中该组件都应该删除
         *  - 组件的key修改， 所有对象中对应组件的key都应该同步
         *  - 组件的其他内容修改， 例如， label,select/radio/checkbox 的选先配置的key,默认值，等某些字段是各个对像组件自维护的，应该是不被同步的
         *    但是选项配置这种，动态新增/删除的选项应该按值同步
         *  - 组件设计器的其他改动，例如hiddenJs,disabedJs,initJs都需要同步
         */
        this.syncPredefinedLists();
      },
      immediate: true,
      deep: true,
    },

    //@jayce 23/05/10-10:52:23 : custom End
  },
  computed: {
    basicsArray() {
      // 计算需要显示的基础字段
      return basicsList.filter((item) => this.fields.includes(item.type));
    },
    layoutArray() {
      // 计算需要显示的布局字段
      return layoutList.filter((item) => this.fields.includes(item.type));
    },
    collapseDefaultActiveKey() {
      // 计算当前展开的控件列表
      const defaultActiveKey = window.localStorage.getItem('collapseDefaultActiveKey');
      if (defaultActiveKey) {
        return defaultActiveKey.split(',');
      } else {
        return ['1'];
      }
    },
  },
  mounted() {
    //@jayce 21/12/23-09:35:57 : 优先从localStorage中获取缓存以初始化
    //@jayce 23/05/10-09:49:06 : TODO: 这里的逻辑看看要不要删除或者优化一下，
    let kformcache = cusLocalStorage.getItem('kform', 'data');
    if (kformcache != null) {
      // this.data = kformcache;
    }
    //@jayce 21/12/23-13:23:39 : 这个监听器原本时定义在watch 对象中，但是会造成data中初始值覆盖localstorage, 所以需要让监听器在mounted时再生效
    this.$watch(
      'data',
      function (e) {
        this.$store.commit('SET_KFORM_DATA', this.data); //@jayce 21/12/23-09:26:56 : 用于监听数据变化，触发缓存内容到localStorage
        this.$nextTick(() => {
          this.revoke.push(e);
        });
      },
      { deep: true, immediate: true },
    );
  },
  beforeDestroy() {
    // this.$confirm({
    //   content: '离开页面将会清除',
    // })
  },

  methods: {
    //@jayce 23/05/09-16:41:44 :custom Start
    handleLanguageSelect(e) {
      /**
       * 当从 select 组件选中一个新的语言时， 将会拷贝一份 list 到predefinedLists
       * 1. 从哪里拷贝？ this.data.list 始终是最新的
       *  */
      this.data.predefinedLists[e] = deepCloneObject(this.data.list);
    },
    handleLanguageDeselect(e) {},
    handleCurrentLanguageChange({ target: { value } }) {
      /**
       * 当通过 radio button group 选中某个语言时：
       * 1. 要修改当前语言，即 this.data.config.currentLang, 它是响应式绑定的，所以无需手动修改
       * 2. 将当前表单数据赋值为 this.data.predefinedLists[lang]
       * 3. 如何保证各个配置独立又同步呢？ 通过watch去实现
       */
      this.data.list = this.data.predefinedLists[value];
      // 切换tab到表单属性设置面版
      // todo: 可优化，不跳转面版，怎么做模拟点击更新元素
      this.handleSetSelectItem({
        key: '',
      });
    },
    syncPredefinedLists() {
      const currentLang = this.data.config.currentLang;
      // const currentList = this.data.predefinedLists[currentLang];
      const noSyncFields = ['label', 'help', 'placeholder', 'defaultValue']; //指定不需要同步的字段列表，(仅对象|嵌套对象字段) & (!数组对象字段,数组单独在callback中去处理)
      for (let langKey in this.data.predefinedLists) {
        if (langKey === currentLang) continue; // 当前语言所对应的predefinedList和this.data.list 是同步的，且最新的，所以应该跳过不处理
        const cache = deepCloneObject(this.data.predefinedLists[langKey]); //当前设计缓存

        this.data.predefinedLists[langKey] = deepCloneObject(this.data.list); //直接复制最新的list

        // 去遍历 temp 中的组件，根据 noSyncFields<不需要同步的字段列表> ， 同时判断 最新的list中，是否依旧存在该组件，如果存在则将缓存的字段 重新赋值
        this.walkNodes((cache_element) => {
          // 遍历缓存对象，如果新的对象中有字段的 noSyncField ，即被指定非同步字段，则应该将对应缓存字段值覆盖掉新对象中的对应字段值
          this.walkNodes((latest_element) => {
            if (latest_element.key === cache_element.key) {
              // 找到新对象和缓存对象中都存在的组件
              // 遍历 cache_element，将需要同步的字段存储在一个 Map 中

              const cacheMap = new Map();
              this.walkListItem(cache_element, (key, value) => {
                cacheMap.set(key, value);
              });

              // 遍历 latest_element，根据 cacheMap 中的值更新对应的字段
              this.walkListItem(latest_element, (key, value, Obj) => {
                if (cacheMap.has(key)) {
                  const cacheValue = cacheMap.get(key);
                  if (key === 'options') {
                    // options.options 特别处理
                    // value: Array<{value,label}>
                    // 带有配置选项的组件应该同步选项，但是不同步 label
                    const cacheOptions = cacheMap.get(key);
                    Obj[key].forEach(({ value, label }, index) => {
                      // value
                      const findCacheOptionItem = cacheOptions.find((cacheOptionItem) => {
                        return cacheOptionItem.value === value;
                      });
                      if (findCacheOptionItem !== undefined) {
                        Obj[key][index].label = findCacheOptionItem.label;
                      }
                    });
                  } else if (key === 'rules') {
                    // rules 特别处理
                    // value: Array<{message,required|pattern}>
                    // 同步rule配置项，但是message 不同步
                    const cacheRules = cacheMap.get(key);
                    Obj[key].forEach((rule, index) => {
                      // rule.required 就一个,rule.pattern 可能会有多个
                      if (typeof rule.required !== 'undefined') {
                        const findCacheRequiredRule = cacheRules.find(({ required }) => required === rule.required);
                        Obj[key][index].message = findCacheRequiredRule.message;
                      }
                      if (typeof rule.pattern !== 'undefined') {
                        const findCachePatternRule = cacheRules.find(({ pattern }) => pattern === rule.pattern);
                        Obj[key][index].message = findCachePatternRule.message;
                      }
                    });
                  } else if (noSyncFields.includes(key)) {
                    // 存在非同步字段
                    Obj[key] = cacheValue;
                  }
                }
              });
            }
          }, this.data.predefinedLists[langKey]);
        }, cache);
      }
    },
    walkNodes(callback, list) {
      // 递归遍历控件树
      const traverse = (array) => {
        array.forEach((element) => {
          callback(element);
          // this.$set(element.options, optionName, value);

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
      traverse(list);
    },
    /**
     * @param listItem Object
     * @param callback Function - callback(key:当前对象的key,value:当前对象的value,Obj:当前对象)
     */
    walkListItem(listItem, callback) {
      // 遍历listItem 对象以及嵌套对象的key， value值
      // callback 的回调参数是：callback(key,value,Obj)
      // 返回 value 类型可能是基本值类型或者数组
      // 针对数组，应该需要进一步处理
      const traverse = function (Obj) {
        // callback
        Object.entries(Obj).forEach(([key, value]) => {
          if (typeof value === 'object') {
            if (Array.isArray(value)) {
              // is array
              callback(key, value, Obj);
            } else if (value != null) {
              // is object & not null
              traverse(value);
            }
          } else {
            callback(key, value, Obj);
          }
        });
      };
      traverse(listItem);
    },
    setInitField(record) {
      this.walkListItem(record, (key, value, Obj) => {
        switch (key) {
          case 'placeholder':
            Obj[key] = translateFields.placeholder[this.data.config.currentLang];
            break;
          case 'rules':
            const findRequiredRule = Obj[key].find((rule) => typeof rule.required !== 'undefined');
            findRequiredRule.message = translateFields.message[this.data.config.currentLang];
            break;
        }
      });
    },

    //@jayce 23/05/09-16:44:20 : custom End

    generateKey(list, index) {
      // 生成key值
      const key = list[index].type + '_' + new Date().getTime();
      this.$set(list, index, {
        ...list[index],
        key,
        model: key,
      });
      if (this.noModel.includes(list[index].type)) {
        // 删除不需要的model属性
        delete list[index].model;
      }
    },
    handleListPush(item) {
      // 双击控件按钮push到list
      // 生成key值
      if (!this.selectItem.key) {
        // 在没有选择表单时，将数据push到this.data.list
        const key = item.type + '_' + new Date().getTime();
        item = {
          ...item,
          key,
          model: key,
        };
        if (this.noModel.includes(item.type)) {
          // 删除不需要的model属性
          delete item.model;
        }
        const itemString = JSON.stringify(item);
        const record = JSON.parse(itemString);
        // 删除icon及compoent属性
        delete record.icon;
        delete record.component;
        //@jayce 23/05/11-16:48:14 : +setInitField
        this.setInitField(record);
        //@jayce 23/05/11-16:51:18 : +setInitField
        this.data.list.push(record);
        this.handleSetSelectItem(record);
        return false;
      }
      this.$refs.KFCP.handleCopy(false, item);
    },
    handleOpenJsonModal() {
      // 打开json预览模态框
      this.$refs.jsonModal.jsonData = this.data;
      this.$refs.jsonModal.visible = true;
    },
    handleOpenCodeModal() {
      // 打开代码预览模态框
      this.$refs.codeModal.jsonData = this.data;
      this.$refs.codeModal.visible = true;
    },
    handleOpenImportJsonModal() {
      // 打开json预览模态框
      this.$refs.importJsonModal.jsonData = this.data;
      this.$refs.importJsonModal.handleSetSelectItem = this.handleSetSelectItem;
      this.$refs.importJsonModal.visible = true;
    },
    handlePreview() {
      // 打开预览模态框
      this.$refs.previewModal.jsonData = this.data;
      this.$refs.previewModal.previewWidth = this.previewOptions.width;
      this.$refs.previewModal.visible = true;
    },
    handleReset() {
      // 清空
      let _this = this;
      if (this.hideResetHint) {
        // 不显示提示直接清空
        this.resetData();
        return;
      }
      this.$confirm({
        title: '警告',
        content: '是否确认清空内容?',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk() {
          _this.resetData();
        },
      });
    },
    resetData() {
      this.clearData();
      this.$message.success('已清空');
    },
    clearData() {
      this.data = {
        list: [],
        config: {
          layout: 'horizontal',
          labelCol: { xs: 4, sm: 4, md: 4, lg: 4, xl: 4, xxl: 4 },
          labelWidth: 100,
          labelLayout: 'flex',
          wrapperCol: { xs: 18, sm: 18, md: 18, lg: 18, xl: 18, xxl: 18 },
          hideRequiredMark: false,
          customStyle: '',
          enablePrint: false, //@jayce
          Expressions: '', //@jayce
          currentLang: 'zh', //@jayce 23/05/10-09:22:11 :
          supportedLanguages: ['zh'], //@jayce 23/05/10-10:39:41 :
        },
        //@jayce 23/05/10-10:39:50 :
        predefinedLists: {
          zh: [],
        },
      };
      this.handleSetSelectItem({ key: '' });
    },
    handleSetSelectItem(record) {
      // 操作间隔不能低于100毫秒
      const newTime = new Date().getTime();
      if (newTime - this.updateTime < 100) {
        return false;
      }

      this.updateTime = newTime;

      // 设置selectItem的值
      this.selectItem = record;

      // 判断是否选中控件，如果选中则弹出属性面板，否则关闭属性面板
      if (record.key) {
        this.startType = record.type;
        this.changeTab(2);
      } else {
        this.changeTab(1);
      }
    },
    /**
     * @description: 切换属性设置面板
     * @param {*}
     * @return {*}
     */

    changeTab(e) {
      this.activeKey = e;
    },
    /**
     * @Author: kcz
     * @description: 遍历json结构，获取所有字段
     * @param {*}
     * @return {*} Array
     */
    getFieldSchema() {
      const fields = [];
      const traverse = (array) => {
        array.forEach((element) => {
          if (element.type === 'grid' || element.type === 'tabs') {
            // 栅格布局
            element.columns.forEach((item) => {
              traverse(item.list);
            });
          } else if (element.type === 'card') {
            // 卡片布局
            traverse(element.list);
          } else if (element.type === 'batch') {
            // 动态表格内复制
            traverse(element.list);
          } else if (element.type === 'table') {
            // 表格布局
            element.trs.forEach((item) => {
              item.tds.forEach((val) => {
                traverse(val.list);
              });
            });
          } else {
            if (element.model) {
              fields.push(element);
            }
          }
        });
      };
      traverse(this.data.list);
      return fields;
    },
    handleSetData(data) {
      // 用于父组件赋值
      try {
        if (typeof data !== 'object') {
          return false;
        } else {
          this.data = data;
          // 导入json数据后，需要清除已选择key
          this.handleSetSelectItem({ key: '' });
        }
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    collapseChange(val) {
      // 点击collapse时，保存当前collapse状态
      window.localStorage.setItem('collapseDefaultActiveKey', val);
    },
    handleStart(type) {
      this.startType = type;
    },

    /**
     * @description: 撤销
     * @param {*}
     * @return {*}
     */
    handleUndo() {
      const record = this.revoke.undo();
      if (!record) {
        return false;
      }
      this.data = record;

      this.handleSetSelectItem({ key: '' });
    },

    /**
     * @description: 重做
     * @param {*}
     * @return {*}
     */
    handleRedo() {
      const record = this.revoke.redo();
      if (!record) {
        return false;
      }
      this.data = record;
    },

    handleSave() {
      // 保存函数
      this.$emit('save', JSON.stringify(this.data));
    },
    getValue() {
      // 获取数据
      return this.data;
    },
    handleClose() {
      this.$emit('close');
    },
    //@jayce 23/04/20-14:43:39 : ----CUS START ----
    handleRemoveRightMenu(form) {
      // console.log('xxxxxxxxxxxxxxxxx');
      // 透传点击事件，去更新增强表达式部分
      this.$refs.FP.rightPanelClicked(form);
    },
  },
  created() {
    this.revoke = new Revoke();
    this.recordList = this.revoke.recordList;
    this.redoList = this.revoke.redoList;
  },
};
</script>
<style lang="scss" scoped>
//@jayce 23/05/10-14:12:53 : custom start
::v-deep input.ant-select-search__field {
  display: none;
}
//@jayce 23/05/10-14:15:01 : custom end
</style>
>
