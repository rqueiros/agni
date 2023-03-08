<template>
  <v-card class="mx-auto" outlined>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="display-1">
          GAMIFICATION
        </v-list-item-title>
        <v-list-item-subtitle
          >Leaderboards, badges and much more!</v-list-item-subtitle
        >
      </v-list-item-content>

      <v-list-item-avatar tile size="80" color="green">
        <v-icon large color="white">
          mdi-gamepad-variant
        </v-icon>
      </v-list-item-avatar>
    </v-list-item>
    <v-card-text>
      <code>Gamification data will appear here in future versions</code>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    resource: Object
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
      { text: "Output", value: "output" },
      { text: "Expected", value: "expected" },
      { text: "Actions", value: "actions", sortable: false }
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
    code: ""
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Test" : "Edit Test";
    },
    tests() {
      return this.resource.tests;
    },
    ...mapGetters(["getCode"])
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
    initialize() {
      this.tests = this.resource.tests;
    },

    run() {
      this.code = this.getCode;
      this.tests.forEach(test => {
        let res;
        if (test.type == "expression") {
          try {
            console.log(eval(`${this.code}`));
            res = eval(`${this.code}\n${test.input}`);
            res = typeof res === "undefined" ? `No assigned value` : res;
            console.log(typeof res);
          } catch (error) {
            res = error.message;
          }
        } else if (test.type == "metric") {
          switch (test.input) {
            case "lines":
              res = eval(`${this.code.split("\n").length} ${test.expected}`);
              console.log(
                "->" + `${this.code.split("\n").length} ${test.expected}`
              );
              console.log("->" + res);
              break;
            case "push":
              res = this.code.includes("push");
              console.log("->" + res);
              break;
            default:
              break;
          }
        } else {
          let fct = eval(`(${this.code})`);
          let arr = test.input.split(" ").map(Number);
          res = fct.call(null, ...arr);
        }
        test.output = String(res);
        //res == test.expOutput
        // ? (trs[index + 1].style.backgroundColor = "green")
        //: (trs[index + 1].style.backgroundColor = "red");
      });
    },

    getColor(item) {
      if (item.output == "") return "white";
      else if (
        item.output == item.expected ||
        (item.type == "metric" && item.output == "true")
      )
        return "green";
      else return "red";
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
