<template>
  <div id="header" class="text-left">
    <v-list-item :class="!isMDsmaler ? 'px-4' : isMD ? 'px-2' : 'px-4'" class="align-start">
      <v-list-item-content class="py-2">
        <v-list-item-title :class="getTitleClass">
          <!--Student + Viewer-->
          <div v-if="isStudent || isViewer">
            {{
              getModuleByResourceId(resource.id, resource.contentType)
                .internalId
            }}.
            {{
              getModuleByResourceId(resource.id, resource.contentType)
                .name
            }}
          </div>
          <!--Author-->
          <Editable
            v-if="isAuthor"
            :type="'module'"
            :field="'name'"
            :placeholder="'Module Name'"
            :value="
              getModuleByResourceId(resource.id, resource.contentType)
                .name
            "
            :id="
              getModuleByResourceId(resource.id, resource.contentType)
                .id
            "
            @input="editableInput"
          />
        </v-list-item-title>

        <v-list-item-subtitle
          v-if="resource.contentType != 'lesson'"
          :class="getSubtitleClass"
        >
          <!--Student + Viewer-->
          <div v-if="isStudent || isViewer">
            {{ getLessonByResourceId(resource.id).name }}
          </div>
          <!--Author-->
          <Editable
            v-if="isAuthor"
            :type="'lesson'"
            :field="'name'"
            placeholder="Lesson name"
            :value="getLessonByResourceId(resource.id).name"
            :id="getLessonByResourceId(resource.id).id"
            @input="editableInput"
          />
        </v-list-item-subtitle>

        <v-list-item-subtitle :class="getSubtitleClass">
          <!--Student + Viewer-->
          <div v-if="isStudent || isViewer">
            {{ resource.name }}
          </div>
          <!--Author-->
          <Editable
            v-if="isAuthor && resource.contentType == 'lesson'"
            placeholder="Lesson name"
            :type="'lesson'"
            :value="resource.name"
            :id="resource.id"
            :field="'name'"
            @input="editableInput"
          />
          <Editable
            v-if="isAuthor && resource.contentType != 'lesson'"
            placeholder="Exercise name"
            :type="'evaluative'"
            :value="resource.name"
            :id="resource.id"
            :field="'name'"
            @input="editableInput"
          />
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-avatar tile :size="getAvatarMediumSize" color="red" class="align-self-start">
        <v-icon color="white" :size="getIconBigSize">
          {{ getIcon(resource) }}
        </v-icon>
      </v-list-item-avatar>
    </v-list-item>

    <!--Student + Viewer-->
    <v-card-text
      v-if="resource.description && (isStudent || isViewer)"
      :class="getSmallTextClass"
      v-html="resource.description"
    ></v-card-text>
    <!--Author-->
    <v-card-text
      v-if="resource.contentType == 'lesson' && isAuthor"
      :class="getSmallTextClass"
    >
      <Editable
        :type="'lesson'"
        placeholder="Lesson description"
        :value="resource.description"
        :id="resource.id"
        :field="'description'"
        @input="editableInput"
      />
    </v-card-text>

    <!--Student + Viewer-->
    <v-card-text
      v-if="resource.statement && (isStudent || isViewer)"
      :class="getSmallTextClass"
      v-html="resource.statement"
    ></v-card-text>
    <!--Author-->
    <v-card-text
      v-if="resource.contentType == 'code' && isAuthor"
      :class="getSmallTextClass"
    >
      <Editable
        placeholder="Exercise statement"
        :type="'evaluative'"
        :value="resource.statement"
        :id="resource.id"
        :field="'statement'"
        @input="editableInput"
      />
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
import Editable from "../../../gerneral/Editable.vue";

export default {
  name: "Header",

  props: {
    resource: {
      type: Object
    }
  },

  components: {
    Editable
  },

  computed: {
    ...mapGetters([
      "getModuleByResourceId",
      "getLessonByResourceId",
      "getTitleClass",
      "getSubtitleClass",
      "getIconBigSize",
      "getAvatarMediumSize",
      "getSmallTextClass",
      "isStudent",
      "isTeacher",
      "isAuthor",
      "isViewer",
      "isMDsmaler",
      "isMD"
    ])
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
    }
    /*html_escape(html_str) {
      const lines = html_str.split("\n");
      return lines;
    },*/
  }
};
</script>

<style></style>
