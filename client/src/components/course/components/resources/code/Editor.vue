<template>
  <div id="editor">
    <v-card-text>
      <div class="pb-2 text-subtitle-1 font-weight-medium">
        <Editable
          v-if="isAuthor"
          :type="'evaluative'"
          :value="resource.name"
          :id="resource.id"
          placeholder="Evaluative name"
          :field="'name'"
          @input="editableInput"
          onclick="event.stopPropagation()"
        />
        <span v-if="isViewer || isStudent">
          {{ resource.name }}
        </span>
      </div>

      <div class="pb-2">
        <div
          v-if="resource.statement && (isStudent || isViewer)"
          v-html="resource.statement"
        ></div>
        <div v-if="isAuthor">
          <vue-editor
            v-model="resource.statement"
            style="border-radius: 8px;"
            :style="{ backgroundColor: $vuetify.theme.currentTheme.editable }"
            :editor-toolbar="customToolbar"
            placeholder="Evaluative statement"
          />
        </div>
      </div>

      <div class="flex">
        <vue-cascader-select
          class="black--text"
          :options="options"
          @select="(selected) => setType(resource.id, selected.value)"
          :value="resource.type != null ? resource.type : ''"
          v-if="isAuthor"
          style="width: fit-content"
          :style="valid ? 'border: 2px solid red; border-radius: 6px' : ''"
        />
        <v-select
          v-if="isAuthor"
          v-model="languages"
          :items="languageOptions"
          multiple
          persistent-hint
          outlined
          dense
          item-title="name"
        ></v-select>
        <div v-if="isViewer" class="w-full">Type: {{ resource.type }}</div>

        <v-select
          v-if="isStudent"
          color="error"
          item-color="error"
          v-model="language"
          :items="languageOptions"
          persistent-hint
          outlined
          dense
        ></v-select>
      </div>
    </v-card-text>

    <div>
      <v-card
        v-if="isTeacher"
        outlined
        class="d-flex align-center justify-center"
        height="32px"
      >
        Solution
      </v-card>
      <AceEditor
        ref="myEditor"
        v-model="code"
        lang="javascript"
        theme="ambiance"
        width="100%"
        height="20rem"
        :options="editorOp"
        :commands="com"
        @init="editorInit"
        @onchange="editorChange"
      />
    </div>

    <div class="py-2" v-if="isTeacher">
      <v-btn
        width="100%"
        v-if="isAuthor && !showSkeleton && !hasSkeleton"
        @click="showSkeleton = true"
        height="36px"
        color="button"
      >
        <v-icon>mdi-plus</v-icon>Skeleton
      </v-btn>
      <div v-if="showSkeleton || hasSkeleton">
        <v-card
          height="32px"
          outlined
          class="d-flex align-center justify-center"
        >
          Skeleton
          <v-btn
            v-if="isAuthor"
            icon
            @click="deleteSkeleton"
            :x-small="getButtonSmallSize == 'x-small'"
            :small="getButtonSmallSize == 'small'"
            style="position:absolute; top:auto; right: 8px;"
          >
            <v-icon :size="getIconSmallSize">mdi-delete</v-icon>
          </v-btn>
        </v-card>
        <AceEditor
          ref="skeleton"
          v-model="code1"
          @init="editorInit"
          @onchange="editorChange"
          lang="javascript"
          theme="ambiance"
          width="100%"
          height="10rem"
          :options="editorOp"
          :commands="com"
        />
      </div>
    </div>

    <div class="pt-2 pb-4" v-if="isTeacher">
      <v-card
        flat
        outlined
        class="d-flex align-center"
        style="border-left: 0; border-right: 0;"
      >
        <v-btn
          width="100%"
          v-if="isAuthor && !contextLen"
          @click="addContextByEvaluativeID(resource.id)"
          color="button"
        >
          <v-icon>mdi-plus</v-icon>Context
        </v-btn>
        <v-layout column>
          <v-app-bar flat color="white" class="pa-0" rounded height="32">
            <v-tabs
              style="width:calc(100% - 40px)"
              center-active
              v-model="tab"
              color="error"
              grow
              show-arrows
              hide-slider
            >
              <v-tab
                v-for="(item, i) in resource.contexts"
                :key="i"
                style="width:100px"
                :class="getSmallTextClass"
              >
                <!--Student & Viewer-->
                <span v-if="isStudent || isViewer">
                  {{ item.name }}
                </span>

                <span v-if="isAuthor" class="d-flex align-center">
                  <Editable
                    :type="'context'"
                    :value="item.name"
                    :id="item.id"
                    placeholder="Context name"
                    :field="'name'"
                    @input="editableInput"
                    onclick="event.stopPropagation()"
                  />
                  <v-btn
                    v-if="isAuthor"
                    icon
                    :x-small="getButtonSmallSize == 'x-small'"
                    :small="getButtonSmallSize == 'small'"
                    onclick="event.stopPropagation()"
                    @click="deleteCont(item.id)"
                  >
                    <v-icon :size="getIconSmallSize">
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </span>
              </v-tab>
            </v-tabs>

            <!--Author-->
            <v-btn
              v-if="contextLen"
              min-width="0"
              width="32px"
              height="28px"
              class="ma-1"
              @click="addContextByEvaluativeID(resource.id)"
              :small="getButtonMediumSize == 'small'"
              :medium="getButtonMediumSize == 'medium'"
              color="button"
            >
              <v-icon> mdi-plus </v-icon>
            </v-btn>
          </v-app-bar>

          <v-tabs-items v-model="tab">
            <v-tab-item v-for="(item, i) in resource.contexts" :key="i">
              <AceEditor
                ref="context"
                v-model="code2"
                @init="editorInit"
                @onchange="editorChange"
                v-if="contextLen"
                theme="ambiance"
                width="100%"
                height="10rem"
                :options="editorOp"
                :commands="com"
              />
            </v-tab-item>
          </v-tabs-items>
        </v-layout>
      </v-card>
    </div>

    <span v-if="isStudent" class="caption ml-2" :class="isMD ? 'ml-2' : 'ml-4'">
      (autosave each 10 seconds)
    </span>

    <v-card-actions v-if="isStudent" class="d-flex flex-wrap">
      <!--
      <v-btn 
        color="error" 
        class="mb-2" 
        @click="backToSheet" 
        :small="getButtonMediumSize=='small'"
        :medium="getButtonMediumSize=='medium'"
      >
        BACK TO SHEET<v-icon right dark> mdi-autorenew </v-icon>
      </v-btn>-->
      <v-btn
        color="success"
        class="mb-2"
        @click="dataSumit"
        :disabled="statusSaveButton"
        :small="getButtonMediumSize == 'small'"
        :medium="getButtonMediumSize == 'medium'"
      >
        SAVE
        <pre>(Ctrl+S)</pre>
        <v-icon right dark> mdi-content-save </v-icon>
      </v-btn>
      <v-btn
        color="primary"
        dark
        class="mb-2"
        @click="getTeachersCode"
        :small="getButtonMediumSize == 'small'"
        :medium="getButtonMediumSize == 'medium'"
      >
        TEACHER'S CODE<v-icon right dark> mdi-account-switch </v-icon>
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
//import PythonTranspiler from '/osiris/bundle.js';
//import PythonTranspiler from '@/assets/osiris/bundle.js';
//import PythonTranspiler from './osiris/src/dist/bundle.js';

