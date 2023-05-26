<template>
  <div id="editor">

    <vue-cascader-select :options="options" @select="(selected) => setType(resource.strapiId, selected.value)"
      class="course_text ml-2 mt-2" :value="resource.type" v-if="isTeacher" style="width: fit-content" />

    <v-card outlined class="course_text d-flex align-center justify-center mt-4" height="2rem">
      Solution
    </v-card>
    <AceEditor ref="myEditor" v-model="code" lang="javascript" class="course_text mb-4" theme="ambiance" width="100%"
      height="20em" :options="editorOp" :commands="com" @init="editorInit" @onchange="editorChange" />

    <v-btn width="100%" v-if="isTeacher && !showSkeleton && !hasSkeleton" @click="showSkeleton = true"
      class="course_button course_text mb-4">
      <v-icon>mdi-plus</v-icon>Skeleton
    </v-btn>
    <v-card v-if="isTeacher && (showSkeleton || hasSkeleton)" height="2rem" outlined
      class="course_text d-flex align-center justify-center mt-4">
      Skeleton
      <v-btn icon @click="deleteSkeleton" class="course_iconButtonL" style="position:absolute; top:0em; right: 0em;">
        <v-icon class="">mdi-delete</v-icon>
      </v-btn>
    </v-card>
    <AceEditor ref="skeleton" v-model="code1" @init="editorInit" @onchange="editorChange" lang="javascript"
      v-if="(isTeacher && showSkeleton) || (isTeacher && hasSkeleton)" class="course_text mb-4" theme="ambiance" width="100%"
      height="15em" :options="editorOp" :commands="com" />

    <v-btn width="100%" v-if="isTeacher && !showContext && !contextLen" @click="showContext = true"
      class="course_button course_text">
      <v-icon>mdi-plus</v-icon>Context
    </v-btn>
    <v-card outlined style="border-radius: 0; display: flex;">
      <div style="width: 100%;" v-if="isTeacher" class="d-flex">
        <v-bottom-navigation grow style="height: 2rem;" id="navBar" v-model="index" class="elevation-0"
          v-if="showContext || contextLen">
          <v-btn v-for="(item, i) in getContext" :key="i" class="course_smallText"
            style="padding: 0 0.5em; border-left: solid; border-right: solid; border-width: 0.01em; border-color: lightgray;">
            <div class="d-flex align-center">
              <Editable v-if="isTeacher" :type="'context'" :value="item.name" :id="item.strapiId"
                placeholder="Context name" :field="'name'" @input="editableChange" onclick="event.stopPropagation()">
              </Editable>
              <v-spacer style="width:1em"></v-spacer>
              <v-icon class="course_IconS" v-if="isTeacher" @click="deleteCont(item.strapiId)">mdi-delete</v-icon>
            </div>
          </v-btn>
        </v-bottom-navigation>


        <div v-if="(showContext || contextLen) && isTeacher" style="height: 2rem;" class="d-flex">
          <v-btn icon style="min-width: 0;" @click="addContext" class="course_iconButtonL">
            <v-icon> mdi-plus </v-icon>
          </v-btn>
          <v-btn icon style="min-width: 0;" @click="showContext = false" class="course_iconButtonL">
            <v-icon> mdi-delete </v-icon>
          </v-btn>
        </div>
      </div>
    </v-card>

    <context v-if="contextLen" :resource="getCont" ref="context"></context>

    <!--
    <AceEditor ref="context" v-model="code2" @init="editorInit" @onchange="editorChange" lang="javascript"
      v-if="isTeacher && showContext" class="course_text" theme="ambiance" width="100%" height="15em" :options="editorOp"
      :commands="com" />-->

    <v-spacer style="height: 16px"></v-spacer>

    <span v-if="isStudent" class="caption mr-2">(autosave each 10 seconds)</span>
    <v-card-actions>
      <v-btn color="error" class="mb-2" @click="backToSheet">
        BACK TO SHEET<v-icon right dark> mdi-autorenew </v-icon>
      </v-btn>
      <v-btn color="success" class="mb-2" @click="dataSumit" :disabled="statusSaveButton" v-if="isStudent">
        SAVE
        <pre>(Ctrl+S)</pre>
        <v-icon right dark> mdi-content-save </v-icon>
      </v-btn>

      <v-btn color="primary" dark class="mb-2" @click="getTeachersCode" v-if="isStudent">
        GET TEACHER'S CODE<v-icon right dark> mdi-account-switch </v-icon>
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
/* global JSHINT */
import { bus } from "@/main.js";

import { html2dom } from "@/assets/utils/html2dom.js";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import AceEditor from "vuejs-ace-editor";
import { mapActions, mapGetters, mapMutations } from "vuex";

import Context from "./Context.vue"
import Editable from "../../../../../components/Editable.vue";

import Vue from 'vue';
import VueCascaderSelect from 'vue-cascader-select';
Vue.use(VueCascaderSelect);

