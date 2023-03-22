<template>
  <div>
    <v-card class="mx-auto" outlined>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="display-1"> TESTS </v-list-item-title>
          <v-list-item-subtitle
            >Run the teacher tests and create your owns!</v-list-item-subtitle
          >
        </v-list-item-content>

        <v-list-item-avatar tile class="box" color="blue">
          <v-icon color="white" class="box_icon"> mdi-robot-confused </v-icon>
        </v-list-item-avatar>
      </v-list-item>
      <v-data-table
        :headers="headers"
        :items="tests"
        sort-by="input"
        group-by="type"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  @click="run"
                  color="success"
                  :disabled="getErrors"
                  class="mb-2 mr-2"
                  v-bind="attrs"
                >
                  Run Tests
                </v-btn>
                <!--<v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">-->
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  @click="newTest"
                >
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
                        <v-text-field
                          v-model="editedItem.input"
                          label="Input data"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.expected"
                          label="Expected"
                        ></v-text-field>
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
                <v-card-title class="headline"
                  >Are you sure you want to delete this test?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:group.header="{ items, isOpen, toggle }">
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
 */ export default {
  name: "Tests",
  props: {
    resource: Object,
    errors: Array,
    logs: Array
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Input",
        align: "start",
        sortable: true,
        value: "input"
      },
      { text: "Type", value: "type" },
      { text: "Output", value: "output" },
      { text: "Expected", value: "expected" }
    ],
    headers2: [
      {
        text: "Input",
        align: "start",
        sortable: true,
        value: "input"
      },
      { text: "Output", value: "output" },
      { text: "Expected", value: "expected" }
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
    nTestsSuccess: 0
  }),

  computed: {
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
    ...mapGetters(["getStatusByResourceId"])
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
        this.code = this.getStatusByResourceId(this.resource.strapiId).answer[0].code;

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
        await this.setProgress({
          id: this.resource.strapiId,
          data: {
            grade: status
          }
        });
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

<style></style>
