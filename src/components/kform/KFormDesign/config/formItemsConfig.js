/*
 * author kcz
 * date 2019-11-20
 * description 表单控件项
 */
// 基础控件
export const basicsList = [
  {
    type: 'input', // 表单类型
    label: '输入框', // 标题文字
    icon: 'icon-write',
    options: {
      type: 'text',
      width: '100%', // 宽度
      defaultValue: '', // 默认值
      placeholder: 'common.please_input', // 没有输入时，提示文字
      clearable: false,
      maxLength: null,
      addonBefore: '',
      addonAfter: '',
      hidden: false, // 是否隐藏，false显示，true隐藏
      disabled: false, // 是否禁用，false不禁用，true禁用
    },
    model: '', // 数据字段
    key: '',
    help: '',
    rules: [
      //验证规则
      {
        required: false, // 必须填写
        message: 'common.please_input',
      },
    ],
  },
  {
    type: 'textarea', // 表单类型
    label: '文本框', // 标题文字
    icon: 'icon-edit',
    options: {
      width: '100%', // 宽度
      minRows: 4,
      maxRows: 6,
      maxLength: null,
      defaultValue: '',
      clearable: false,
      hidden: false, // 是否隐藏，false显示，true隐藏
      disabled: false,
      placeholder: 'common.please_input',
    },
    model: '', // 数据字段
    key: '',
    help: '',
    rules: [
      {
        required: false,
        message: 'common.please_input',
      },
    ],
  },
  {
    type: 'number', // 表单类型
    label: '数字输入框', // 标题文字
    icon: 'icon-number',
    options: {
      width: '100%', // 宽度
      defaultValue: 0, // 默认值
      min: null, // 可输入最小值
      max: null, // 可输入最大值
      precision: null,
      step: 1, // 步长，点击加减按钮时候，加减多少
      hidden: false, // 是否隐藏，false显示，true隐藏
      disabled: false, //是否禁用
      placeholder: 'common.please_input',
    },
    model: '', // 数据字段
    key: '',
    help: '',
    rules: [
      {
        required: false,
        message: 'common.please_input',
      },
    ],
  },
  {
    type: 'select', // 表单类型
    label: '下拉选择器', // 标题文字
    icon: 'icon-xiala',
    options: {
      width: '100%', // 宽度
      defaultValue: undefined, // 下拉选框请使用undefined为默认值
      multiple: false, // 是否允许多选
      disabled: false, // 是否禁用
      clearable: false, // 是否显示清除按钮
      hidden: false, // 是否隐藏，false显示，true隐藏
      placeholder: '请选择', // 默认提示文字
      dynamicKey: '',
      dynamic: false,
      options: [
        // 下拉选择项配置
        {
          value: '1',
          label: '下拉框1',
        },
        {
          value: '2',
          label: '下拉框2',
        },
      ],
      showSearch: false, // 是否显示搜索框，搜索选择的项的值，而不是文字
    },
    model: '',
    key: '',
    help: '',
    rules: [
      {
        required: false,
        message: 'common.please_input',
      },
    ],
  },
  {
    type: 'checkbox',
    label: '多选框',
    icon: 'icon-duoxuan1',
    options: {
      disabled: false, //是否禁用
      hidden: false, // 是否隐藏，false显示，true隐藏
      defaultValue: [],
      dynamicKey: '',
      dynamic: false,
      options: [
        {
          value: '1',
          label: '选项1',
        },
        {
          value: '2',
          label: '选项2',
        },
        {
          value: '3',
          label: '选项3',
        },
      ],
    },
    model: '',
    key: '',
    help: '',
    rules: [
      {
        required: false,
        message: 'common.please_input',
      },
    ],
  },
  {
    type: 'radio', // 表单类型
    label: '单选框', // 标题文字
    icon: 'icon-danxuan-cuxiantiao',
    options: {
      disabled: false, //是否禁用
      hidden: false, // 是否隐藏，false显示，true隐藏
      defaultValue: '', // 默认值
      dynamicKey: '',
      dynamic: false,
      options: [
        {
          value: '1',
          label: '选项1',
        },
        {
          value: '2',
          label: '选项2',
        },
        {
          value: '3',
          label: '选项3',
        },
      ],
    },
    model: '',
    key: '',
    help: '',
    rules: [
      {
        required: false,
        message: 'common.please_input',
      },
    ],
  },
  {
    type: 'date', // 表单类型
    label: '日期选择框', // 标题文字
    icon: 'icon-calendar',
    options: {
      width: '100%', // 宽度
      defaultValue: '', // 默认值，字符串 12:00:00
      rangeDefaultValue: [], // 默认值，字符串 12:00:00
      range: false, // 范围日期选择，为true则会显示两个时间选择框（同时defaultValue和placeholder要改成数组），
      showTime: false, // 是否显示时间选择器
      disabled: false, // 是否禁用
      hidden: false, // 是否隐藏，false显示，true隐藏
      clearable: false, // 是否显示清除按钮
      placeholder: '请选择',
      rangePlaceholder: ['开始时间', '结束时间'],
      format: 'YYYY-MM-DD', // 展示格式  （请按照这个规则写 YYYY-MM-DD HH:mm:ss，区分大小写）
    },
    model: '',
    key: '',
    help: '',
    rules: [
      {
        required: false,
        message: 'common.please_input',
      },
    ],
  },
  {
    type: 'time', // 表单类型
    label: '时间选择框', // 标题文字
    icon: 'icon-time',
    options: {
      width: '100%', // 宽度
      defaultValue: '', // 默认值，字符串 12:00:00
      disabled: false, // 是否禁用
      hidden: false, // 是否隐藏，false显示，true隐藏
      clearable: false, // 是否显示清除按钮
      placeholder: '请选择',
      format: 'HH:mm:ss', // 展示格式
    },
    model: '',
    key: '',
    help: '',
    rules: [
      {
        required: false,
        message: 'common.please_input',
      },
    ],
  },
  {
    type: 'rate', // 表单类型
    label: '评分', // 标题文字
    icon: 'icon-pingfen_moren',
    options: {
      defaultValue: 0,
      max: 5, // 最大值
      disabled: false, // 是否禁用
      hidden: false, // 是否隐藏，false显示，true隐藏
      allowHalf: false, // 是否允许半选
    },
    model: '',
    key: '',
    help: '',
    rules: [
      {
        required: false,
        message: 'common.please_input',
      },
    ],
  },
  {
    type: 'slider', // 表单类型
    label: '滑动输入条', // 标题文字
    icon: 'icon-menu',
    options: {
      width: '100%', // 宽度
      defaultValue: 0, // 默认值， 如果range为true的时候，则需要改成数组,如：[12,15]
      disabled: false, // 是否禁用
      hidden: false, // 是否隐藏，false显示，true隐藏
      min: 0, // 最小值
      max: 100, // 最大值
      step: 1, // 步长，取值必须大于 0，并且可被 (max - min) 整除
      showInput: false, // 是否显示输入框，range为true时，请勿开启
      // range: false // 双滑块模式
    },
    model: '',
    key: '',
    help: '',
    rules: [
      {
        required: false,
        message: 'common.please_input',
      },
    ],
  },
  {
    type: 'uploadFile', // 表单类型
    label: '上传文件', // 标题文字
    icon: 'icon-upload',
    options: {
      defaultValue: '[]',
      multiple: false,
      disabled: false,
      hidden: false, // 是否隐藏，false显示，true隐藏
      drag: false,
      downloadWay: 'a',
      dynamicFun: '',
      width: '100%',
      limit: 3,
      data: '{"listType":"text"}',
      fileName: 'file',
      headers: {},
      action: 'http://cdn.kcz66.com/uploadFile.txt',
      placeholder: '上传',
    },
    model: '',
    key: '',
    help: '',
    rules: [
      {
        required: false,
        message: 'common.please_input',
      },
    ],
  },
  {
    type: 'uploadImg',
    label: '上传图片',
    icon: 'icon-image',
    options: {
      defaultValue: '[]',
      multiple: false,
      hidden: false, // 是否隐藏，false显示，true隐藏
      disabled: false,
      width: '100%',
      data: '{}',
      limit: 3,
      placeholder: '上传',
      fileName: 'image',
      headers: {},
      action: 'http://cdn.kcz66.com/upload-img.txt',
      listType: 'picture-card',
    },
    model: '',
    key: '',
    help: '',
    rules: [
      {
        required: false,
        message: 'common.please_input',
      },
    ],
  },
  {
    type: 'treeSelect', // 表单类型
    label: '树选择器', // 标题文字
    icon: 'icon-tree',
    options: {
      disabled: false, //是否禁用
      defaultValue: undefined, // 默认值
      multiple: false,
      hidden: false, // 是否隐藏，false显示，true隐藏
      clearable: false, // 是否显示清除按钮
      showSearch: false, // 是否显示搜索框，搜索选择的项的值，而不是文字
      treeCheckable: false,
      placeholder: '请选择',
      dynamicKey: '',
      dynamic: true,
      options: [
        {
          value: '1',
          label: '选项1',
          children: [
            {
              value: '11',
              label: '选项11',
            },
          ],
        },
        {
          value: '2',
          label: '选项2',
          children: [
            {
              value: '22',
              label: '选项22',
            },
          ],
        },
      ],
    },
    model: '',
    key: '',
    help: '',
    rules: [
      {
        required: false,
        message: 'common.please_input',
      },
    ],
  },
  {
    type: 'cascader', // 表单类型
    label: '级联选择器', // 标题文字
    icon: 'icon-guanlian',
    options: {
      disabled: false, //是否禁用
      hidden: false, // 是否隐藏，false显示，true隐藏
      defaultValue: undefined, // 默认值
      showSearch: false, // 是否显示搜索框，搜索选择的项的值，而不是文字
      placeholder: '请选择',
      clearable: false, // 是否显示清除按钮
      dynamicKey: '',
      dynamic: true,
      options: [
        {
          value: '1',
          label: '选项1',
          children: [
            {
              value: '11',
              label: '选项11',
            },
          ],
        },
        {
          value: '2',
          label: '选项2',
          children: [
            {
              value: '22',
              label: '选项22',
            },
          ],
        },
      ],
    },
    model: '',
    key: '',
    help: '',
    rules: [
      {
        required: false,
        message: 'common.please_input',
      },
    ],
  },
  {
    type: 'batch',
    label: '动态表格',
    icon: 'icon-biaoge',
    list: [],
    options: {
      scrollY: 0,
      disabled: false,
      hidden: false, // 是否隐藏，false显示，true隐藏
      showLabel: false,
      hideSequence: false,
      width: '100%',
    },
    model: '',
    key: '',
    help: '',
  },
  {
    type: 'selectInputList',
    label: '选择输入列',
    icon: 'icon-biaoge',
    columns: [
      {
        value: '1',
        label: '选项1',
        list: [],
      },
      {
        value: '2',
        label: '选项2',
        list: [],
      },
    ],
    options: {
      disabled: false,
      multiple: true, // 是否允许多选
      hidden: false, // 是否隐藏，false显示，true隐藏
      showLabel: false,
      width: '100%',
    },
    model: '',
    key: '',
    help: '',
  },
  {
    type: 'editor',
    label: '富文本',
    icon: 'icon-LC_icon_edit_line_1',
    list: [],
    options: {
      height: 300,
      placeholder: 'common.please_input',
      defaultValue: '',
      chinesization: true,
      hidden: false, // 是否隐藏，false显示，true隐藏
      disabled: false,
      showLabel: false,
      width: '100%',
    },
    model: '',
    key: '',
    help: '',
    rules: [
      {
        required: false,
        message: 'common.please_input',
      },
    ],
  },
  {
    type: 'switch', // 表单类型
    label: '开关', // 标题文字
    icon: 'icon-kaiguan3',
    options: {
      defaultValue: false, // 默认值 Boolean 类型
      hidden: false, // 是否隐藏，false显示，true隐藏
      disabled: false, // 是否禁用
    },
    model: '',
    key: '',
    help: '',
    rules: [
      {
        required: false,
        message: 'common.please_input',
      },
    ],
  },
  {
    type: 'button', // 表单类型
    label: '按钮', // 标题文字
    icon: 'icon-button-remove',
    options: {
      type: 'primary',
      handle: 'submit',
      dynamicFun: '',
      hidden: false, // 是否隐藏，false显示，true隐藏
      disabled: false, // 是否禁用，false不禁用，true禁用
    },
    key: '',
  },
  {
    type: 'alert',
    label: '警告提示',
    icon: 'icon-zu',
    options: {
      type: 'success',
      description: '',
      showIcon: false,
      banner: false,
      hidden: false, // 是否隐藏，false显示，true隐藏
      closable: false,
    },
    key: '',
  },
  {
    type: 'text',
    label: '文字',
    icon: 'icon-zihao',
    options: {
      textAlign: 'left',
      hidden: false, // 是否隐藏，false显示，true隐藏
      showRequiredMark: false,
      color: 'rgb(0, 0, 0)',
      fontFamily: 'SimHei',
      fontSize: '16pt',
    },
    key: '',
  },
  {
    type: 'html',
    label: 'HTML',
    icon: 'icon-ai-code',
    options: {
      hidden: false, // 是否隐藏，false显示，true隐藏
      defaultValue: '<strong>HTML</strong>',
    },
    key: '',
  },
]

