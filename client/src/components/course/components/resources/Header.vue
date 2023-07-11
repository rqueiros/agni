<template>
  <div id="header" class="text-left">
    <v-list-item 
      :class="!isMDsmaller ? 'px-4' : isMD ? 'px-2' : 'px-4'" 
      class="align-start"
    >
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
            type="module"
            field="name"
            placeholder="Module Name"
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
          <div v-if="isStudent || isViewer" class="red--text text--lighten-1">
            {{ getLessonByResourceId(resource.id).internalId }}.
            {{ getLessonByResourceId(resource.id).name }}
          </div>
          <!--Author-->
          <Editable
            v-if="isAuthor"
            type="lesson"
            field="name"
            placeholder="Lesson name"
            :value="getLessonByResourceId(resource.id).name"
            :id="getLessonByResourceId(resource.id).id"
            @input="editableInput"
          />
        </v-list-item-subtitle>

        <v-list-item-subtitle :class="getSubtitleClass">
          <!--Student + Viewer-->
          <div v-if="(isStudent || isViewer) && resource.contentType=='lesson'">
            {{ resource.internalId }}.
            {{ resource.name }}
          </div>
          <div v-if="(isStudent || isViewer) && resource.contentType!='lesson'">
            {{ resource.name }}
          </div>
          <!--Author-->
          <Editable
            v-if="isAuthor && resource.contentType == 'lesson'"
            placeholder="Lesson name"
            type="lesson"
            :value="resource.name"
            :id="resource.id"
            field="name"
            @input="editableInput"
          />
          <Editable
            v-if="isAuthor && resource.contentType != 'lesson'"
            placeholder="Exercise name"
            type="evaluative"
            :value="resource.name"
            :id="resource.id"
            field="name"
            @input="editableInput"
          />
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-avatar 
        tile 
        :size="getAvatarMediumSize" 
        color="red" 
        class="align-self-start"
      >
        <v-icon color="white" :size="getIconBigSize">
          {{ resource.contentType=="code" ? 
          getIcon(resource.type) : getIcon(resource.contentType) }}
        </v-icon>
      </v-list-item-avatar>
    </v-list-item>

    <!--Student + Viewer-->
    <v-card-text
      v-if="resource.description && (isStudent || isViewer)"
      :class="!isMDsmaller ? 'px-4 '+ getSmallTextClass
        : isMD ? 'px-2 '+ getSmallTextClass : 'px-4 '+ getSmallTextClass" 
      v-html="resource.description"
    ></v-card-text>
    <!--Author-->
    <v-card-text
      v-if="resource.contentType == 'lesson' && isAuthor"
      :class="!isMDsmaller ? 'px-4 '+getSmallTextClass
        : isMD ? 'px-2 '+ getSmallTextClass : 'px-4 '+ getSmallTextClass" 
    >
      <Editable
        type="lesson"
        placeholder="Lesson description"
        :value="resource.description"
        :id="resource.id"
        field="description"
        @input="editableInput"
      />
    </v-card-text>

    <!--Student + Viewer-->
    <v-card-text
      v-if="resource.statement && (isStudent || isViewer)"
      :class="!isMDsmaller ? 'px-4 '+getSmallTextClass
        : isMD ? 'px-2 '+ getSmallTextClass : 'px-4 '+ getSmallTextClass" 
      v-html="resource.statement"
    ></v-card-text>
    <!--Author-->
    <v-card-text
      v-if="resource.contentType == 'code' && isAuthor"
      :class="!isMDsmaller ? 'px-4 '+getSmallTextClass
        : isMD ? 'px-2 '+ getSmallTextClass : 'px-4 '+ getSmallTextClass" 
    >
      <!--
      <Editable
        placeholder="Exercise statement"
        type="evaluative"
        :value="resource.statement"
        :id="resource.id"
        field="statement"
        @input="editableInput"
      />-->
      <vue-editor 
        v-model="resource.statement" 
        style="background-color: rgb(226, 226, 226); border-radius: 8px;"
        :editor-toolbar="customToolbar"
        placeholder="Evaluative statement"
      />
    </v-card-text>

    <!--<v-alert v-if="resource.html != undefined" color="#2A3B4D" 
      dark icon="mdi-language-html5" dense>
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

import { VueEditor } from "vue2-editor";


export default {
  name: "Header",

  props: {
    resource: {
      type: Object
    }
  },

  components: {
    Editable,
    VueEditor
  },

  data() {
    return {
      customToolbar: [
        ["bold", "italic", "underline"],
        [
          { align: "" },
          { align: "center" },
        ],
        ["code-block"],
        [{ list: "bullet" }],
        [{ color: [] }, { background: [] }],
      ],
    }
  },

  computed: {
    ...mapGetters("main",[
      "getModuleByResourceId",
      "getLessonByResourceId",
      "isStudent",
      "isTeacher",
      "isAuthor",
      "isViewer",
    ]),
    ...mapGetters("style",[
      "getTitleClass",
      "getSubtitleClass",
      "getIconBigSize",
      "getAvatarMediumSize",
      "getSmallTextClass",
      "isMDsmaller",
      "isMD",
      "getIcon"
    ])
  },

  watch: {
    "resource.statement"(value) {
      const obj2 = {
        id: this.resource.id,
        value: value,
        field: "statement",
        type: "evaluative"
      };
      this.editableInput(obj2);
    },
  },

  methods: {
    ...mapMutations("main",["editableInput"]),
    /*html_escape(html_str) {
      const lines = html_str.split("\n");
      return lines;
    },*/
  }
};
</script>

<style scoped>
/* Text editor */
#header>>>.ql-toolbar.ql-snow{
  border:none;
  border-bottom: 1px solid #ccc;
}
#header>>>.ql-container.ql-snow{
  border:none;
}
#header>>>.ql-editor{
  font-size:0.75rem;
  min-height: 100px;
}
#header>>>.quillWrapper .ql-snow.ql-toolbar .ql-formats{
  margin-bottom:2px;
}
#header>>>.quillWrapper .ql-snow.ql-toolbar{
  padding-top:4px;
  padding-bottom:4px
}
</style>
