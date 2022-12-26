<template>
  <div style="text-align: right">
    <AceEditor
      ref="myEditor"
      v-model="code"
      @init="editorInit"
      @onchange="editorChange"
      lang="javascript"
      theme="ambiance"
      width="100%"
      height="250px"
      :options="{
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
      }"
      :commands="[
        {
          name: 'save',
          bindKey: { win: 'Ctrl-s', mac: 'Command-s' },
          exec: dataSumit,
          readOnly: true,
        },
      ]"
    />
    <span class="caption mr-2">(autosave each 10 seconds)</span>
    <v-card-actions>
      <v-btn color="error" class="mb-2" @click="backToSheet">
        BACK TO SHEET<v-icon right dark> mdi-autorenew </v-icon>
      </v-btn>
      <v-btn
        color="success"
        class="mb-2"
        @click="dataSumit"
        :disabled="statusSaveButton"
      >
        SAVE
        <pre>(Ctrl+S)</pre>
        <v-icon right dark> mdi-content-save </v-icon>
      </v-btn>

      <v-btn color="primary" dark class="mb-2" @click="getTeachersCode">
        GET TEACHER'S CODE<v-icon right dark> mdi-account-switch </v-icon>
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { bus } from "@/main.js";

import { html2dom } from "@/assets/utils/html2dom.js";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import AceEditor from "vuejs-ace-editor";
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "Editor",
  props: {
    resource: Object,
  },
  components: {
    AceEditor,
  },
  data() {
    return {
      sheet: "",
      code: "",
      saveHandler: "",
      statusSaveButton: false,
      statusResetButton: false,
      mapDetector: [],
      originalLog: "",
    };
  },
  computed: {
    ...mapGetters(["getSheetByResourceId", "getProgressFromResourceId"]),
  },
  methods: {
    ...mapMutations(["setProgress"]),
    backToSheet() {
      clearInterval(this.saveHandler);
      bus.$emit("changeIt", this.getSheetByResourceId(this.resource.id).id);
    },
    loadCode() {
      this.code =
        this.getProgressFromResourceId(this.resource.id)?.code ||
        this.resource.skeleton;
    },
    dataSumit() {
      let originalCode = this.code;
      const errors = [];
      const logs = [];
      this.statusSaveButton = true;
      this.setProgress({ id: this.resource.id, code: this.code });

      if (this.resource.html) {
        this.code = `
          ${html2dom.parse(this.resource.html)}\n
          ${this.code.replaceAll("document", "docFragment")}
          `;
        console.log(this.code);
      }

      // 1. Turn off window functions
      window.prompt = (..._args) => {};
      window.confirm = (..._args) => {};
      window.alert = (..._args) => {};

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
          errors.push({
            type: error.code.startsWith("E") ? "error" : "info",
            row: error.line - 1,
            column: 0,
            text: error.reason,
          });
        }
      }

      // Set the errors in the editor
      this.$refs.myEditor.editor.getSession().setAnnotations([...errors]);

      // Emit errors for parent component to show errors
      this.$emit("onErrors", errors);
      this.$emit("onLogs", logs);
      this.code = originalCode;
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
        html: `<div style='text-align:left'><code>${this.resource.code.replaceAll(
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
          this.code = this.resource.code.replaceAll("&nbsp;", " ");
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

    editorInit: function (_editor) {
      require("brace/ext/language_tools"); //language extension prerequsite...
      require("brace/mode/html");
      require("brace/mode/javascript"); //language
      require("brace/mode/less");
      require("brace/theme/ambiance");
      require("brace/snippets/javascript"); //snippet
      require("brace");

      this.loadCode();

      /*       editor.commands.on("exec", function (e) {
        const rowCol = editor.selection.getCursor();
        if (rowCol.row == 0) {
          alert("You cannot change this line since it is read only!");
          e.preventDefault();
          e.stopPropagation();
        }
      });
 */
      this.saveHandler = setInterval(this.dataSumit, 10000);
    },
    editorChange() {
      this.statusSaveButton = false;
      this.statusResetButton = false;
    },

    gotoLine(line) {
      this.$refs.myEditor.editor.resize(true);
      this.$refs.myEditor.editor.scrollToLine(line, true, true, function () {});
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
      return codeStr.replace(
        /for *\(.*\{|while *\(.*\{|do *\{/g,
        function (loopHead) {
          var id = parseInt(Math.random() * Number.MAX_SAFE_INTEGER);
          return `this.infiniteLoopDetector(${id});${loopHead}this.infiniteLoopDetector(${id});`;
        }
      );
    },
  },
};
</script>

<style>
#editor {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

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
</style>