// 高级控件
// export const highList = [];

// import { Alert } from "ant-design-vue";
import LaisonInputCustomerSelect from '@/components/laison/LaisonInputCustomerSelect'
import LaisonErpCustomerSelector from '@/components/laison/LaisonErpCustomerSelector'

import LaisonInputMeterSelect from '@/components/laison/LaisonInputMeterSelect'
import LaisonInputUserSelect from '@/components/laison/LaisonInputUserSelect'

import LaisonInputDeptSelect from '@/components/laison/LaisonInputDeptSelect'
import LaisonMultiImgUploadModel from '@/components/laison/LaisonMultiImgUploadModel'
import LaisonLoginUser from '@/components/laison/LaisonLoginUser'
import LaisonSalesmanInfo from '@/components/laison/LaisonSalesmanInfo'

import LaisonGmapMeterSelector from '@/components/laison/LaisonGmapMeterSelector'
import LaisonStockList from '@/components/laison/LaisonStockList'

import LaisonErpConfig from '@/components/laison/LaisonErpConfig'
import LaisonErpMeterNumberRecord from '@/components/laison/LaisonErpMeterNumberRecord'
import LaisonErpProductionOptions from '@/components/laison/LaisonErpProductionOptions'

//  -------------------------------- 工单系统 Start --------------------------------

