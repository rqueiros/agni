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
      <v-card
        style="margin-right:4.7%; background-color: #F7F8F9;"
        class="py-2 mb-4"
        :class="$vuetify.breakpoint.lgAndUp ? 'barMarginBig' : 'barMarginSmall'"
        tile
        elevation="0"
      >
        <AppBar :resource="resource" />
      </v-card>
      <v-container fluid class="pa-0 mb-10">
        <v-row class="mt-0">
          <v-col :class="$vuetify.breakpoint.lgAndUp ? 'containerWidthBig' : 'containerWidthSmall'"></v-col>
          <v-col class="px-0 mx-0">
            <v-row class=""> </v-row>
            <v-row style="min-height: 80vh; margin-right: 5%;" class="pl-4 pr-4">
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

import AppBar from "./components/appBar/AppBar.vue";
import Resource from "./components/resources/Resource.vue";
import Menu from "./components/Menu.vue";

export default {
  components: {
    Resource,
    Menu,
    AppBar
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

.containerWidthBig{
  max-width: 210px;
}
.containerWidthSmall{
  max-width: 100px;
}

.barMarginBig{
  margin-left:202px; 
}
.barMarginSmall{
  margin-left:92px; 
}
</style>
