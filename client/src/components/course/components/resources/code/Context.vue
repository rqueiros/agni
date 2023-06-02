<template>
  <div id="contexts">
    <v-card
      class="mx-auto"
      max-width="100%"
      outlined
      v-if="resource.contentType == 'new'"
      style="display: flex; justify-content: center; align-items: center;"
    >
      <v-row
        style="margin:0;height:15rem; display: flex; justify-content: center; align-items: center; padding:1em"
      >
        <v-col cols="6">
          <v-file-input
            class="course_smallText course_button"
            label="File input"
            v-model="file"
            prepend-icon=""
            disabled
            outlined
          ></v-file-input>
        </v-col>
        <v-col cols="6">
          <v-btn
            class="course_smallText course_button"
            outlined
            @click="changeContext"
            >Write File</v-btn
          >
        </v-col>
      </v-row>
    </v-card>
    <v-card
      class="mx-auto"
      max-width="100%"
      outlined
      v-else
      style="display: flex; justify-content: center; align-items: center;"
    >
      <AceEditor
        ref="skeleton"
        v-model="code"
        @init="editorInit"
        lang="javascript"
        class="course_text"
        theme="ambiance"
        width="100%"
        height="15em"
        :options="editorOp"
        :commands="com"
      />
    </v-card>
  </div>
</template>

<script>
import AceEditor from "vuejs-ace-editor";

import { mapGetters, mapMutations } from "vuex";
export default {
  name: "context",
  components: {
    AceEditor
  },
  props: {
    resource: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      code: "",
      expositives: [],
      index: 0,
      expo: {},
      file: [],
      saveHandler: "",
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
          name: "save",
          bindKey: { win: "Ctrl-s", mac: "Command-s" },
          exec: this.dataSumit,
          readOnly: true
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["getResourceById", "getProgressFromResourceId"])
  },
  watch: {
    file: function(newFile, oldFile) {
      if (newFile !== oldFile) {
        if (newFile != [] && newFile != undefined) {
          this.changeContextTypeById(this.resource.id);
        }
      }
    },
    "resource.id"(_, oldId) {
      console.log(oldId);
      this.dataSumitId(oldId);
      this.code = this.resource.text;
    }
  },

  created() {
    this.code = this.resource.text;
  },

  methods: {
    ...mapMutations(["editableInput"]),
    testM() {
      this.dataSumit();
      clearInterval(this.saveHandler);
      //this.saveHandler.forEach(e => {clearInterval(e)})
    },
    changeContext() {
      const obj = {
        id: this.resource.id,
        field: "contentType",
        value: "",
        type: "context"
      };
      this.editableInput(obj);
    },
    dataSumitId(id) {
      const obj = {
        id: id,
        value: this.code,
        field: "text",
        type: "context"
      };
      //console.log(this.code1)
      this.editableInput(obj);
    },
    async dataSumit() {
      //console.log(this.code)
      //let originalCode = this.code;
      const obj = {
        id: this.resource.id,
        value: this.code,
        field: "text",
        type: "context"
      };
      //console.log(this.code1)
      this.editableInput(obj);

      /*
            const errors = [];
            const logs = [];
            this.statusSaveButton = true;
            //this.setProgress({ id: this.resource.id, code: this.code });
            if (this.isStudent) {
                this.setProgress({
                    id: this.resource.id,
                    data: {
                        answer: [{ __component: "solution.code", code: this.code }]
                    }
                });
            } else if (this.isTeacher) {
                //this.setTeacherProgress({ id: this.resource.id, code: this.code })
                const obj = {
                    id: this.resource.id,
                    value: this.code,
                    field: "solution",
                    type: "evaluative"
                }
                //console.log(this.code1)
                this.editableInput(obj)
                const obj2 = {
                    id: this.resource.id,
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
            this.code1 = originalCode1*/
    },
    editorInit: function(_editor) {
      console.log("editor", _editor);

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
    }
  }
};
</script>

<style scoped></style>
