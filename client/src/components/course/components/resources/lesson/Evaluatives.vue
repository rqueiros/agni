<template>
  <div id="evaluatives" v-if="evaluativesNotNull || isAuthor">

    <v-card class="rounded-0" style="border-left: 0; border-right: 0;">
      <!--Author-->
      <v-menu offset-y auto v-if="!evaluativesNotNull && isAuthor">
        <template v-slot:activator="{ on, attrs }">
          <v-btn width="100%" v-bind="attrs" v-on="on" class="course_button" small>
            <v-icon>mdi-plus</v-icon>Add Exercises
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item v-for="(item, index) in addEvaluativeMenu" :key="index" link @click="addEvaluative(item.value)">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!--Student-->
      <v-data-table :headers="headers.student" :items="loadResource" @click:row="play" v-if="isStudent"
        mobile-breakpoint="0" :no-data-text="''" dense>
        <template v-slot:top>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle :class="getSubtitleClass">Exercises:</v-list-item-subtitle>
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
      <v-data-table :headers="headers.author" :items="loadResource" v-if="isAuthor && evaluativesNotNull" mobile-breakpoint="0"
        :no-data-text="''" hide-default-footer>
        <template v-slot:top>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle :class="getSubtitleClass">Exercises:</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
        <template v-slot:body="{ items }">
          <tbody>
            <template v-for="item in items">
              <tr v-if="item.type != 'new'" :key="item.id" @click="play(item)">
                <td>{{ item.id }}</td>
                <td>
                  <v-icon :title="item.contentType" :size="getIconMediumSize">
                    {{ getIcon(item.contentType) }}
                  </v-icon>
                </td>
                <td>
                  <span :class="getSmallTextClass">
                    <Editable :type="'evaluative'" :value="item.name" :id="item.rid" :field="'name'"
                      @input="editableInput" placeholder="Exercise name" onclick="event.stopPropagation()"/>
                  </span>
                </td>
                <td>
                  <v-btn 
                  x-small
                  :class="getBUTTONSTYLE ? 'ma-0 pa-0' : ''" 
                  :min-width="getBUTTONSTYLE ? 0 : ''"
                  :icon="!getBUTTONSTYLE"
                  @click="deleteEvaluative(item.rid)">
                    <v-icon :size="getIconSmallSize"> mdi-delete </v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
            <template>
              <tr style="background-color: transparent !important">
                <td :colspan="headers.author.length" class="pa-0">
                  <!--
                  <v-btn width="100%" @click="addEvaluative" class="course_button my-3" small>
                    <v-icon>mdi-plus</v-icon> Add Exercise
                  </v-btn>-->
                  <v-menu offset-y auto>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn width="100%" v-bind="attrs" v-on="on" class="course_button my-3" small>
                        <v-icon>mdi-plus</v-icon>Add Exercises
                      </v-btn>
                    </template>
                    <v-list dense>
                      <v-list-item v-for="(item, index) in addEvaluativeMenu" :key="index" link
                        @click="addEvaluative(item.value)">
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </td>
              </tr>
            </template>
          </tbody>
        </template>
      </v-data-table>

      <!--Viewer-->
      <v-data-table :headers="headers.viewer" :items="loadResource" @click:row="play" v-if="isViewer"
        mobile-breakpoint="0" :no-data-text="''">
        <template v-slot:top>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle :class="getSubtitleClass">Exercises:</v-list-item-subtitle>
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

    <SelectDialog 
    :dialog="dialog" 
    :type="'evaluatives'" 
    :already="resource.evaluatives.map(e => e.id)"
    @addExistingevaluatives="addExistingEval" 
    @closeSelectDialog="closeSelectDialog"/>
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
import { mapActions, mapGetters, mapMutations } from "vuex";

import Editable from "../../../../gerneral/Editable.vue";
import SelectDialog from "../../../../gerneral/SelectDialog.vue";

export default {
  name: "Evaluatives",

  components: {
    Editable,
    SelectDialog
  },

  props: {
    resource: {
      type: Object,
      default: () => { }
    },
  },

  data() {
    return {
      dialog: false,
      headers: {
        student: [
          { text: "#", align: "start", sortable: true, value: "id" },
          { text: "Name", value: "name" },
          { text: "Type", value: "type" },
          { text: "Solving status (%)", value: "grade" },
          { text: "Actions", value: "action" }
        ],
        author: [
          { text: "#", align: "start", sortable: true, value: "id" },
          { text: "Type", value: "type" },
          { text: "Name", value: "name" },
          { text: "", value: "" }
        ],
        viewer: [
          { text: "#", align: "start", sortable: true, value: "id" },
          { text: "Type", value: "type" },
          { text: "Name", value: "name" }
        ],
      },
      addEvaluativeMenu: [
        { title: "New Quiz", value: "quiz" },
        { title: "New Prog Ex", value: "prog" },
        { title: "Select Exercise", value: "select" }
      ],
    };
  },

  created() {
    this.loadResource;
  },

  computed: {
    ...mapGetters("main", [
      "getResourceById",
      "getStatusByResourceId",
      "getRole",
      "isStudent",
      "isTeacher",
      "isAuthor",
      "isViewer",
      "getBUTTONSTYLE"
    ]),
    ...mapGetters("style", [
      "getSubtitleClass",
      "getIconMediumSize",
      "getIconSmallSize",
      "getSmallTextClass",
      "getIcon",
    ]),
    loadResource() {
      let ev = [];
      if (
        !("evaluatives" in this.resource) ||
        this.resource.evaluatives.length < 1
      ) {
        ev = [];
      } else if (this.isStudent) {
        let i = 1;
        this.resource.evaluatives.forEach(evaluative => {
          let grade = this.getStatusByResourceId(evaluative.id).grade;
          ev.push({
            id: i,
            rid: evaluative.id,
            name: evaluative.name,
            type: evaluative.type,
            grade: grade,
            action: ""
          });
          i++;
        });
      } else {
        let i = 1;
        this.resource.evaluatives.forEach(evaluative => {
          ev.push({
            id: i,
            rid: evaluative.id,
            name: evaluative.name,
            type: evaluative.type,
            contentType: evaluative.contentType
          });
          i++;
        });
      }
      return ev;
    },
    evaluativesNotNull() {
      return this.resource.evaluatives.length > 0;
    }
  },

  methods: {
    ...mapMutations("main", [
      "addEvaluativeByLessonId",
      "changeEvaluativeTypeById",
      "deleteEvaluative",
      "editableInput",
      "addQuizByLessonId",
      "addProgExByLessonId"
    ]),
    ...mapActions("main", ["fetchCollectionTypes", "addExistingEvaluatives"]),
    changeEvaluativeType(id, type) {
      this.changeEvaluativeTypeById([id, type]);
    },
    addEvaluative(type) {
      if (type == "quiz") {
        this.addQuizByLessonId(this.resource.id)
      } else if (type == "prog") {
        this.addProgExByLessonId(this.resource.id)
      } else if (type == "select") {
        this.dialog = true;
      }
      //this.addEvaluativeByLessonId(this.resource.id);
    },
    play(value) {
      bus.$emit("changeIt", [value.rid, "evaluative"]);
    },
    async addExistingEval(ids){
      await this.addExistingEvaluatives([this.resource.id, ids])
      this.closeSelectDialog()
    },
    closeSelectDialog(){
      this.dialog=false
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