import WorkOrderNumberGenerator from '@/components/laison/AftersaleCutsomComponents/WorkOrderNumberGenerator'
import MerterNumberInfo from '@/components/laison/AftersaleCutsomComponents/MerterNumberInfo'
import EditorToolbar from '@/components/laison/AftersaleCutsomComponents/EditorToolbar'
import UserSelectionAndDesc from '@/components/laison/AftersaleCutsomComponents/UserSelectionAndDesc'
import ConfigSelector from '@/components/laison/AftersaleCutsomComponents/ConfigSelector'
import DcuCiuDynamicForm from '@/components/laison/AftersaleCutsomComponents/DcuCiuDynamicForm'

import CategoriesSelector from '@/components/laison/AftersaleCutsomComponents/CategoriesSelector.vue'
import LongTaskRelateSelector from '@/components/laison/AftersaleCutsomComponents/LongTaskRelateSelector.vue'

//  -------------------------------- 工单系统 End --------------------------------

// 自定义组件
export const customComponents = {
  title: '自定义组件',
  list: [
    {
      label: '登录用户',
      type: 'LoginUser',
      component: LaisonLoginUser,
      options: {
        // multiple: false,
        disabled: false,
        width: '100%',
        data: '{}',
        // placeholder: '',
        // action: '',
      },
      model: 'vcds',
      key: '',
      rules: [
        {
          required: false,
          message: 'order.pleaseSelect',
        },
      ],
    },
    {
      label: '业务员信息',
      type: 'SalemanInfo',
      component: LaisonSalesmanInfo,
      options: {
        // multiple: false,
        disabled: false,
        hidden: false, // 是否隐藏，false显示，true隐藏
        width: '100%',
        data: '{}',
        // placeholder: '',
        // action: '',
      },
      model: 'vcds',
      key: '',
      rules: [
        {
          required: false,
          message: 'order.pleaseSelect',
        },
      ],
    },
    {
      label: '部门选择',
      type: 'DeptSelect',
      component: LaisonInputDeptSelect,
      options: {
        // multiple: false,
        disabled: false,
        hidden: false, // 是否隐藏，false显示，true隐藏
        width: '100%',
        data: '{}',
        // placeholder: '',
        // action: '',
        listType: 'picture-card',
      },
      model: '',
      key: '',
      rules: [
        {
          required: false,
          message: 'order.pleaseSelect',
        },
      ],
    },
    {
      label: '客户选择',
      type: 'CustomerSelect',
      component: LaisonInputCustomerSelect,
      options: {
        // multiple: false,
        disabled: false,
        hidden: false, // 是否隐藏，false显示，true隐藏
        width: '100%',
        data: '{}',
        // placeholder: '',
        // action: '',
        listType: 'picture-card',
      },
      model: '',
      key: '',
      rules: [
        {
          required: false,
          message: 'order.pleaseSelect',
        },
      ],
    },
    {
      label: '表计选择',
      type: 'MeterSelect',
      component: LaisonInputMeterSelect,
      options: {
        // multiple: false,
        disabled: false,
        hidden: false, // 是否隐藏，false显示，true隐藏
        width: '100%',
        data: '{}',
        // placeholder: '',
        // action: '',
        listType: 'picture-card',
      },
      model: '',
      key: '',
      rules: [
        {
          required: false,
          message: 'order.pleaseSelect',
        },
      ],
    },
    {
      label: '用户选择',
      type: 'UserSelect',
      component: LaisonInputUserSelect,
      options: {
        // multiple: false,
        disabled: false,
        hidden: false, // 是否隐藏，false显示，true隐藏
        width: '100%',
        data: '{}',
        // placeholder: '',
        // action: '',
        listType: 'picture-card',
      },
      model: '',
      key: '',
      rules: [
        {
          required: false,
          message: 'order.pleaseSelect',
        },
      ],
    },
    {
      label: 'erp级联配置',
      type: 'ErpTypeSelect',
      component: LaisonErpConfig,
      options: {
        // multiple: false,
        disabled: false,
        hidden: false, // 是否隐藏，false显示，true隐藏
        width: '100%',
        data: '{}',
        // placeholder: '',
        // action: '',
        listType: 'picture-card',
      },
      model: '',
      key: '',
      rules: [
        {
          required: false,
          message: 'order.pleaseSelect',
        },
      ],
    },
    {
      label: '文件上传',
      type: 'FileUpload',
      component: LaisonMultiImgUploadModel,
      options: {
        // multiple: false,
        disabled: false,
        width: '100%',
        data: '{"listType":"text","count":1,"size":500,"onlyImg":true}',
        // placeholder: '',
        // action: '',
        listType: 'picture-card',
      },
      model: '',
      key: '',
      rules: [
        {
          required: false,
          message: 'order.pleaseSelect',
        },
      ],
    },
    {
      label: '地图表计选择器',
      type: 'GmapMeterSelect',
      component: LaisonGmapMeterSelector,
      options: {
        // multiple: false,
        disabled: false,
        width: '100%',
        data: '{}',
        // placeholder: '',
        // action: '',
        listType: 'picture-card',
      },
      model: '',
      key: '',
      rules: [
        {
          required: false,
          message: 'order.pleaseSelect',
        },
      ],
    },
    {
      label: '产品明细表',
      type: 'LaisonStockList',
      component: LaisonStockList,
      options: {
        // multiple: false,
        disabled: false,
        hidden: false, // 是否隐藏，false显示，true隐藏
        width: '100%',
        data: '{}',
        // placeholder: '',
        // action: '',
        listType: 'text',
      },
      rules: [
        //验证规则
        {
          required: true, // 必须填写
          message: 'common.please_input',
        },
      ],
      model: '',
      key: '',
    },
    {
      label: 'erp客户选择器',
      type: 'erpCustomerSelector',
      component: LaisonErpCustomerSelector,
      options: {
        // multiple: false,
        disabled: false,
        hidden: false, // 是否隐藏，false显示，true隐藏
        width: '100%',
        data: '{"customer":"SUB_DEPT_TYPE"}',
        // placeholder: '',
        // action: '',
        listType: 'picture-card',
      },
      model: '',
      key: '',
      rules: [
        {
          required: false,
          message: 'order.pleaseSelect',
        },
      ],
    },

    {
      label: '表号生成器',
      type: 'laisonErpMeterNumberRecord',
      component: LaisonErpMeterNumberRecord,
      options: {
        // multiple: false,
        disabled: false,
        hidden: false, // 是否隐藏，false显示，true隐藏
        width: '100%',
        data: '{}',
        // placeholder: '',
        // action: '',
        listType: 'picture-card',
      },
      model: '',
      key: '',
      rules: [
        {
          required: false,
          message: 'order.pleaseSelect',
        },
      ],
    },
    {
      label: '生产选项',
      type: 'LaisonErpProductionOptions',
      component: LaisonErpProductionOptions,
      options: {
        // multiple: false,
        disabled: false,
        hidden: false, // 是否隐藏，false显示，true隐藏
        width: '100%',
        data: '{}',
        // placeholder: '',
        // action: '',
        listType: 'picture-card',
      },
      model: '',
      key: '',
      rules: [
        {
          required: false,
          message: 'order.pleaseSelect',
        },
      ],
    },
    // ---------------------------------------------------- 工单系统组件 Start ----------------------------------------------------
    {
      label: '工单号生成器',
      type: 'WorkOrderNumberGenerator',
      component: WorkOrderNumberGenerator,
      options: {
        // multiple: false,
        disabled: false,
        hidden: false, // 是否隐藏，false显示，true隐藏
        width: '100%',
        data: '{}',
        // placeholder: '',
        // action: '',
        // listType: 'picture-card',
      },
      model: '',
      key: '',
      rules: [
        {
          required: false,
          message: 'order.pleaseSelect',
        },
      ],
    },
    {
      label: '表号信息',
      type: 'MerterNumberInfo',
      component: MerterNumberInfo,
      options: {
        // multiple: false,
        disabled: false,
        hidden: false, // 是否隐藏，false显示，true隐藏
        width: '100%',
        data: '{}',
        // placeholder: '',
        // action: '',
        // listType: 'picture-card',
      },
      model: '',
      key: '',
      rules: [
        {
          required: false,
          message: 'order.pleaseSelect',
        },
      ],
    },
    {
      label: '立即处理工具栏',
      type: 'EditorToolbar',
      component: EditorToolbar,
      options: {
        // multiple: false,
        disabled: false,
        hidden: false, // 是否隐藏，false显示，true隐藏
        width: '100%',
        data: '{}',
        // placeholder: '',
        // action: '',
        // listType: 'picture-card',
      },
      model: '',
      key: '',
      rules: [
        {
          required: false,
          message: 'order.pleaseSelect',
        },
      ],
    },
    {
      label: '用户选择与描述',
      type: 'UserSelectionAndDesc',
      component: UserSelectionAndDesc,
      options: {
        // multiple: false,
        disabled: false,
        hidden: false, // 是否隐藏，false显示，true隐藏
        width: '100%',
        data: '{}',
        // placeholder: '',
        // action: '',
        // listType: 'picture-card',
      },
      model: '',
      key: '',
      rules: [
        {
          required: false,
          message: 'order.pleaseSelect',
        },
      ],
    },
    {
      label: 'DCU/CIU表单',
      type: 'DcuCiuDynamicForm',
      component: DcuCiuDynamicForm,
      options: {
        // multiple: false,
        disabled: false,
        hidden: false, // 是否隐藏，false显示，true隐藏
        width: '100%',
        // data: '{"processType":"chlx","mode":"default"}',
        data: '',
        // placeholder: '',
        // action: '',
        // listType: 'picture-card',
      },
      model: '',
      key: '',
      rules: [
        {
          required: false,
          message: 'order.pleaseSelect',
        },
      ],
    },
    {
      label: '配置选择器',
      type: 'ConfigSelector',
      component: ConfigSelector,
      options: {
        // multiple: false,
        disabled: false,
        hidden: false, // 是否隐藏，false显示，true隐藏
        width: '100%',
        // data: '{"processType":"chlx","mode":"default"}',
        data: '{"processType":"shlx","mode":"default","default":"表计"}',

        // placeholder: '',
        // action: '',
        // listType: 'picture-card',
      },
      model: '',
      key: '',
      rules: [
        {
          required: false,
          message: 'order.pleaseSelect',
        },
      ],
    },
    {
      label: '问题分类选择器',
      type: 'CategoriesSelector',
      component: CategoriesSelector,
      options: {
        // multiple: false,
        disabled: false,
        hidden: false, // 是否隐藏，false显示，true隐藏
        width: '100%',
        // data: '{"processType":"chlx","mode":"default"}',
        data: '[]',

        // placeholder: '',
        // action: '',
        // listType: 'picture-card',
      },
      model: '',
      key: '',
      rules: [
        {
          required: false,
          message: 'order.pleaseSelect',
        },
      ],
    },
    {
      label: '长期任务选择器',
      type: 'LongTaskRelateSelector',
      component: LongTaskRelateSelector,
      options: {
        // multiple: false,
        disabled: false,
        hidden: false, // 是否隐藏，false显示，true隐藏
        width: '100%',
        // data: '{"processType":"chlx","mode":"default"}',
        data: '[]',

        // placeholder: '',
        // action: '',
        // listType: 'picture-card',
      },
      model: '',
      key: '',
      rules: [
        {
          required: false,
          message: 'order.pleaseSelect',
        },
      ],
    },

    // ---------------------------------------------------- 工单系统组件 End ----------------------------------------------------
  ],
}
window.$customComponentList = customComponents.list

