<template>
  <v-app id="inspire1" style="background-color: lightgray;">
    <!--System bar-->
    <v-system-bar id="teacher_bar" app dark style="z-index: 10;">
      <div>TEACHER</div>
      <v-spacer></v-spacer>
      <div class="mr-2 my"><v-icon>mdi-school</v-icon>learnJS v0.7.7</div>
    </v-system-bar>

    <!--Main-->
    <v-main style="padding: 24px 0 32px 0; background-color: lightgray;">
      <v-container fluid style="padding: 0;align-items: flex-start;" fill-height>
        <v-row >
          <v-col cols="2">
            <Menu />
          </v-col>
          <v-col cols="8">
            <v-row style="padding-top: 0px; margin-top:12px">
              <Header :header="header" />
            </v-row>
            <!--<Resource :resource="resource" />-->
            <v-row style="min-height: 33rem;">
              <v-card class="" width="100%" outlined style="width: 100%; box-shadow:0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.2), 0px 1px 10px 0px rgba(0, 0, 0, 0.2)">
                <Course outlined />
              </v-card>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { bus } from "@/main.js";
import { mapActions } from "vuex";
//import Resource from "./components/Resource.vue";
import Menu from "./components/Menu.vue";
import Header from "./components/Header.vue";
import Course from "../student/Course.vue";

export default {
  components: {
    //Resource,
    Menu,
    Header,
    Course
  },
  data: () => ({
    resource: "main,Main",
    header: "main"
  }),
  methods: {
    ...mapActions(["fetchEmptyCourse"]),
    setPage(payload) {
      this.resource = payload[0];
      this.header = payload[1];
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

    this.fetchEmptyCourse();
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
