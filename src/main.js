import Vue from "vue";
import App from "./App.vue";
import "ant-design-vue/dist/antd.css";
import Antd from "ant-design-vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueAxios from "vue-axios";
Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(Antd);

Vue.use(router);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
