<template>
  <div id="header" class="text-left">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title :class="getTitleClass(screenSize)">
          <!--Student + Viewer-->
          <div v-if="isStudent || isViewer">
            {{ getModuleByResourceId(resource.strapiId, resource.contentType).internalId }}.
            {{ getModuleByResourceId(resource.strapiId, resource.contentType).name }}
          </div>
          <!--Author-->
          <Editable v-if="isAuthor" :type="'module'" :field="'name'" :placeholder="'Module Name'"
            :value="getModuleByResourceId(resource.strapiId, resource.contentType).name"
            :id="getModuleByResourceId(resource.strapiId, resource.contentType).strapiId" 
            @input="editableInput">
          </Editable>
        </v-list-item-title>

        <v-list-item-subtitle v-if="resource.contentType != 'lesson'" :class="getSubtitleClass(screenSize)">
          <!--Student + Viewer-->
          <div v-if="isStudent || isViewer">
            {{ getLessonByResourceId(resource.strapiId).name }}
          </div>
          <!--Author-->
          <Editable v-if="isAuthor" :type="'lesson'" :field="'name'" placeholder="Lesson name"
            :value="getLessonByResourceId(resource.strapiId).name" 
            :id="getLessonByResourceId(resource.strapiId).strapiId"
            @input="editableInput">
          </Editable>
        </v-list-item-subtitle>

        <v-list-item-subtitle :class="getSubtitleClass(screenSize)">
          <!--Student + Viewer-->
          <div v-if="isStudent || isViewer">
            {{ resource.name }}
          </div>
          <!--Author-->
          <Editable v-if="isAuthor && resource.contentType == 'lesson'" placeholder="Lesson name" :type="'lesson'"
            :value="resource.name" :id="resource.strapiId" :field="'name'" @input="editableInput"></Editable>
          <Editable v-if="isAuthor && resource.contentType != 'lesson'" placeholder="Exercise name" :type="'evaluative'"
            :value="resource.name" :id="resource.strapiId" :field="'name'" @input="editableInput"></Editable>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-avatar tile :size="getAvatarMediumSize(screenSize)" color="red">
        <v-icon color="white" :size="getIconBigSize(screenSize)">
          {{ getIcon(resource) }}
        </v-icon>
      </v-list-item-avatar>
    </v-list-item>

    <!--Student + Viewer-->
    <v-card-text :class="getSmallTextClass(screenSize)" v-if="resource.description && (isStudent || isViewer)" v-html="resource.description"></v-card-text>
    <!--Author-->
    <v-card-text v-if="resource.contentType == 'lesson' && isAuthor" :class="getSmallTextClass(screenSize)">
      <Editable :type="'lesson'" placeholder="Lesson description" :value="resource.description" :id="resource.strapiId"
        :field="'description'" @input="editableInput" />
    </v-card-text>
    
    <!--Student + Viewer-->
    <v-card-text :class="getSmallTextClass(screenSize)" v-if="resource.statement && (isStudent || isViewer)" v-html="resource.statement"></v-card-text>
    <!--Author-->
    <v-card-text v-if="resource.contentType == 'code' && isAuthor" :class="getSmallTextClass(screenSize)">
      <Editable placeholder="Exercise statement" :type="'evaluative'" :value="resource.statement" :id="resource.strapiId"
        :field="'statement'" @input="editableInput" />
    </v-card-text>

    <v-card-text v-if="resource.contentType == 'quiz'"></v-card-text>

    <!--<v-alert v-if="resource.html != undefined" color="#2A3B4D" dark icon="mdi-language-html5" dense>
      <code>
        <div v-for="line in html_escape(resource.html)" :key="line">
          {{ line }}
        </div>
      </code>
    </v-alert>-->
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
    },
    screenSize: {
      type: String,
      default: () => ""
    }
  },

  components: {
    Editable
  },

  computed: {
    ...mapGetters([
      "getModuleByResourceId", "getLessonByResourceId", "getRole",
      "getTitleClass", "getSubtitleClass", "getIconBigSize", "getAvatarMediumSize",
      "getSmallTextClass"
    ]),
    isStudent() {
      return this.getRole == "student";
    },
    isTeacher() {
      return this.getRole == "teacher" || this.getRole == "author" || this.getRole == "viewer";
    },
    isAuthor() {
      return this.getRole == "author" 
    },
    isViewer() {
      return this.getRole == "viewer";
    }
  },

  methods: {
    ...mapMutations(["editableInput"]),
    getIcon(resource) {
      let icon;
      switch (resource.contentType) {
        case "code":
          switch (resource.type) {
            case "blank":
              icon = "mdi-text-box-outline";
              break;
            case "skeleton":
              icon = "mdi-text-box-plus-outline";
              break;
            case "buggy":
              icon = "mdi-bug";
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
    /*html_escape(html_str) {
      const lines = html_str.split("\n");
      return lines;
    },*/
  }
};
</script>

<style></style>
