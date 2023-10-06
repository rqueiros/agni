<template>
  <v-app>
    <v-card flat color="background" height="100%">
      <v-system-bar app dark style="z-index: 10;" color="teacherSystemBar">
        <div>TEACHER</div>
        <v-spacer></v-spacer>
        <div class="mr-2">
          <v-icon>mdi-school</v-icon>learnJS v0.7.7
        </div>
      </v-system-bar>

      <v-main class="px-0 pt-3">
        <Menu />
        <v-card 
          color="appbar"
          tile
          elevation="1"
          style="padding-right: 5%; padding-left:22px;"
          class="mt-3 mb-5 py-1"
          :class="$vuetify.breakpoint.lgAndUp ? 'barMarginBig2' : 'barMarginSmall2'" 
        >
          <AppBar :resource="resource" />
        </v-card>
        <div 
          style="margin-right: 5%;" 
          class="mb-8 min_height" 
          :class="$vuetify.breakpoint.lgAndUp ? 'barMarginBig' : 'barMarginSmall'"
        >
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
import { mapActions, mapGetters } from "vuex";

import AppBar from "./components/appBar/AppBar.vue";
import Resource from "./components/resources/Resource.vue";
import Menu from "./components/Menu.vue";
import Snackbar from "./../../components/gerneral/Snackbar.vue"

export default {
  components: {
    Resource,
    Menu,
    AppBar,
    Snackbar
  },
  data: () => ({
    resource: "home,Home",
    valid:true,

    snackbar: {
      open: false,
      text: "",
      icon: "",
      color: "",
      timeout: 2000,
    },
  }),

  watch: {
    '$vuetify.theme.currentTheme'() {
        document.documentElement.style.setProperty('--shadow-color', this.$vuetify.theme.currentTheme.shadowColor);
    }
  },

  mounted(){
    document.documentElement.style.setProperty('--shadow-color', this.$vuetify.theme.currentTheme.shadowColor);
  },

  methods: {
    ...mapActions("main", ["fetchEmptyCourse"]),
    validate(){
      console.log(this.$refs.loginForm.validate())
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
      this.snackbar = this.getSuccessSnackbar(payload)
    });
    bus.$on("errorSnackbar", payload => {
      this.snackbar = this.getErrorSnackbar(payload)
    });
    bus.$on("snackbarChange", payload => {
      this.snackbar.open = payload
    });
  },
  
  computed: {
    ...mapGetters("style", [
      "getErrorSnackbar", 
      "getSuccessSnackbar", 
    ]),
  },
};
</script>


<style>
.shadow{
  /*box-shadow: 0px 0px 5px rgb(184, 184, 184) !important;*/
  box-shadow: 0px 0px 5px var(--shadow-color) !important;
}


.min_height{
  min-height:calc(100vh - 150px);
}

.v-navigation-drawer,
.v-navigation-drawer--fixed {
  position: none !important;
}

.containerWidthBig {
  max-width: 202px;
}

.containerWidthSmall {
  max-width: 92px;
}

.barMarginBig {
  margin-left: 202px;
}
.barMarginBig2 {
  margin-left: 180px;
}

.barMarginSmall {
  margin-left: 92px;
}
.barMarginSmall2 {
  margin-left: 70px;
}
</style>
