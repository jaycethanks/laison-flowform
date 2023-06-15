export default {
  created() {
    if (!this.computedQuery) this.$message.warn('未引入 handleQuery mixin!');
    if (!this.computedQuery.lang) this.$message.warn('data.query.lang 未指定!');

    this.handleLanguage(this.computedQuery.lang);
  },
  methods: {
    handleLanguage(lang) {
      this.$i18n.locale = lang;
    },
  },
};
