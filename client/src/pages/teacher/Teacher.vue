<template>
  <v-app id="inspire1" style="background-color: #F7F8F9;">
    <!--System bar-->
    <v-system-bar id="teacher_bar" app dark style="z-index: 10;">
      <div>TEACHER</div>
      <v-spacer></v-spacer>
      <div class="mr-2"><v-icon>mdi-school</v-icon>learnJS v0.7.7</div>
    </v-system-bar>

    <!--Main-->
    <v-main class="px-0 pt-6">
      <Menu />
      <v-card style="margin-right:5%; background-color: #F7F8F9;" class="mt-3 mb-5"
        :class="$vuetify.breakpoint.lgAndUp ? 'barMarginBig' : 'barMarginSmall'" tile elevation="0">
        <AppBar :resource="resource" />
      </v-card>
      <div style="margin-right: 5%;" class="mb-8 min_height" :class="$vuetify.breakpoint.lgAndUp ? 'barMarginBig' : 'barMarginSmall'">
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
    header: "home",

    snackbar: {
        open: false,
        text: "",
        icon: "",
        color: "",
        timeout: 2000,
      },
  }),

  methods: {
    ...mapActions("main", ["fetchEmptyCourse"]),
    setPage(payload) {
      this.resource = payload[0];
    },
    setResource(payload) {
      this.resource = payload;
    },
    setHeader(payload) {
      this.header = payload;
    }
  },

  created() {
    bus.$on("changePage", payload => {
      this.setPage(payload);
    });
    bus.$on("changeResource", payload => {
      this.setResource(payload);
    });
    bus.$on("changeHeader", payload => {
      this.setHeader(payload);
    });
    bus.$on("successSnackbar", payload => {
      this.snackbar = this.getSuccessSnackbar(payload)
    });
    bus.$on("errorSnackbar", payload => {
      this.snackbar = this.getErrorSnackbar(payload)
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
.min_height{
  min-height:calc(100vh - 150px);
}

#teacher_bar {
  background-color: #454444;
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

.barMarginSmall {
  margin-left: 92px;
}
</style>
