<template>
  <div id="evaluatives" v-if="evalLen || isAuthor">
    <v-card outlined class="rounded-0" style="border-left: 0; border-right: 0;">

      <!--Author-->
      <v-btn width="100%" v-if="!evalLen && isAuthor && !showEvaluatives" @click="showEvaluatives = true"
        class="course_button" small>
        <v-icon>mdi-plus</v-icon>Exercises
      </v-btn>

      <!--Student-->
      <v-data-table :headers="headers" :items="loadResource" @click:row="play" v-if="showEvaluatives && isStudent"
        mobile-breakpoint="0" :no-data-text="''">
        <template v-slot:top>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle :class="getSubtitleClass(screenSize)">Exercises:</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
        <template v-slot:item.type="{ item }">
          <v-icon :title="item.type">
            {{ getIcon(item.type) }}
          </v-icon>
        </template>
        <template v-slot:item.grade="{ item }">
          <v-chip :color="getColor(item.grade)" dark>
            {{ item.grade }}%
          </v-chip>
        </template>
        <template v-slot:item.action="{ item }">
          <v-btn icon @click="play(item)">
            <v-icon>mdi-clipboard-play</v-icon>
          </v-btn>
        </template>
      </v-data-table>

      <!--Author-->
      <v-data-table :headers="teacherHeaders" :items="loadResource" v-if="showEvaluatives && isAuthor"
        mobile-breakpoint="0" :no-data-text="''" hide-default-footer>
        <template v-slot:top>
          <v-list-item style="min-height: 0; padding-right: 0;">
            <v-list-item-content>
              <v-list-item-subtitle :class="getSubtitleClass(screenSize)">Exercises:</v-list-item-subtitle>
            </v-list-item-content>
            <v-btn icon @click="removeEvaluatives" small class="mr-1">
              <v-icon :size="getIconMediumSize(screenSize)"> mdi-delete </v-icon>
            </v-btn>
          </v-list-item>
        </template>
        <template v-slot:body="{ items }">
          <tbody>
            <template v-for="item in items">
              <tr v-if="item.type == 'new'" style="background-color: transparent !important" :key="item.id">
                <td :colspan="headers.length" style="padding: 0 auto">
                  <v-btn outlined class="exercise_buttons" @click="changeEvaluativeType(item.rid, 'quiz')">
                    Quiz
                  </v-btn>
                  <v-btn outlined class="exercise_buttons" @click="changeEvaluativeType(item.rid, 'code')">
                    ProgrammingEx
                  </v-btn>
                  <v-btn outlined class="exercise_buttons"> Select </v-btn>
                  <v-btn outlined class="exercise_buttons"> Import </v-btn>
                  <v-btn icon class="course_iconButtonS" @click="deleteEvaluative(item.rid)">
                    <v-icon class="course_IconS" style="padding: 0 0.8vw !important;">mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
              <tr v-if="item.type != 'new'" :key="item.id" @click="play(item)">
                <td>{{ item.id }}</td>
                <td>
                  <v-icon :title="item.contentType" :size="getIconMediumSize(screenSize)">
                    {{ getIcon(item.contentType) }}
                  </v-icon>
                </td>
                <td>
                  <span :class="getSmallTextClass(screenSize)">
                    <Editable :type="'evaluative'" :value="item.name" :id="item.rid" :field="'name'"
                      @input="editableChange" placeholder="Exercise name" onclick="event.stopPropagation()"></Editable>
                  </span>
                </td>
                <td>
                  <v-btn icon @click="deleteEvaluative(item.rid)" class="course_iconButtonS">
                    <v-icon :size="getIconSmallSize(screenSize)"> mdi-delete </v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
            <template>
              <tr style="background-color: transparent !important">
                <td :colspan="teacherHeaders.length" class="pa-0">
                  <v-btn width="100%" @click="addEvaluative" class="course_button my-3" small>
                    <v-icon>mdi-plus</v-icon> Add Exercise
                  </v-btn>
                </td>
              </tr>
            </template>
          </tbody>
        </template>
      </v-data-table>

      <!--Viewer-->
      <v-data-table :headers="viewerHeaders" :items="loadResource" @click:row="play" v-if="showEvaluatives && isViewer"
        mobile-breakpoint="0" :no-data-text="''">
        <template v-slot:top>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle :class="getSubtitleClass(screenSize)">Exercises:</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
        <template v-slot:item.type="{ item }">
          <v-icon :title="item.type">
            {{ getIcon(item.type) }}
          </v-icon>
        </template>
      </v-data-table>

    </v-card>
  </div>
  <!---------------comment----------------------------------------------
        <template v-if="isTeacher" v-slot:body.append="{ headers }">
          <tr style="background-color: transparent !important;">
            <td :colspan="headers.length" style="padding:0 0.4vw">
              <v-btn outlined class="exercise_buttons">
                Quiz
              </v-btn>
              <v-btn outlined class="exercise_buttons">
                ProgrammingEx
              </v-btn>
              <v-btn outlined class="exercise_buttons">
                Select
              </v-btn>
              <v-btn outlined class="exercise_buttons">
                Import
              </v-btn>
              <v-btn icon class="exercise_buttons" style="width:1.5vw;">
                <v-icon style="font-size: 1.5vw;">mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
          <tr style="background-color: transparent !important;">
            <td :colspan="headers.length" style="padding: 0">
              <v-btn style="width: 100%;">
                <v-icon>mdi-plus</v-icon> Add Exercise
              </v-btn>
            </td>
          </tr>
        </template>
        -->
