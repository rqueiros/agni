<template>
  <div id="evaluatives" v-if="evaluativesNotNull || isAuthor">
    <v-card outlined class="rounded-0" style="border-left: 0; border-right: 0;">
      <!--Author-->
      <v-btn
        width="100%"
        v-if="!evaluativesNotNull && isAuthor && !showEvaluatives"
        @click="showEvaluatives = true"
        class="course_button"
        small
      >
        <v-icon>mdi-plus</v-icon>Exercises
      </v-btn>

      <!--Student-->
      <v-data-table
        :headers="studentHeaders"
        :items="loadResource"
        @click:row="play"
        v-if="showEvaluatives && isStudent"
        mobile-breakpoint="0"
        :no-data-text="''"
      >
        <template v-slot:top>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle :class="getSubtitleClass"
                >Exercises:</v-list-item-subtitle
              >
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
      <v-data-table
        :headers="authorHeaders"
        :items="loadResource"
        v-if="showEvaluatives && isAuthor"
        mobile-breakpoint="0"
        :no-data-text="''"
        hide-default-footer
      >
        <template v-slot:top>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle :class="getSubtitleClass"
                >Exercises:</v-list-item-subtitle
              >
            </v-list-item-content>
            <v-btn icon @click="removeEvaluatives" small class="mr-1">
              <v-icon :size="getIconMediumSize"> mdi-delete </v-icon>
            </v-btn>
          </v-list-item>
        </template>
        <template v-slot:body="{ items }">
          <tbody>
            <template v-for="item in items">
              <tr
                v-if="item.type == 'new'"
                style="background-color: transparent !important"
                :key="item.id"
              >
                <td :colspan="authorHeaders.length" style="padding: 0 auto"> <!--TODO change this-->
                  <v-btn
                    outlined
                    class="exercise_buttons"
                    @click="changeEvaluativeType(item.rid, 'quiz')"
                  >
                    Quiz
                  </v-btn>
                  <v-btn
                    outlined
                    class="exercise_buttons"
                    @click="changeEvaluativeType(item.rid, 'code')"
                  >
                    ProgrammingEx
                  </v-btn>
                  <v-btn outlined class="exercise_buttons" @click="select(item.rid)"> Select </v-btn>
                  <v-btn outlined class="exercise_buttons"> Import </v-btn>
                  <v-btn
                    icon
                    class="course_iconButtonS"
                    @click="deleteEvaluative(item.rid)"
                  >
                    <v-icon
                      class="course_IconS"
                      style="padding: 0 0.8vw !important;"
                      >mdi-delete</v-icon
                    >
                  </v-btn>
                </td>
              </tr>
              <tr v-if="item.type != 'new'" :key="item.id" @click="play(item)">
                <td>{{ item.id }}</td>
                <td>
                  <v-icon :title="item.contentType" :size="getIconMediumSize">
                    {{ getIcon(item.contentType) }}
                  </v-icon>
                </td>
                <td>
                  <span :class="getSmallTextClass">
                    <Editable
                      :type="'evaluative'"
                      :value="item.name"
                      :id="item.rid"
                      :field="'name'"
                      @input="editableInput"
                      placeholder="Exercise name"
                      onclick="event.stopPropagation()"
                    ></Editable>
                  </span>
                </td>
                <td>
                  <v-btn
                    icon
                    @click="deleteEvaluative(item.rid)"
                    class="course_iconButtonS"
                  >
                    <v-icon :size="getIconSmallSize"> mdi-delete </v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
            <template>
              <tr style="background-color: transparent !important">
                <td :colspan="authorHeaders.length" class="pa-0">
                  <v-btn
                    width="100%"
                    @click="addEvaluative"
                    class="course_button my-3"
                    small
                  >
                    <v-icon>mdi-plus</v-icon> Add Exercise
                  </v-btn>
                </td>
              </tr>
            </template>
          </tbody>
        </template>
      </v-data-table>

      <!--Viewer-->
      <v-data-table
        :headers="viewerHeaders"
        :items="loadResource"
        @click:row="play"
        v-if="showEvaluatives && isViewer"
        mobile-breakpoint="0"
        :no-data-text="''"
      >
        <template v-slot:top>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle :class="getSubtitleClass"
                >Exercises:</v-list-item-subtitle
              >
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

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
        <v-data-table :items="dialogEvaluatives" :headers="dialogHeaders" hide-default-header hide-default-footer :loading="loading" height="200px"  class="overflow-y-auto my-3 elevation-2" :search="search">
          <template v-slot:item.name="{ item }">
            <v-checkbox v-model="checkboxes" :value="item.id" :label="item.name" hide-details class="px-8"
              :prepend-icon="getIcon(item.type)"></v-checkbox>
          </template>
        </v-data-table>
        <v-card-actions>
          <v-btn outlined text @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn outlined text @click="addExistEvaluative">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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

