<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->

    <div>
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="[8, 8]" align="middle" justify="space-between" type="flex">
          <a-col>
            <a-row :gutter="[8, 8]" align="middle" type="flex">
              <a-col>
                <a-form-item :label="$t('ErpStock.stockCode')">
                  <a-input v-model="pageInfo.condition.stockCode" :placeholder="$t('ErpStock.stockCode')"></a-input>
                </a-form-item>
              </a-col>
              <a-col>
                <a-form-item :label="$t('ErpStock.stockName')">
                  <a-input v-model="pageInfo.condition.stockName" :placeholder="$t('ErpStock.stockName')"></a-input>
                </a-form-item>
              </a-col>
              <a-col>
                <a-form-item :label="$t('OperateLog.queryTime')">
                  <a-range-picker
                    :default-value="queryTimeDefaultValue"
                    @change="queryTimeChange"
                    style="max-width: 200px"
                  />
                </a-form-item>
              </a-col>
              <a-col>
                <a-button class="table-page-search-submitButtons" type="primary" @click="searchQuery" icon="search"
                  >{{ $t('common.query') }}
                </a-button>
              </a-col>
              <a-col>
                <a-button
                  class="table-page-search-submitButtons"
                  type="primary"
                  @click="searchReset"
                  icon="reload"
                  style="margin-left: 8px"
                  >{{ $t('common.reset') }}
                </a-button>
              </a-col>
            </a-row>
          </a-col>
          <a-col>
            <a-space size="small">
              <a-button
                v-if="showAdd()"
                class="export-excel-wrapper table-page-search-submitButtons"
                @click="handleAdd"
                icon="plus"
                >{{ $t('common.add') }}
              </a-button>

              <a-upload
                ref="upload"
                class="export-excel-wrapper table-page-search-submitButtons"
                name="file"
                :multiple="false"
                :showUploadList="false"
                accept=".xsl,.xlsx,.XSL,.XLSX"
                :headers="buildHeaders()"
                :action="buildUploadUrl()"
                @change="importChange"
              >
                <a-button>
                  <a-icon type="upload" />
                  {{ $t('erp.import') }}
                </a-button>
              </a-upload>

              <download-excel
                class="export-excel-wrapper table-page-search-submitButtons"
                :data="exportDatas"
                :fields="exportJsonFiled"
                :before-generate="startDownload"
                type="xls"
                name="ErpStockList.xls"
              >
                <a-button icon="download">
                  {{ $t('common.export') }}
                </a-button>
              </download-excel>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!--      <a-button-->
      <!--        v-if='showAdd()'-->
      <!--        @click='handleAdd'-->
      <!--        v-show='show'-->
      <!--        type='primary'-->
      <!--        icon='plus'-->
      <!--      >{{ $t('common.add') }}-->
      <!--      </a-button>-->
      <a-button v-if="showExport()" type="primary" v-show="show" icon="download" @click="handleExportXls">
        {{ $t('common.export') }}
      </a-button>
      <!--      <a-dropdown v-if="selectedRowKeys.length > 0">-->
      <!--        <a-menu slot="overlay">-->
      <!--          <a-menu-item key="1" @click="batchDel">-->
      <!--            <a-icon type="delete" />-->
      <!--            {{ $t('common.delete') }}-->
      <!--          </a-menu-item>-->
      <!--        </a-menu>-->
      <!--        <a-button style="margin-left: 8px">-->
      <!--          {{ $t('common.deleteAll') }}-->
      <!--          <a-icon type="down" />-->
      <!--        </a-button>-->
      <!--      </a-dropdown>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <!--      <div class='ant-alert ant-alert-info' style='margin-bottom: 16px'>-->
      <!--        <i class='anticon anticon-info-circle ant-alert-icon'></i>-->
      <!--        {{ $t('common.alreadyChoose') }}-->
      <!--        <a style='font-weight: 600'>{{ selectedRowKeys.length }}</a>-->
      <!--        {{ $t('common.item') }}-->
      <!--        <a style='margin-left: 24px' @click='onClearSelected'>-->
      <!--          {{ $t('common.clearAll') }}-->
      <!--        </a>-->
      <!--      </div>-->

      <a-table
        ref="table"
        size="middle"
        bordered
        :scroll="{ x: true }"
        rowKey="stockCode"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pageInfo"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="status" slot-scope="text">{{ text ? '启用' : '禁用' }}</span>
        <span slot="delFlag" slot-scope="text">{{ text ? '已删除' : '未删除' }}</span>

        <span slot="action" slot-scope="text, record">
          <a href="javascript:;" @click="handleDetail(record)">{{ $t('common.detail') }}</a>
          <a-divider type="vertical" v-if="showEdit(record)" />
          <a @click="handleEdit(record)" v-if="showEdit(record)">{{ $t('common.edit') }}</a>
          <a-divider type="vertical" v-if="showDelete(record)" />
          <a @click="handelEditProps(record)" v-if="showEdit(record)">{{ $t('编辑属性') }}</a>
          <a-divider type="vertical" v-if="showDelete(record)" />
          <!-- <a href='javascript:;' @click='addAddr(record)'>{{ $t('erp.addAttr') }}</a>
          <a-divider type='vertical' v-if='showEdit(record)' /> -->
          <a-popconfirm
            v-if="showDelete(record)"
            :title="$t('common.delete')"
            @confirm="() => handleDelete(record.stockCode)"
          >
            <a>{{ $t('common.delete') }}</a>
          </a-popconfirm>
          <a-divider type="vertical" v-if="showRealDel()" />
          <a-popconfirm
            v-if="showRealDel()"
            :title="$t('common.realDelete')"
            @confirm="() => handleRealDelete(record.stockCode)"
          >
            <a>{{ $t('common.realDelete') }}</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <erp-stock-modal ref="modalForm" @ok="modalFormOk"></erp-stock-modal>

    <LaisonSimpalKFormShow ref="lskf" @ok="propsChange" />
  </a-card>
