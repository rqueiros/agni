<template>
  <v-list-item>
    <v-btn
      @click="backToSheet"
      color="error"
      class="mr-3"
      style="height:55px; width:10px"
      min-width="10px"
      v-if="evaluative"
    >
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-list-item-content>
      <v-list-item-title v-if="lesson || evaluative" :class="getTitleClass">
        <div v-if="isStudent || isViewer">
          {{
            getModuleByResourceID(resource.id, resource.contentType).internalId
          }}.
          {{ getModuleByResourceID(resource.id, resource.contentType).name }}
        </div>
        <Editable
          v-if="isAuthor"
          type="module"
          field="name"
          placeholder="Module Name"
          :value="getModuleByResourceID(resource.id, resource.contentType).name"
          :id="getModuleByResourceID(resource.id, resource.contentType).id"
          @input="editableInput"
          :required="true"
        />
      </v-list-item-title>
      <v-list-item-title v-else :class="getTitleClass">
        {{ title }}
      </v-list-item-title>

      <v-list-item-subtitle
        v-if="lesson || evaluative"
        :class="getSubtitleClass"
      >
        <div v-if="evaluative">
          <div v-if="isStudent || isViewer" class="red--text text--lighten-1">
            {{ getLessonByResourceID(resource.id).internalId }}.
            {{ getLessonByResourceID(resource.id).name }}
          </div>
          <!--Author-->
          <Editable
            v-if="isAuthor"
            type="lesson"
            field="name"
            placeholder="Lesson name"
            :value="getLessonByResourceID(resource.id).name"
            :id="getLessonByResourceID(resource.id).id"
            @input="editableInput"
            :required="true"
          />
        </div>
        <div v-if="lesson">
          <div v-if="isStudent || isViewer" class="red--text text--lighten-1">
            {{ resource.internalId }}.
            {{ resource.name }}
          </div>
          <Editable
            v-if="isAuthor"
            placeholder="Lesson name"
            type="lesson"
            :value="resource.name"
            :id="resource.id"
            field="name"
            @input="editableInput"
            :required="true"
          />
        </div>
      </v-list-item-subtitle>
      <v-list-item-subtitle :class="getSmallTextClass">
        {{ subtitle }}
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-avatar
      tile
      :color="color"
      class="box"
      :size="getAvatarMediumSize"
    >
      <v-icon color="white" class="box_icon">
        {{ icon }}
      </v-icon>
    </v-list-item-avatar>
  </v-list-item>
</template>

<script>
import { bus } from "@/main.js";

import { mapGetters, mapActions } from "vuex";
import Editable from "../../gerneral/Editable.vue";

export default {
  props: {
    title: {
      type: String,
      default: () => null,
    },
    subtitle: {
      type: String,
      default: () => null,
    },
    icon: {
      type: String,
      default: () => null,
    },
    color: {
      type: String,
      default: () => null,
    },
    lesson: {
      type: Boolean,
      default: () => false,
    },
    evaluative: {
      type: Boolean,
      default: () => false,
    },
    editable: {
      type: Boolean,
      default: () => false,
    },
    resource: {
      type: Object,
      default: () => null,
    },
  },

  components: {
    Editable,
  },

  data() {
    return {
      generateWaiting: false,

      valid: true,

      openChat: false,
      chat: "",

      customToolbar: [
        ["bold", "italic", "underline"],
        [{ align: "" }, { align: "center" }],
        ["code-block"],
        [{ list: "bullet" }],
        [{ color: [] }, { background: [] }],
      ],
    };
  },

  computed: {
    ...mapGetters("main", ["getModuleByResourceID", "getLessonByResourceID"]),
    ...mapGetters("request", [
      "isStudent",
      "isTeacher",
      "isAuthor",
      "isViewer",
    ]),
    ...mapGetters("style", [
      "getTitleClass",
      "getSubtitleClass",
      "getAvatarMediumSize",
      "getSmallTextClass",
      "getIcon",
    ]),
  },

  watch: {
    "resource.statement"(value) {
      const obj2 = {
        id: this.resource.id,
        value: value,
        field: "statement",
        type: "evaluative",
      };
      this.editableInput(obj2);
    },
  },

  methods: {
    ...mapActions("main", ["editableInput"]),
    backToSheet() {
      const lesson = this.getLessonByResourceID(this.resource.id);
      bus.$emit("changeIt", [lesson.id, lesson.contentType]);
    },
  },
};
</script>
