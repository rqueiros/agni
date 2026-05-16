<template>
  <div id="tests">
    <v-card
      :outlined="!isEvaluative"
      :class="isEvaluative ? 'shadow' : ''"
      :style="{ backgroundColor: $vuetify.theme.currentTheme.studentboxes }"
    >
      <CardHeader
        title="TESTS"
        :subtitle="
          isStudent ? 'Run the teacher tests and create your owns!' : ''
        "
        icon="mdi-robot-confused"
        color="blue"
      />

      <v-data-table
        :headers="
          isAuthor
            ? headers.author
            : isViewer
            ? headers.viewer
            : headers.student
        "
        :items="isTeacher || isViewer ? resource.tests : resource.tests.filter(test => test.show)"
        :sort-by="isStudent ? 'input' : ''"
        mobile-breakpoint="0"
        :group-by="isStudent ? 'type' : []"
        :hide-default-footer="isTeacher"
        :no-data-text="isTeacher ? '' : 'There are no Tests'"
        disable-sort
        :style="{ backgroundColor: $vuetify.theme.currentTheme.studentboxes }"
      >
        <template v-slot:top>
          <div class="py-1 d-flex px-2">
            <v-btn
              @click="run"
              color="success"
              :disabled="getErrors"
              :small="getButtonMediumSize == 'small'"
              :medium="getButtonMediumSize == 'medium'"
            >
              Run Tests
            </v-btn>
            <v-btn
              v-if="isStudent"
              color="primary"
              class="mx-2"
              dark
              @click="newTest"
              :small="getButtonMediumSize == 'small'"
              :medium="getButtonMediumSize == 'medium'"
            >
              New Test
            </v-btn>
            <v-spacer></v-spacer>
            <div class="text-center" v-if="isAuthor">
              <v-menu
                :close-on-content-click="false"
                :nudge-width="200"
                offset-x
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    color="blue"
                    style="color: white"
                    :small="getButtonMediumSize == 'small'"
                    :medium="getButtonMediumSize == 'medium'"
                  >
                    Help
                  </v-btn>
                </template>

                <v-card>
                  <v-list>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title
                          >How to create a Test</v-list-item-title
                        >
                        <v-list-item-subtitle
                          >Test examples follow above</v-list-item-subtitle
                        >
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>

                  <v-divider></v-divider>

                  <v-expansion-panels>
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        Type: log
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-simple-table>
                          <template v-slot:default>
                            <thead>
                              <tr>
                                <th class="text-left">Code</th>
                                <th class="text-left">Input</th>
                                <th class="text-left">Expected</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>console.log("Hello")</td>
                                <td>log</td>
                                <td>Hello</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-expansion-panel-content>
                    </v-expansion-panel>

                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        Type: expression
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-simple-table>
                          <template v-slot:default>
                            <thead>
                              <tr>
                                <th class="text-left">Subtype</th>
                                <th class="text-left">Code</th>
                                <th class="text-left">Input</th>
                                <th class="text-left">Expected</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td></td>
                                <td>let name="John"</td>
                                <td>name</td>
                                <td>John</td>
                              </tr>
                              <tr>
                                <td></td>
                                <td>let age = 12</td>
                                <td>typeof(age)</td>
                                <td>number</td>
                              </tr>
                              <tr>
                                <td></td>
                                <td>let name="John"; \n let admin=name</td>
                                <td>admin == name</td>
                                <td>true</td>
                              </tr>
                              <tr>
                                <td>error</td>
                                <td>const age = 12</td>
                                <td>age=20</td>
                                <td>error</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-expansion-panel-content>
                    </v-expansion-panel>

                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        Type: function
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-simple-table>
                          <template v-slot:default>
                            <thead>
                              <tr>
                                <th class="text-left">Code</th>
                                <th class="text-left">Input</th>
                                <th class="text-left">Expected</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>function addOne(a){return a+1}</td>
                                <td>3</td>
                                <td>4</td>
                              </tr>
                              <tr>
                                <td>function sum(a,b){return a+b}</td>
                                <td>1 5</td>
                                <td>6</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-expansion-panel-content>
                    </v-expansion-panel>

                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        Type: metric
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-simple-table>
                          <template v-slot:default>
                            <thead>
                              <tr>
                                <th class="text-left">Subtype</th>
                                <th class="text-left">Code</th>
                                <th class="text-left">Input</th>
                                <th class="text-left">Expected</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>occurrences</td>
                                <td>if (a&lt;b) {return a} else {return b}</td>
                                <td>occurrences:if</td>
                                <td>1</td>
                              </tr>
                              <tr>
                                <td>occurrences</td>
                                <td>let name = "John";</td>
                                <td>occurrences:Ana</td>
                                <td>0</td>
                              </tr>
                              <tr>
                                <td>lines</td>
                                <td>let name="John"; \n let name2="Ana"</td>
                                <td>lines</td>
                                <td>==2</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-card>
              </v-menu>
            </div>
          </div>
        </template>

        <template
          v-slot:group.header="{ items, isOpen, toggle }"
          v-if="isStudent"
        >
          <th colspan="3">
            <v-icon @click="toggle"
              >{{
                items[0].type == "metric"
                  ? "mdi-firework"
                  : items[0].type == "log"
                  ? "mdi-math-log"
                  : "mdi-robot-confused"
              }}
            </v-icon>

            {{
              items[0].type == "metric"
                ? ` ${items[0].type} (extra challenge):`
                : items[0].type == "log"
                ? ` console logs:`
                : ` general tests:`
            }}
          </th>
        </template>

        <template v-slot:header.input="{}">
          <span>Input</span><br />
          <span>Expected</span>
        </template>

        <template v-slot:item.input="{ item }">
          <div :class="getSmallTextClass">
            <span v-if="isStudent">
              {{ item.alias || item.input }}
            </span>
            <span v-if="isAuthor">
              <Editable
                :type="'test'"
                :value="item.input"
                :id="item.id"
                :field="'input'"
                placeholder="Input"
                @input="editableInput"
                :required="true"
                style="margin-top: 2px; margin-bottom: 2px"
              ></Editable>
              <Editable
                :type="'test'"
                :value="item.expected"
                :id="item.id"
                :field="'expected'"
                placeholder="Expected"
                @input="editableInput"
                :required="true"
                style="margin-bottom: 2px"
              ></Editable>
            </span>
            <span v-if="isViewer">
              <div>{{ item.input }}</div>
              <div>{{ item.expected }}</div>
            </span>
          </div>
        </template>

        <template v-slot:item.output="{ item }">
          <v-chip
            :color="getColor(item)"
            dark
            :small="getButtonMediumSize == 'small'"
            :medium="getButtonMediumSize == 'medium'"
          >
            {{ item.output }}
          </v-chip>
        </template>

        <template v-slot:item.expected="{ item }">
          <div :class="getSmallTextClass">
            {{
              item.options && !item.options.showExpected
                ? "hidden"
                : item.expected
            }}
          </div>
        </template>

        <template v-slot:item.type="{ item }">
          <div :class="getSmallTextClass">
            <span v-if="isAuthor" class="black--text">
              <vue-cascader-select
                :options="options"
                @select="(selected) => setTypes(item.id, selected.value)"
                :value="
                  'subtype' in item &&
                  item.subtype != '' &&
                  item.subtype != null
                    ? item.subtype
                    : item.type != null
                    ? item.type
                    : ''
                "
                :style="
                  validate(item)
                    ? 'border: 2px solid red; border-radius: 6px'
                    : ''
                "
              />
            </span>
            <span v-if="isViewer">
              <div>{{ item.type }}</div>
              <div>{{ item.subtype }}</div>
            </span>
          </div>
        </template>

        <template v-slot:item.show="{ item }">
          <v-btn
            icon
            v-if="item.show"
            @click="changeTestVisibility(item.id, false)"
            :disabled="isViewer"
            :x-small="getButtonSmallSize == 'x-small'"
            :small="getButtonSmallSize == 'small'"
          >
            <v-icon :size="getIconSmallSize"> mdi-eye </v-icon>
          </v-btn>
          <v-btn
            icon
            v-if="!item.show"
            :x-small="getButtonSmallSize == 'x-small'"
            :small="getButtonSmallSize == 'small'"
            @click="changeTestVisibility(item.id, true)"
            :disabled="isViewer"
          >
            <v-icon :size="getIconSmallSize"> mdi-eye-off </v-icon>
          </v-btn>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon
            @click="deleteTestByID(item.id)"
            :x-small="getButtonSmallSize == 'x-small'"
            :small="getButtonSmallSize == 'small'"
          >
            <v-icon :size="getIconSmallSize"> mdi-delete </v-icon>
          </v-btn>
        </template>

        <template v-slot:footer v-if="isAuthor">
          <v-btn
            width="100%"
            @click="addTestByEvaluativeID(resource.id)"
            :small="getButtonMediumSize == 'small'"
            :medium="getButtonMediumSize == 'medium'"
            class="mb-2 mt-1"
            color="button"
          >
            <v-icon>mdi-plus</v-icon> Add Test
          </v-btn>
        </template>
      </v-data-table>

      <!-- <br />
      <v-alert
      color="#2A3B4D"
      dark
      icon="mdi-firework"
      dense
    >
      <strong>EXTRA CHALLENGES</strong>
    </v-alert>
      <v-data-table
        :headers="headers2"
        :items="tests2"
        sort-by="input"
        class="elevation-1"
      >
        <template v-slot:item.output="{ item }">
          <v-chip :color="getColor(item)" dark>
            {{ item.output }}
          </v-chip>
        </template>
      </v-data-table> -->
    </v-card>
  </div>
