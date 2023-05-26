<template>
  <v-app id="inspire1" style="background-color: #F7F8F9;">
    <!--System bar-->
    <v-system-bar id="teacher_bar" app dark style="z-index: 10;">
      <div>TEACHER</div>
      <v-spacer></v-spacer>
      <div class="mr-2"><v-icon>mdi-school</v-icon>learnJS v0.7.7</div>
    </v-system-bar>

    <!--Main-->
    <v-main class="px-0 pt-6 pb-3">
      <v-container fluid class="pa-0">
        <v-row class="mt-3">
          <v-col cols="2">
            <Menu />
          </v-col>
          <v-col cols="10">
            <v-row class="pl-4 pr-4 mr-16">
              <Header :resource="resource" />
            </v-row>
            <v-row style="min-height: 75vh;" class="mb-3 pl-4 pr-4 mr-16" >
              <Resource :resource="resource" />
            </v-row>
          </v-col>
          <!--
          <v-col>
            <Buttons :resource="resource"/>
          </v-col>-->
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { bus } from "@/main.js";
import { mapActions } from "vuex";

import Resource from "./components/Resource.vue";
import Menu from "./components/Menu.vue";
import Header from "./components/Header.vue";
//import Buttons from "./components/Buttons.vue";

export default {
  components: {
    Resource,
    Menu,
    Header,
    //Buttons
  },
  data: () => ({
    resource: "main,Main",
    header: "main"
  }),
  methods: {
    ...mapActions(["fetchEmptyCourse"]),
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
  }
};
</script>

<style>
#teacher_bar {
  background-color: #454444;
}

.v-navigation-drawer,
.v-navigation-drawer--fixed {
  position: none !important;
}
</style>
