<template>
  <div class="header">
    <!--STATEMENT-->
    <v-list-item>
      <v-list-item-content>

        <v-list-item-title class="resource_title">
          <!---------------------Student--------------------------------------->
          <div v-if="isStudent">
            {{ getModuleByResourceId(resource.strapiId, resource.contentType).internalId }}.
            {{ getModuleByResourceId(resource.strapiId, resource.contentType).name }}
          </div>
          <!---->
          <!---------------------Teacher--------------------------------------->
          <Editable v-if="isTeacher" :type="'module'"
            :value="getModuleByResourceId(resource.strapiId, resource.contentType).name"
            :id="getModuleByResourceId(resource.strapiId, resource.contentType).strapiId" :field="'name'"
            @input="editableChange"></Editable>
          <!---->
        </v-list-item-title>

        <v-list-item-subtitle class="resource_subtitle">
          <!---------------------Student--------------------------------------->
          <div v-if="isStudent">
            {{ resource.name }}
          </div>
          <!---->
          <!---------------------Teacher--------------------------------------->
          <Editable v-if="isTeacher" :type="'lesson'" :value="resource.name" :id="resource.strapiId" :field="'name'"
            @input="editableChange"></Editable>
          <!---->
        </v-list-item-subtitle>

      </v-list-item-content>
      <v-list-item-avatar tile class="box" color="red">
        <v-icon large color="white" class="box_icon">
          {{ getIcon(resource) }}
        </v-icon>
      </v-list-item-avatar>
    </v-list-item>

    <!---------------------Student--------------------------------------------->
    <v-card-text class="resource_text" v-if="resource.description && isStudent"
      v-html="resource.description"></v-card-text>
    <v-card-text v-if="resource.statement" v-html="resource.statement"></v-card-text>
    <v-alert v-if="resource.html != undefined" color="#2A3B4D" dark icon="mdi-language-html5" dense>
      <code>
          <div v-for="line in html_escape(resource.html)" :key="line">
            {{ line }}
          </div>
        </code>
    </v-alert>
    <!---->
    <!---------------------Teacher--------------------------------------------->
    <v-card-text v-if="resource.description && isTeacher">
      <Editable :type="'lesson'" :value="resource.description"
        :id="resource.strapiId" :field="'description'" @input="editableChange" />
    </v-card-text>
    <v-card-text v-if="resource.statement && isTeacher">
      <Editable :type="'evaluative'" :value="resource.statement"
        :id="resource.strapiId" :field="'statement'" @input="editableChange" />
    </v-card-text>
    <!---->

  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import Editable from "../../../../components/Editable.vue";

export default {
  name: "Header",

  props: {
    resource: {
      type: Object
    }
  },

  components: {
    Editable,
  },

  data: () => ({
    role: "",
  }),

  created() {
    this.role = this.getRole
  },

  computed: {
    ...mapGetters(["getModuleByResourceId", "getSheetByResourceId", "getRole"]),
    isStudent() {
      return this.role == "student"
    },
    isTeacher() {
      return this.role == "teacher"
    }
  },

  methods: {
    ...mapMutations(["editableInput"]),
    getIcon(resource) {
      let icon;
      switch (resource.contentType) {
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
        case "quiz":
          icon = "mdi-head-question-outline";
          break;
        case "lesson":
          icon = "mdi-nodejs";
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
    editableChange(obj) {
      this.editableInput(obj)
    },
  }
};
</script>

<style></style>
