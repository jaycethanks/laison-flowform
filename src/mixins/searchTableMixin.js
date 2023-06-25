import moment from 'moment'
import 'moment/locale/zh-cn';

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
      defaultStartBeforeMonth: 3
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
      const startTime = this.moment()
        .add(-this.defaultStartBeforeMonth, 'M')
      const endTime = this.moment()
      this.timeRange_ = [startTime, endTime]
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
