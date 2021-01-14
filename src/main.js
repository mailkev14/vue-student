import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import Vue from "vue";
import VueSwal from 'vue-swal';
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import {
  ValidationObserver,
  ValidationProvider,
  extend,
  localize
} from "vee-validate";

import en from "vee-validate/dist/locale/en.json";
import * as rules from "vee-validate/dist/rules";

// Install VeeValidate rules and localization
Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule]);
});

localize("en", en);

// global components
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueSwal);

Vue.config.productionTip = false;

import App from "./App.vue";
import router from "./router";
import store from './store';

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount("#app");