// 布局控件
export const layoutList = [
  {
    type: 'divider',
    label: '分割线',
    icon: 'icon-fengexian',
    options: {
      orientation: 'left',
    },
    key: '',
    model: '',
  },
  {
    type: 'card',
    label: '卡片布局',
    icon: 'icon-qiapian',
    list: [],
    key: '',
    model: '',
  },
  {
    type: 'tabs',
    label: '标签页布局',
    icon: 'icon-tabs',
    options: {
      tabBarGutter: null,
      type: 'line',
      tabPosition: 'top',
      size: 'default',
      animated: true,
    },
    columns: [
      {
        value: '1',
        label: '选项1',
        list: [],
      },
      {
        value: '2',
        label: '选项2',
        list: [],
      },
    ],
    key: '',
    model: '',
  },
  {
    type: 'grid',
    label: '栅格布局',
    icon: 'icon-zhage',
    columns: [
      {
        span: 12,
        list: [],
      },
      {
        span: 12,
        list: [],
      },
    ],
    options: {
      gutter: 0,
    },
    key: '',
    model: '',
  },
  {
    type: 'table',
    label: '表格布局',
    icon: 'icon-biaoge',
    trs: [
      {
        tds: [
          {
            colspan: 1,
            rowspan: 1,
            list: [],
          },
          {
            colspan: 1,
            rowspan: 1,
            list: [],
          },
        ],
      },
      {
        tds: [
          {
            colspan: 1,
            rowspan: 1,
            list: [],
          },
          {
            colspan: 1,
            rowspan: 1,
            list: [],
          },
        ],
      },
    ],
    options: {
      width: '100%',
      bordered: true,
      bright: false,
      small: true,
      customStyle: '',
    },
    key: '',
    model: '',
  },
]

