import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
  theme: { themes: {
    light: {
      primary: '#1976D2',
      secondary: '#424242',
      accent: '#82B1FF',
      error: '#FF5252',
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#FFC107',
      background: colors.grey.lighten4,
      teacherMenu: colors.grey.lighten2,
      teacherSystemBar: colors.grey.darken3,
      hover: colors.grey.lighten3
    },
    dark: {
      background: colors.grey.darken4,
      teacherMenu: colors.grey.darken3,
      teacherSystemBar: colors.grey.darken1,
      hover: colors.grey.darken1
    },
  }, },
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
