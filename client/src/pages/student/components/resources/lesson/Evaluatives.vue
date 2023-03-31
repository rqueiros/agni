<template>
  <div id="evaluatives" v-if="evalLen || isTeacher">
    <v-card outlined>
      <v-btn style="width: 100%; margin-bottom:2vw" v-if="!evalLen && isTeacher && !showEvaluatives" @click="showEvaluatives = true">
        <v-icon>mdi-plus</v-icon>Exercises
      </v-btn>
      <v-data-table :headers="headers" :items="evaluatives" class="elevation-1" @click:row="play2"
        v-if="showEvaluatives" mobile-breakpoint="0">
        <template v-slot:top>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="resource_subtitle">Exercises:</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-avatar tile @click="removeEvaluatives" class="exercise" v-if="isTeacher">
              <v-icon class="box_icon" small>
                mdi-delete
              </v-icon>
            </v-list-item-avatar>
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
    </v-card>
  </div>
</template>

<script>
import { bus } from "@/main.js";
import { mapGetters } from "vuex";
export default {
  name: "Evaluatives",

  components: {},

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
      evaluatives: [],
      role: "",
      showEvaluatives: false
    };
  },

  created() {
    this.role = this.getRole
    if (!("evaluatives" in this.resource) || (this.resource.evaluatives.lenght == 0)) {
      this.evaluatives = []
    } else {
      this.showEvaluatives = true
      let i = 1;
      this.resource.evaluatives.forEach(evaluative => {
        let grade = this.getStatusByResourceId(evaluative.strapiId).grade;
        this.evaluatives.push({
          id: i,
          rid: evaluative.strapiId,
          name: evaluative.name,
          type: evaluative.type,
          grade: grade,
          action: ""
        });
        i++;
      });
    }
  },

  computed: {
    ...mapGetters(["getResourceById", "getStatusByResourceId", "getRole"]),
    evalLen() {
      return this.evaluatives.length > 0
    },
    isStudent() {
      return this.role == "student"
    },
    isTeacher() {
      return this.role == "teacher"
    }
  },

  methods: {
    removeEvaluatives(){
      this.evaluatives=[]
      this.showEvaluatives=false
    },
    play(value) {
      bus.$emit("changeIt", [value.rid, "evaluative"]);
    },
    play2(value) {
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
</style>
