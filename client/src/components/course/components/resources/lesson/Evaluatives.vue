<template>
  <div id="evaluatives" v-if="evaluativesNotNull || isAuthor">
    <v-card
      flat
      :style="{ backgroundColor: $vuetify.theme.currentTheme.studentboxes }"
    >
      <!--Author-->
      <v-menu offset-y v-if="!evaluativesNotNull && isAuthor">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            width="100%"
            v-bind="attrs"
            v-on="on"
            height="36px"
            :small="getButtonMediumSize == 'small'"
            :medium="getButtonMediumSize == 'medium'"
            color="button"
          >
            <v-icon>mdi-plus</v-icon>Add Exercises
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item
            class="text-center"
            v-for="(item, index) in addEvaluativeMenu"
            :key="index"
            @click="addEvaluative(item.value)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-data-table
        v-if="(isAuthor && evaluativesNotNull) || isStudent || isViewer"
        :headers="
          isAuthor
            ? headers.author
            : isViewer
            ? headers.viewer
            : headers.student
        "
        :items="loadResource"
        @click:row="play"
        mobile-breakpoint="0"
        no-data-text=""
        :hide-default-footer="isAuthor"
        class="my-data-table"
        style="background-color: transparent;"
        v-model="selected"
      >


        <template v-slot:item.id="{ item }">
          <span :class="getSmallTextClass">
            {{ item.id }}
          </span>
        </template>

        <template v-slot:item.type="{ item }">
          <v-icon
            v-if="'type' in item && item.type != null"
            :size="getIconMediumSize"
          >
            {{ getIcon(item.type) }}
          </v-icon>
          <v-icon v-else :size="getIconMediumSize">
            {{ getIcon(item.contentType) }}
          </v-icon>
        </template>

        <template v-slot:footer v-if="isAuthor">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                width="100%"
                v-bind="attrs"
                v-on="on"
                :small="getButtonMediumSize == 'small'"
                :medium="getButtonMediumSize == 'medium'"
                class="mb-2 mt-1"
                color="button"
              >
                <v-icon>mdi-plus</v-icon>Add Exercises
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item
                v-for="(item, index) in addEvaluativeMenu"
                :key="index"
                class="text-center"
                link
                @click="addEvaluative(item.value)"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

        <template v-slot:item.name="{ item }">
          <span v-if="isStudent || isViewer">
            {{ item.name }}
          </span>
          <Editable
            v-if="isAuthor"
            :class="getSmallTextClass"
            type="evaluative"
            :value="item.name"
            :id="item.id"
            field="name"
            @input="editableInput"
            placeholder="Exercise name"
            onclick="event.stopPropagation()"
            :required="true"
          />
        </template>

        <template v-slot:item.grade="{ item }">
          <v-chip :color="getColor(item.grade)" dark class="pointer">
            <div style="width: 32px" class="text-center">
              {{ item.grade }}%
            </div>
          </v-chip>
        </template>

        <template v-slot:item.action="{ item }">
          <v-btn
            v-if="isStudent"
            icon
            @click="play(item)"
            :x-small="getButtonSmallSize == 'x-small'"
            :small="getButtonSmallSize == 'small'"
          >
            <v-icon :size="getIconSmallSize">mdi-clipboard-play</v-icon>
          </v-btn>
          <v-btn
            v-if="isAuthor"
            :x-small="getButtonSmallSize == 'x-small'"
            :small="getButtonSmallSize == 'small'"
            icon
            @click="deleteEvaluativeByID(item.id)"
            onclick="event.stopPropagation()"
          >
            <v-icon :size="getIconSmallSize"> mdi-delete </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <SelectDialog
      v-if="isAuthor"
      :dialog="dialog"
      :type="'evaluatives'"
      :already="resource.evaluatives.map((e) => e.id)"
      @addExistingevaluatives="addExistingEval"
      @closeSelectDialog="dialog = false"
    />

    <ExternalDialog
      :dialog="externalDialog"
      @addExternalExercises="addExternalExercises"
      @closeSelectDialog="externalDialog = false"
    />
  </div>
</template>

<script>
import { bus } from "@/main.js";
import { mapActions, mapGetters } from "vuex";

import Editable from "../../../../gerneral/Editable.vue";
import SelectDialog from "../../../../gerneral/SelectDialog.vue";
import ExternalDialog from "../../../../gerneral/ExternalDialog/ExternalDialog.vue";

