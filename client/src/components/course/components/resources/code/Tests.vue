<template>
  <div id="tests">
    <v-card
      :outlined="!isEvaluative"
      :class="isEvaluative ? 'shadow' : ''"
      :style="{ backgroundColor: $vuetify.theme.currentTheme.studentboxes }"
    >
      <v-list-item class="px-2">
        <v-list-item-content class="align-self-start">
          <v-list-item-title :class="getTitleClass">
            TESTS
          </v-list-item-title>
          <v-list-item-subtitle v-if="isStudent" :class="getSmallTextClass"
            >Run the teacher tests and create your owns!</v-list-item-subtitle
          >
        </v-list-item-content>
        <v-list-item-avatar tile :size="getAvatarMediumSize" color="blue">
          <v-icon color="white" :size="getIconBigSize">
            mdi-robot-confused
          </v-icon>
        </v-list-item-avatar>
      </v-list-item>

      <v-data-table
        :headers="
          isAuthor
            ? headers.author
            : isViewer
            ? headers.viewer
            : headers.student
        "
        :items="resource.tests"
        :sort-by="isStudent ? 'input' : ''"
        mobile-breakpoint="0"
        :group-by="isStudent ? 'type' : []"
        :hide-default-footer="isTeacher"
        :no-data-text="isTeacher ? '' : 'There are no Tests'"
        disable-sort
        :style="{ backgroundColor: $vuetify.theme.currentTheme.studentboxes }"
      >
        <template v-slot:top>
          <div
            class="py-1 d-flex px-2"
          >
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
                    style="color:white"
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
                                <th class="text-left">
                                  Code
                                </th>
                                <th class="text-left">
                                  Input
                                </th>
                                <th class="text-left">
                                  Expected
                                </th>
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
                                <th class="text-left">
                                  Subtype
                                </th>
                                <th class="text-left">
                                  Code
                                </th>
                                <th class="text-left">
                                  Input
                                </th>
                                <th class="text-left">
                                  Expected
                                </th>
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
                                <th class="text-left">
                                  Code
                                </th>
                                <th class="text-left">
                                  Input
                                </th>
                                <th class="text-left">
                                  Expected
                                </th>
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
                                <th class="text-left">
                                  Subtype
                                </th>
                                <th class="text-left">
                                  Code
                                </th>
                                <th class="text-left">
                                  Input
                                </th>
                                <th class="text-left">
                                  Expected
                                </th>
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
          <span>Input</span><br>
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
                style="margin-top:2px; margin-bottom:2px"
              ></Editable>
              <Editable
                :type="'test'"
                :value="item.expected"
                :id="item.id"
                :field="'expected'"
                placeholder="Expected"
                @input="editableInput"
                :required="true"
                style="margin-bottom:2px"
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
                @select="selected => setTypes(item.id, selected.value)"
                :value="
                  'subtype' in item &&
                  item.subtype != '' &&
                  item.subtype != null
                    ? item.subtype
                    : item.type != null
                    ? item.type
                    : ''
                "
                :style="validate(item) ? 'border: 2px solid red; border-radius: 6px' : ''"
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
            <v-icon :size="getIconSmallSize">
              mdi-eye
            </v-icon>
          </v-btn>
          <v-btn
            icon
            v-if="!item.show"
            :x-small="getButtonSmallSize == 'x-small'"
            :small="getButtonSmallSize == 'small'"
            @click="changeTestVisibility(item.id, true)"
            :disabled="isViewer"
          >
            <v-icon :size="getIconSmallSize">
              mdi-eye-off
            </v-icon>
          </v-btn>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon
            @click="deleteTestByID(item.id)"
            :x-small="getButtonSmallSize == 'x-small'"
            :small="getButtonSmallSize == 'small'"
          >
            <v-icon :size="getIconSmallSize">
              mdi-delete
            </v-icon>
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

Vue.use(VueCascaderSelect);

