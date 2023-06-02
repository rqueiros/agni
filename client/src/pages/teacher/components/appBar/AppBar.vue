<template>
  <div id="header">

    <AppBarCourse v-if="resource.includes('Course')" :title="getTitle" :description="getDescription"/>

    <AppBarContent v-if="resource.includes('Content')" :title="getTitle" :description="getDescription"/>

    <!--
    <v-row>
      <v-col cols="7">
        <div class="text-h5 text-left">
          {{ getTitle }}
        </div>
        <div class="text-body-2 text-left">
          {{ getDescription }}
        </div>
      </v-col>
      <v-col cols="5" class="d-flex flex-row-reverse">
        <Buttons :resource="resource"/>
      </v-col>
    </v-row>-->
  </div>
</template>

<script>
import { bus } from "@/main.js";

import {mapMutations, mapActions } from "vuex";

import AppBarContent from "./appBars/AppBarContent.vue";
import AppBarCourse from "./appBars/AppBarCourse.vue";

export default {
  name: "Header",

  props: {
    resource: {
      type: String,
      default: () => null
    }
  },

  components:{
    AppBarContent,
    AppBarCourse
  },

  data() {
    return {};
  },

  computed: {
    getTitle() {
      if (this.resource.includes("class")) {
        return "Class Managing";
      } else if (this.resource.includes("Course")) {
        return "COURSE CREATION";
      } else if (this.resource.includes("content")) {
        return "MANAGE CONTENT";
      } else if (this.resource.includes("content")) {
        return "Content Managing";
      } else if (this.resource.includes("content")) {
        return "Content Managing";
      } else if (this.resource.includes("content")) {
        return "Content Managing";
      } else if (this.resource.includes("main")) {
        return "Welcome to the Agni Teacher side";
      } else if (this.resource.includes("settings")) {
        return "Settings";
      } else if (this.resource.includes("account")) {
        return "Account";
      } else {
        return "Content Managing";
      }
    },
    getDescription() {
      if (this.resource.includes("class")) {
        return "Here you can create and manage the occurrences of your classes";
      } else if (this.resource.includes("Course")) {
        return "Create, edit or view courses";
      } else if (this.resource.includes("content")) {
        return "Create and manage courses, expositives (pdf,.. content), evaluative (progEx, Quiz) and questions";
      } else if (this.resource.includes("main")) {
        return "Here can teachers manage classes and courses for their students";
      } else {
        return "Create and manage a course, expositives (pdf,.. content), evaluative (progEx, Quiz) and questions";
      }
    }
  },

  methods: {
    ...mapMutations(["deleteStructure"]),
    ...mapActions(["publishCourse", "saveCourse", "fetchEmptyCourse"]),
    exitOcc() {
      this.deleteStructure();
      bus.$emit("changePage", ["class,Class", "class"]);
    },
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
        case "Occurrence":
          console.log("todo"); // TODO empty occurrence
          bus.$emit("changePage", ["class,Occurrence", "occurrence"]);
          break;
      }
    }
  }
};
</script>

<style scoped>
#header >>> .v-toolbar__content,
.v-toolbar__extension {
  padding: 0 !important;
}
</style>