/*
const script = document.createElement('script');
script.src = '/osiris/bundle.js';
script.onload = () => {
  console.log("Bundle loaded:", window.PythonTranspiler); // Debugging
  if (window.PythonTranspiler) {
    const pythonTranspiler = new window.PythonTranspiler("python", true);
  } else {
    console.error("PythonTranspiler is undefined.");
  }
};
document.body.appendChild(script);*/

/* global JSHINT */
import { bus } from "@/main.js";

import { html2dom } from "@/assets/utils/html2dom.js";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import AceEditor from "vuejs-ace-editor";
import { mapActions, mapGetters } from "vuex";

import Editable from "../../../../gerneral/Editable.vue";

import Vue from "vue";
import VueCascaderSelect from "vue-cascader-select";
Vue.use(VueCascaderSelect);
import { VueEditor } from "vue2-editor";

// TODO: implement a previous/next navigation in the editor component

export default {
  name: "Editor",

  props: {
    resource: {
      type: Object,
      default: () => null,
    },
    isEvaluative: {
      type: Boolean,
      default: () => false,
    },
  },

  components: {
    AceEditor,
    VueCascaderSelect,
    Editable,
    VueEditor,
  },

  data() {
    return {
      content: "<h1>Some initial content</h1>",
      customToolbar: [
        ["bold", "italic", "underline"],
        [{ align: "" }, { align: "center" }],
        ["code-block"],
        [{ list: "bullet" }],
        [{ color: [] }, { background: [] }],
      ],

      tab: 0,
      code: "",
      code1: "",
      code2: "",

      saveHandler: "",
      saveHandler2: "",
      statusSaveButton: false,
      statusResetButton: false,
      mapDetector: [],
      originalLog: "",

      showSkeleton: false,
      hasSkeleton: false,
      contextDeleted: false,

      languages: [],
      language: "",

      options: [
        { label: "blank", value: "blank" },
        { label: "skeleton", value: "skeleton" },
        { label: "buggy", value: "buggy" },
      ],
      languageOptions: ["JavaScript", "Python"],
      editorOp: {
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        fontSize: 17,
        highlightActiveLine: true,
        enableSnippets: true,
        enableEmmet: true,
        showLineNumbers: true,
        tabSize: 2,
        showPrintMargin: false,
        showGutter: true,
      },
      com: [
        {
          name: "save",
          bindKey: { win: "Ctrl-s", mac: "Command-s" },
          exec: this.dataSumit,
          readOnly: true,
        },
      ],
    };
  },

  watch: {
    "resource.skeleton"(value) {
      if (value.length > 0) {
        this.hasSkeleton = true;
      } else {
        this.hasSkeleton = false;
      }
    },
    tab(newV, oldV) {
      if (newV != undefined && !this.contextDeleted) {
        this.saveContext(this.resource.contexts[oldV].id, this.code2);
        this.code2 = this.resource.contexts[newV].text;
      } else if (this.contextDeleted) {
        this.code2 = this.resource.contexts[newV].text;
        this.contextDeleted = false;
      }
    },
    "resource.solution"(value) {
      this.code = value;
    },
    "resource.statement"(value) {
      const obj2 = {
        id: this.resource.id,
        value: value,
        field: "statement",
        type: "evaluative",
      };
      this.editableInput(obj2);
    },
    languages(value) {
      const obj = {
        id: this.resource.id,
        value: value,
        field: "languages",
        type: "evaluative",
      };
      this.editableInput(obj);
    },
  },

  beforeDestroy() {
    this.saveDate();
    clearInterval(this.saveHandler);
    clearInterval(this.saveHandler2);
  },

  created() {
    //const abc = require('@/assets/osiris/bundle.js').default || require('@/assets/osiris/bundle.js');

    //console.log(abc)
    //const transpiler = new abc("python", true)

    if (this.isStudent) {
      if (!this.resource.languages || this.resource.languages.length == 0) {
        this.languageOptions = ["JavaScript"];
        this.language = "JavaScript";
      } else if (this.resource.languages) {
        this.languageOptions = this.resource.languages;
        this.language = this.languageOptions[0];
      }

      if (
        this.getStatusByResourceID(this.resource.id).answer[0].code == "" &&
        this.resource.skeleton
      ) {
        this.code = this.resource.skeleton;
      } else if (
        this.getStatusByResourceID(this.resource.id).answer[0].code != ""
      ) {
        this.code = this.getStatusByResourceID(this.resource.id).answer[0].code;
      } else {
        this.code = "";
      }
    } else if (this.isTeacher) {
      this.code = this.resource.solution;
      this.code1 = this.resource.skeleton;
      if (this.resource.languages) {
        this.languages = this.resource.languages;
      }
      if (this.resource.contexts.length > 0) {
        this.code2 = this.resource.contexts[this.tab].text;
      }
    }
    if (
      "skeleton" in this.resource &&
      this.resource.skeleton != null &&
      this.resource.skeleton.length > 0
    ) {
      this.hasSkeleton = true;
    } else {
      this.hasSkeleton = false;
    }
  },

  computed: {
    ...mapGetters("main", [
      "getLessonByResourceID",
      "getStatusByResourceID",
      "getValidated",
    ]),
    ...mapGetters("request", [
      "isStudent",
      "isTeacher",
      "isViewer",
      "isAuthor",
    ]),
    ...mapGetters("style", [
      "getSmallTextClass",
      "getIconBigSize",
      "getIconSmallSize",
      "isMD",
      "getButtonSmallSize",
      "getButtonMediumSize",
      "getSubtitleClass",
      "getSmallTextClass",
    ]),
    contextLen() {
      return this.resource.contexts.length > 0;
    },
    valid() {
      return this.resource.type == null && this.getValidated;
    },
  },

  methods: {
    ...mapActions("request", ["setProgress"]),
    ...mapActions("main", [
      "editableInput",
      "setTeacherProgress",
      "addContextByEvaluativeID",
      "deleteContextByID",
    ]),
    deleteCont(id) {
      this.contextDeleted = true;
      let index = this.resource.contexts.findIndex((c) => c.id == id);
      let verify = this.resource.contexts.length - 1 > index;
      let verify2 = this.tab <= index;
      this.deleteContextByID(id);
      if (verify && verify2) {
        this.code2 = this.resource.contexts[this.tab].text;
      }
    },
    saveContext(id, code) {
      const obj2 = {
        id: id,
        value: code,
        field: "text",
        type: "context",
      };
      this.editableInput(obj2);
    },
    deleteSkeleton() {
      this.showSkeleton = false;
      this.code1 = "";
      const obj = {
        id: this.resource.id,
        value: "",
        field: "skeleton",
        type: "evaluative",
      };
      this.editableInput(obj);
    },
    setType(id, value) {
      const obj = {
        id: id,
        value: value,
        field: "type",
        type: "evaluative",
      };
      this.editableInput(obj);
    },

    backToSheet() {
      const lesson = this.getLessonByResourceID(this.resource.id);
      bus.$emit("changeIt", [lesson.id, lesson.contentType]);
    },
    loadCode() {
      if (this.isStudent) {
        if (
          this.getStatusByResourceID(this.resource.id).answer[0].code == "" &&
          this.resource.skeleton
        ) {
          this.code = this.resource.skeleton;
        } else if (
          this.getStatusByResourceID(this.resource.id).answer[0].code != ""
        ) {
          this.code = this.getStatusByResourceID(
            this.resource.id
          ).answer[0].code;
        } else {
          this.code = "";
        }
      } else if (this.isTeacher) {
        this.code = this.resource.solution.split(" ")[0];
        this.code1 = this.resource.skeleton.split(" ")[0];
      }
    },
    saveDate() {
      const obj = {
        id: this.resource.id,
        value: this.code,
        field: "solution",
        type: "evaluative",
      };
      this.editableInput(obj);
      const obj2 = {
        id: this.resource.id,
        value: this.code1,
        field: "skeleton",
        type: "evaluative",
      };
      this.editableInput(obj2);
      if (this.tab != undefined && this.resource.contexts.length > 0) {
        this.saveContext(this.resource.contexts[this.tab].id, this.code2);
      }
    },
    async dataSumit2(status) {
      //let originalCode = this.code;
      //let originalCode1 = this.code1;

      const errors = [];
      const logs = [];
      this.statusSaveButton = true;
      //this.setProgress({ id: this.resource.id, code: this.code });

      if (this.isStudent) {
        this.setProgress({
          id: this.resource.id,
          data: {
            answer: [{ __component: "solution.code", code: this.code }],
            grade: status,
          },
        });
        const obj = {
          id: this.resource.id,
          value: [{ __component: "solution.code", code: this.code }],
          field: "answer",
          type: "status",
        };
        this.editableInput(obj);
      } else if (this.isTeacher) {
        //this.setTeacherProgress({ id: this.resource.id, code: this.code })
        const obj = {
          id: this.resource.id,
          value: this.code,
          field: "solution",
          type: "evaluative",
        };
        this.editableInput(obj);
        const obj2 = {
          id: this.resource.id,
          value: this.code1,
          field: "skeleton",
          type: "evaluative",
        };
        this.editableInput(obj2);
        if (this.tab != undefined && this.resource.contexts.length > 0) {
          this.saveContext(this.resource.contexts[this.tab].id, this.code2);
        }
      }

      if (this.resource.html) {
        this.code = `
          ${html2dom.parse(this.resource.html)}\n
          ${this.code.replaceAll("document", "docFragment")}
          `;
        //console.log(this.code);
      }
      // 1. Turn off window functions
      window.prompt = (..._args) => {
        console.log("windowPrompt", _args);
      };
      window.confirm = (..._args) => {
        console.log("windowConfirm", _args);
      };
      window.alert = (..._args) => {
        console.log("windowAlert", _args);
      };

      // 2. Replace console.log with stub implementation.
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push({ row: -1, type: "log", text: args });
      };
      const wrapperCode = this.infiniteLoopDetectorWrapper(this.code);
      try {
        eval(wrapperCode);
      } catch (error) {
        const message =
          error.message === "infinite" ? "Infinite loop" : error.message;
        errors.push({
          type: "error",
          row: 1,
          column: 0,
          text: message,
        });
      } finally {
        // Restore original implementation after testing.
        console.log = originalLog;
      }

      // 3. Detect JSHINT errors and warnings
      const options = {
        undef: true,
        unused: true,
        devel: true,
        browser: true,
        esversion: 7,
      };
      JSHINT(this.code, options);
      const jshintEerrors = JSHINT.data().errors;
      if (jshintEerrors) {
        for (const error of jshintEerrors) {
          if (
            !(
              error.evidence.startsWith("function") &&
              error.reason.endsWith("is defined but never used.")
            )
          ) {
            errors.push({
              type: error.code.startsWith("E") ? "error" : "info",
              row: error.line - 1,
              column: 0,
              text: error.reason,
            });
          }
        }
      }
      this.$emit("onErrors", errors);
      this.$emit("onLogs", logs);
    },
    async dataSumit() {
      //let originalCode = this.code;
      //let originalCode1 = this.code1;

      const errors = [];
      const logs = [];
      this.statusSaveButton = true;
      //this.setProgress({ id: this.resource.id, code: this.code });

      if (this.isStudent) {
        this.setProgress({
          id: this.resource.id,
          data: {
            answer: [{ __component: "solution.code", code: this.code }],
          },
        });
        const obj = {
          id: this.resource.id,
          value: [{ __component: "solution.code", code: this.code }],
          field: "answer",
          type: "status",
        };
        this.editableInput(obj);
      } else if (this.isTeacher) {
        //this.setTeacherProgress({ id: this.resource.id, code: this.code })
        const obj = {
          id: this.resource.id,
          value: this.code,
          field: "solution",
          type: "evaluative",
        };
        this.editableInput(obj);
        const obj2 = {
          id: this.resource.id,
          value: this.code1,
          field: "skeleton",
          type: "evaluative",
        };
        this.editableInput(obj2);
        if (this.tab != undefined && this.resource.contexts.length > 0) {
          this.saveContext(this.resource.contexts[this.tab].id, this.code2);
        }
      }

      if (this.resource.html) {
        this.code = `
          ${html2dom.parse(this.resource.html)}\n
          ${this.code.replaceAll("document", "docFragment")}
          `;
        //console.log(this.code);
      }
      // 1. Turn off window functions
      window.prompt = (..._args) => {
        console.log("windowPrompt", _args);
      };
      window.confirm = (..._args) => {
        console.log("windowConfirm", _args);
      };
      window.alert = (..._args) => {
        console.log("windowAlert", _args);
      };

      // 2. Replace console.log with stub implementation.
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push({ row: -1, type: "log", text: args });
      };
      const wrapperCode = this.infiniteLoopDetectorWrapper(this.code);
      try {
        eval(wrapperCode);
      } catch (error) {
        const message =
          error.message === "infinite" ? "Infinite loop" : error.message;
        errors.push({
          type: "error",
          row: 1,
          column: 0,
          text: message,
        });
      } finally {
        // Restore original implementation after testing.
        console.log = originalLog;
      }

      // 3. Detect JSHINT errors and warnings
      const options = {
        undef: true,
        unused: true,
        devel: true,
        browser: true,
        esversion: 7,
      };
      JSHINT(this.code, options);
      const jshintEerrors = JSHINT.data().errors;
      if (jshintEerrors) {
        for (const error of jshintEerrors) {
          if (
            !(
              error.evidence.startsWith("function") &&
              error.reason.endsWith("is defined but never used.")
            )
          ) {
            errors.push({
              type: error.code.startsWith("E") ? "error" : "info",
              row: error.line - 1,
              column: 0,
              text: error.reason,
            });
          }
        }
      }

      // Set the errors in the editor
      //this.$refs.myEditor.editor.getSession().setAnnotations([...errors]);

      // Emit errors for parent component to show errors
      this.$emit("onErrors", errors);
      this.$emit("onLogs", logs);
      //this.code = originalCode;
      //this.code1 = originalCode1;
    },
    getLineNumberError(err) {
      const caller_line = err.stack.split("\n")[4];
      const tab = caller_line.tabOf("at ");
      return caller_line.slice(tab + 2, caller_line.length);
    },
    reset() {
      this.code = this.resource.skeleton;
      this.statusResetButton = true;
    },
    getTeachersCode() {
      Swal.fire({
        title: "<strong>TEACHER'S CODE</strong>",
        icon: "success",
        html: `<div style='text-align:left'><code>${this.resource.solution.replaceAll(
          "\n",
          "<br>"
        )}</code></div>`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "GET THE CODE",
        cancelButtonText: "CANCEL",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.code = this.resource.solution.replaceAll("&nbsp;", " ");
        }
      });
    },
    isKeyword(keyword) {
      const editorRef = this.$refs.myEditor.editor;
      const searchOptions = {
        backwards: true,
        wrap: true,
        caseSensitive: true,
        wholeWord: true,
        regExp: false,
      };
      editorRef.findAll(keyword, searchOptions);
      return editorRef.getSelection().getAllRanges().length;
    },
    editorInit: function(_editor) {
      if (this.isViewer) {
        _editor.setReadOnly(true);
      }

      require("brace/ext/language_tools"); //language extension prerequsite...
      require("brace/mode/html");
      require("brace/mode/javascript"); //language
      require("brace/mode/less");
      require("brace/theme/ambiance");
      require("brace/snippets/javascript"); //snippet
      require("brace");

      //this.loadCode();

      /*       editor.commands.on("exec", function (e) {
        const rowCol = editor.selection.getCursor();
        if (rowCol.row == 0) {
          alert("You cannot change this line since it is read only!");
          e.preventDefault();
          e.stopPropagation();
        }
      });
 */

      if (this.saveHandler == "") {
        this.saveHandler = setInterval(this.dataSumit, 1000);
      }
      if (this.saveHandler == "" && this.isStudent) {
        this.saveHandler = setInterval(this.dataSumit2, 100000);
      }
    },
    editorChange() {
      this.statusSaveButton = false;
      this.statusResetButton = false;
    },
    gotoLine(line) {
      this.$refs.myEditor.editor.resize(true);
      this.$refs.myEditor.editor.scrollToLine(line, true, true, function() {});
      this.$refs.myEditor.editor.gotoLine(line, 0, true);
    },
    infiniteLoopDetector(id) {
      if (id in this.mapDetector) {
        if (Date.now() - this.mapDetector[id] > 1000) {
          delete this.mapDetector[id];
          throw new Error("infinite");
        }
      } else {
        this.mapDetector[id] = Date.now();
      }
    },
    infiniteLoopDetectorWrapper(codeStr) {
      if (typeof codeStr !== "string") {
        throw new Error(
          "Can only wrap code represented by string, not any other thing at the time! If you want to wrap a function, convert it to string first."
        );
      }
      // this is not a strong regex, but enough to use at the time
      return codeStr.replace(/for *\(.*\{|while *\(.*\{|do *\{/g, function(
        loopHead
      ) {
        var id = parseInt(Math.random() * Number.MAX_SAFE_INTEGER);
        return `this.infiniteLoopDetector(${id});${loopHead}this.infiniteLoopDetector(${id});`;
      });
    },
  },
};
</script>

<style scoped>
/* Dropdown styles */
.vcs {
  position: initial;
}

/*
#editor >>> .vcs__picker input{
  border: 2px solid red
}*/
#editor >>> .vcs__select-menu {
  z-index: 10;
  width: 13em;
  left: auto;
  top: auto;
}

#editor >>> .vcs__select-menu__not-main {
  left: calc(100% - 1px) !important;
  top: -1px !important;
}

#editor >>> .vcs__picker input {
  height: 2em;
  padding: 0 20px 0 5px;
}

