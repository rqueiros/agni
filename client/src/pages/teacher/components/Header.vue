<template>
  <div id="header" style="width: 100%;">
    <v-app-bar dense rounded elevation="0" height="auto" style="background-color: white;">
      <v-btn rounded text elevation="0" class="mx-1" v-if="resource.includes('Course') || resource.includes('Occurrence') || resource.includes('Student')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-divider vertical v-if="resource.includes('Course') || resource.includes('Occurrence') || resource.includes('Student')"></v-divider>
      <span class="mx-4">{{ getTitle }}</span>
      <v-spacer></v-spacer>
      <v-btn outlined class="mr-1" rounded color="primary" v-if="resource.includes('Course') && isAuthor">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
      <v-btn outlined class="mx-1" rounded color="primary" v-if="resource.includes('Course') && isAuthor">
        <v-icon>mdi-publish</v-icon>
      </v-btn>
      <v-btn outlined class="mx-1" rounded color="primary" v-if="resource.includes('Course')">
        <v-icon>mdi-content-copy</v-icon>
      </v-btn>
      <v-btn outlined class="ml-1" rounded color="error" v-if="resource.includes('Course') && isAuthor">
        <v-icon>mdi-delete</v-icon>
      </v-btn>

      <v-btn outlined class="ml-1" rounded color="primary" v-if="resource.includes('Content') || resource.includes('Class')">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-app-bar>
    
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
//import Buttons from './Buttons.vue';
import { mapGetters, mapState } from 'vuex';

export default {
  name: "Header",

  props: {
    resource: {
      type: String,
      default: () => null
    }
  },

  components: {
    //Buttons
  },

  computed: {
    ...mapState(['changed']),
    ...mapGetters(["getRole", "getPublishedAt"]),
    isAuthor() {
      return this.getRole == "author"
    },
    isViewer() {
      return this.getRole == "viewer"
    },
    isDraft() {
      return this.getPublishedAt == null
    },
    getTitle() {
      if (this.resource.includes("class")) {
        return "Class Managing";
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
      } else if (this.resource.includes("content")) {
        return "Here you can create and manage a course, expositives (pdf,.. content), evaluative (progEx, Quiz) and questions";
      } else if (this.resource.includes("main")) {
        return "Here can teachers manage classes and courses for their students";
      } else {
        return "Create and manage a course, expositives (pdf,.. content), evaluative (progEx, Quiz) and questions";
      }
    }
  }
};
</script>

<style scoped>
#header>>>.v-toolbar__content, .v-toolbar__extension{
  padding:0 !important;
}

</style>
