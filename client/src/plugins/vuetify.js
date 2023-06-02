import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  breakpoint: {
    thresholds: {
      xs: 480,
      sm: 768,
      md: 1024,
      lg: 1280,
    },
    scrollBarWidth: 24
  }
});