#editor >>> .vcs__arrow-container {
  padding-left: 6px;
  left: 0px;
  display: flex;
  justify-content: end;
}

#editor >>> .vcs__arrow {
  padding: 2px;
}

#editor >>> .vcs__cross {
  display: none;
}

/* Tab bar styles */
.theme--light.v-tabs .v-tab--active:hover::before,
.theme--light.v-tabs .v-tab--active::before {
  opacity: 0.12;
}

#editor >>> .v-toolbar__content,
.v-toolbar__extension {
  padding: 0;
}

#editor >>> .v-toolbar__content > .v-tabs:first-child,
.v-toolbar__extension > .v-tabs:first-child {
  margin: 0;
}

#editor >>> .v-slide-group__next,
.v-slide-group__prev {
  min-width: 24px;
}

/* Text editor */
#editor >>> .ql-toolbar.ql-snow {
  border: none;
  border-bottom: 1px solid #ccc;
}

#editor >>> .ql-container.ql-snow {
  border: none;
}

#editor >>> .ql-editor {
  font-size: 0.75rem;
  min-height: 100px;
}

#editor >>> .quillWrapper .ql-snow.ql-toolbar .ql-formats {
  margin-bottom: 2px;
}

#editor >>> .quillWrapper .ql-snow.ql-toolbar {
  padding-top: 4px;
  padding-bottom: 4px;
}
</style>
