<template>
  <div id="importDialog">
    <v-dialog v-model="localDialog" max-width="500">
      <v-card>
        <v-card-title>
          Import Data
        </v-card-title>

        <v-card-text class="pb-2">
          <v-file-input
            v-if="file == null"
            v-model="file"
            label="Select JSON or CSV File"
            accept=".json,.csv"
          ></v-file-input>
          <div v-else>
            <container fluid>
              <v-row dense>
                <v-col class="d-flex align-center">
                  Class Name Key:
                </v-col>
                <v-col>
                  <v-select
                    v-model="classKey"
                    :items="[
                      ...keys,
                      ...getOccurrence.classes.map(c => c.name)
                    ]"
                    label="Select Key or Class"
                    outlined
                    dense
                    :hide-details="details.classKey"
                    :error-messages="errorMessages.classKey"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col class="d-flex align-center">
                  Student Name Key:
                </v-col>
                <v-col>
                  <v-select
                    v-model="studentKey"
                    :items="keys"
                    label="Select Key"
                    outlined
                    dense
                    :hide-details="details.studentKey"
                    :error-messages="errorMessages.studentKey"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col class="d-flex align-center">
                  Student Email Key:
                </v-col>
                <v-col>
                  <v-select
                    v-model="emailKey"
                    :items="keys"
                    label="Select Key"
                    outlined
                    dense
                    :hide-details="details.emailKey"
                    :error-messages="errorMessages.emailKey"
                  ></v-select>
                </v-col>
              </v-row>
            </container>
          </div>
        </v-card-text>

        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn text @click="localDialog = false">
            Cancel
          </v-btn>
          <v-btn text @click="addContent">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import Papa from "papaparse";

