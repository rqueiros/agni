<template>
  <div id="evaluatives" v-if="evalLen || isTeacher">
    <v-card outlined>

      <!---------------STUDENT------------------------------------------------->
      <v-data-table :headers="headers" :items="loadResource" class="elevation-1" @click:row="play2"
        v-if="showEvaluatives && isStudent" mobile-breakpoint="0" :no-data-text="''">
        <template v-slot:top>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="course_subtitle">Exercises:</v-list-item-subtitle>
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
      <!---->


      <!---------------TEACHER------------------------------------------------->

      <v-btn style="width: 100%" v-if="!evalLen && isTeacher && !showEvaluatives" @click="showEvaluatives = true"
        class="course_button course_text">
        <v-icon>mdi-plus</v-icon>Exercises
      </v-btn>

      <!--
      <div style="height:2rem">
        <span class="resource_subtitle">Exercises:</span>
        <v-btn icon style="min-width: 0;" @click="removeExpositives" class="course_iconButtonL">
          <v-icon class="box_icon" small> mdi-delete </v-icon>
        </v-btn>
      </div>-->


      <v-data-table :headers="teacherHeaders" :items="loadResource" class="elevation-1"
        v-if="showEvaluatives && isTeacher" mobile-breakpoint="0" :no-data-text="''">
        <template v-slot:top >
          <v-list-item style="min-height: 0; padding-right: 0;">
            <v-list-item-content>
              <v-list-item-subtitle class="course_subtitle">Exercises:</v-list-item-subtitle>
            </v-list-item-content>
              <v-btn icon class="course_iconButtonL" @click="removeEvaluatives">
                <v-icon> mdi-delete </v-icon>
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
                  <v-icon :title="item.type" class="course_IconS">
                    {{ getIcon(item.type) }}
                  </v-icon>
                </td>
                <td>
                  <Editable :type="'evaluative'" :value="item.name" :id="item.rid" :field="'name'" @input="editableChange" placeholder="Exercise name"
                    onclick="event.stopPropagation()"></Editable>
                </td>
                <td>
                  <v-btn icon @click="deleteEvaluative(item.rid)" class="course_iconButtonS">
                    <v-icon class="course_IconS"> mdi-delete </v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
            <template>
              <tr style="background-color: transparent !important">
                <td :colspan="headers.length" style="padding: 0">
                  <v-btn style="width: 100%" @click="addEvaluative" class="course_button course_text">
                    <v-icon>mdi-plus</v-icon> Add Exercise
                  </v-btn>
                </td>
              </tr>
            </template>
          </tbody>
        </template>
      </v-data-table>
      <!---->

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
    }
  },

  data() {
    return {
      headers: [
        {
          text: "#",
          align: "start",
          sortable: true,
          value: "id"
        },
        { text: "Name", value: "name" },
        { text: "Type", value: "type" },
        { text: "Solving status (%)", value: "grade" },
        { text: "Actions", value: "action" }
      ],
      teacherHeaders: [
        {
          text: "#",
          align: "start",
          sortable: true,
          value: "id"
        },
        { text: "Type", value: "type" },
        { text: "Name", value: "name" },
        { text: "", value: "" }
      ],
      evaluatives: [],
      role: "",
      showEvaluatives: false
    };
  },

  created() {
    this.role = this.getRole;
    this.loadResource;
  },

  computed: {
    ...mapGetters(["getResourceById", "getStatusByResourceId", "getRole"]),
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
            type: evaluative.type
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
      return this.role == "student";
    },
    isTeacher() {
      return this.role == "teacher";
    }
  },

  methods: {
    ...mapMutations([
      "addEvaluativeByLessonId",
      "changeEvaluativeTypeById",
      "deleteEvaluative",
      "editableInput"
    ]),
    handleButtonClick() {
      console.log("Button clicked");
    },
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
      console.log(value)
      bus.$emit("changeIt", [value.rid, "evaluative"]);
    },
    play2(value) {
      console.log(value)
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
