<template>
  <v-app>
    <v-card flat color="background" height="100%">
      <v-system-bar app dark color="teacherSystemBar" style="z-index: 100;">
        <div>TEACHER</div>
        <v-spacer></v-spacer>
        <div class="mr-2"><v-icon>mdi-school</v-icon>learnJS v0.7.7</div>
      </v-system-bar>

      <v-main class="px-0 pt-6">
        <Menu />

        <div
          :style="{
            'margin-left': $vuetify.breakpoint.lgAndUp ? '140px' : '70px'
          }"
        >
          <v-card
            color="appbar"
            tile
            elevation="1"
            style="padding-right: 5%"
            class="py-1 pl-5"
          >
            <AppBar :resource="resource" />
          </v-card>
          <div style="padding-right: 5%;" class="mb-8 min_height pl-5 pt-5">
            <!--
            <v-btn @click="validate">
              Do it
            </v-btn>-->
            <!--
            <v-form ref="loginForm" v-model="valid" lazy-validation>
              <Resource :resource="resource" />
            </v-form>-->
            <Resource :resource="resource" />
          </div>
        </div>

        <Snackbar
          :snackbar="snackbar.open"
          :timeout="snackbar.timeout"
          :color="snackbar.color"
          :icon="snackbar.icon"
          :text="snackbar.text"
        />
      </v-main>
    </v-card>
  </v-app>
</template>

<script>
import { bus } from "@/main.js";
import { mapGetters } from "vuex";

import AppBar from "./components/AppBar.vue";
import Resource from "./components/resources/Resource.vue";
import Menu from "./components/Menu.vue";
import Snackbar from "./../../components/gerneral/Snackbar.vue";

export default {
  components: {
    Resource,
    Menu,
    AppBar,
    Snackbar
  },
  data: () => ({
    resource: "home,Home",
    valid: true,

    snackbar: {
      open: false,
      text: "",
      icon: "",
      color: "",
      timeout: 2000
    }
  }),

  watch: {
    "$vuetify.theme.currentTheme"() {
      document.documentElement.style.setProperty(
        "--shadow-color",
        this.$vuetify.theme.currentTheme.shadowColor
      );
    }
  },

  mounted() {
    document.documentElement.style.setProperty(
      "--shadow-color",
      this.$vuetify.theme.currentTheme.shadowColor
    );
  },

  computed: {
    ...mapGetters("style", ["getErrorSnackbar", "getSuccessSnackbar"])
  },

  methods: {
    validate() {
      console.log(this.$refs.loginForm.validate());
    }
  },

  created() {
    bus.$on("changePage", payload => {
      this.resource = payload;
    });
    bus.$on("changeResource", payload => {
      this.resource = payload;
    });
    bus.$on("successSnackbar", payload => {
      this.snackbar = this.getSuccessSnackbar(payload);
    });
    bus.$on("errorSnackbar", payload => {
      this.snackbar = this.getErrorSnackbar(payload);
    });
    bus.$on("snackbarChange", payload => {
      this.snackbar.open = payload;
    });
  }
};
</script>

<style>
.shadow {
  box-shadow: 0px 0px 5px var(--shadow-color) !important;
}

.min_height {
  min-height: calc(100vh - 145px);
}

.v-navigation-drawer,
.v-navigation-drawer--fixed {
  position: none !important;
}
</style>