export default {
  name: "ImporttDialog",

  props: {
    dialog: {
      type: Boolean,
      default: () => false
    }
  },

  data() {
    return {
      localDialog: this.dailog,

      file: null,
      jsonFile: null,
      csvFile: null,

      keys: [],
      classKey: "",
      studentKey: "",
      emailKez: "",

      details: {
        studentKey: true,
        classKey: true,
        emailKey: true,
      },
      errorMessages: {
        studentKey: "",
        classKey: "",
        emailKey: "",
      }
    };
  },

  watch: {
    dialog(newValue) {
      this.localDialog = newValue;
    },
    localDialog(newV) {
      if (!newV) {
        this.$emit("closeSelectDialog");
        this.reset();
      }
    },
    file(newFile) {
      if (newFile != null) {
        this.readFile(newFile);
      }
    },
    studentKey(newV) {
      if (newV != "") {
        this.errorMessages.studentKey = "";
      }
    },
    classKey(newV) {
      if (newV != "") {
        this.errorMessages.classKey = "";
      }
    },
    emailKey(newV) {
      if (newV != "") {
        this.errorMessages.emailKey = "";
      }
    }
  },

  created() {},

  computed: {
    ...mapGetters("main", ["getOccurrence"])
  },

  methods: {
    ...mapActions("main", [
      "addClassByOccurrenceID2",
      "addStudentByClassName"
    ]),
    extractKeys(obj) {
      const keys = [];
      if (obj instanceof Array) {
        for (let i of obj) {
          keys.push(...this.extractKeys(i));
        }
      } else {
        for (let [key, value] of Object.entries(obj)) {
          const newPrefix = "key - " + key;
          keys.push(newPrefix);
          if (typeof value === "object" && value !== null) {
            keys.push(...this.extractKeys(value));
          }
        }
      }
      return keys;
    },
    findObjectsWithKey(obj, targetKey, results = []) {
      if (typeof obj === "object" && obj !== null) {
        if (Object.prototype.hasOwnProperty.call(obj, targetKey)) {
          results.push(obj);
        }
        if (obj instanceof Array) {
          for (let i of obj) {
            this.findObjectsWithKey(i, targetKey, results);
          }
        } else {
          for (let key in obj) {
            this.findObjectsWithKey(obj[key], targetKey, results);
          }
        }
      }
      return results;
    },
    addContent() {
      if (this.classKey != "" && this.studentKey != "") {
        if (this.jsonFile != null) {
          this.addJSONContent();
        } else if (this.csvFile != null) {
          this.addCSVContent();
        }
        this.reset();
        this.localDialog = false;
      } else {
        if (this.classKey == "") {
          this.details.classKey = false;
          this.errorMessages.classKey = "Selection required.";
        }
        if (this.studentKey == "") {
          this.details.studentKey = false;
          this.errorMessages.studentKey = "Selection required.";
        }
        if (this.emailKey == "") {
          this.details.emailKey = false;
          this.errorMessages.emailKey = "Selection required.";
        }
      }
    },
    addJSONContent() {
      let studentKey = this.studentKey.slice(6);
      let emailKey = this.emailKey.slice(6);
      if (this.classKey.startsWith("key - ")) {
        let classKey = this.classKey.slice(6);
        let classes = this.findObjectsWithKey(this.jsonFile, classKey);
        classes.forEach(cla => {
          let students = this.findObjectsWithKey(cla, studentKey);
          students = students.map(student => {
            return { name: student[studentKey], email: student[emailKey] };
          });
          let c = {
            name: cla[classKey],
            students: students
          };
          this.addClassByOccurrenceID2([this.getOccurrence.id, c]);
        });
      } else {
        let students = this.findObjectsWithKey(this.jsonFile, studentKey);
        students = students.map(student => {
          return { name: student[studentKey], email: student[emailKey] };
        });
        this.addStudentByClassName([this.classKey, students]);
      }
    },
    addCSVContent() {
      let studentKey = this.studentKey.slice(6);
      let emailKey = this.emailKey.slice(6);
      if (this.classKey.startsWith("key - ")) {
        let classKey = this.classKey.slice(6);
        let classes = this.csvFile.map(o => o[classKey]);
        classes = [...new Set(classes)];
        classes.forEach(cla => {
          let students = this.csvFile.filter(o => o[classKey] == cla);
          students = students.map(student => {
            return { name: student[studentKey], email:student[emailKey] };
          });
          let c = {
            name: cla,
            students: students
          };
          this.addClassByOccurrenceID2([this.getOccurrence.id, c]);
        });
      } else {
        let students = this.csvFile.map(o => {
          return { name: o[studentKey], email:o[emailKey] };
        });
        this.addStudentByClassName([this.classKey, students]);
      }
    },
    readFile(file) {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          if (file.name.endsWith(".csv")) {
            this.parseCSV(e.target.result);
          } else if (file.name.endsWith(".json")) {
            this.parseJSON(e.target.result);
          }
        } catch (error) {
          console.error("Error parsing File:", error);
        }
      };
      reader.onerror = error => {
        console.error("Error reading file:", error);
      };
      reader.readAsText(file);
    },
    parseCSV(content) {
      let parsedCSV = [];
      Papa.parse(content, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          parsedCSV = results.data;
        }
      });
      this.csvFile = parsedCSV;
      let k = [...Object.keys(parsedCSV[0])];
      this.keys = k.map(key => "key - " + key);
    },
    parseJSON(content) {
      let parsedJSON = JSON.parse(content);
      this.jsonFile = parsedJSON;
      this.keys = [...new Set(this.extractKeys(parsedJSON))];
    },
    reset() {
      this.file = null;
      this.csvFile = null;
      this.jsonFile = null;
      (this.classKey = ""), (this.studentKey = ""), (this.keys = []), (this.emailKey = "");
      this.resetDetails();
    },
    resetDetails() {
      this.details = {
        studentKey: true,
        classKey: true,
        emailKey: true,
      };
      this.errorMessages = {
        studentKey: "",
        classKey: "",
        emailKey: "",
      };
    }
  }
};
</script>

<style scoped></style>
