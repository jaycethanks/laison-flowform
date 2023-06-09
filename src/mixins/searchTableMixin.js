import moment from 'moment'
import 'moment/locale/zh-cn';
import { sampleCondition } from "@/api/platform/processOpenAPI.js"

import zh from 'ant-design-vue/es/date-picker/locale/zh_CN';
import ar from 'ant-design-vue/es/date-picker/locale/ar_EG';
import fr from 'ant-design-vue/es/date-picker/locale/fr_FR';
import pt from 'ant-design-vue/es/date-picker/locale/pt_PT';
import en from 'ant-design-vue/es/date-picker/locale/en_US';
const antdLangs = {
  zh,
  ar,
  fr,
  pt,
  en,
};
const langLabelMap = {
  zh: 'zh-CN',
  en: 'en-US',
  fr: 'fr-FR',
  pt: 'pt-PT',
  ar: 'ar-EG'
}
export default {
  data() {
    return {
      pageInfo: {
        condition: {
          orderByClause: 'create_time desc',
          startTime: '',
          endTime: '',
        },
        loading: false,
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0,
        },
      },
      dataSource: null,
      timeRange_: [],
      locale_: en,
      defaultStartBeforeMonth: 3,
      sampleCondition_: {},// 通用 query 条件options 列表
    };
  },
  watch: {
    'pageInfo.pagination': {
      handler: function () {
        this.loadData();
      },
    },
    timeRange_: {
      handler: function () {
        this.pageInfo.condition.startTime = this.momentToString(this.timeRange_[0], false)
        this.pageInfo.condition.endTime = this.momentToString(this.timeRange_[1], true)
      },
      deep: true
    }

  },
  created() {
    this.timeLocalInit()
  },
  mounted() {
    this._loadSampleCondition()
    this.timeRangeInit()


  },
  methods: {
    moment,
    timeLocalInit() {
      moment.locale(langLabelMap[this.computedQuery.lang]);
      this.locale_ = antdLangs[this.computedQuery.lang]
    },
    timeRangeInit() {
      //初始化查询条件的时间范围
      const recent = Number(this.computedQuery.recent || this.defaultStartBeforeMonth)
      if (isNaN(recent)) { this.$message.error('recent query param should be a number !') }
      console.log('[recent]: ', recent)
      const startTime = this.moment()
        .add(-recent, 'M')
      const endTime = this.moment()
      this.timeRange_ = [startTime, endTime]
    },
    async _loadSampleCondition() {
      const res = await sampleCondition({
        uniTenantId: this.computedQuery.uniTenantId,
        bizToken: this.computedQuery.bizToken,
      })
      if (res.status === 200) {
        this.sampleCondition_ = res.data
        if (res.data.orderTypes) {
          this.sampleCondition_.orderTypes = this.sampleCondition_.orderTypes.map(it => ({
            label: it,
            value: it
          }))
        }
        if (res.data.applyList) {
          this.sampleCondition_.applyList = this.sampleCondition_.applyList.map(it => ({
            label: it.name,
            value: it.id
          }))
        }

      } else {
        this.$message.error(res.msg)
      }
    },
    momentToString(momentObj, dayEnd) {
      return dayEnd ?
        this.moment(momentObj).endOf('day').format('YYYY-MM-DD HH:mm:ss')
        : this.moment(momentObj).startOf('day').format('YYYY-MM-DD HH:mm:ss')
    },
    resetSearch() {
      this.timeLocalInit()
      this.timeRangeInit()
      this.pageInfo.condition = {
        orderByClause: 'create_time desc',
      };
      this.loadData();
    },
    async loadData(options = {}) {
      this.pageInfo.loading = true;
      const res = await this.findPage(Object.assign(this.pageInfo, options));
      if (res.status === 200) {
        const { total, list } = res.data;
        this.dataSource = list;
        this.pageInfo.pagination.total = total;
      } else {
        this.$message.error(res.msg);
      }
      this.pageInfo.loading = false;
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pageInfo.pagination };
      pager.current = pagination.current;
      this.pageInfo.pagination = pager;
      this.loadData();
    },
  },
};