</template>

<script>
/* import { QUnit } from "qunit"; */
import Swal from "sweetalert2";
import { html2dom } from "@/assets/utils/html2dom.js";
import "sweetalert2/src/sweetalert2.scss";
import { mapActions, mapGetters } from "vuex";
/* import * as LJS from "@/assets/utils/test.js";
 */
import Vue from "vue";
import { EventBus } from "@/event-bus.js";

import Editable from "../../../../gerneral/Editable.vue";
import VueCascaderSelect from "vue-cascader-select";
import CardHeader from "../../CardHeader.vue";

import Osiris from "osiris-educational-transpiler";

Vue.use(VueCascaderSelect);

export default {
  name: "Tests",

  components: {
    Editable,
    VueCascaderSelect,
    CardHeader,
  },

  props: {
    resource: Object,
    errors: Array,
    logs: Array,
    isEvaluative: {
      type: Boolean,
      default: () => false,
    },
    selectedLanguage: {
      type: String,
      default: "JavaScript",
    },
  },

  data: () => ({
    //valid: true,

    dialog: false,
    dialogDelete: false,

    headers: {
      student: [
        { text: "Input", value: "input", align: "start", sortable: true },
        { text: "Type", value: "type" },
        { text: "Output", value: "output" },
        { text: "Expected", value: "expected" },
      ],
      student2: [
        { text: "Input", value: "input", align: "center", sortable: true },
        { text: "Output", value: "output" },
        { text: "Expected", value: "expected" },
      ],
      author: [
        { text: "Output", value: "output", align: "center" },
        { text: "Input Expected", value: "input", align: "center" },
        { text: "Type", value: "type", align: "center" },
        { text: "", value: "show", align: "center" },
        { text: "", value: "actions" },
      ],
      viewer: [
        { text: "Output", value: "output", align: "center" },
        { text: "Input \n Expected", value: "input", align: "center" },
        { text: "Type", value: "type", align: "center" },
        { text: "Show", value: "show", align: "center" },
      ],
    },

    editedIndex: -1,
    editedItem: {
      input: "",
      output: "",
      expected: "",
    },
    defaultItem: {
      input: "",
      output: "",
      expected: "",
    },
    code: "",
    nTestsSuccess: 0,
    value: [],
    options: [
      {
        label: "Expression",
        value: "expression",
        disabled: true,
        options: [
          { label: "Expression", value: "expression" },
          { label: "Error", value: "error" },
        ],
      },
      {
        label: "Metric",
        value: "metric",
        disabled: true,
        options: [
          { label: "Occurrences", value: "occurrences" },
          { label: "Lines", value: "lines" },
        ],
      },
      {
        label: "Log",
        value: "log",
      },
      {
        label: "Function",
        value: "function",
      },
    ],
  }),

  created() {
    if (this.isTeacher) {
      this.run();
    }
  },

  computed: {
    ...mapGetters("main", ["getStatusByResourceID", "getValidated"]),
    ...mapGetters("request", [
      "isStudent",
      "isTeacher",
      "isViewer",
      "isAuthor",
    ]),
    ...mapGetters("style", [
      "getSmallTextClass",
      "getIconSmallSize",
      "getButtonMediumSize",
      "getButtonSmallSize",
    ]),
    formTitle() {
      return this.editedIndex === -1 ? "New Test" : "Edit Test";
    },
    getErrors() {
      return this.errors.some((error) => error.type == "error");
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  mounted() {
    EventBus.$on("runTests", this.run);
  },
  beforeDestroy() {
    EventBus.$off("runTests", this.run);
  },

  methods: {
    ...mapActions("request", ["setProgress"]),
    ...mapActions("main", [
      "addTestByEvaluativeID",
      "deleteTestByID",
      "editableInput",
    ]),
    validate(test) {
      return test.type == null && this.getValidated;
    },
    changeTestVisibility(id, value) {
      const obj = {
        id: id,
        value: value,
        field: "show",
        type: "test",
      };
      this.editableInput(obj);
    },
    setTypes(id, value) {
      const obj = {
        id: id,
        type: "test",
      };
      if (value == "log") {
        obj.value = value;
        obj.field = "type";
        this.editableInput(obj);
        obj.value = "";
        obj.field = "subtype";
        this.editableInput(obj);
      } else if (value == "function") {
        obj.value = value;
        obj.field = "type";
        this.editableInput(obj);
        obj.value = "";
        obj.field = "subtype";
        this.editableInput(obj);
      } else if (value == "expression") {
        obj.value = value;
        obj.field = "type";
        this.editableInput(obj);
        obj.value = "";
        obj.field = "subtype";
        this.editableInput(obj);
      } else if (value == "error") {
        obj.value = value;
        obj.field = "subtype";
        this.editableInput(obj);
        obj.value = "expression";
        obj.field = "type";
        this.editableInput(obj);
      } else if (value == "occurrences") {
        obj.value = value;
        obj.field = "subtype";
        this.editableInput(obj);
        obj.value = "metric";
        obj.field = "type";
        this.editableInput(obj);
      } else if (value == "lines") {
        obj.value = value;
        obj.field = "subtype";
        this.editableInput(obj);
        obj.value = "metric";
        obj.field = "type";
        this.editableInput(obj);
      }
    },
    newTest() {
      Swal.fire(
        "Not available!",
        "Creating tests will be a hot feature in the next version of learnJS",
        "info"
      );
    },
    run() {
      this.code = this.isStudent
        ? this.getStatusByResourceID(this.resource.id).answer[0].code
        : this.resource.solution;

      const codeToTest = (() => {
        console.log("tests", this.resource.tests);
        switch (this.selectedLanguage) {
          case "JavaScript":
            return this.code;
          case "Python": {
            const transpilerPython = new Osiris("python");
            const transpiledCode = transpilerPython.passCode(this.code);
            if (transpiledCode.success) {
              //const separator = "function ord(str) {";
              const extracted = transpiledCode.code//.split(separator)[0].trim();
              //console.log(extracted);
              return extracted;
            } else {
              console.error("Transpilation Error:", transpiledCode.error);
              return "";
            }
          }
          case "Rust": {
            const transpilerRust = new Osiris("rust");
            const transpiledCode = transpilerRust.passCode(this.code);
            if (transpiledCode.success) {
              return transpiledCode.code;
            } else {
              console.error("Transpilation Error:", transpiledCode.error);
              return "";
            }
          }
          default:
            return this.code;
        }
      })();
      if (this.resource.html) {
        this.code = `          
          ${html2dom.parse(this.resource.html)}\n          
          ${this.code.replaceAll("document", "docFragment")}
          `;
      }
      this.runTests(codeToTest);

      const status = (this.nTestsSuccess / this.resource.tests.length) * 100;

      console.log("Number of tests success", this.nTestsSuccess);
      console.log("Number of tests", this.resource.tests.length);
      this.$emit("onSaveCode", status);
    },

    runTests(codeToTest) {
      console.log("codeToTest:::::", codeToTest);
      this.nTestsSuccess = 0;
      const updatedTests = [];
      this.resource.tests.forEach((test) => {
        const result = this.executeTest(test, codeToTest);
        console.log("result:::::", result);
        const isCorrect = this.checkTestResult(test, result, test.type);
        const updatedTest = {
          ...test,
          correct: isCorrect,
          output:
            typeof result === "object"
              ? JSON.stringify(result)
              : String(result),
        };
        updatedTests.push(updatedTest);
        if (isCorrect) this.nTestsSuccess++;
      });
      const obj = {
        id: this.resource.id,
        value: updatedTests,
        field: "tests",
        type: "evaluative",
      };
      this.editableInput(obj);
      this.$set(this.resource, "tests", updatedTests);
      this.$forceUpdate();
    },

    executeTest(test, codeToTest) {
      switch (test.type) {
        case "log": {
          const logText = this.logs.map((log) => log.text).join("");
          return logText || "No logs found";
        }

        case "expression":
          return this.executeExpressionTest(test, codeToTest);

        case "metric":
          return this.executeMetricTest(test, codeToTest);

        case "function":
          return this.executeFunctionTest(test, codeToTest);

        default:
          return "Unknown test type";
      }
    },

    executeExpressionTest(test, codeToTest) {
      try {
        if (test.subtype) {
          eval(`${codeToTest}\n${test.input}`);
          return "no error";
        }
        const result = eval(`${codeToTest}\n${test.input}`);
        return typeof result === "undefined" ? "No assigned value" : result;
      } catch (error) {
        console.log("Expression test error:", error.message);
        return test.subtype ? "error" : error.message;
      }
    },

    executeMetricTest(test, codeToTest) {
      switch (test.subtype) {
        case "lines": {
          const lines = codeToTest.split("\n");
          const count = lines.filter(
            (line) => line.startsWith("//") || line === ""
          ).length;
          return eval(`${lines.length - count} ${test.expected}`);
        }

        case "occurrences": {
          const keyword = test.input.split(":")[1];
          return (codeToTest.match(new RegExp(keyword, "g")) || []).length;
        }

        case "keyword": {
          return codeToTest.includes(test.input.split(":")[1]);
        }

        default:
          return true;
      }
    },

    executeFunctionTest(test, codeToTest) {
      try {
        console.log("codeToTest:::::", codeToTest);
        const fct = eval(`(${codeToTest})`);
        const args = this.parseFunctionArguments(test.input);
        return test.input === "" ? fct.call(null) : fct.call(null, ...args);
      } catch (error) {
        return " ";
      }
    },

    parseFunctionArguments(input) {

      /*      
      if (input.startsWith("[") && input.endsWith("]")) {
        try {
          return [JSON.parse(input.replace(/'/g, '"'))];
        } catch (e) {
          console.error("String is not a valid JSON array:", e);
          return null;
        }
      }
      */

      const args = [];
      let currentPos = 0;
      
      while (currentPos < input.length) {
        // Skip whitespace
        while (currentPos < input.length && input[currentPos] === ' ') {
          currentPos++;
        }
        if (currentPos >= input.length) break;

        // Check for array
        if (input[currentPos] === '[') {
          let bracketCount = 1;
          let endPos = currentPos + 1;
          while (endPos < input.length && bracketCount > 0) {
            if (input[endPos] === '[') bracketCount++;
            if (input[endPos] === ']') bracketCount--;
            endPos++;
          }
          if (bracketCount === 0) {
            try {
              const arrayStr = input.substring(currentPos, endPos);
              args.push(JSON.parse(arrayStr.replace(/'/g, '"')));
              currentPos = endPos;
              continue;
            } catch (e) {
              // If array parsing fails, treat it as a regular argument
            }
          }
        }

        // Check for string
        if (input[currentPos] === '"') {
          let endPos = currentPos + 1;
          while (endPos < input.length && input[endPos] !== '"') {
            if (input[endPos] === '\\') endPos++; // Skip escaped quotes
            endPos++;
          }
          if (endPos < input.length) {
            args.push(input.substring(currentPos + 1, endPos));
            currentPos = endPos + 1;
            continue;
          }
        }

        /*
        const args = [];
        const regex = /"([^"]+)"|(\b\d+\.?\d*|\.\d+\b)|(\b\w+\b)/g;
        let matches;
        */

        // Check for number
        const numberMatch = input.substring(currentPos).match(/^(\d+\.?\d*|\.\d+)/);
        if (numberMatch) {
          args.push(parseFloat(numberMatch[0]));
          currentPos += numberMatch[0].length;
          continue;
        }

        /*
        while ((matches = regex.exec(input)) !== null) {
        if (matches[1]) {
          args.push(matches[1]);
        } else if (matches[2]) {
          args.push(parseFloat(matches[2]));
        } else if (matches[3]) {
          args.push(matches[3]);
        */
        // Check for word
        const wordMatch = input.substring(currentPos).match(/^(\w+)/);
        if (wordMatch) {
          args.push(wordMatch[0]);
          currentPos += wordMatch[0].length;
          continue;
        }

        // If we get here, move to next character
        currentPos++;
      }

      return args;
    },

    checkTestResult(test, result, type) {
      if (Array.isArray(result)) {
        try {
          const expectedArray = JSON.parse(test.expected.replace(/'/g, '"'));
          const compareArrays = (arr1, arr2) => {
            if (arr1.length !== arr2.length) return false;
            return arr1.every((element, index) => {
              if (Array.isArray(element) && Array.isArray(arr2[index])) {
                return compareArrays(element, arr2[index]);
              }
              if (Array.isArray(element[0]) && Array.isArray(arr2[index][0])) {
                return compareArrays(element[0], arr2[index][0]);
              }
              return element === arr2[index];
            });
          };
          return compareArrays(expectedArray, result);
        } catch (err) {
          console.error("Error comparing arrays:", err);
          return false;
        }
      }
      if (type == "function") {
        console.log("result", result);
        console.log("test.expected", test.expected);
        const expected = test.expected.replace(/"/g, "");
        return result === expected || 
               (typeof result === 'number' && result === Number(expected)) ||
               (result === false && expected === "false") ||
               (result === true && expected === "true");
      }
      return (
        String(result) === test.expected.replace(/"/g, "") || result === true
      );
    },
    getColor(item) {
      if (item.output == "") return "white";
      else if (
        item.output == item.expected ||
        (item.type == "metric" && item.output == "true") ||
        item.correct
      ) {
        return "green";
      } else return "red";
    },
    deleteItem(item) {
      this.editedIndex = this.resource.tests.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.resource.tests.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.resource.tests[this.editedIndex], this.editedItem);
      } else {
        this.resource.tests.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>

<style scoped>
#tests >>> .v-data-table__empty-wrapper {
  display: none;
}

#tests >>> td {
  padding: 0 4px;
}

#tests >>> th {
  padding: 0 4px;
}

/* dropdown styles */
.vcs {
  position: initial;
  min-width: 60px;
}
#tests >>> .vcs__select-menu {
  z-index: 1;
  width: fit-content !important;
  left: auto;
  top: auto;
}
#tests >>> .vcs__select-menu__not-main {
  left: calc(100% - 1px) !important;
  top: -1px !important;
}
#tests >>> .vcs__arrow-container {
  padding-left: 6px;
  left: 0px;
  display: flex;
  justify-content: end;
}
#tests >>> .vcs__arrow {
  padding: 2px;
}
#tests >>> .vcs__cross {
  display: none;
}
#tests >>> .vcs__picker input {
  height: 2em;
  padding: 0 20px 0 5px;
}
</style>
