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
      studentMenuAccout: colors.grey.lighten4,
      appbar: colors.grey.lighten3,
      teacherSystemBar: colors.grey.darken3,
      hover: colors.grey.lighten3,
      boxes: colors.white,
      shadowColor: '#B8B8B8',
      button:"#f5f5f5",
      editable:"#E2E2E2",
      text:"#000000",
    },
    dark: {
      background: "#1B1D25",
      teacherMenu: "#24282B",
      studentMenuAccout: "#24282B",
      appbar: "#24282B",
      teacherSystemBar: colors.grey.darken2,
      //hover: colors.grey.darken4,
      hover: "#2E3235",
      boxes: "#24282B",
      shadowColor: colors.blue,
      button: "#484747",
      editable:colors.grey.darken1,
      text:"#FFFFFF",
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