export default {
  name: "Evaluatives",

  components: {
    Editable
  },

  props: {
    resource: {
      type: Object,
      default: () => {}
    },
  },

  data() {
    return {
      studentHeaders: [
        { text: "#", align: "start", sortable: true, value: "id" },
        { text: "Name", value: "name" },
        { text: "Type", value: "type" },
        { text: "Solving status (%)", value: "grade" },
        { text: "Actions", value: "action" }
      ],
      authorHeaders: [
        { text: "#", align: "start", sortable: true, value: "id" },
        { text: "Type", value: "type" },
        { text: "Name", value: "name" },
        { text: "", value: "" }
      ],
      viewerHeaders: [
        { text: "#", align: "start", sortable: true, value: "id" },
        { text: "Type", value: "type" },
        { text: "Name", value: "name" }
      ],
      evaluatives: [],
      showEvaluatives: false,
      dialog:false,
      dialogEvaluatives:[],
      dialogHeaders:[{ value: "name" }],
      checkboxes: [],
      search:"",
      loading:false,
      thatEval:0,
    };
  },

  watch: {
    dialog(newV){
      if (!newV){
        this.checkboxes = [];
      }
    }
  },

  created() {
    this.loadResource;
  },

  computed: {
    ...mapGetters([
      "getResourceById",
      "getStatusByResourceId",
      "getRole",
      "getSubtitleClass",
      "getIconMediumSize",
      "getIconSmallSize",
      "getSmallTextClass",
      "isStudent",
      "isTeacher",
      "isAuthor",
      "isViewer",
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
        this.setShowEvaluatives(true);
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
    ...mapMutations([
      "addEvaluativeByLessonId",
      "changeEvaluativeTypeById",
      "deleteEvaluative",
      "editableInput"
    ]),
    ...mapActions(["fetchCollectionTypes", "addExistingEvaluatives"]),
    async select(id) {
      this.thatEval = id
      const parameters = {
        collectionType: "evaluative"
      };
      this.dialog = true
      this.loading = true;
      let lessonIds = this.resource.evaluatives.map(e => e.id)
      let fetchedEvaluatives = await this.fetchCollectionTypes(parameters);
      this.dialogEvaluatives = fetchedEvaluatives.filter(e => !lessonIds.includes(e.id))
      this.loading = false;
    },
    async addExistEvaluative(){
      let lessonId = this.resource.id
      await this.addExistingEvaluatives([lessonId, this.checkboxes, this.thatEval])
      this.dialog = false;
    },
    setShowEvaluatives(value) {
      this.showEvaluatives = value;
    },
    changeEvaluativeType(id, type) {
      this.changeEvaluativeTypeById([id, type]);
    },
    addEvaluative() {
      this.addEvaluativeByLessonId(this.resource.id);
    },
    removeEvaluatives() {
      this.resource.evaluatives = [];
      this.showEvaluatives = false;
      //TODO removes also from store???
    },
    play(value) {
      bus.$emit("changeIt", [value.rid, "evaluative"]);
    },
    getIcon(type) {
      let icon = "";
      switch (type) {
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
