<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <!--订单编号-->
          <a-col :md="6" :sm="8">
            <a-form-item :label="$t('OrderStats.orderNo')">
              <a-input :placeholder="$t('OrderStats.inputOrderNo')" v-model="pageInfo.condition.orderNo"></a-input>
            </a-form-item>
          </a-col>
          <!--合同号-->
          <a-col :md="6" :sm="8">
            <a-form-item :label="$t('OrderStats.contractNo')">
              <a-input
                :placeholder="$t('OrderStats.inputContractNo')"
                v-model="pageInfo.condition.contractNo"
              ></a-input>
            </a-form-item>
          </a-col>
          <!--客户名称-->
          <a-col :md="6" :sm="8">
            <a-form-item :label="$t('OrderStats.customer')">
              <a-select
                show-search
                option-filter-prop="name"
                :filter-option="filterOption"
                :placeholder="$t('OrderStats.selectCustomer')"
                v-model="pageInfo.condition.customer"
              >
                <a-select-option v-for="(item, i) in customers" :key="i" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!--订单状态-->
          <a-col :md="6" :sm="8">
            <a-form-item :label="$t('OrderStats.orderStatus')">
              <a-select
                mode="multiple"
                :placeholder="$t('OrderStats.selectOrderStatus')"
                v-model="pageInfo.condition.statusList"
              >
                <a-select-option v-for="(item, i) in orderStatus" :key="i" :value="item.status">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!--订单类型-->
          <a-col :md="6" :sm="8">
            <a-form-item :label="$t('OrderStats.orderType')">
              <a-select :placeholder="$t('OrderStats.selectOrderType')" v-model="pageInfo.condition.orderType">
                <a-select-option v-for="(item, i) in orderTypes" :key="i" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!--业务部门-->
          <a-col :md="6" :sm="8">
            <a-form-item :label="$t('OrderStats.busDept')">
              <a-select :placeholder="$t('OrderStats.selectBusDept')" v-model="pageInfo.condition.busDept">
                <a-select-option v-for="(item, i) in applyDepts" :key="i" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!--业务人员-->
          <a-col :md="6" :sm="6">
            <a-form-item :label="$t('OrderStats.busUser')">
              <a-select
                show-search
                option-filter-prop="name"
                :filter-option="filterOption"
                :placeholder="$t('OrderStats.selectBusUser')"
                v-model="pageInfo.condition.busUser"
              >
                <a-select-option v-for="(item, i) in applyers" :key="i" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!--下单时间-->
          <a-col :md="6" :sm="6">
            <a-form-item :label="$t('OrderStats.createTime')">
              <a-range-picker style="width: 100%" v-model="queryTimeDefaultValue" @change="queryTimeChange" />
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-button type="primary" @click="searchQuery" icon="search">{{ $t('common.query') }}</a-button>
            <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px"
              >{{ $t('common.reset') }}
            </a-button>
            <download-excel
              class="export-excel-wrapper"
              :data="exportDatas"
              :fields="exportJsonFiled"
              :before-generate="startDownload"
              type="xls"
              :name="'订单统计' + new Date().getTime() + '.xls'"
            >
              <a-button type="primary" icon="download"> {{ $t('common.export') }}</a-button>
            </download-excel>

            <download-excel
              class="export-excel-wrapper"
              :data="exportConstDatas"
              :fields="exportJsonFiled"
              :before-generate="startConstDownload"
              type="xls"
              :name="'订单耗时统计' + new Date().getTime() + '.xls'"
            >
              <a-button type="dashed" icon="download"> 订单耗时</a-button>
            </download-excel>

            <download-excel
              v-if="hasPermission('yunying')"
              class="export-excel-wrapper"
              :data="exportDatas"
              :fields="exportJsonFiled"
              :before-generate="startDownloadOrderDetails"
              type="xls"
              :name="'订单详情导出' + new Date().getTime() + '.xls'"
            >
              <a-button type="dashed" icon="download"> 订单详情导出</a-button>
            </download-excel>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="display: flex">
      <a-button v-if="showAdd()" @click="handleAdd" v-show="show" type="primary" icon="plus"
        >{{ $t('common.add') }}
      </a-button>
      <a-button v-if="showExport()" type="primary" v-show="show" icon="download" @click="handleExportXls">
        {{ $t('common.export') }}
      </a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete" />
            {{ $t('common.delete') }}
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          {{ $t('common.deleteAll') }}
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        :scroll="{ x: true }"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pageInfo"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="status" slot-scope="text, record">
          <a-tag
            :color="
              record.status === 0 //待提交
                ? ''
                : record.status === 1 //'处理中'
                ? 'orange'
                : record.status === 2 //'已完成'
                ? 'blue'
                : record.status === 3 //'已撤回'
                ? 'red'
                : record.status === 4 //'审批中'
                ? 'orange'
                : record.status === 5 //'异常'
                ? '#FF6C38'
                : record.status === 6 //已驳回
                ? 'pink'
                : record.status === 7 || record.status === 8 //已变更
                ? 'purple'
                : record.status === 999 //'待归档'
                ? 'cyan'
                : ''
            "
          >
            {{ text }}
          </a-tag>
        </span>

        <span slot="action" slot-scope="text, record">
          <!--历史/进度-->
          <a href="javascript:;" v-if="record.status !== 0" @click="onProgressOrder(record)">
            {{ record.result === 1 ? $t('erp.progress') : $t('erp.history') }}
          </a>
          <!--催单-->
          <a-divider type="vertical" v-if="record.result === 1" />
          <a href="javascript:;" v-if="record.result === 1" @click="onRemainderOrder(record)">
            {{ $t('erp.remainder') }}
          </a>
          <!--详情-->
          <a-divider type="vertical" v-if="record.status !== 0 || record.result === 1" />
          <a href="javascript:;" @click="onDetailOrder(record)">
            {{ $t('erp.detail') }}
          </a>
          <!--上传附件-->
          <a-divider type="vertical" v-if="showUP(record)" />
          <a href="javascript:;" v-if="showUP(record)" @click="showUpload(record)">
            {{ '添加附件' }}
          </a>
          <!--修复表号-->
          <a-divider type="vertical" v-if="showFix && record.status !== 0" />
          <a href="javascript:;" v-if="showFix && record.status !== 0" @click="fixMeterNumber(record)">
            {{ '修复表号' }}
          </a>
          <!--编辑-->
          <a-divider type="vertical" v-if="hasPermission('editAmount') && !hasPermission('tag.ceo')" />
          <a
            href="javascript:;"
            v-if="hasPermission('editAmount') && !hasPermission('tag.ceo')"
            @click="onEditOrder(record)"
          >
            {{ $t('erp.inputAmount') }}
          </a>
        </span>

        <template slot="OrderFile" slot-scope="text, record">
          <div class="dd-cover" @click="onOrderFileClick(record, text)">
            <JEllipsis :value="text" :length="25"></JEllipsis>
          </div>
        </template>

        <template slot="prepayDesc" slot-scope="text, record">
          <JEllipsis :value="text" :length="20"></JEllipsis>
        </template>
      </a-table>
    </div>
    <!-- table区域-end -->
    <!--表单数据-->
    <!-- <form-show ref="lcfs" v-model="node" :clickable="disabled"></form-show> -->
    <!--流程表单-->
    <LaisonCustomeFormShow2 ref="lcfs" v-model="node" :opts="{ type: 4 }"></LaisonCustomeFormShow2>

    <!--任务进度-->
    <j-modal-erp :title="buildProgressTitle()" :visible="showTaskProgress" @cancel="showTaskProgress = false">
      <div v-if="showTaskProgress">
        <component :is="TaskProgressBpmn" :value="taskProgress"></component>
      </div>
    </j-modal-erp>

    <JModalAmountInput ref="amountRef" v-model="amountRecord" @editSuccess="editSuccess"></JModalAmountInput>

    <a-modal v-model="opload_visible" title="" @ok="handleUpload" @cancel="handleClose">
      <a-upload
        name="file"
        ref="xupload"
        :multiple="true"
        :action="fileUploadUrl"
        :headers="headers"
        @change="handleFileChange"
        :defaultFileList="defaultFileList"
      >
        <a-button>
          <a-icon type="upload" />
          点击上传
        </a-button>
      </a-upload>
    </a-modal>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin';