// TODO: implement a previous/next navigation in the editor component


export default {
  name: "Editor",
  props: {
    resource: Object
  },
  components: {
    AceEditor,
    VueCascaderSelect,
    Context,
    Editable
  },
  data() {
    return {
      sheet: "",
      code: "",
      code1: "",
      code2: "",
      saveHandler: "",
      saveHandler1: "",
      statusSaveButton: false,
      statusResetButton: false,
      mapDetector: [],
      originalLog: "",
      showContext: false,
      showSkeleton: false,
      hasSkeleton: false,
      index: 0,
      options: [
        {
          label: 'blank',
          value: 'blank',
        },
        {
          label: 'skeleton',
          value: 'skeleton',
        }, {
          label: 'buggy',
          value: 'buggy',
        },
      ],
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
        showGutter: true
      },
      com: [
        {
          name: 'save',
          bindKey: { win: 'Ctrl-s', mac: 'Command-s' },
          exec: this.dataSumit,
          readOnly: true
        }
      ]
    };
  },
  watch: {
    'resource.skeleton'(value) {
      if (value.length > 0) {
        this.hasSkeleton = true
      } else {
        this.hasSkeleton = false
      }
    },/*
    index(_, oldI){
      //console.log(newI)
      console.log(oldI)
      if (oldI!= undefined){
        //this.$refs.context.testM()
        console.log(oldI)
      }
    }*/
  },
  created() {
    if (this.isStudent) {
      if (
        this.getStatusByResourceId(this.resource.strapiId).answer[0].code ==
        "" &&
        this.resource.skeleton
      ) {
        this.code = this.resource.skeleton;
      } else if (
        this.getStatusByResourceId(this.resource.strapiId).answer[0].code != ""
      ) {
        this.code = this.getStatusByResourceId(
          this.resource.strapiId
        ).answer[0].code;
      } else {
        this.code = "";
      }
    } else if (this.isTeacher) {
      this.code = this.resource.solution
      this.code1 = this.resource.skeleton
    }
    if (this.resource.skeleton.length > 0) {
      this.hasSkeleton = true
    } else {
      this.hasSkeleton = false
    }
  },
  computed: {
    ...mapGetters(["getLessonByResourceId", "getStatusByResourceId", "getRole"]),
    getContext() {
      return this.resource.contexts
    },
    contextLen() {
      return this.resource.contexts.length > 0;
    },
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
      return this.getRole == "viewer"
    },
    getCont() {
      return this.resource.contexts[this.index];
    },
    /*
    hasSkeleton() {
      console.log("hasSkeleton")
      console.log(this.resource)
      return this.resource.skeleton.length > 0
    }*/
  },
  methods: {
    ...mapActions(["setProgress"]),
    ...mapMutations([
      "editableInput", "setTeacherProgress", "addContextByEvaluativeId", "deleteContext"
    ]),
    addContext() {
      if (!this.contextLen) {
        this.index = 0
      }
      this.addContextByEvaluativeId(this.resource.strapiId)
    },
    editableChange(obj) {
      this.editableInput(obj);
    },
    testM() {
      this.dataSumit()
      clearInterval(this.saveHandler);
      if (this.$refs.context) {
        this.$refs.context.testM()
      }
      this.hasSkeleton = false
      this.$destroy()
      //this.saveHandler.forEach(e => {clearInterval(e)})
    },
    deleteSkeleton() {
      this.showSkeleton = false
      this.code1 = ""
      const obj = {
        id: this.resource.strapiId,
        value: "",
        field: "skeleton",
        type: "evaluative"
      }
      this.editableInput(obj)
    },
    setType(id, value) {
      const obj = {
        id: id,
        value: value,
        field: "type",
        type: "evaluative"
      }
      this.editableInput(obj)
    },
    setIndex(i) {
      this.index = i
    },
    deleteCont(id) {
      if (this.index == this.resource.contexts.findIndex(e => e.strapiId == id)) {
        if (this.index > 0) {
          this.setIndex(this.index - 1)
        }
      }
      this.deleteContext(id)
    },
    backToSheet() {
      //this.dataSumit()
      //clearInterval(this.saveHandler);
      const lesson = this.getLessonByResourceId(this.resource.strapiId);
      bus.$emit("changeIt", [lesson.strapiId, lesson.contentType]);
    },

    loadCode() {
      if (this.isStudent) {
        if (
          this.getStatusByResourceId(this.resource.strapiId).answer[0].code ==
          "" &&
          this.resource.skeleton
        ) {
          this.code = this.resource.skeleton;
        } else if (
          this.getStatusByResourceId(this.resource.strapiId).answer[0].code != ""
        ) {
          this.code = this.getStatusByResourceId(
            this.resource.strapiId
          ).answer[0].code;
        } else {
          this.code = "";
        }
      } else if (this.isTeacher) {
        this.code = this.resource.solution.split(' ')[0]
        this.code1 = this.resource.skeleton.split(" ")[0]
      }
    },
    async dataSumit() {
      //console.log(this.code)
      let originalCode = this.code;
      let originalCode1 = this.code1

      const errors = [];
      const logs = [];
      this.statusSaveButton = true;
      //this.setProgress({ id: this.resource.id, code: this.code });
      if (this.isStudent) {
        this.setProgress({
          id: this.resource.strapiId,
          data: {
            answer: [{ __component: "solution.code", code: this.code }]
          }
        });
      } else if (this.isTeacher) {
        //this.setTeacherProgress({ id: this.resource.strapiId, code: this.code })
        const obj = {
          id: this.resource.strapiId,
          value: this.code,
          field: "solution",
          type: "evaluative"
        }
        //console.log(this.code1)
        this.editableInput(obj)
        const obj2 = {
          id: this.resource.strapiId,
          value: this.code1,
          field: "skeleton",
          type: "evaluative"
        }
        this.editableInput(obj2)

      }

      if (this.resource.html) {
        this.code = `
          ${html2dom.parse(this.resource.html)}\n
          ${this.code.replaceAll("document", "docFragment")}
          `;
        //console.log(this.code);
      }
      // 1. Turn off window functions
      window.prompt = (..._args) => { console.log("windowPrompt", _args) };
      window.confirm = (..._args) => { console.log("windowConfirm", _args) };
      window.alert = (..._args) => { console.log("windowAlert", _args) };

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
          text: message
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
        esversion: 7
      };
      JSHINT(this.code, options);
      const jshintEerrors = JSHINT.data().errors;
      if (jshintEerrors) {
        for (const error of jshintEerrors) {
          errors.push({
            type: error.code.startsWith("E") ? "error" : "info",
            row: error.line - 1,
            column: 0,
            text: error.reason
          });
        }
      }

      // Set the errors in the editor
      //this.$refs.myEditor.editor.getSession().setAnnotations([...errors]);

      // Emit errors for parent component to show errors
      this.$emit("onErrors", errors);
      this.$emit("onLogs", logs);
      this.code = originalCode;
      this.code1 = originalCode1
    },

    getLineNumberError(err) {
      const caller_line = err.stack.split("\n")[4];
      const index = caller_line.indexOf("at ");
      return caller_line.slice(index + 2, caller_line.length);
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
        cancelButtonText: "CANCEL"
      }).then(result => {
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
        regExp: false
      };
      editorRef.findAll(keyword, searchOptions);
      return editorRef.getSelection().getAllRanges().length;
    },

    editorInit: function (_editor) {
      console.log("editor", _editor)

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
        this.saveHandler = setInterval(this.dataSumit, 10000);
      }
    },
    editorChange() {
      this.statusSaveButton = false;
      this.statusResetButton = false;
    },

    gotoLine(line) {
      this.$refs.myEditor.editor.resize(true);
      this.$refs.myEditor.editor.scrollToLine(line, true, true, function () { });
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
      return codeStr.replace(/for *\(.*\{|while *\(.*\{|do *\{/g, function (
        loopHead
      ) {
        var id = parseInt(Math.random() * Number.MAX_SAFE_INTEGER);
        return `this.infiniteLoopDetector(${id});${loopHead}this.infiniteLoopDetector(${id});`;
      });
    }
  }
};
</script>

<style scoped>
/*
#editor {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}*/

.myMarker {
  position: absolute;
  background: rgba(100, 200, 100, 0.5);
  z-index: 20;
}

.bar {
  position: absolute;
  background: rgba(100, 100, 200, 0.5);
  z-index: 40;
  width: 2px !important;
}

#editor>>>.v-text-field.v-text-field--solo .v-input__control {
  min-height: 0;
}

#editor>>>.v-messages {
  min-height: 0;
}

#editor>>>.v-label {
  font-size: inherit;
}

#editor>>>.v-text-field input {
  padding: 0;
}

.vcs {
  position: initial;
}

#editor>>>.vcs__select-menu {
  z-index: 10;
  width: 13em;
  left: auto;
  top: auto;
}

#editor>>>.vcs__select-menu__not-main {
  left: calc(100% - 1px) !important;
  top: -1px !important;
}

#editor>>>.vcs__picker input {
  height: 2em;
  padding: 0 20px 0 5px;
}

#editor>>>.vcs__arrow-container {
  padding-left: 6px;
  right: 6px;
}

#editor>>>.vcs__arrow {
  padding: 2px;
}

#editor>>>.vcs__cross {
  display: none;
}

.v-item-group.v-bottom-navigation .v-btn.v-btn--active:not(:hover):before {
  opacity: 0.18 !important;
}

#navBar>>>.v-btn__content {
  flex: auto;
}

#navBar>>>.v-item-group.v-bottom-navigation .v-btn {
  max-width: none !important;
  min-width: 0 !important;
  font-weight: none !important;
}

#navBar>>>.v-btn {
  font-size: none !important;
}
</style>
