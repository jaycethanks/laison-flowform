<template>
  <div class="card-container">
    <a-card :bordered="false">
      <!-- 查询区域 -->
      <section class="gap--common bordered--wt section--filter-query">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="[24, 8]" align="middle" justify="space-between" type="flex">
            <a-col>
              <a-row :gutter="[24, 8]" align="middle" type="flex">
                <a-col>
                  <a-form-item :label="$t('ErpFactoryIncomingInspection.stockName')">
                    <StockSelect v-model="condition.stockCode" />
                  </a-form-item>
                </a-col>

                <a-col>
                  <a-form-item :label="$t('InspectStatistics.queryTime')">
                    <a-range-picker
                      :default-value="inspectTimeDefaultValue"
                      @change="inspectTimeChange"
                      format="YYYY-MM"
                      v-model="inspectQt"
                      style="max-width: 200px"
                    />
                  </a-form-item>
                </a-col>
                <a-col>
                  <a-radio-group v-model="condition.inspectDataType" button-style="solid">
                    <a-radio-button value="%Y-%m">
                      {{ $t('InspectStatistics.monthType') }}
                    </a-radio-button>
                    <a-radio-button value="%Y">
                      {{ $t('InspectStatistics.yearType') }}
                    </a-radio-button>
                  </a-radio-group>
                </a-col>
              </a-row>
            </a-col>
            <a-col>
              <a-space size="small">
                <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
                  <a-button type="primary" @click="searchQuery" icon="search">{{
                    $t('common.query')
                  }}</a-button>
                </span>
              </a-space>
            </a-col>
          </a-row>
        </a-form>
      </section>

      <section class="gap--common bordered--wt section--summary">
        <a-descriptions layout="vertical" :title="$t('InspectStatistics.factorySubtotal')" :column="2">
          <a-descriptions-item :label="$t('InspectStatistics.totalCount')">
            {{ totalCount }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('InspectStatistics.averagepassrate')">
            {{ averagepassrate }}
          </a-descriptions-item>
        </a-descriptions>
      </section>

      <section class="section--echart">
        <LineChart
          :style="{ height: '500px', width: '1000px', marginBottom: '0' }"
          v-model="option"
          class="gap--common bordered--wt"
        />
        <LineChart
          :style="{ height: '500px', width: '500px', marginBottom: '0' }"
          v-model="pieoption"
          class="gap--common bordered--wt"
        />
<!--        <LineChart-->
<!--          :style="{ height: '500px', width: '500px', marginBottom: '0' }"-->
<!--          v-model="cpieoption"-->
<!--          class="gap&#45;&#45;common bordered&#45;&#45;wt"-->
<!--        />-->
        <!-- <PieChart
          :style="{ height: '400px', width: '600px', marginBottom: '0' }"
          :param="{}"
          class="gap--common bordered--wt"
        /> -->
      </section>
    </a-card>
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

import moment from 'moment'
import API from '@/api/InspectStatistics'
import LineChart from '@/components/laison/EchartBased/lihua/LihuaChart.vue'
import PieChart from '@/components/laison/EchartBased/base/PieChart.vue'
import StockSelect from '@/components/laison/InputSelect/LaisonErpStockInputSelect'
import SupplierSelect from '@/components/laison/InputSelect/LaisonErpSupplierInputSelect'
export default {
  name: 'FactoryInspectStatistics',
  mixins: [JeecgListMixin],
  components: {
    LineChart,
    PieChart,
    StockSelect,
    SupplierSelect,
  },
  data() {
    return {
      condition: {
        inspectDataType: '%Y-%m',
      },
      description: '统计分析',
      totalCount: 0,
      averagepassrate: 0, //平均通过率
      inspectTimeDefaultValue: [null, null],
      inspectQt: [],
      cpieoption:{ xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '30%']
        },
        visualMap: {
          type: 'piecewise',
          show: false,
          dimension: 0,
          seriesIndex: 0,
          pieces: [
            {
              gt: 1,
              lt: 3,
              color: 'rgba(0, 0, 180, 0.4)'
            },
            {
              gt: 5,
              lt: 7,
              color: 'rgba(0, 0, 180, 0.4)'
            }
          ]
        },
        series: [
          {
            type: 'line',
            smooth: 0.6,
            symbol: 'none',
            lineStyle: {
              color: '#5470C6',
              width: 5
            },
            markLine: {
              symbol: ['none', 'none'],
              label: { show: false },
              data: [{ xAxis: 1 }, { xAxis: 3 }, { xAxis: 5 }, { xAxis: 7 }]
            },
            areaStyle: {},
            data: [
              ['2019-10-10', 200],
              ['2019-10-11', 560],
              ['2019-10-12', 750],
              ['2019-10-13', 580],
              ['2019-10-14', 250],
              ['2019-10-15', 300],
              ['2019-10-16', 450],
              ['2019-10-17', 300],
              ['2019-10-18', 100]
            ]
          }
        ]},
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999',
            },
          },
        },
        title: { text: this.$t('InspectStatistics.factoryInspectStatisticsTitle') },
        // toolbox: {
        //   feature: {
        //     dataView: { show: true, readOnly: false },
        //     magicType: { show: true, type: ['line', 'bar'] },
        //     restore: { show: true },
        //     saveAsImage: { show: true },
        //   },
        // },
        legend: {
          data: [
            this.$t('InspectStatistics.totalCount'),
            this.$t('InspectStatistics.passCount'),
            this.$t('InspectStatistics.passPercent'),
          ],
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisPointer: {
              type: 'shadow',
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: this.$t('InspectStatistics.count'),
          },
          {
            type: 'value',
            name: this.$t('InspectStatistics.passPercent'),
            min: 0,
            max: 100,
            axisLabel: {
              formatter: '{value} °%',
            },
          },
        ],
        series: [
          {
            name: this.$t('InspectStatistics.totalCount'),
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value
              },
            },
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
          },
          {
            name: this.$t('InspectStatistics.passCount'),
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value
              },
            },
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
          },
          {
            name: this.$t('InspectStatistics.passPercent'),
            type: 'line',
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function (value) {
                return value + ' %'
              },
            },
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
          },
        ],
      },

      pieoption: {
        title: { text: this.$t('InspectStatistics.factoryInspectResult') },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          top: '5%',
          left: 'center',
        },
        series: [
          {
            name: '质检结果',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' },
            ],
          },
        ],
      },
    }
  },
  async created() {},
  async mounted() {
    this.condition.startTime = this.moment().add(-3, 'M').startOf('M').format('YYYY-MM-DD HH:mm:ss') //开始时间是当前时间减去3个月
    this.condition.endTime = this.moment().endOf('M').format('YYYY-MM-DD HH:mm:ss') //结束时间是当天
    this.$set(this.inspectQt, 0, moment(this.condition.startTime, 'YYYY-MM-DD')) //用于组件显示
    this.$set(this.inspectQt, 1, moment(this.condition.endTime, 'YYYY-MM-DD')) //用于组件显示
    this.loadData()
  },
  computed: {},
  methods: {
    moment,
    async loadData() {
      let res = await API.factoryInspectStatistics(this.condition)
      this.averagepassrate = res.subStatistics.avgPassPercent
      this.totalCount = res.subStatistics.totalCount
      this.option.xAxis[0].data.splice(0, this.option.xAxis[0].data.length)
      this.option.series[0].data.splice(0, this.option.series[0].data.length)
      this.option.series[1].data.splice(0, this.option.series[1].data.length)
      this.option.series[2].data.splice(0, this.option.series[2].data.length)

      res.countbarData.forEach((i, v) => {
        this.option.xAxis[0].data.push(i.xdata)
        this.option.series[0].data.push(res.countbarData[v].value)
        this.option.series[1].data.push(res.passCountbarData[v].value)
        this.option.series[2].data.push(res.percentLineData[v].value)
      })
      this.pieoption.series[0].data.splice(0, this.pieoption.series[0].data.length)

      res.resultPie.forEach((i, v) => {
        if (i.xdata == '0') {
          i.name = this.$t('ErpMaterialIncomingInspection.bhg')
        } else if (i.xdata == '2') {
          i.name = this.$t('ErpMaterialIncomingInspection.dgj')
        } else if (i.xdata == '3') {
          i.name = this.$t('ErpMaterialIncomingInspection.hg')
        }
        this.pieoption.series[0].data.push(i)
      })

      window.op = this.pieoption
    },

    inspectTimeChange(dates) {
      this.condition.startTime = dates[0].startOf('M').format('YYYY-MM-DD HH:mm:ss')
      this.condition.endTime = dates[1].endOf('M').format('YYYY-MM-DD HH:mm:ss')
    },

    searchQuery() {
      this.loadData()
    },
  },
}
</script>
<style scoped lang="less">
.bordered--wt {
  border: 1px solid #efefef;
}

