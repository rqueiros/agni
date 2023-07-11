<template>
  <div id="appBarOccurrences">
    <v-app-bar 
      rounded 
      elevation="2" 
      height="auto" 
      outlined 
      style="background-color: #F7F8F9;" 
      class="pa-2"
    >

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <span class="mx-4" v-bind="attrs" v-on="on"> 
            {{ title }}
          </span>
        </template>
        <span>{{ description }}</span>
      </v-tooltip>

      <v-spacer></v-spacer>

      <v-text-field label="Search" outlined dense hide-details disabled/>
      <!--TODO implement Search-->

      <v-spacer></v-spacer>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn 
            elevation="1" 
            rounded 
            color="primary" 
            @click="addOccurrence" 
            v-bind="attrs" 
            v-on="on"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Add</span>
      </v-tooltip>

    </v-app-bar>
  </div>
</template>
  
<script>
import { bus } from "@/main.js";

import { mapActions } from "vuex";

export default {
  name: "AppBarOccurrences",

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

  methods: {
    ...mapActions("main", ["fetchEmptyOccurrence"]),
    addOccurrence() {
      this.fetchEmptyOccurrence();
      bus.$emit("changePage", "student,Occurrence");
    },
  }
}
</script>

  
<style scoped></style>