export default {
  name: "Evaluatives",

  components: {
    Editable,
    SelectDialog,
    ExternalDialog,
  },

  props: {
    resource: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      valid: true,
      selected: [],
      tableItems: [],
      dialog: false,
      externalDialog: false,
      headers: {
        student: [
          {
            text: "#",
            align: "start",
            sortable: true,
            value: "number",
            cellClass: "pointer",
          },
          { text: "Exercise", value: "name", cellClass: "pointer" },
          { text: "Type", value: "type", cellClass: "pointer" },
          { text: "Solved", value: "grade", cellClass: "pointer" },
        ],
        author: [
          {
            text: "#",
            align: "start",
            sortable: true,
            value: "number",
            cellClass: "pointer",
          },
          { text: "Type", value: "type", cellClass: "pointer" },
          { text: "Exercise", value: "name", cellClass: "pointer" },
        ],
        viewer: [
          {
            text: "#",
            align: "start",
            sortable: true,
            value: "number",
            cellClass: "pointer",
          },
          { text: "Type", value: "type", cellClass: "pointer" },
          { text: "Exercise", value: "name", cellClass: "pointer" },
        ],
      },
      addEvaluativeMenu: [
        { title: "NEW QUIZ", value: "quiz" },
        { title: "NEW PROG. EX.", value: "prog" },
        { title: "SELECT", value: "select" },
        { title: "EXTERNAL", value: "external" },
      ],
    };
  },

  created() {
    this.updateTableItems();
    if (this.getValidated) {
      const notValid = this.resource.evaluatives.filter((e) => !e.valid);
      this.selected = this.tableItems.filter((e) =>
        notValid.map((ev) => ev.id).includes(e.id)
      );
    }
    bus.$on("addExternalExercises", (payload) => {
      this.addExternalExercises(payload);
    });
  },

  async mounted() {
    //await this.fetchCourse();
    this.updateTableItems();
  },

  watch: {
    'resource.evaluatives': {
      handler() {
        this.updateTableItems();
      },
      deep: true
    },
    getValids() {
      if (this.getValidated) {
        const notValid = this.resource.evaluatives.filter((e) => !e.valid);
        this.selected = this.tableItems.filter((e) =>
          notValid.map((ev) => ev.id).includes(e.id)
        );
      }
    },
  },

  computed: {
    ...mapGetters("main", ["getStatusByResourceID", "getValidated"]),
    ...mapGetters("request", [
      "fetchCourse",
      "getRole",
      "isStudent",
      "isTeacher",
      "isAuthor",
      "isViewer",
    ]),
    ...mapGetters("style", [
      "getSubtitleClass",
      "getIconMediumSize",
      "getIconSmallSize",
      "getSmallTextClass",
      "getIcon",
      "getButtonMediumSize",
      "getButtonSmallSize",
    ]),
    getValids() {
      return this.resource.evaluatives.map((e) => e.valid);
    },
    loadResource() {
      return this.tableItems;
    },
    evaluativesNotNull() {
      return this.resource.evaluatives.length > 0;
    },
  },

  methods: {
    ...mapActions("main", [
      "editableInput",
      "addQuizByLessonID",
      "addProgExByLessonID",
      "addEvaluativeByLessonID2",
      "deleteEvaluativeByID",
    ]),
    ...mapActions("request", ["addExistingEvaluatives"]),
    addEvaluative(type) {
      if (type == "quiz") {
        this.addQuizByLessonID(this.resource.id);
      } else if (type == "prog") {
        this.addProgExByLessonID(this.resource.id);
      } else if (type == "select") {
        this.dialog = true;
      } else if (type == "external") {
        this.externalDialog = true;
      }
    },
    play(value) {
      bus.$emit("changeIt", [value.id, "evaluative"]);
    },
    async addExistingEval(ids) {
      await this.addExistingEvaluatives([this.resource.id, ids]);
      this.dialog = false;
    },
    addExternalExercises(exercises) {
      this.externalDialog = false;
      exercises.forEach((e) => {
        this.addEvaluativeByLessonID2([this.resource.id, e]);
      });
    },
    getColor(status) {
      status = +status;
      if (status == 0) return "red";
      else if (status < 100) return "orange";
      else return "green";
    },
    updateTableItems() {
      if (!this.resource.evaluatives || this.resource.evaluatives.length < 1) {
        this.tableItems = [];
        return;
      }

      if (this.isStudent) {
        this.tableItems = this.resource.evaluatives.map((evaluative, index) => ({
          number: index + 1,
          id: evaluative.id,
          name: evaluative.name,
          type: evaluative.type,
          grade: Number(this.getStatusByResourceID(evaluative.id).grade.toFixed(1)),
          action: "",
        }));
      } else {
        this.tableItems = this.resource.evaluatives.map((evaluative, index) => ({
          number: index + 1,
          id: evaluative.id,
          name: evaluative.name,
          type: evaluative.type,
          contentType: evaluative.contentType,
        }));
      }
    },
  },
};
</script>

<style scoped>
.my-data-table tbody tr:hover {
  cursor: pointer;
}

#evaluatives >>> .v-data-table__selected {
  background-color: transparent;
}
#evaluatives >>> .v-data-table__selected td:first-child {
  border-top: 2px solid red;
  border-bottom: 2px solid red;
  border-left: 2px solid red;
}
#evaluatives >>> .v-data-table__selected td:not(:first-child):not(:last-child) {
  border-top: 2px solid red;
  border-bottom: 2px solid red;
}
#evaluatives >>> .v-data-table__selected td:last-child {
  border-top: 2px solid red;
  border-bottom: 2px solid red;
  border-right: 2px solid red;
}
</style>
