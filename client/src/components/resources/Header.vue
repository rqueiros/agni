<template>
  <div id="header">
    <!--STATEMENT-->
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="display-1">
          M{{ getModuleByResourceId(resource.id).id }}.
          {{ getModuleByResourceId(resource.id).name }}
        </v-list-item-title>
        <v-list-item-subtitle
          class="title"
          style="color: red"
          v-if="getSheetByResourceId(resource.id)"
        >
          {{ getSheetByResourceId(resource.id).name }}</v-list-item-subtitle
        >
        <v-list-item-subtitle class="title">{{
          resource.name
        }}</v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-avatar tile size="80" color="red">
        <v-icon large color="white">
          {{ getIcon(resource) }}
        </v-icon>
      </v-list-item-avatar>
    </v-list-item>
    <v-card-text v-html="resource.description"></v-card-text>
    <v-alert
      v-if="resource.html != undefined"
      color="#2A3B4D"
      dark
      icon="mdi-language-html5"
      dense
    >
      <code>
        <div v-for="line in html_escape(resource.html)" :key="line">
          {{ line }}
        </div>
      </code>
    </v-alert>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Header",
  props: {
    resource: {
      type: Object,
    },
  },
  mounted() {
    console.log("-->>" + this.resource.html);
  },
  methods: {
    getIcon(resource) {
      let icon;
      switch (resource.type) {
        case "video":
          icon = "mdi-video";
          break;
        case "code":
          switch (resource.subtype) {
            case "blank":
              icon = "mdi-text-box-outline";
              break;
            case "skeleton":
              icon = "mdi-text-box-plus-outline";
              break;
            case "buggy":
              icon = "mdi-bug";
              break;
            case "quiz":
              icon = "mdi-head-question-outline";
              break;
            default:
              icon = "mdi-code-json";
              break;
          }
          break;
        case "sheet":
          icon = "mdi-nodejs";
          break;
        case "quiz":
          icon = "mdi-head-question-outline";
          break;
        case "pdf":
          icon = "mdi-file-pdf";
          break;
        default:
          break;
      }
      return icon;
    },
    html_escape(html_str) {
      const lines = html_str.split("\n");
      return lines;
    },
  },
  computed: {
    ...mapGetters(["getModuleByResourceId", "getSheetByResourceId"]),
  },
};
</script>

<style></style>
