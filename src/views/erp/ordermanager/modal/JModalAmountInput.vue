<template>
  <!-- wrapClassName 用于设定modal的最大宽度 -->
  <j-modal
    wrapClassName="laison_modal-preview"
    width="90vw"
    :visible="visible"
    switchFullscreen
    title="编辑收款信息"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    @fullScreenEvent="isFullScreen = $event"
    :body-style="{ maxHeight: isFullScreen ? '' : '70vh', overflowY: 'auto' }"
    :ok-button-props="{ props: { disabled: this.okBtnDisabled } }"
  >
    <div>
      <a-descriptions title="订单基础信息">
        <a-descriptions-item label="下单人"> {{ value.applyName }} - {{ value.applyDeptName }} </a-descriptions-item>
        <a-descriptions-item label="跟单人">
          {{ value.merchandiserName }}
        </a-descriptions-item>
        <a-descriptions-item label="下单时间">
          {{ value.applyTime }}
        </a-descriptions-item>
        <a-descriptions-item label="下单类型">
          {{ value.placeOrderType }}
        </a-descriptions-item>
        <a-descriptions-item label="订单类型">
          {{ value.orderType }}
        </a-descriptions-item>
        <a-descriptions-item label="订单目的">
          {{ value.orderPurpose }}
        </a-descriptions-item>
        <a-descriptions-item label="货币符号">
          {{ value.currencySymbol }}
        </a-descriptions-item>
        <a-descriptions-item label="运输费用">
          {{ value.freightCharge }}
        </a-descriptions-item>
        <a-descriptions-item label="订单总金额">
          {{ value.totalAmount }}
        </a-descriptions-item>
      </a-descriptions>
      <h3 style="font-style: normal; font-weight: bold; margin-bottom: 22px; margin-top: 5px">产品信息</h3>
      <a-table
        ref="table"
        size="middle"
        :scroll="{ x: true }"
        bordered
        rowKey="id"
        :pagination="false"
        :loading="loading"
        :columns="columns"
        :dataSource="dataSource"
      >
        <template slot="sellingPrice" slot-scope="text, record">
          <div>
            {{ text.toFixed(2) }}
          </div>
        </template>
        <template slot="price" slot-scope="text, record">
          <div>
            {{ text.toFixed(2) }}
          </div>
        </template>
      </a-table>
      <a-descriptions title="上次收款信息" style="margin-top: 30px">
        <a-descriptions-item label="销售预收备注">
          {{ value.prepayDesc }}
        </a-descriptions-item>
        <a-descriptions-item label="预收款">
          {{ yushoukuan }}
        </a-descriptions-item>
        <a-descriptions-item label="待收款">
          {{ daishoukuan }}
        </a-descriptions-item>
      </a-descriptions>
      <h3 style="font-style: normal; font-weight: bold; margin-top: 5px">本次收款信息</h3>
      <div class="table-page-search-wrapper" style="margin-top: 18px">
        <a-form layout="inline">
          <a-row :gutter="24">
            <!--订单编号-->
            <a-col :md="7" :sm="8">
              <a-form-item label="预收款">
                <a-input-number
                  style="width: 200px"
                  placeholder="请输入预收款"
                  v-model="form.yushoukuan"
                  @change="onInputChange"
                ></a-input-number>
              </a-form-item>
            </a-col>
            <!--合同号-->
            <a-col :md="7" :sm="8" style="margin-left: 35px">
              <a-form-item label="待收款">
                <a-input
                  disabled
                  style="width: 200px"
                  placeholder="跟随预收款显示"
                  v-model="form.daishoukuan"
                ></a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <h3
        v-if="inputRecords !== null && inputRecords.length > 0"
        style="font-style: normal; font-weight: bold; margin-top: 5px; margin-bottom: 22px"
      >
        收款记录
      </h3>
      <a-timeline>
        <a-timeline-item v-for="(item, index) in inputRecords" :key="index">
          <p style="color: #222222">{{ $t('erp.operateDate') }}: {{ item.createTime }}</p>
          <p style="color: #222222">{{ $t('erp.yushoukuan') }}: {{ item.yushoukuan }}</p>
          <p style="color: #222222">{{ $t('erp.daishoukuan') }}: {{ item.daishoukuan }}</p>
        </a-timeline-item>
      </a-timeline>
    </div>
  </j-modal>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin';