</template>

<script>
import { bus } from "@/main.js";
import { mapGetters, mapMutations } from "vuex";
import Editable from "../../../../../components/Editable.vue";

export default {
  name: "Evaluatives",

  components: {
    Editable
  },

  props: {
    resource: {
      type: Object,
      default: () => { }
    },
    screenSize: {
      type: String,
      default: () => ""
    }
  },

  data() {
    return {
      headers: [
        { text: "#", align: "start", sortable: true, value: "id" },
        { text: "Name", value: "name" },
        { text: "Type", value: "type" },
        { text: "Solving status (%)", value: "grade" },
        { text: "Actions", value: "action" }
      ],
      teacherHeaders: [
        { text: "#", align: "start", sortable: true, value: "id" },
        { text: "Type", value: "type" },
        { text: "Name", value: "name" },
        { text: "", value: "" }
      ],
      viewerHeaders: [
        { text: "#", align: "start", sortable: true, value: "id" },
        { text: "Type", value: "type" },
        { text: "Name", value: "name" },
      ],
      evaluatives: [],
      showEvaluatives: false
    };
  },

  created() {
    this.loadResource;
  },

  computed: {
    ...mapGetters([
      "getResourceById", "getStatusByResourceId", "getRole",
      "getSubtitleClass", "getIconMediumSize", "getIconSmallSize", "getSmallTextClass"
    ]),
    loadResource() {
      let ev = [];
      if (
        !("evaluatives" in this.resource) ||
        this.resource.evaluatives.length < 1
      ) {
        ev = [];
      } else if (this.isStudent) {
        this.setShowEvaluatives(true);
        let i = 1;
        this.resource.evaluatives.forEach(evaluative => {
          let grade = this.getStatusByResourceId(evaluative.strapiId).grade;
          ev.push({
            id: i,
            rid: evaluative.strapiId,
            name: evaluative.name,
            type: evaluative.type,
            grade: grade,
            action: ""
          });
          i++;
        });
      } else {
        this.setShowEvaluatives(true);
        let i = 1;
        this.resource.evaluatives.forEach(evaluative => {
          ev.push({
            id: i,
            rid: evaluative.strapiId,
            name: evaluative.name,
            type: evaluative.type,
            contentType: evaluative.contentType
          });
          i++;
        });
      }
      return ev;
    },
    evalLen() {
      return this.resource.evaluatives.length > 0;
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
    }
  },

  methods: {
    ...mapMutations([
      "addEvaluativeByLessonId",
      "changeEvaluativeTypeById",
      "deleteEvaluative",
      "editableInput"
    ]),
    editableChange(obj) {
      this.editableInput(obj);
    },
    setShowEvaluatives(value) {
      this.showEvaluatives = value;
    },
    changeEvaluativeType(id, type) {
      this.changeEvaluativeTypeById([id, type]);
    },
    addEvaluative() {
      this.addEvaluativeByLessonId(this.resource.strapiId);
    },
    removeEvaluatives() {
      this.resource.evaluatives = [];
      this.showEvaluatives = false;
    },
    play(value) {
      bus.$emit("changeIt", [value.rid, "evaluative"]);
    },
    getIcon(subtype) {
      let icon = "";
      switch (subtype) {
        case "blank":
          icon = "mdi-text-box-outline";
          break;
        case "skeleton":
          icon = "mdi-text-box-plus-outline";
          break;
        case "buggy":
          icon = "mdi-bug";
          break;
        case "quiz":
          icon = "mdi-head-question-outline";
          break;
        default:
          icon = "mdi-code-json";
          break;
      }
      return icon;
    },
    getColor(status) {
      status = +status;
      if (status == 0) return "red";
      else if (status < 100) return "orange";
      else return "green";
    }
  }
};
</script>

<style>
.exercise:hover {
  cursor: pointer;
}

.exercise_buttons {
  height: 1.5vw !important;
  font-size: 0.7vw !important;
  padding: 0 1.1em !important;
  margin: 0 0.5em;
}
</style>
