// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import VueResource from 'vue-resource';
import Request from '@/plugins/request';

import 'element-ui/lib/theme-default/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueResource);
Vue.use(Request);

/* eslint-disable no-new */
window.vueRoot = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});