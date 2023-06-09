<template>
  <div id="appBarStudentDashboard">
    <v-app-bar rounded elevation="1" height="auto" outlined style="background-color: #F7F8F9;" class="pa-2">

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <span class="mx-4" v-bind="attrs" v-on="on"> {{ title }}
          </span>
        </template>
        <span>{{ description }}</span>
      </v-tooltip>

      <v-spacer></v-spacer>

      <v-text-field label="Search" outlined dense hide-details disabled></v-text-field>
      <!--TODO implement Search-->

      <v-spacer></v-spacer>

      <v-btn elevation="1" rounded color="primary" @click="addOccurrence">
        <v-icon>mdi-plus</v-icon>
      </v-btn>

    </v-app-bar>
  </div>
</template>
  
<script>
import { bus } from "@/main.js";

import { mapActions } from "vuex";

export default {
  name: "AppBarStudentDashboard",

  components: {},

  props: {
    title: {
      type: String,
      default: () => ""
    },
    description: {
      type: String,
      default: () => ""
    }
  },

  data() {
    return {
    };
  },

  computed: {},

  methods: {
    ...mapActions("main", ["fetchEmptyOccurrence"]),
    addOccurrence() {
      this.fetchEmptyOccurrence();
      bus.$emit("changePage", ["student,Occurrence", "occurrence"]);
    },
  }
}
</script>
  
<style scoped></style>