export default {
  name: "Tests",

  components: {
    Editable,
    VueCascaderSelect
  },

  props: {
    resource: Object,
    errors: Array,
    logs: Array,
    isEvaluative: {
      type: Boolean,
      default: () => false
    }
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
        { text: "Expected", value: "expected" }
      ],
      student2: [
        { text: "Input", value: "input", align: "center", sortable: true },
        { text: "Output", value: "output" },
        { text: "Expected", value: "expected" }
      ],
      author: [
        { text: "Output", value: "output", align: "center" },
        { text: "Input Expected", value: "input", align: "center" },
        { text: "Type", value: "type", align: "center" },
        { text: "", value: "show", align: "center" },
        { text: "", value: "actions" }
      ],
      viewer: [
        { text: "Output", value: "output", align: "center" },
        { text: "Input \n Expected", value: "input", align: "center" },
        { text: "Type", value: "type", align: "center" },
        { text: "Show", value: "show", align: "center" }
      ]
    },

    editedIndex: -1,
    editedItem: {
      input: "",
      output: "",
      expected: ""
    },
    defaultItem: {
      input: "",
      output: "",
      expected: ""
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
          { label: "Error", value: "error" }
        ]
      },
      {
        label: "Metric",
        value: "metric",
        disabled: true,
        options: [
          { label: "Occurrences", value: "occurrences" },
          { label: "Lines", value: "lines" }
        ]
      },
      {
        label: "Log",
        value: "log"
      },
      {
        label: "Function",
        value: "function"
      }
    ]
  }),

  created(){
    if (this.isTeacher){
      this.run()
    }
  },

  computed: {
    ...mapGetters("main", [
      "getStatusByResourceID",
      "getValidated"
    ]),
    ...mapGetters("request", [
      "isStudent",
      "isTeacher",
      "isViewer",
      "isAuthor"
    ]),
    ...mapGetters("style", [
      "getTitleClass",
      "getSmallTextClass",
      "getAvatarMediumSize",
      "getIconBigSize",
      "isMDsmaller",
      "isMD",
      "getIconSmallSize",
      "getButtonMediumSize",
      "getButtonSmallSize"
    ]),
    formTitle() {
      return this.editedIndex === -1 ? "New Test" : "Edit Test";
    },
    getErrors() {
      return this.errors.some(error => error.type == "error");
    },
    /* tests2() {
      return this.resource.tests.filter((test) => test.type == "metric");
    }, */

  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
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
      "editableInput"
    ]),
    validate(test){
      return test.type == null && this.getValidated
    },
    changeTestVisibility(id, value) {
      const obj = {
        id: id,
        value: value,
        field: "show",
        type: "test"
      };
      this.editableInput(obj);
    },
    setTypes(id, value) {
      const obj = {
        id: id,
        type: "test"
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
    /* run2() {
      this.code = this.getProgressFromResourceId(this.resource.id).code;
        
      QUnit.testDone(( details ) => {console.log(details);});
      QUnit.start()
      function square() {
        return x * x;
      }
      QUnit.test("square()", (assert) => {
        assert.equal(this.code, 4, "square(2)");
                
      });
    }, */
    run() {
      // Save the code

        this.nTestsSuccess = 0;
        if (this.isStudent) {
          this.code = this.getStatusByResourceID(
            this.resource.id
          ).answer[0].code;
        } else if (this.isTeacher) {
          this.code = this.resource.solution;
        }

        const originalCode = this.code;

        if (this.resource.html) {
          this.code = `          
          ${html2dom.parse(this.resource.html)}\n          
          ${this.code.replaceAll("document", "docFragment")}
          `;
        }

        // Expressions
        this.resource.tests.forEach((test) => {
          let res;
          //console.log("2. run test->" + test.type);
          if (test.type == "log") {
            res = this.logs.map(log => log.text).join("");
            //console.log("3. result->" + res);
          } else if (test.type == "expression") {
            try {
              if (test.subtype) {
                eval(`${this.code}\n${test.input}`);
                res = "no error";
              } else {
                res = eval(`${this.code}\n${test.input}`);
                res = typeof res === "undefined" ? `No assigned value` : res;
              }
            } catch (error) {
              if (test.subtype) {
                res = "error";
              } else {
                res = error.message;
              }
            }
          } else if (test.type == "metric") {
            if (test.subtype == "lines") {
              let count = 0;
              const lines = this.code.split("\n");
              lines.forEach(line => {
                if (line.startsWith("//") || line == "") {
                  count++;
                }
              });
              res = eval(`${lines.length - count} ${test.expected}`);
            } else if (test.subtype == "occurrences") {
              const keyword = test.input.split(":")[1];
              const nOccurrences = (
                this.code.match(new RegExp(keyword, "g")) || []
              ).length;
              res = nOccurrences;
            } else if (test.subtype == "keyword") {
              res = this.code.includes(test.input.split(":")[1]);
            } else {
              res = true;
            }
          } else {
            let fct = eval(`(${this.code})`);
            let arr = []
            if (test.input.startsWith('[') && test.input.endsWith(']')) {
              try {
                arr = [JSON.parse(test.input.replace(/'/g, '"'))];
              } catch (e) {
                console.error("String is not a valid JSON array:", e);
                arr = null
              }
            } else {
              //arr = test.input.split(" ");
              //arr = arr.map(x => JSON.parse(x))
              //console.log(arr)
              const regex = /"([^"]+)"|(\b\d+\.?\d*|\.\d+\b)|(\b\w+\b)/g;
              let matches;
              while ((matches = regex.exec(test.input)) !== null) {
                if (matches[1]) {
                  // This is a matched quoted word, push it without the quotes
                  arr.push(matches[1]);
                } else if (matches[2]) {
                  // This is a matched number, parse it and push
                  arr.push(parseFloat(matches[2]));
                } else if (matches[3]) {
                  // This is a matched unquoted word
                  arr.push(matches[3]);
                }
              }
            }
            if (test.input == "") {
              res = fct.call(null);
            } else {
              res = fct.call(null, ...arr);
            }
          }
          if (Array.isArray(res)){
            try {
              let expectedArray = JSON.parse(test.expected.replace(/'/g, '"'));
              if (expectedArray.length === res.length && expectedArray.every((element, index) => element === res[index])){
                test.correct=true
                this.nTestsSuccess++
              } else {
                test.correct = false
              }
            } catch(err){
              test.correct = false
              console.log(err)
            }
          } else if (String(res) == test.expected.replace(/"/g, '') || res === true) {
            test.correct=true
            this.nTestsSuccess++;
          } else {
            test.correct = false
          }

          /*
          Vue.set(this.resource.tests, index, {
            ...test,
            output: typeof(res)=="object" ? JSON.stringify(res) : String(res),
          });*/
          //res == test.expOutput
          // ? (trs[index + 1].style.backgroundColor = "green")
          //: (trs[index + 1].style.backgroundColor = "red");
        });

        //Update progress

        
        const status = (this.nTestsSuccess / this.resource.tests.length) * 100;

        /*
        if (this.isStudent) {
          this.setProgress({
            id: this.resource.id,
            data: {
              grade: status
            }
          });
        }*/

        this.code = originalCode;

        this.$emit("onSaveCode", status);


        setTimeout(async () => {
          this.nTestsSuccess = 0;
        if (this.isStudent) {
          this.code = this.getStatusByResourceID(
            this.resource.id
          ).answer[0].code;
        } else if (this.isTeacher) {
          this.code = this.resource.solution;
        }

        const originalCode = this.code;

        if (this.resource.html) {
          this.code = `          
          ${html2dom.parse(this.resource.html)}\n          
          ${this.code.replaceAll("document", "docFragment")}
          `;
        }

        // Expressions
        this.resource.tests.forEach((test, index) => {
          let res;
          //console.log("2. run test->" + test.type);
          if (test.type == "log") {
            res = this.logs.map(log => log.text).join("");
            //console.log("3. result->" + res);
          } else if (test.type == "expression") {
            try {
              if (test.subtype) {
                eval(`${this.code}\n${test.input}`);
                res = "no error";
              } else {
                res = eval(`${this.code}\n${test.input}`);
                res = typeof res === "undefined" ? `No assigned value` : res;
              }
            } catch (error) {
              if (test.subtype) {
                res = "error";
              } else {
                res = error.message;
              }
            }
          } else if (test.type == "metric") {
            if (test.subtype == "lines") {
              let count = 0;
              const lines = this.code.split("\n");
              lines.forEach(line => {
                if (line.startsWith("//") || line == "") {
                  count++;
                }
              });
              res = eval(`${lines.length - count} ${test.expected}`);
            } else if (test.subtype == "occurrences") {
              const keyword = test.input.split(":")[1];
              const nOccurrences = (
                this.code.match(new RegExp(keyword, "g")) || []
              ).length;
              res = nOccurrences;
            } else if (test.subtype == "keyword") {
              res = this.code.includes(test.input.split(":")[1]);
            } else {
              res = true;
            }
          } else {
            let fct = eval(`(${this.code})`);
            let arr = []
            if (test.input.startsWith('[') && test.input.endsWith(']')) {
              try {
                arr = [JSON.parse(test.input.replace(/'/g, '"'))];
              } catch (e) {
                console.error("String is not a valid JSON array:", e);
                arr = null
              }
            } else {
              //arr = test.input.split(" ");
              //arr = arr.map(x => JSON.parse(x))
              //console.log(arr)
              const regex = /"([^"]+)"|(\b\d+\.?\d*|\.\d+\b)|(\b\w+\b)/g;
              let matches;
              while ((matches = regex.exec(test.input)) !== null) {
                if (matches[1]) {
                  // This is a matched quoted word, push it without the quotes
                  arr.push(matches[1]);
                } else if (matches[2]) {
                  // This is a matched number, parse it and push
                  arr.push(parseFloat(matches[2]));
                } else if (matches[3]) {
                  // This is a matched unquoted word
                  arr.push(matches[3]);
                }
              }
            }
            if (test.input == "") {
              res = fct.call(null);
            } else {
              res = fct.call(null, ...arr);
            }
          }
          if (Array.isArray(res)){
            try {
              let expectedArray = JSON.parse(test.expected.replace(/'/g, '"'));
              if (expectedArray.length === res.length && expectedArray.every((element, index) => element === res[index])){
                test.correct=true
                this.nTestsSuccess++
              } else {
                test.correct = false
              }
            } catch(err){
              test.correct = false
              console.log(err)
            }
          } else if (String(res) == test.expected.replace(/"/g, '') || res === true) {
            test.correct=true
            this.nTestsSuccess++;
          } else {
            test.correct = false
          }


          Vue.set(this.resource.tests, index, {
            ...test,
            output: typeof(res)=="object" ? JSON.stringify(res) : String(res),
          });
          //res == test.expOutput
          // ? (trs[index + 1].style.backgroundColor = "green")
          //: (trs[index + 1].style.backgroundColor = "red");
        });
        const obj = {
          id: this.resource.id,
          value: this.resource.tests,
          field: "tests",
          type: "evaluative"
        };
        this.editableInput(obj)
        this.$forceUpdate();
        this.code = originalCode;
        }, 1000)

    },
    getColor(item) {
      if (item.output == "") return "white";
      else if (
        item.output == item.expected ||
        (item.type == "metric" && item.output == "true") || item.correct
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
    }
  }
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
  left : 0px;
  display:flex;
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
