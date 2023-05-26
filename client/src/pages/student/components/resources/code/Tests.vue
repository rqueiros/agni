<template>
  <div id="tests">
    <v-card outlined>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title :class="getTitleClass(screenSize)"> TESTS </v-list-item-title>
          <v-list-item-subtitle v-if="isStudent" :class="getSmallTextClass(screenSize)">Run the teacher tests and create
            your owns!</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-avatar tile :size="getAvatarMediumSize(screenSize)" color="blue">
          <v-icon color="white" :size="getIconBigSize(screenSize)"> mdi-robot-confused </v-icon>
        </v-list-item-avatar>
      </v-list-item>

      <!---------------STUDENT------------------------------------------------->
      <v-data-table v-if="isStudent" :headers="headers" :items="tests" sort-by="input" group-by="type">
        <template v-slot:top>
          <v-toolbar flat>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn @click="run" color="success" :disabled="getErrors" class="mb-2 mr-2" v-bind="attrs">
                  Run Tests
                </v-btn>
                <!--<v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">-->
                <v-btn color="primary" dark class="mb-2" v-bind="attrs" @click="newTest">
                  New Test
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.input" label="Input data"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.expected" label="Expected"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline">Are you sure you want to delete this test?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:group.header="{ items, isOpen, toggle }">
          <th colspan="3">
            <v-icon @click="toggle">{{
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
        <template v-slot:item.input="{ item }">
          {{ item.alias || item.input }}
        </template>
        <template v-slot:item.output="{ item }">
          <v-chip :color="getColor(item)" dark>
            {{ item.output }}
          </v-chip>
        </template>
        <template v-slot:item.expected="{ item }">
          {{
            item.options && !item.options.showExpected
            ? "hidden"
            : item.expected
          }}
        </template>
      </v-data-table>
      <!---->

      <!---------------Teacher------------------------------------------------->
      <v-data-table :headers="teacherHeaders" :items="tests" v-if="isTeacher" mobile-breakpoint="0" :no-data-text="''"
        id="teachertable" hide-default-footer>
        <template v-slot:top>
          <v-toolbar flat>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn @click="run" color="success" :disabled="getErrors" class="course_button course_text"
                  v-bind="attrs">
                  Run Solution on Tests
                </v-btn>
              </template>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:body="{ items }">
          <tbody>
            <template v-for="item in items">
              <tr :key="item.strapiId">
                <td><v-chip :color="getColor(item)" dark>
                    {{ item.output }}
                  </v-chip></td>
                <td class="course_smallText">
                  <Editable :type="'test'" :value="item.input" :id="item.strapiId" :field="'input'" placeholder="Input"
                    style="margin-bottom: 0.2em;" @input="editableChange"></Editable>
                  <Editable :type="'test'" :value="item.expected" :id="item.strapiId" :field="'expected'"
                    placeholder="Expected" @input="editableChange"></Editable>
                </td>
                <td class="course_smallText">
                  <vue-cascader-select :options="options" @select="(selected) => setTypes(item.strapiId, selected.value)"
                    :value="('subtype' in item && item.subtype != '') ? item.subtype : item.type" />
                </td>
                <td>
                  <v-btn icon v-if="item.show" class="course_iconButtonS"
                    @click="changeTestVisibility(item.strapiId, false)">
                    <v-icon class="course_IconS">
                      mdi-eye
                    </v-icon>
                  </v-btn>
                  <v-btn icon v-if="!item.show" class="course_iconButtonS"
                    @click="changeTestVisibility(item.strapiId, true)">
                    <v-icon class="course_IconS">
                      mdi-eye-off
                    </v-icon>
                  </v-btn>
                </td>
                <td style="padding-left: 0;">
                  <v-btn icon @click="deleteTest(item.strapiId)" class="course_iconButtonS">
                    <v-icon class="course_IconS"> mdi-delete </v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
            <template>
              <tr style="background-color: transparent !important">
                <td :colspan="teacherHeaders.length" style="padding: 0">
                  <v-btn style="width: 100%" @click="addTestByEvaluativeId(resource.strapiId)"
                    class="course_button course_text">
                    <v-icon>mdi-plus</v-icon> Add Test
                  </v-btn>
                </td>
              </tr>
            </template>
          </tbody>
        </template>
      </v-data-table>
      <!---->

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
import { mapActions, mapGetters, mapMutations } from "vuex";
import Editable from "../../../../../components/Editable.vue";
/* import * as LJS from "@/assets/utils/test.js";
*/
import Vue from 'vue';
import VueCascaderSelect from 'vue-cascader-select';

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
    screenSize: {
      type: String,
      default: () => ""
    }
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "Input", value: "input", align: "start", sortable: true },
      { text: "Type", value: "type" },
      { text: "Output", value: "output" },
      { text: "Expected", value: "expected" }
    ],
    headers2: [
      { text: "Input", value: "input", align: "center", sortable: true },
      { text: "Output", value: "output" },
      { text: "Expected", value: "expected" }
    ],
    teacherHeaders: [
      { text: "Output", value: "output", align: "start" },
      { text: "Input \n Expected", value: "input" },
      { text: "Type", value: "type" },
      { text: "", value: "show" },
      { text: "", value: "" }
    ],
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
    nTestsSuccess: 0.,
    value: [],
    options: [
      {
        label: 'Expression',
        value: 'expression',
        disabled: true,
        options: [
          { label: 'Expression', value: 'expression' },
          { label: 'Error', value: 'error' },
        ],
      },
      {
        label: 'Metric',
        value: 'metric',
        disabled: true,
        options: [
          { label: 'Occurrences', value: 'occurrences' },
          { label: 'Lines', value: 'lines' },
        ],
      },
      {
        label: 'Log',
        value: 'log',
      },
      {
        label: 'Function',
        value: 'function',
      },
    ]
  }),

  computed: {
    ...mapGetters(["getStatusByResourceId", "getRole", "getStatusTeacher",
      "getTitleClass", "getSmallTextClass", "getAvatarMediumSize", "getIconBigSize"]),
    formTitle() {
      return this.editedIndex === -1 ? "New Test" : "Edit Test";
    },
    tests() {
      return this.resource.tests;
    },
    getErrors() {
      return this.errors.some(error => error.type == "error");
    },
    /* tests2() {
      return this.resource.tests.filter((test) => test.type == "metric");
    }, */
    isStudent() {
      return this.getRole == "student";
    },
    isTeacher() {
      return this.getRole == "teacher" || this.getRole == "author" || this.getRole == "viewer";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
  },

  methods: {
    ...mapActions(["setProgress"]),
    ...mapMutations([
      "addTestByEvaluativeId",
      "deleteTest",
      "editableInput"
    ]),
    changeTestVisibility(id, value) {
      const obj = {
        id: id,
        value: value,
        field: "show",
        type: "test"
      }
      this.editableChange(obj)
    },
    setTypes(id, value) {
      const obj = {
        id: id,
        type: "test"
      }
      if (value == "log") {
        obj.value = value
        obj.field = "type"
        this.editableChange(obj)
        obj.value = ""
        obj.field = "subtype"
        this.editableChange(obj)
      } else if (value == "function") {
        obj.value = value
        obj.field = "type"
        this.editableChange(obj)
        obj.value = ""
        obj.field = "subtype"
        this.editableChange(obj)
      } else if (value == "expression") {
        obj.value = value
        obj.field = "type"
        this.editableChange(obj)
        obj.value = ""
        obj.field = "subtype"
        this.editableChange(obj)
      } else if (value == "error") {
        obj.value = value
        obj.field = "subtype"
        this.editableChange(obj)
        obj.value = "expression"
        obj.field = "type"
        this.editableChange(obj)
      } else if (value == "occurrences") {
        obj.value = value
        obj.field = "subtype"
        this.editableChange(obj)
        obj.value = "metric"
        obj.field = "type"
        this.editableChange(obj)
      } else if (value == "lines") {
        obj.value = value
        obj.field = "subtype"
        this.editableChange(obj)
        obj.value = "metric"
        obj.field = "type"
        this.editableChange(obj)
      }

    },
    editableChange(obj) {
      this.editableInput(obj);
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
      this.$emit("onSaveCode");

      setTimeout(async () => {
        this.nTestsSuccess = 0;
        if (this.isStudent) {
          this.code = this.getStatusByResourceId(
            this.resource.strapiId
          ).answer[0].code;
        } else if (this.isTeacher) {
          this.code = this.resource.solution
        }


        const originalCode = this.code;

        if (this.resource.html) {
          this.code = `          
          ${html2dom.parse(this.resource.html)}\n          
          ${this.code.replaceAll("document", "docFragment")}
          `;
        }

        // Expressions
        this.tests.forEach(test => {
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
            let arr = test.input.split(" ").map(Number);
            if (test.input == "") {
              res = fct.call(null);
            } else {
              res = fct.call(null, ...arr);
            }
          }
          console.log(res)
          test.output = String(res);

          if (test.output == test.expected || res == true) {
            this.nTestsSuccess++;
          }
          //res == test.expOutput
          // ? (trs[index + 1].style.backgroundColor = "green")
          //: (trs[index + 1].style.backgroundColor = "red");
        });

        //Update progress
        const status = (this.nTestsSuccess / this.tests.length) * 100;

        if (this.isStudent) {
          await this.setProgress({
            id: this.resource.strapiId,
            data: {
              grade: status
            }
          });
        }
        this.code = originalCode;
      }, 1000);
    },

    getColor(item) {
      if (item.output == "") return "white";
      else if (
        item.output == item.expected ||
        (item.type == "metric" && item.output == "true")
      ) {
        return "green";
      } else return "red";
    },

    editItem(item) {
      this.editedIndex = this.tests.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.tests.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.tests.splice(this.editedIndex, 1);
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
        Object.assign(this.tests[this.editedIndex], this.editedItem);
      } else {
        this.tests.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>

<style scoped>
#teachertable>>>td {
  padding: 0 0.5em;
}

#teachertable>>>th {
  padding: 0 0.5em;
}

.vcs {
  position: initial;
}

#teachertable>>>.vcs__select-menu {
  z-index: 1;
  width: fit-content !important;
  left: auto;
  top: auto;
}

#teachertable>>>.vcs__select-menu__not-main {
  left: calc(100% - 1px) !important;
  top: -1px !important;
}

#teachertable>>>.vcs__picker input {
  height: 2em;
  padding: 0 20px 0 5px;
}

#teachertable>>>.vcs__arrow-container {
  padding-left: 6px;
  right: 6px;
}

#teachertable>>>.vcs__arrow {
  padding: 2px;
}

#teachertable>>>.vcs__cross {
  display: none;
}
</style>
