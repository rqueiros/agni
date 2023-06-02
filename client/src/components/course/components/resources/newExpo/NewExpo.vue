<template>
  <div id="newExpo">
    <v-card class="mx-auto" max-width="100%" outlined
      style="display: flex; justify-content: center; align-items: center;">
      <v-row style="margin:0;height:15rem; display: flex; justify-content: center; align-items: center; padding:1em">
        <v-col cols="6">
          <v-file-input class="course_smallText course_button" label="File input" v-model="file" prepend-icon=""
            outlined></v-file-input>
        </v-col>
        <v-col cols="6">
          <v-btn class="course_smallText course_button" outlined @click="select">Select Expositive</v-btn>
        </v-col>
      </v-row>
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
        <v-data-table :items="expositives" :headers="tableHeaders" hide-default-header hide-default-footer :loading="loading" height="200px"  class="overflow-y-auto my-3 elevation-2" :search="search">

          <template v-slot:item.name="{ item }">
            <v-checkbox v-model="checkboxes" :value="item.id" :label="item.name" hide-details class="px-8"
              :prepend-icon="getIcon(item.type)"></v-checkbox>
          </template>
        </v-data-table>
        <v-card-actions>
          <v-btn outlined text @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn outlined text @click="addExpositives">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "Expositives",
  components: {},
  props: {
    resource: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      expositives: [],
      index: 0,
      expo: {},
      file: [],
      dialog: false,
      loading: false,
      tableHeaders: [{ value: "name" }],
      checkboxes: [],
      search:"",
    };
  },
  computed: {
    ...mapGetters(["getResourceById", "getProgressFromResourceId", "getLessonByResourceId"])
  },
  watch: {
    file: function (newFile, oldFile) {
      if (newFile !== oldFile) {
        if (newFile != [] && newFile != undefined) {
          this.changeExpositiveTypeById([this.resource.id, newFile]);
        }
      }
    },
    dialog(newV){
      if (!newV){
        this.checkboxes = [];
      }
    }
  },

  created() { },

  methods: {
    ...mapMutations(["changeExpositiveTypeById"]),
    ...mapActions(["fetchCollectionTypes", "addExistingExpositives"]),
    async select() {
      const parameters = {
        collectionType: "expositive"
      };
      this.dialog = true
      this.loading = true;
      let lessonIds = this.getLessonByResourceId(this.resource.id).expositives.map(e => e.id)
      let fetchedExpositives = await this.fetchCollectionTypes(parameters);
      this.expositives = fetchedExpositives.filter(e => !lessonIds.includes(e.id))
      this.loading = false;
    },
    async addExpositives(){
      let lessonId = this.getLessonByResourceId(this.resource.id).id
      await this.addExistingExpositives([lessonId, this.checkboxes, this.resource.id])
      this.dialog = false
    },
    getIcon(type) {
      if (type == "Contest") return "mdi-trophy";
      else if (type == "Course") return "mdi-school-outline";
      else if (type == "Test/Exam") return "mdi-note-edit-outline";
      else if (type == "programming-exercise") return "mdi-code-json";
      else if (type == "quiz") return "mdi-head-question-outline";
      else if (type == "pdf") return "mdi-file-pdf-box";
      else if (type == "video") return "mdi-video";
    },
  }
};
</script>

<style scoped>
#newExpo>>>.v-text-field--outlined .v-label {
  top: auto !important;
}

#newExpo>>>.v-text-field--outlined>.v-input__control>.v-input__slot {
  min-height: 0 !important;
}
</style>