import { activitiMixin } from '@views/activiti/mixins/activitiMixin';
import JEllipsis from '@/components/jeecg/JEllipsis';
import API from '@/api/ErpStats';
import moment from 'moment';
import LaisonCustomeFormShow2 from '@comp/laison/LaisonCustomeFormShow2';
import JModalAmountInput from '@views/erp/ordermanager/modal/JModalAmountInput';
import ConfigAPI from '@/api/ErpConfig';
import { downFile } from '@/api/manage';
import JModalErp from '@/views/erp/ordermanager/modal/JModalErp.vue';
import { getFileAccessHttpUrl } from '@/api/manage';
import Vue from 'vue';
import TrendVue from '../../../components/Trend/Trend.vue';

const ExcelExportFields = [
  {
    title: '品质审批完成时间',
    dataIndex: 'auditTime',
  },
  {
    title: '订单编号',
    dataIndex: 'orderNo',
  },
  {
    title: '订单类型',
    dataIndex: 'orderType',
  },
  {
    title: '下单人员',
    dataIndex: 'applyName',
  },
  {
    title: '下单部门',
    dataIndex: 'applyDeptName',
  },
  {
    title: '客户名称',
    dataIndex: 'customerName',
  },
  {
    title: '终端客户名称',
    dataIndex: 'endCustomerName',
  },
  {
    title: '排序',
    dataIndex: 'sortNo',
  },
  {
    title: '存货编码',
    dataIndex: 'stockCode',
  },

  {
    title: '存货名称',
    dataIndex: 'stockName',
  },
  {
    title: '规格型号',
    dataIndex: 'specificationMode',
  },
  {
    title: '规格描述',
    dataIndex: 'specificationIntro',
  },
  {
    title: 'BOM版本',
    dataIndex: 'bomVersion',
  },
  {
    title: '固件版本',
    dataIndex: 'solidVersion',
  },
  {
    title: '销售数量',
    dataIndex: 'saleCount',
  },
  {
    title: '赠送数量',
    dataIndex: 'giftCount',
  },
  {
    title: '合计',
    dataIndex: 'totalCount',
  },
  {
    title: '期望出货日期',
    dataIndex: 'expectedTime',
  },
];

