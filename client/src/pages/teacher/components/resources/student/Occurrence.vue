<template>
  <div id="occurrence" v-if="getOccurrence">
    <v-container fluid class="pa-0" style="max-width: 1200px;">
      <v-row dense>
        <v-col cols="12">
          <CourseInfo/>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <Classes/>
        </v-col>
      </v-row>
      <v-row dense v-if="new Date(getOccurrence.startDate) < new Date()">
        <v-col cols="12">
          <Statistics/>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<script>
import { mapGetters } from "vuex";

import Classes from "./Classes.vue"
import Statistics from "./Statistics.vue";
import CourseInfo from "./CourseInfo.vue";


export default {
  name: "Occurrence",

  components: {
    Statistics,
    Classes,
    CourseInfo
  },

  data() {
    return {};
  },

  computed: {
    ...mapGetters("main", ["getOccurrence"]),
  },
};
</script>


<style scoped>
</style>
