<template>
  <v-app id="inspire">
    <!--System bar-->
    <v-system-bar app>
      <div>STUDENT</div>
      <v-spacer></v-spacer>
      <div class="mr-2"><v-icon>mdi-school</v-icon>learnJS v0.7.7</div>
    </v-system-bar>
    <!--Main-->
    <v-main style="padding:24px 0px 0px 0%;">
      <Course />
    </v-main>
  </v-app>
</template>

<script>
import Course from "./Course.vue";

export default {
  components: {
    Course,
  },
}
</script>