const ExcelConstExportFields = [
  {
    title: '订单编号',
    dataIndex: 'orderNo',
  },
  {
    title: '订单类型',
    dataIndex: 'orderType',
  },
  {
    title: '下单人员',
    dataIndex: 'applyName',
  },
  {
    title: '下单部门',
    dataIndex: 'applyDeptName',
  },
  {
    title: '下单金额',
    dataIndex: 'totalAmount',
  },

  {
    title: '工单状态',
    dataIndex: 'statusName',
  },
  {
    title: '任务进度',
    dataIndex: 'taskName',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '申请时间',
    dataIndex: 'applyTime',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
  },
  {
    title: '总耗时',
    dataIndex: 'totalConst',
  },
];
const ExcelDetailExportFields = [
  {
    title: '订单编号',
    dataIndex: 'orderNo',
  },
  {
    title: '订单类型',
    dataIndex: 'orderType',
  },
  // {
  //   title: '下单人员',
  //   dataIndex: 'applyName',
  // },
  {
    title: '下单部门',
    dataIndex: 'applyDeptName',
  },
  {
    title: '客户名称',
    dataIndex: 'customerName',
  },
  // {
  //   title: '终端客户名称',
  //   dataIndex: 'endCustomerName',
  // },
  {
    title: '排序',
    dataIndex: 'sortNo',
  },
  {
    title: '存货编码',
    dataIndex: 'stockCode',
  },

  {
    title: '存货名称',
    dataIndex: 'stockName',
  },
  {
    title: '规格型号',
    dataIndex: 'specificationMode',
  },
  {
    title: '规格描述',
    dataIndex: 'specificationIntro',
  },
  // {
  //   title: 'BOM版本',
  //   dataIndex: 'bomVersion',
  // },
  // {
  //   title: '固件版本',
  //   dataIndex: 'solidVersion',
  // },
  {
    title: '销售数量',
    dataIndex: 'saleCount',
  },
  {
    title: '赠送数量',
    dataIndex: 'giftCount',
  },
  {
    title: '合计',
    dataIndex: 'totalCount',
  },
  {
    title: '合计金额',
    dataIndex: 'amount',
  },
  { title: '货币单位', dataIndex: 'currentSymbol' },
  { title: '汇率', dataIndex: 'exchangeRate' }, //留空
  { title: '订单金额汇总', dataIndex: 'amountSum' }, //留空
  { title: '审批节点', dataIndex: 'taskName' },
  {
    title: '期望出货日期',
    dataIndex: 'expectedTime',
  },
];

