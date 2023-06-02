<template>
  <div id="contentButtons">
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

      <v-menu offset-y auto>
        <template v-slot:activator="{ on, attrs }">
          <v-btn elevation="1" rounded v-bind="attrs" v-on="on" color="primary">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in addList" :key="index" link @click="addCollectionType(item.title)">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

    </v-app-bar>
  </div>
</template>

<script>
import { bus } from "@/main.js";

import { mapActions } from "vuex";

export default {
  name: "ContentButtons",

  components:{},

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
      addList: [
        { title: "Course" },
        { title: "Expositive" },
        { title: "Evaluative" },
        { title: "Question" }
      ],
    };
  },

  computed: {},

  methods: {
    ...mapActions(["fetchEmptyCourse"]),
    addCollectionType(item) {
      switch (item) {
        case "Course":
          this.fetchEmptyCourse();
          bus.$emit("changePage", ["content,Course", "content"]);
          break;
        case "Expositive":
          console.log("todo"); // TODO create Expositive
          break;
        case "Evaluative":
          console.log("todo"); // TODO create Evaluative
          break;
        case "Question":
          console.log("todo"); // TODO create Question
          break;
      }
    },
  }
}
</script>

<style scoped></style>