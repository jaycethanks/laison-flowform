import Vue from 'vue';
import VueI18n from 'vue-i18n';
import ar from './ar';
import en from './en';
import fr from './fr';
import pt from './pt';
import zh from './zh';
Vue.use(VueI18n);
const languages = {
  ar,
  en,
  fr,
  pt,
  zh,
};
const messages = Object.assign(languages);

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});

export default i18n;