export default {
  name: 'OrderStats',
  mixins: [JeecgListMixin, activitiMixin],
  components: {
    JEllipsis,
    LaisonCustomeFormShow2,
    JModalAmountInput,
    JModalErp,
  },
  data() {
    return {
      showFix: false,
      description: '订单统计',
      opload_visible: false,
      tempRecord: null,
      defaultFileList: [],
      xfileList: [],
      fileUploadUrl: this.API_BASE_URL + '/file/upload',
      headers: {
        authorization: 'authorization-text',
      },
      // 新增修改按钮是否显示
      orderByClause: 'apply_time desc',
      applyDepts: [],
      applyers: [],
      customers: [],
      orderStatus: [],
      orderTypes: [],
      amountRecord: {},
      exportConstDatas: [],
      show: true,
      // 表头
      columns: [
        {
          title: this.$t('OrderStats.title'),
          dataIndex: 'title',
        },
        {
          title: this.$t('OrderStats.orderNo'),
          dataIndex: 'orderNo',
        },
        {
          title: this.$t('OrderStats.orderType'),
          dataIndex: 'orderType',
        },
        {
          title: this.$t('OrderStats.status'),
          dataIndex: 'statusName',
          sorter: (a, b) => a.status - b.status,
          scopedSlots: { customRender: 'status' },
        },
        {
          title: this.$t('OrderStats.customer'),
          dataIndex: 'customerName',
        },
        {
          title: this.$t('OrderStats.applyName'),
          dataIndex: 'applyName',
        },
        {
          title: this.$t('OrderStats.merchandiser'),
          dataIndex: 'merchandiserName',
        },
        {
          title: this.$t('OrderStats.expectedTime'),
          dataIndex: 'expectedTime',
          customRender: (text) => {
            return text && text.length >= 10 ? text.substring(0, 10) : text;
          },
        },
        {
          title: this.$t('OrderStats.transportMode'),
          dataIndex: 'transportMode',
        },
        {
          title: this.$t('OrderStats.applyDept'),
          dataIndex: 'applyDeptName',
        },
        {
          title: this.$t('OrderStats.merchandiserDept'),
          dataIndex: 'merchandiserDeptName',
        },
        {
          title: this.$t('OrderStats.attachmentFiles'),
          dataIndex: 'attachmentFiles',
          width: '160px',
          customRender: (text, record, index) => {
            if (record.attachmentFiles) {
              let fileList = JSON.parse(record.attachmentFiles);
              let r = <div></div>;
              fileList.forEach((v) => {
                if (v) {
                  let tempa = <a href="http://baidu" target="_blank"></a>;
                  tempa.data.attrs.href = '/file' + v; //这里有问题

                  let a = v.split('/');
                  tempa.text = a[a.length - 1];
                  if (r.children == undefined) {
                    r.children = [];
                    r.children.push(tempa);
                  } else {
                    let b = <br></br>;
                    r.children.push(b);
                    r.children.push(tempa);
                  }
                }
              });

              return r;
            } else {
              return '';
            }
          },
        },
        {
          title: this.$t('OrderStats.updateBy'),
          dataIndex: 'updateName',
        },
        {
          title: this.$t('OrderStats.applyTime'),
          dataIndex: 'applyTime',
        },
        {
          title: this.$t('OrderStats.updateTime'),
          dataIndex: 'updateTime',
        },
        {
          title: this.$t('common.operation'),
          dataIndex: 'action',
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
        },
      ],
      //财务表头
      financeColumns: [
        {
          title: this.$t('OrderStats.contractNo'),
          dataIndex: 'contractNo',
        },
        {
          title: this.$t('erp.prepayDesc'),
          dataIndex: 'prepayDesc',
          scopedSlots: { customRender: 'prepayDesc' },
        },
        {
          title: this.$t('erp.yushoukuan'),
          dataIndex: 'curYushoukuan',
        },
        {
          title: this.$t('erp.daishoukuan'),
          dataIndex: 'curDaishoukuan',
        },
        {
          title: this.$t('erp.totalAmount'),
          dataIndex: 'totalAmount',
        },
        {
          title: this.$t('OrderStats.currencySymbol'),
          dataIndex: 'currencySymbol',
        },
        {
          title: this.$t('OrderStats.contractFile'),
          dataIndex: 'contractFile',
          scopedSlots: { customRender: 'OrderFile' },
        },
      ],
      //下单表头
      placeColumns: [
        {
          title: this.$t('OrderStats.contractNo'),
          dataIndex: 'contractNo',
        },
        {
          title: this.$t('erp.prepayDesc'),
          dataIndex: 'prepayDesc',
          scopedSlots: { customRender: 'prepayDesc' },
        },
        {
          title: this.$t('erp.totalAmount'),
          dataIndex: 'totalAmount',
        },
        {
          title: this.$t('OrderStats.currencySymbol'),
          dataIndex: 'currencySymbol',
        },
        {
          title: this.$t('OrderStats.contractFile'),
          dataIndex: 'contractFile',
          scopedSlots: { customRender: 'OrderFile' },
        },
      ],
    };
  },

  created() {
    this.pageInfo.condition.orderByClause = this.orderByClause;
    if (this.$store.getters.userInfo.id !== '1') {
      this.pageInfo.condition.delFlag = 0;
    }
    //初始化查询条件的时间范围
    this.setDefaultTimeRangeFilter();
    let config = this.$store.getters.userInfo.sysDept.config.erpOrderStatsListFiled;
    config = config === undefined ? 0 : config;
    ExcelExportFields.forEach((v, index) => {
      //生成导出字段
      // if (v.dataIndex && v.dataIndex !== 'action') {
      if (v.dataIndex == 'stockCode') {
        let f = {
          field: 'stockCode',
          callback: (value) => {
            return value + '&nbsp';
          },
        };
        this.exportJsonFiled[v.title] = f;
      } else {
        this.exportJsonFiled[v.title] = v.dataIndex;
      }

      // }
    });

    // for (let i = 0; i < 30; i++) {
    //   let j = 1 << i
    //   if ((config & j) !== 0) {
    //     //为真说明这个字段需要删除
    //     let filedname = API.filedList[i]
    //     this.columns.forEach((v, index) => {
    //       if (v.dataIndex === filedname) {
    //         this.columns.splice(index, 1)
    //         delete this.exportJsonFiled[v.title] //去掉不需要的导出字段
    //       }
    //     })
    //   }
    // }
    this.showFix = this.showFixNumber();
    this.checkCloumns();
    this.loadData();
  },
  computed: {},
  methods: {
    moment,

    filterOption(input, option) {
      console.log(input, option, '--line595');
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    //文件点击事件
    onOrderFileClick(record, text) {
      if (text) {
        let jsonValue = text.split(',');
        if (jsonValue) {
          if (jsonValue.length === 1) {
            //直接下载
            let url = jsonValue[0];
            this.downloadFile(window._CONFIG['fileURL'] + url, url.substring(url.lastIndexOf('/') + 1));
          } else {
            //弹窗选择下载，可以全选下载
          }
        }
      }
    },
    downloadFile(url, fileName) {
      window.open(url, '_blank');
      return;
      console.log('url', url);
      const el = document.createElement('a');
      el.style.display = 'none';
      el.setAttribute('target', '_blank');
      /**
       * download的属性是HTML5新增的属性
       * href属性的地址必须是非跨域的地址，如果引用的是第三方的网站或者说是前后端分离的项目(调用后台的接口)，这时download就会不起作用。
       * 此时，如果是下载浏览器无法解析的文件，例如.exe,.xlsx..那么浏览器会自动下载，但是如果使用浏览器可以解析的文件，比如.txt,.png,.pdf....浏览器就会采取预览模式
       * 所以，对于.txt,.png,.pdf等的预览功能我们就可以直接不设置download属性(前提是后端响应头的Content-Type: application/octet-stream，如果为application/pdf浏览器则会判断文件为 pdf ，自动执行预览的策略)
       */
      fileName && el.setAttribute('download', fileName);
      el.href = url;
      console.log(el);
      document.body.appendChild(el);
      el.click();
      document.body.removeChild(el);
    },
    handleFileChange(info) {
      console.log('info', info, this.$refs.xupload);

      if (info.file.status === 'removed') {
        console.log(info.file.status);
        let filelist = [];
        info.fileList.forEach((element) => {
          filelist.push(element.response.fileLocation);
        });
        this.tempRecord.attachmentFiles = JSON.stringify(filelist);
        console.log(this.tempRecord.attachmentFiles);
      }
      if (info.file.status === 'done') {
        let filelist = [];
        if (this.tempRecord.attachmentFiles) {
          filelist = JSON.parse(this.tempRecord.attachmentFiles);
        }
        filelist.push(info.file.response.fileLocation);
        this.tempRecord.attachmentFiles = JSON.stringify(filelist);
        console.log(this.tempRecord.attachmentFiles);
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
    hasPermission(permission) {
      return this.$store.getters.userInfo.permissions.includes(permission);
    },
    showFixNumber() {
      return this.$store.getters.userInfo.id === '1';
    },
    async fixMeterNumber(record) {
      let res = await API.fixMeterNumber2(record);
      if (res && res.success) {
        this.$message.success(res.msg);
        this.loadData();
      } else {
        this.$message.warning(res.errors);
      }
    },
    showUpload(record) {
      this.opload_visible = true;
      this.tempRecord = JOSN.parse(JSON.stringify(record));
      this.defaultFileList.splice(0, this.defaultFileList.length);
      if (this.$refs.xupload && this.$refs.xupload.fileList) {
        this.$refs.xupload.fileList.splice(0, this.$refs.xupload.fileList.length);
      }
      if (this.tempRecord.attachmentFiles) {
        let files = JSON.parse(this.tempRecord.attachmentFiles);

        files.forEach((v, i) => {
          console.log(v, i);
        });
        files.forEach((v, i) => {
          if (v) {
            let path = v.split('/');

            let file = {};
            file.uid = i;
            file.name = path[path.length - 1];
            file.status = 'done';
            file.url = '/file' + v;
            this.defaultFileList.push(file);
          }
        });
      }
    },
    async handleUpload() {
      await API.uploadAttatchment(this.tempRecord);
      this.opload_visible = false;
      this.tempRecord = null;
      this.defaultFileList.splice(0, this.defaultFileList.length);
      if (this.$refs.xupload && this.$refs.xupload.fileList) {
        this.$refs.xupload.fileList.splice(0, this.$refs.xupload.fileList.length);
      }
      this.loadData();
    },
    handleClose() {
      this.defaultFileList.splice(0, this.defaultFileList.length);
      if (this.$refs.xupload && this.$refs.xupload.fileList) {
        this.$refs.xupload.fileList.splice(0, this.$refs.xupload.fileList.length);
      }
    },
    loadData() {
      this.loading = true;
      this.findOrderCondition();
      API.orderStats(this.pageInfo)
        .then((res) => {
          this.dataSource = res.list;
          this.pageInfo.total = res.total;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },

    async findOrderCondition() {
      let res = await API.orderCondition(this.pageInfo);
      if (res.data) {
        this.applyDepts = res.data.applyDepts;
        this.applyers = res.data.applyers;
        this.customers = res.data.customers;
        this.orderStatus = res.data.orderStatus;
        this.orderTypes = res.data.orderTypes;
      }
    },
    showUP(record) {
      if ([1, 2, 999].includes(record.status)) {
        let userId = this.$store.getters.userInfo.id;
        if (userId == record.applyId || userId == record.merchandiser) {
          return true;
        }
      }
      return false;
    },
    checkCloumns() {
      if (this.hasPermission('editAmount')) {
        for (let i = 0; i < this.financeColumns.length; i++) {
          this.columns.splice(4 + i, 0, this.financeColumns[i]);
        }
      } else if (this.hasPermission('erpCheck')) {
        for (let i = 0; i < this.placeColumns.length; i++) {
          this.columns.splice(4 + i, 0, this.placeColumns[i]);
        }
      }
    },
    onEditOrder(record) {
      this.amountRecord = record;
      this.$refs.amountRef.res;
      this.$refs.amountRef.show();
    },
    onDetailOrder(r) {
      this.loading = true;
      ConfigAPI.findDesignFormInfoByBusinessId(r.id)
        .then((res) => {
          if (res.success) {
            res.data.taskId = r.taskId;
            this.showLcfsForm(res.data, false);
          } else {
            this.loading = false;
            this.$message.error(res.errors);
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log('err', err);
        });
    },
    editSuccess() {
      this.loadData();
    },
    showAdd(item) {
      return this.$store.getters.userInfo.permissions.includes('OrderStats:add');
    },
    showExport() {
      return this.$store.getters.userInfo.permissions.includes('OrderStats:export');
    },
    showEdit(item) {
      return this.$store.getters.userInfo.permissions.includes('OrderStats:update');
    },
    showDelete(item) {
      return this.$store.getters.userInfo.permissions.includes('OrderStats:delete');
    },
    showRealDel() {
      return this.$store.getters.userInfo.id === '1';
    },
    getConfig() {
      return this.$store.getters.userInfo.sysDept.config;
    },
    showFiled(filedName) {
      let config = this.$store.getters.userInfo.sysDept.config.erpOrderStatsAddFiled;
      config = config === undefined ? 0 : config;
      let indexOfFiled = API.filedList.indexOf(filedName);
      let flag = 1 << indexOfFiled;
      return !(config & flag);
    },

    async startDownload() {
      this.loading = true;
      this.exportJsonFiled = {};
      ExcelExportFields.forEach((v, index) => {
        if (v.dataIndex == 'stockCode') {
          let f = {
            field: 'stockCode',
            callback: (value) => {
              return value.toString();
              // return value + '&nbsp'
            },
          };
          this.exportJsonFiled[v.title] = f;
        } else {
          this.exportJsonFiled[v.title] = v.dataIndex;
        }
      });
      let temp = await API.buildStatsExportData(this.pageInfo);
      if (!temp) {
        this.$message.error('导出错误');
        return;
      }

      this.exportDatas = temp.data;
      this.loading = false;
    },
    async startConstDownload() {
      this.loading = true;
      this.exportJsonFiled = {};
      ExcelConstExportFields.forEach((v, index) => {
        if (v.dataIndex == 'totalAmount') {
          let f = {
            field: 'totalAmount',
            callback: (value) => {
              return value + '&nbsp';
            },
          };
          this.exportJsonFiled[v.title] = f;
        } else {
          this.exportJsonFiled[v.title] = v.dataIndex;
        }
        // this.exportJsonFiled[v.title] = v.dataIndex
      });
      let temp = await API.buildOrderProgressRecords(this.pageInfo);
      if (!temp) {
        this.$message.error('导出错误');
        return;
      }
      this.exportConstDatas = temp.data;
      this.loading = false;
    },
    async startDownloadOrderDetails() {
      this.loading = true;
      this.exportJsonFiled = {};
      ExcelDetailExportFields.forEach((v, index) => {
        if (v.dataIndex == 'stockCode') {
          let f = {
            field: 'stockCode',
            callback: (value) => {
              return value.toString();
              // return value + '&nbsp'
            },
          };
          this.exportJsonFiled[v.title] = f;
        } else {
          this.exportJsonFiled[v.title] = v.dataIndex;
        }
      });

      let temp = await API.buildStatsExportData(this.pageInfo);
      if (!temp) {
        this.$message.error('导出错误');
        return;
      }
      temp.data.forEach((it) => {
        // 构建汇率和金额汇总空数据
        it.amountSum = '';
        it.exchangeRate = '';
      });
      this.exportDatas = temp.data;

      this.loading = false;
    },
  },
};
</script>
<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 3px;
}

.ant-card-body .table-operator {
  margin-bottom: 18px;
}

.ant-table-tbody .ant-table-row td {
  padding-top: 15px;
  padding-bottom: 15px;
}

.anty-row-operator button {
  margin: 0 5px;
}

.ant-btn-danger {
  background-color: #ffffff;
}

.ant-modal-cust-warp {
  height: 100%;
}

.ant-modal-cust-warp .ant-modal-body {
  height: calc(100% - 110px) !important;
  overflow-y: auto;
}

.ant-modal-cust-warp .ant-modal-content {
  height: 90% !important;
  overflow-y: hidden;
}

.export-excel-wrapper {
  display: inline-block;
  margin-left: 8px;
}

.dd-cover {
  color: brown;
  cursor: pointer;
}

.dd-cover:hover {
  color: #a87474;
}

.dd-cover:active {
  color: #666666;
}
</style>
