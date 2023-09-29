<template>
  <div id="header" class="text-left">
    <v-list-item 
      :class="!isMDsmaller ? 'px-4' : isMD ? 'px-2' : 'px-4'" 
      class="align-start"
    >
      <v-btn 
        @click="backToSheet"
        color="error" 
        class="mt-2 mr-3" 
        style="height:68px; width:10px" min-width="10px" 
        v-if="resource.contentType != 'lesson'"
      >
          <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
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
        <v-list-item-subtitle :class="getSubtitleClass" v-if="resource.contentType =='lesson'">
          <div v-if="(isStudent || isViewer) && resource.contentType=='lesson'">
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
          />
        </v-list-item-subtitle>

        
        <!--
        <v-list-item-subtitle :class="getSubtitleClass">

          <div v-if="(isStudent || isViewer) && resource.contentType=='lesson'">
            {{ resource.internalId }}.
            {{ resource.name }}
          </div>
          <div v-if="(isStudent || isViewer) && resource.contentType!='lesson'">
            {{ resource.name }}
          </div>
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
        </v-list-item-subtitle>-->
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

    <v-card-text class="pa-0" v-if="resource.contentType!='lesson'">
      <v-list-item :class="!isMDsmaller ? 'px-4' : isMD ? 'px-2' : 'px-4'" style="min-height:0px">
        <v-list-item-content class="pb-2 pt-0">
          <v-list-item-subtitle :class="getSubtitleClass">
            <!--Student + Viewer-->
            <div v-if="(isStudent || isViewer)">
              {{ resource.name }}
            </div>
            <!--Author-->
            <Editable
              v-if="isAuthor"
              placeholder="Exercise name"
              type="evaluative"
              :value="resource.name"
              :id="resource.id"
              field="name"
              @input="editableInput"
            />
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card-text>

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
      <v-sheet class="mb-2 mt-n4 rounded-lg" :color="openChat ? '#74AA9C' : ''">
        <div style="font-size: 14px;" class="text-center pt-1" v-if="openChat">
          Describe the Exercise you want to generate.
        </div>
        <div class="d-flex align-center px-1">
          <v-avatar
            color="#74AA9C"
            size="40"
            class="elevation-1 gptAvater mr-1"
            @click="openChat = !openChat"
          >
            <img
              :src="require('@/assets/chatgptLogo.png')"
              contain
              height="10px" 
              class="pa-1"
            >          
          </v-avatar>
          <div v-if="openChat" class="flex-grow-1">
            <v-textarea
              v-model="chat"
              dense
              auto-grow
              rows="1"
              outlined
              hide-details
              full-width
              style="font-size: 12px; line-height: 0.5"
            ></v-textarea>
          </div>
        </div>
        <div v-if="openChat">
          <v-btn text width="100%" @click="generateExercise">Generate</v-btn>
        </div>
      </v-sheet>
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
import { bus } from "@/main.js";

import { mapGetters, mapMutations, mapActions } from "vuex";
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
      openChat:false,
      chat:"",

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
    ...mapActions("main", ["generateProgrammingEx"]),
    /*html_escape(html_str) {
      const lines = html_str.split("\n");
      return lines;
    },*/
    backToSheet() {
      const lesson = this.getLessonByResourceId(this.resource.id);
      bus.$emit("changeIt", [lesson.id, lesson.contentType]);
    },
    generateExercise(){
      this.generateProgrammingEx([this.chat, this.resource.id])
    },
  },
};
</script>

<style scoped>
.gptAvater:hover{
  cursor: pointer;
}

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
