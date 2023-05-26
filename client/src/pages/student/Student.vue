<template>
  <v-app id="inspire">
    <!--System bar-->
    <v-system-bar app class="d-sm-none d-md-flex" style="z-index:10">
      <div>STUDENT</div>
      <v-spacer></v-spacer>
      <div class="mr-2"><v-icon>mdi-school</v-icon>learnJS v0.7.7</div>
    </v-system-bar>
    <!--Main-->
    <v-main class="pa-sm-0 pt-md-6">
      <Course />
    </v-main>
  </v-app>
</template>

<script>
import Course from "./Course.vue";

export default {
  name:"Student",

  components: {
    Course
  },
};
</script>