</template>

<script>
import ErpStockModal from './modules/ErpStockModal';
import { JeecgListMixin } from '@/mixins/JeecgListMixin';
import JEllipsis from '@comp/jeecg/JEllipsis';
import API from '@/api/ErpStock';
import moment from 'moment';
import Vue from 'vue';
import { ACCESS_TOKEN } from '@/store/mutation-types';
import LaisonErpConfig from '@comp/laison/LaisonErpConfig';
import LaisonSimpalKFormShow from '@comp/laison/LaisonSimpalKFormShow';
import LaisonInputEdit from '@comp/laison/LaisonInputEdit';

export default {
  name: 'ErpStockList',
  mixins: [JeecgListMixin],
  components: {
    JEllipsis,
    ErpStockModal,
    LaisonErpConfig,
    LaisonSimpalKFormShow,
    LaisonInputEdit,
  },
  data() {
    return {
      description: 'ErpStock管理',
      // 新增修改按钮是否显示
      orderByClause: 'create_time desc',
      editRecord: null,
      editCodeNumber: null,
      show: true,
      buildDyScroll: {},
      // 表头
      columns: [
        {
          title: this.$t('ErpStock.stockCode'),
          align: 'left',
          dataIndex: 'stockCode',
        },
        {
          title: this.$t('ErpStock.stockType'),
          align: 'left',
          dataIndex: 'stockType',
        },
        {
          title: this.$t('ErpStock.specificationMode'),
          align: 'left',
          dataIndex: 'specificationMode',
        },
        {
          title: this.$t('ErpStock.stockName'),
          align: 'left',
          dataIndex: 'stockName',
        },
        {
          title: this.$t('ErpStock.purcahsePrice') + '(￥)',
          align: 'left',
          dataIndex: 'purcahsePrice',
          customRender: (text, record, index) => {
            if (!this.hasPermission('caiwu')) {
              return record.purchasePrice;
            }
            let that = this;
            let props = {};
            console.log('存货的采购价格=', record.purchasePrice);
            props['value'] = record.purchasePrice;
            props['type'] = 'number';

            let a = <LaisonInputEdit {...{ props }} />;
            let callBack = function (data) {
              record.purchasePrice = data;
              API.update(record).then((res) => that.loadData());
            };
            a.componentOptions.listeners = {};
            a.componentOptions.listeners.input = callBack;
            return a;
          },
        },
        {
          title: this.$t('ErpStock.measureUnit'),
          align: 'left',
          dataIndex: 'measureUnit',
        },
        {
          title: this.$t('ErpStock.deliveryFactory'),
          align: 'left',
          dataIndex: 'deliveryFactory',
        },
        {
          title: this.$t('ErpStock.specificationIntro'),
          align: 'left',
          dataIndex: 'specificationIntro',
        },

        {
          title: this.$t('ErpStock.drawingNo'),
          align: 'left',
          dataIndex: 'drawingNo',
        },
        {
          title: this.$t('ErpStock.elecMoudle'),
          align: 'left',
          dataIndex: 'elecMoudle',
        },
        {
          title: this.$t('ErpStock.meterInfo'),
          align: 'left',
          dataIndex: 'meterInfo',
        },
        {
          title: this.$t('ErpStock.flow'),
          align: 'left',
          dataIndex: 'flow',
        },
        {
          title: this.$t('ErpStock.pulse'),
          align: 'left',
          dataIndex: 'pulse',
        },
        {
          title: this.$t('ErpStock.enclosureAccessories'),
          align: 'left',
          dataIndex: 'enclosureAccessories',
        },
        {
          title: this.$t('ErpStock.createBy'),
          align: 'left',
          dataIndex: 'createName',
        },
        {
          title: this.$t('ErpStock.status'),
          align: 'left',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: this.$t('ErpStock.delFlag'),
          align: 'left',
          dataIndex: 'delFlag',
          scopedSlots: { customRender: 'delFlag' },
        },
        {
          title: this.$t('ErpStock.createTime'),
          align: 'left',
          dataIndex: 'createTime',
        },
        {
          title: this.$t('ErpStock.updateBy'),
          align: 'left',
          dataIndex: 'updateName',
        },
        {
          title: this.$t('ErpStock.updateTime'),
          align: 'left',
          dataIndex: 'updateTime',
        },
        {
          title: this.$t('ErpStock.deptId'),
          align: 'left',
          dataIndex: 'deptName',
        },

        {
          title: this.$t('ErpStock.nameEn'),
          align: 'left',
          dataIndex: 'nameEn',
        },
        {
          title: this.$t('ErpStock.warehouseId'),
          align: 'left',
          dataIndex: 'warehouseId',
        },
        {
          title: this.$t('ErpStock.extParam'),
          align: 'left',
          dataIndex: 'extParam',
        },
        {
          title: this.$t('ErpStock.classifyId'),
          align: 'left',
          dataIndex: 'classifyId',
        },
        {
          title: this.$t('ErpStock.measureGroupUnit'),
          align: 'left',
          dataIndex: 'measureGroupUnit',
        },
        {
          title: this.$t('ErpStock.measureGroupUnitClassify'),
          align: 'left',
          dataIndex: 'measureGroupUnitClassify',
        },
        {
          title: this.$t('ErpStock.inventoryAttrIds'),
          align: 'left',
          dataIndex: 'inventoryAttrIds',
        },
        {
          title: this.$t('ErpStock.inventoryAttrJson'),
          align: 'left',
          dataIndex: 'inventoryAttrJson',
        },
        {
          title: this.$t('ErpStock.buyer'),
          align: 'left',
          dataIndex: 'buyer',
        },
        {
          title: this.$t('ErpStock.productionDept'),
          align: 'left',
          dataIndex: 'productionDept',
        },

        {
          title: this.$t('ErpStock.sellingPrice'),
          align: 'left',
          dataIndex: 'sellingPrice',
        },

        {
          title: this.$t('common.operation'),
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
        },
      ],
    };
  },
  mounted() {
    this.buildScrollInfo();
  },
  created() {
    this.pageInfo.condition.orderByClause = this.orderByClause;
    if (this.$store.getters.userInfo.id != '1') {
      this.pageInfo.condition.delFlag = 0;
    }
    this.resetTimeQuery();
    let config = this.$store.getters.userInfo.sysDept.config.erpStockViewListFiled;
    config = config == undefined ? 0 : config;
    this.columns.forEach((v, index) => {
      //生成导出字段
      if (v.dataIndex && v.dataIndex != 'action') {
        this.exportJsonFiled[v.title] = v.dataIndex;
      }
    });
    for (let i = 0; i < 30; i++) {
      let j = 1 << i;
      if ((config & j) != 0) {
        //为真说明这个字段需要删除
        let filedname = API.filedList[i];
        this.columns.forEach((v, index) => {
          if (v.dataIndex == filedname) {
            this.columns.splice(index, 1);
            delete this.exportJsonFiled[v.title]; //去掉不需要的导出字段
          }
        });
      }
    }

    this.loadData();
  },
  computed: {},
  methods: {
    moment,

    selectItemByCodeNumer(dataSource, codeNumber) {
      //从所有配置里面找到 codeNumber对应的配置
      let codeArray = []; //比如 存货代码是 0203020302 那么 codeNumber=020302  后面4位是真正的存货编码前面6位是类型编码  那么cideArray=['02','0203','020302']

      let count = codeNumber.length / 2;
      for (let i = 1; i <= count; i++) {
        codeArray.push(codeNumber.substring(0, 2 * i));
      }
      console.log('lihuaxxx');

      let defaultItem = {
        allProps: `{}`,
      };
      let item = {}; //需要遍历的节点
      let returnItem = {}; //找到的节点
      item.children = dataSource; //首先遍历根节点

      //@jayce 22/04/25-09:47:05 :  这里的逻辑是  遍历3此  先找02类型有没有配置存货属性  配置了则使用02类型的  再找0203  再找020302
      for (let i = 0; i < count; i++) {
        if (item.children) {
          item.children.forEach((v) => {
            if (v.codeNumber == codeArray[i]) {
              item = v; //如果找到对应的类型 将需要遍历的节点设置成这个节点
              if (v.allProps && v.allProps != '{}') {
                //如果这个节点配置了自定义form则将返回的节点设置成这个节点
                returnItem = v;
              }
            }
          });
        }
      }
      if (Object.keys(returnItem).length > 0) {
        return returnItem;
      }
      return defaultItem;
    },
    handelEditProps(record) {
      this.editCodeNumber = record.stockCode;
      this.editRecord = record;
      let typeCode = record.stockCode.substring(0, record.stockCode.length - 4); //存货类型code
      let chlx; //chlx的节点
      this.$store.getters.userInfo.erpConfigs.forEach((v) => {
        if (v.configCode == 'chlx') {
          chlx = JSON.parse(v.configJson);
        }
      });
      console.log('lihuahuhuh');
      let f = this.selectItemByCodeNumer(chlx, typeCode);

      let formInfo = JSON.parse(f.stockProps);

      let value;
      if (record.stockPropsJson != '') {
        value = JSON.parse(record.stockPropsJson);
      } else {
        value = {};
      }

      this.$refs.lskf.show(formInfo, value);
    },
    async propsChange(value) {
      console.log('zhzhhhvalue', value);
      if (value) {
        this.editRecord.stockPropsJson = JSON.stringify(value);
      }

      await API.update(this.editRecord);
      this.editCodeNumber = null;
      this.editRecord = null;
      this.loadData();
    },
    resetTimeQuery() {
      //初始化查询条件的时间范围
      this.pageInfo.condition.startTime = this.moment()
        .locale('en_US')
        .add(-2, 'Y')
        .startOf('day')
        .format('YYYY-MM-DD HH:mm:ss'); //开始时间是当前时间减去3个月
      this.pageInfo.condition.endTime = this.moment().locale('en_US').endOf('day').format('YYYY-MM-DD HH:mm:ss'); //结束时间是当天
      this.queryTimeDefaultValue[0] = this.moment(this.pageInfo.condition.startTime, 'YYYY-MM-DD');
      this.queryTimeDefaultValue[1] = this.moment(this.pageInfo.condition.endTime, 'YYYY-MM-DD');
    },
    buildScrollInfo() {
      let x = 0;
      for (let i = 0; i < this.columns.length; i++) {
        let column = this.columns[i];
        x += column.width;
      }
      this.buildDyScroll = { x: x };
    },
    importChange(info) {
      let file = info.file;
      let status = file.status;
      if (status !== 'uploading') {
        // this.$refs.upload.clearFiles()
        if (status === 'error') {
          this.$message.error(`${info.file.name} file upload failed.`);
        } else {
          let response = file.response;
          let code = response.code;
          console.log('res', response);
          if (code !== 0) {
            this.$message.error(response.errors || response.msg);
          } else {
            //提交成了，则刷新数据
            this.loadData();
          }
        }
      }
    },

    loadData() {
      this.loading = true;
      API.findByPage(this.pageInfo).then((res) => {
        this.dataSource = res.list;
        this.pageInfo.total = res.total;
        this.loading = false;
      });
    },

    async startDownload() {
      this.loading = true;
      this.exportDatas = await API.findByAll(this.pageInfo);
      this.loading = false;
    },
    handleAdd: function () {
      let obj = Object.assign({}, API.defaultObject);
      this.$refs.modalForm.add(obj);
      this.$refs.modalForm.title = "$t('form.add)'";
      this.$refs.modalForm.disableSubmit = false;
    },
    handleDelete(stockCode) {
      //要真删除用 API.realDeleteById(id)
      API.deleteById(stockCode).then((res) => {
        if (res.code === 0) {
          this.$message.success(res.msg);
        } else {
          this.$message.warning(res.errors);
        }
        this.loadData();
      });
    },
    handleRealDelete(stockCode) {
      API.realDeleteById(stockCode).then((res) => {
        if (res.code === 0) {
          this.$message.success(res.msg);
        } else {
          this.$message.warning(res.errors);
        }
        this.loadData();
      });
    },
    buildHeaders() {
      const token = Vue.ls.get(ACCESS_TOKEN);
      let authorization = '';
      if (token) {
        authorization = 'Bearer ' + token; // 让每个请求携带自定义 token 请根据实际情况自行修改
      }
      console.log('auth', authorization);
      return {
        Authorization: authorization,
      };
    },
    //构建上传的url
    buildUploadUrl() {
      let baseUrl = window._CONFIG['domianURL'] || '/api';
      return baseUrl + '/erpStock/importStock';
    },
    showAdd(item) {
      return this.$store.getters.userInfo.permissions.includes('erpStock:add');
    },
    showExport() {
      return this.$store.getters.userInfo.permissions.includes('erpStock:export');
    },
    showEdit(item) {
      return this.$store.getters.userInfo.permissions.includes('erpStock:update');
    },
    showDelete(item) {
      return this.$store.getters.userInfo.permissions.includes('erpStock:delete');
    },
    hasPermission(permission) {
      return this.$store.getters.userInfo.permissions.includes(permission);
    },
    showRealDel() {
      return this.$store.getters.userInfo.id == '1';
    },
    getConfig() {
      return this.$store.getters.userInfo.sysDept.config;
    },
    showFiled(filedName) {
      let config = this.$store.getters.userInfo.sysDept.config.erpStockAddFiled;
      config = config == undefined ? 0 : config;
      let indexOfFiled = API.filedList.indexOf(filedName);
      let flag = 1 << indexOfFiled;
      return !(config & flag);
    },
    searchReset() {
      this.customerName = null; //退购记录搜索
      this.pageInfo.current = 1;
      this.pageInfo.condition = {
        orderByClause: this.orderByClause,
      };
      if (this.$store.getters.userInfo.id != '1') {
        this.pageInfo.condition.delFlag = 0;
      }
      //初始化查询条件的时间范围
      this.pageInfo.condition.startTime = this.moment().add(-2, 'Y').startOf('day').format('YYYY-MM-DD HH:mm:ss');
      this.pageInfo.condition.endTime = this.moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
      this.queryTimeDefaultValue[0] = moment(this.pageInfo.condition.startTime, 'YYYY-MM-DD');
      this.queryTimeDefaultValue[1] = moment(this.pageInfo.condition.endTime, 'YYYY-MM-DD');
      this.$set(this.qt, 0, moment(this.pageInfo.condition.startTime, 'YYYY-MM-DD'));
      this.$set(this.qt, 1, moment(this.pageInfo.condition.endTime, 'YYYY-MM-DD'));
      this.loadData();
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
</style>
