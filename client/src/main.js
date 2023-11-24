import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VuePlayerPlugin from "vue-youtube-iframe-api";
import VDraggableTreeView from "vuetify-draggable-treeview";
import VueApexCharts from 'vue-apexcharts';
Vue.use(VDraggableTreeView);
Vue.use(VueApexCharts);  // Importing VueApexCharts
Vue.component('apexchart', VueApexCharts);
Vue.use(VuePlayerPlugin, {
  width: "100%", // optional, used to set global width on all futur instance
  height: "400px", // optional, used to set global width on all futur instance
  loadComponent: true // create the global player component <vytia-player></vytia-player>
});

Vue.config.productionTip = false;

export const bus = new Vue();

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
