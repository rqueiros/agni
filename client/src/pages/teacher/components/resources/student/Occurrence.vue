<template>
  <div id="occurrence">
    <v-container fluid class="pa-0">
      <v-row no-gutters class="mb-4">
        <v-col cols="2" class="mr-2">
          <v-card width="100%" height="100%" outlined style="border-color: #C3C3C3;" class="px-2 py-1">
            <Editable :type="'occurrence'" placeholder="Year" :value="occurrence.year.toString()" :id="occurrence.id"
              :field="'year'" @input="editableInput" />
            <span v-if="false">{{ occurrence.year }}</span>
          </v-card>
        </v-col>

        <v-col cols="2" class="mx-2">
          <v-card width="100%" outlined style="border-color: #C3C3C3;" class="px-2">
            <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
              offset-y min-width="auto">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field hide-details v-model="startDate" label="Start Date" prepend-icon="mdi-calendar" readonly
                  v-bind="attrs" v-on="on"></v-text-field>
              </template>
              <v-date-picker no-title v-model="startDate" @input="menu = false"></v-date-picker>
            </v-menu>
          </v-card>
        </v-col>

        <v-col cols="2" class="mx-2">
          <v-card width="100%" outlined style="border-color: #C3C3C3;" class="px-2">
            <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
              offset-y min-width="auto">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field hide-details v-model="endDate" label="End Date" prepend-icon="mdi-calendar" readonly
                  v-bind="attrs" v-on="on"></v-text-field>
              </template>
              <v-date-picker no-title v-model="endDate" @input="menu2 = false"></v-date-picker>
            </v-menu>
          </v-card>
        </v-col>

        <v-col cols="2" class="ml-2">
          <v-card v-if="occurrence.courses != null" width="100%" height="100%" outlined style="border-color: #C3C3C3;"
            class="px-2 text-center">
            <v-list-item>
              <v-list-item-content class="py-2">
                <v-icon>{{ getIcon(occurrence.courses.type) }}</v-icon>{{ occurrence.courses.name }}
              </v-list-item-content>
              <v-list-item-avatar tile :size="15">
                <v-icon small @click="removeCourse">
                  mdi-alpha-x-circle-outline
                </v-icon>
              </v-list-item-avatar>
            </v-list-item>

          </v-card>
          <v-card v-else width="100%" height="100%" outlined style="border-color: #C3C3C3;" class="px-2 text-center"
            @click="chooseCourse">
            <v-icon>mdi-plus</v-icon><span>Course</span>
          </v-card>
        </v-col>
      </v-row>

      <v-row no-gutters class="mb-4">
        <v-col cols="5" class="pr-2">
          <v-card height="180px" outlined style="border-color: #C3C3C3;" class="px-2">
          </v-card>
        </v-col>
        <v-col cols="7" class="pl-2">
          <v-card height="100%" outlined style="border-color: #C3C3C3;" class="px-2">
          </v-card>
        </v-col>
      </v-row>

      <v-row no-gutters class="mx-n2">
        <template v-for="cla in occurrence.classes">
          <v-col :key="cla.id" class="mx-2">
            <v-card width="100%" outlined style="border-color: #C3C3C3;">
              <v-list-item>
                <v-list-item-content>
                  <v-row class="text-body-1">
                    <v-col class="d-flex">
                      <span class="mr-1">Class:</span>
                      <Editable style="width: 80px;" :type="'class'" placeholder="Name" :value="cla.name" :id="cla.id"
                        :field="'name'" @input="editableInput" />
                    </v-col>
                    <v-col class="d-flex">
                      <span class="mr-1">Delay:</span>
                      <Editable style="width: 80px;" :type="'class'" placeholder="Delay" :value="cla.delay != null ? cla.delay.toString() : cla.delay" :id="cla.id"
                        :field="'delay'" @input="editableInput" />
                    </v-col>
                    <v-col>
                      <v-btn small @click="addStudentByClassId(cla.id)">
                        <v-icon>mdi-plus</v-icon>St
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-list-item-content>
                <v-btn icon small class="mr-1" @click="deleteClass(cla.id)">
                  <v-icon> mdi-delete </v-icon>
                </v-btn>
              </v-list-item>
              <v-text-field v-model="cla.search" prepend-inner-icon="mdi-magnify" label="Search" single-line
                class="pa-0 ma-0 ml-4 mr-12 mb-1 text-field" outlined dense hide-details></v-text-field>
              <v-data-table dense :headers="studentHeader" :items="cla.students" :search="cla.search"
                @click:row="openCollectionType" :loading="loading">
                <template v-slot:item.name="{ item }">
                  <Editable :type="'student'" placeholder="Name" :value="item.name" :id="item.id" :field="'name'"
                    @input="editableInput" />
                </template>
                <template v-slot:item.delay="{ item }">
                  <Editable :type="'student'" placeholder="Delay" :value="item.delay != null ? item.delay.toString() : item.delay" :id="item.id" :field="'delay'"
                    @input="editableInput" />
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-icon size="large" onclick="event.stopPropagation()" @click="deleteStudent(item.id)">
                    mdi-delete
                  </v-icon>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </template>
        <v-col cols="1" class="d-flex justify-center">
          <v-btn class="mt-16" rounded fab @click="addClassByOccurrenceId(occurrence.id)">
            <v-icon>mdi-plus</v-icon>
            Class
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        <v-data-table :items="courses" :headers="tableHeaders" hide-default-header hide-default-footer :loading="loading"
          height="200px" class="overflow-y-auto my-3 elevation-2" :search="search">

          <template v-slot:item.name="{ item }">
            <v-checkbox v-model="checkboxes" :value="item.id" :label="item.name" hide-details class="px-8"
              :prepend-icon="getIcon(item.type)"></v-checkbox>
          </template>
        </v-data-table>
        <v-card-actions>
          <v-btn outlined text @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn outlined text @click="addCourses">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <Snackbar :snackbar="snackbar.open" :timeout="snackbar.timeout" :color="snackbar.color" :icon="snackbar.icon"
      :text="snackbar.text" />
  </div>