.gap--common {
  margin: 0 0 20px 0;
  padding: 20px;
}

.section--filter-query {
  // border: 1px solid red;
}
.section--summary {
  // border: 1px solid blue;
}
.section--echart {
  display: flex;
  justify-content: space-between;
  // border: 4px solid yellow;
}
.section--table {
  border: none;
  margin: 0;
  padding: 0;
}
/deep/ .ant-descriptions-item-content {
  font-size: 28px;
  color: rgba(0, 0, 0, 0.85);
  margin-left: 12px;
}

/deep/ tr.ant-descriptions-row:nth-child(1) td {
  &::before {
    background-color: #71bcfe;
    border-radius: 50%;
    content: '';
    display: inline-block;
    vertical-align: middle;
    width: 6px;
    height: 6px;
    margin-right: 6px;
  }
  &:nth-child(1)::before {
    background-color: #71bcfe;
  }
  &:nth-child(2)::before {
    background-color: #4d92ff;
  }
  &:nth-child(3)::before {
    background-color: #78a8ff;
  }
  &:nth-child(4)::before {
    background-color: #64d6fc;
  }
}
</style>

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
<style scoped>
/* tabs-style */
>>> .card-container {
  background: #f5f5f5;
  overflow: hidden;
  padding: 24px;
}
>>> .card-container > .ant-tabs-card > .ant-tabs-content {
  height: 120px;
  margin-top: -16px;
}

>>> .card-container > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
  background: #fff;
  padding: 16px;
}

>>> .ant-tabs-bar {
  margin: 0;
}
>>> .card-container > .ant-tabs-card > .ant-tabs-bar {
  border-color: #fff;
}

>>> .card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
  border-color: transparent;
  background: transparent;
}

>>> .card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
  border-color: #fff;
  background: #fff;
}
</style>