import { activitiMixin } from '@views/activiti/mixins/activitiMixin';
import ErpStats from '@/api/ErpStats';

export default {
  name: 'JModalAmountInput',
  mixins: [JeecgListMixin, activitiMixin],
  components: {},
  props: {
    value: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      // title:'',
      visible: false,
      okBtnDisabled: false,
      isFullScreen: false,
      dataSource: [], //数据源，
      inputRecords: [],
      yushoukuan: 0,
      daishoukuan: 0,
      form: {},
      columns: [
        {
          title: '产品编码',
          align: 'center',
          dataIndex: 'stockCode',
        },
        {
          title: '规格型号',
          align: 'center',
          dataIndex: 'specificationMode',
        },
        {
          title: '基础描述',
          align: 'center',
          dataIndex: 'specificationIntro',
        },
        {
          title: '销售数量',
          align: 'center',
          dataIndex: 'count',
        },
        {
          title: '赠送数量',
          align: 'center',
          dataIndex: 'giftCount',
        },
        {
          title: '销售单价',
          align: 'center',
          dataIndex: 'sellingPrice',
          scopedSlots: { customRender: 'sellingPrice' },
        },
        {
          title: '财务单价',
          align: 'center',
          dataIndex: 'price',
          scopedSlots: { customRender: 'price' },
        },
        {
          title: '小计金额',
          align: 'center',
          dataIndex: 'amount',
        },
      ],
    };
  },
  watch: {
    value(newVal, oldVal) {
      this.calRealData(newVal);
    },
  },

  computed: {},
  created() {},
  mounted() {},
  methods: {
    onInputChange(val) {
      let totalAmount = this.value.totalAmount;
      if (val > totalAmount) {
        this.$message.error('输入金额大于总金额');
        this.form.yushoukuan = totalAmount;
        this.form.daishoukuan = 0;
      } else {
        this.form.daishoukuan = totalAmount - val;
      }
    },

    calRealData(data) {
      this.dataSource = [];
      if (data.stockBriefInfo) {
        let stocks = JSON.parse(data.stockBriefInfo);
        if (stocks && stocks.length > 0) {
          for (let i = 0; i < stocks.length; i++) {
            let stock = stocks[i];
            if (stock.basicInfo) {
              let newObj = {};
              Object.assign(newObj, stock, stock.basicInfo);
              this.dataSource.push(newObj);
            } else {
              this.dataSource.push(stock);
            }
          }
        }
      }
      this.inputRecords = [];
      this.yushoukuan = data.yushoukuan;
      this.daishoukuan = data.daishoukuan;
      if (data.amountInputRecords) {
        let inputRecords = JSON.parse(data.amountInputRecords);
        if (inputRecords && inputRecords.length > 0) {
          let inputRecord = inputRecords[inputRecords.length - 1];
          this.yushoukuan = inputRecord.yushoukuan;
          this.daishoukuan = inputRecord.daishoukuan;
          this.inputRecords = inputRecords.reverse();
        }
      }
      this.form = {};
    },
    show() {
      this.visible = true;
    },
    handleOk() {
      let commitData = JSON.parse(JSON.stringify(this.value));
      if (this.form) {
        commitData.curYushoukuan = this.form.yushoukuan;
        commitData.curDaishoukuan = this.form.daishoukuan;
      }
      if (!commitData.curYushoukuan) {
        this.visible = false;
        return;
      }
      this.loading = true;
      ErpStats.editRecord(commitData)
        .then((res) => {
          this.loading = false;
          if (res.success) {
            this.visible = false;
            this.$emit('editSuccess');
          } else {
            this.$message.error(res.errors);
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },

    handleCancel() {
      this.visible = false;
    },
  },
};
</script>

<style scoped>
>>> .laison_modal-preview > .ant-modal {
  /* max-width: 1400px; */
}
</style>