</template>

<script>
import { bus } from "@/main.js";
import { mapActions, mapGetters, mapMutations } from "vuex";

import Editable from "../../../../../components/gerneral/Editable.vue";
import Snackbar from "../../../../../components/gerneral/Snackbar.vue";

export default {
  name: "Occurrence",

  components: {
    Editable,
    Snackbar,
  },

  data() {
    return {
      startDate: "",
      menu: false,
      endDate: "",
      menu2: false,
      loading: false,
      occurrence: {},
      search: "",
      studentHeader: [
        { text: "Name", value: "name", align: "start" },
        { text: "Delay", value: "delay" },
        { text: "", value: "actions" }
      ],
      dialog: false,
      tableHeaders: [{ text: "Name", value: "name" }],
      courses: [],
      checkboxes: [],

      snackbar: {
        open: false,
        text: "",
        icon: "",
        color: "",
        timeout: 2000,
      },
    };
  },

  watch: {
    startDate(newV) {
      const obj = {
        id: this.occurrence.id,
        value: newV,
        field: "startDate",
        type: "occurrence"
      };
      this.editableInput(obj);
    },
    endDate(newV) {
      const obj = {
        id: this.occurrence.id,
        value: newV,
        field: "endDate",
        type: "occurrence"
      };
      this.editableInput(obj);
    },
  },

  created() {
    this.setItems();
  },

  computed: {
    ...mapGetters("main", ["getOccurrence"]),
    ...mapGetters("style", ["getIcon", "getErrorSnackbar", "getSuccessSnackbar"]),
  },

  methods: {
    ...mapMutations("main", [
      "editableInput",
      "addClassByOccurrenceId",
      "addStudentByClassId",
      "deleteClass",
      "deleteStudent"
    ]),
    ...mapActions("main", ["fetchCollectionTypes"]),
    ...mapMutations("main", ["setStudents"]),
    openCollectionType(item) {
      this.setStudents([item]);
      bus.$emit("changePage", ["student,Student", "student"]);
    },
    setItems() {
      this.loading = true;
      this.occurrence = this.getOccurrence;
      if ("startDate" in this.occurrence) {
        this.startDate = new Date(this.occurrence.startDate);
        this.startDate = this.startDate.toISOString().substring(0, 10);
      }
      if ("endDate" in this.occurrence) {
        this.endDate = new Date(this.occurrence.endDate);
        this.endDate = this.endDate.toISOString().substring(0, 10);
      }
      this.loading = false;
    },
    async chooseCourse() {
      try {
        this.courses = await this.fetchCollectionTypes({ collectionType: "courses" })
        this.dialog = true
      } catch(error) {
        console.log(error)
        this.getErrorSnackbar("Something went wrong fetching the courses")
      }
    },
    addCourses() {
      const obj = {
        id: this.occurrence.id,
        value: this.checkboxes[0],
        field: "courses",
        type: "occurrence"
      };
      this.editableInput(obj);
      this.dialog = false;
    },
    removeCourse() {
      const obj = {
        id: this.occurrence.id,
        value: null,
        field: "courses",
        type: "occurrence"
      };
      this.editableInput(obj);
    }
  }
};
</script>

<style scoped>
#occurrence>>>.v-data-footer__select {
  height: 40px;
}

#occurrence>>>.v-text-field>.v-input__control>.v-input__slot:before {
  border-style: none !important;
}
</style>
