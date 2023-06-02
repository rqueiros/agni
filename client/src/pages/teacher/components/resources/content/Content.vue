<template>
  <div id="content" style="width: 100%;">
    <v-container fluid class="pa-0 mb-4">
      <v-row no-gutters>
        <v-col cols="7" class="mb-4 pr-4">
          <v-card outlined style="border-color: #C3C3C3;" class="pa-2">
            <v-radio-group v-model="collectionType" row hide-details inline class="ma-0 pa-0">
              <v-radio label="Course" value="course"></v-radio>
              <v-radio label="Expositive" value="expositive"></v-radio>
              <v-radio label="Evaluative" value="evaluative"></v-radio>
              <v-radio label="Question" value="question"></v-radio>
            </v-radio-group>
          </v-card>
        </v-col>
        <v-col cols="3">
          <v-card width="100%" outlined style="border-color: #C3C3C3;" class="pa-2">
            <v-radio-group row hide-details inline class="ma-0 pa-0">
              <v-checkbox v-model="checkboxes" label="My" value="my" hide-details class="ma-0 pa-0 mr-4"></v-checkbox>
              <v-checkbox v-model="checkboxes" label="Draft" value="draft" hide-details
                class="ma-0 pa-0 mr-4"></v-checkbox>
            </v-radio-group>
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="5" class="mb-4">
          <v-text-field v-model="search" style="background-color: white;" prepend-inner-icon="mdi-magnify" label="Search"
            single-line class="pa-0 ma-0" outlined dense hide-details></v-text-field>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-card width="100%" outlined style="border-color: #C3C3C3;">
            <v-data-table class="" :itemsPerPage="itemsPerPage" :headers="headers[collectionType]" :items="items"
              :search="search" @click:row="openCollectionType" :loading="loading">
              <template v-slot:item.my="{ item }">
                <v-chip :color="color.my" outlined v-if="item.my">
                  My
                </v-chip>
              </template>
              <template v-slot:item.type="{ item }">
                <v-icon size="x-large">
                  {{ icon[item.type] }}
                </v-icon>
              </template>
              <template v-slot:item.state="{ item }">
                <v-chip :color="color[item.state]" label outlined>
                  {{ item.state }}
                </v-chip>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-menu offset-y auto :close-on-content-click="false">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon size="large" v-bind="attrs" v-on="on" class="mr-2" @click="copyMenu(item)"
                      onclick="event.stopPropagation()">
                      mdi-content-copy
                    </v-icon>
                  </template>
                  <v-list>
                    <v-list-item>
                      <v-treeview selectable dense selection-type="independent" v-model="cloneSelection"
                        :items="cloneItems.children" :open="cloneOpen" :item-key="'idMenu'"></v-treeview>
                    </v-list-item>
                    <v-list-item>
                      <v-btn width="100%" @click="copy()">
                        Clone
                      </v-btn>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-icon size="large" v-if="item.my" @click="remove(item)" onclick="event.stopPropagation()">
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <DeleteDialog :dialog="deleteDialog" :collectionType="collectionType" />

    <Snackbar :snackbar="snackbar.open" :timeout="snackbar.timeout" :color="snackbar.color" :icon="snackbar.icon"
      :text="snackbar.text" />

  </div>
</template>

<script>
import { bus } from "@/main.js";

import { mapActions } from "vuex";

import Snackbar from "../../../../../components/gerneral/Snackbar.vue";
import DeleteDialog from "../../../../../components/gerneral/DeleteDialog.vue";

export default {
  name: "Content",

  components: {
    Snackbar,
    DeleteDialog
  },

  data() {
    return {
      collectionType: "course",
      search: "",
      loading: true,
      items: [],
      checkboxes: [],
      itemsPerPage: 5,

      cloneItems: [],
      cloneSelection: [],
      cloneOpen: [],

      deleteDialog: false,
      toDeleteItem: "",

      headers: {
        course: [
          { text: "", value: "type", align: "center", width: "15%" },
          { text: "Id", value: "id", cellClass: "text-body-1" },
          { text: "Name", value: "name", cellClass: "text-body-1" },
          { text: "Author", value: "my" },
          { text: "State", value: "state" },
          { text: "", value: "actions", sortable: false, width: "15%" }
        ],
        expositive: [
          { text: "Id", value: "id", align: "start" },
          { text: "Name", value: "name" },
          { text: "Type", value: "type" },
          { text: "Author", value: "my" },
          { text: "State", value: "state" },
          { text: "", value: "actions", sortable: false }
        ],
        evaluative: [
          { text: "Id", value: "id", align: "start" },
          { text: "Name", value: "name" },
          { text: "Type", value: "type" },
          { text: "Author", value: "my" },
          { text: "State", value: "state" },
          { text: "", value: "actions", sortable: false }
        ],
        question: [
          { text: "Id", value: "id", align: "start" },
          { text: "Question", value: "question" },
          { text: "Author", value: "my" },
          { text: "State", value: "state" },
          { text: "", value: "actions", sortable: false }
        ]
      },
      snackbar: {
        open: false,
        text: "",
        icon: "",
        color: "",
        timeout: 2000,
      },
      icon: {
        "Contest": "mdi-trophy",
        "Course": "mdi-school-outline",
        "Test/Exam": "mdi-note-edit-outline",
        "programming-exercise": "mdi-code-json",
        "quiz": "mdi-head-question-outline",
        "pdf": "mdi-file-pdf-box",
        "video": "mdi-video",
      },
      color: {
        Published: "green",
        Draft: "primary",
        my: "green"
      }
    };
  },

  created() {
    bus.$on("deleteDialog", payload => {
      this.deleteDialog = payload;
    });
    bus.$on("deleteDialogResult", async payload => {
      this.deleteDialog = false
      try {
        if (payload == "ok") {
          await this.deleteCourse(this.toDeleteItem.id);
          await this.setItems();
          this.toDeleteItem = "";
          this.setSuccessSnackBar(this.collectionType + " deleted")
        }
      } catch (error) {
        console.log(error)
        this.setErrorSnackBar()
      }

    });

    this.setItems();
  },

  watch: {
    collectionType() {
      this.setItems();
    },
    checkboxes() {
      this.setItems();
    },
    cloneSelection(newV, oldV) {
      if (newV.length > oldV.length) {
        const newItem = newV.find(v => !oldV.includes(v));
        const parent = this.findParentofCloneBody(newItem);
        let addIds = [];
        if (parent != null) {
          parent.forEach(v => {
            if (!newV.includes(v)) {
              addIds.push(v);
            }
          });
          this.cloneSelection.push(...addIds);
        }
      }
    }
  },

  computed: {},

  methods: {
    ...mapActions([
      "fetchCollectionTypes",
      "fetchCourseTeacher",
      "fetchEmptyCourse",
      "deleteCourse",
      "fetchCloneBody",
      "fetchClone"
    ]),
    
    setErrorSnackBar(text = "Error") {
      this.snackbar.text = text
      this.snackbar.color = "error"
      this.snackbar.icon = "mdi-alpha-x-circle-outline"
      this.snackbar.open = true
    },
    setSuccessSnackBar(text = "Success") {
      this.snackbar.text = text
      this.snackbar.color = "success"
      this.snackbar.icon = "mdi-check-circle-outline"
      this.snackbar.open = true
    },

    async setItems() {
      const parameters = {
        collectionType: this.collectionType,
        my: this.checkboxes.includes("my"),
        draft: this.checkboxes.includes("draft")
      };
      this.loading = true;
      try {
        this.items = await this.fetchCollectionTypes(parameters);
      } catch (error) {
        console.log(error)
        this.setErrorSnackBar()
      }
      this.loading = false;
    },

    openCollectionType(item) {
      switch (this.collectionType) {
        case "course":
          this.openCourse(item)
          break;
        case "expositive":
          this.openExpositive(item)
          break;
        case "evaluative":
          this.openEvaluative(item)
          break;
        case "question":
          this.openQuestion(item)
          break;
      }
    },
    async openCourse(item) {
      try {
        await this.fetchCourseTeacher(item.id);
        bus.$emit("changePage", ["content,Course", "content"]);
      } catch (error) {
        console.log(error)
        this.setErrorSnackBar()
      }
    },
    async openExpositive(item) {
      try {
        console.log(item)
        //await this.fetchExpositive(item.id);
        //bus.$emit("changePage", ["content,Course", "content"]);
      } catch (error) {
        console.log(error)
        this.setErrorSnackBar()
      }
    },
    async openEvaluative(item) {
      try {
        console.log(item)
        //await this.fetchCourseTeacher(item.id);
        //bus.$emit("changePage", ["content,Course", "content"]);
      } catch (error) {
        console.log(error)
        this.setErrorSnackBar()
      }
    },
    async openQuestion(item) {
      try {
        console.log(item)
        //await this.fetchCourseTeacher(item.id);
        //bus.$emit("changePage", ["content,Course", "content"]);
      } catch (error) {
        console.log(error)
        this.setErrorSnackBar()
      }
    },

    async copyMenu(item) {
      this.cloneSelection = [];
      this.cloneOpen = [];
      let cloneBody = [];
      try {
        cloneBody = await this.fetchCloneBody(item.id);
      } catch (error) {
        console.log(error)
        this.setErrorSnackBar()
      }
      this.cloneItems = cloneBody;
    },
    async copy() {
      let cloneData = this.cloneItems;
      delete cloneData.idMenu
      if (cloneData.children) {
        cloneData.modules = cloneData.children;
        cloneData.modules.forEach(module => {
          if (this.cloneSelection.includes(module.idMenu)) {
            module.clone = true;
          }
          delete module.idMenu;
          delete module.id;
          module.name = module.name.substring(3);
          if (module.children) {
            module.lessons = module.children;
            module.lessons.forEach(lesson => {
              if (this.cloneSelection.includes(lesson.idMenu)) {
                lesson.clone = true;
              }
              delete lesson.idMenu;
              delete lesson.id;
              lesson.name = lesson.name.substring(3);
              if (lesson.children) {
                lesson.expositives = [];
                lesson.evaluatives = [];
                lesson.children.forEach(children => {
                  let element = children;
                  if (this.cloneSelection.includes(element.idMenu)) {
                    element.clone = true;
                  }
                  let name = element.name
                  element.name = element.name.substring(5);
                  delete element.idMenu;
                  delete element.id;
                  if (name.includes("Exp.")) {
                    lesson.expositives.push(element);
                  } else {
                    lesson.evaluatives.push(element);
                  }
                });
                delete lesson.children;
              }
            });
            delete module.children;
          }
        });
        delete cloneData.children;
      }
      this.cloneItems = []
      this.cloneSelection = []
      this.cloneOpen = []
      try {
        await this.fetchClone(cloneData);
      } catch (error) {
        console.log(error)
        this.setErrorSnackBar()
      }
      bus.$emit("changePage", ["content,Course", "content"]);
    },
    findParentofCloneBody(idMenu) {
      const items = this.cloneItems.children;
      for (let i = 0; i < items.length; i++) {
        const module = items[i];
        if (module.idMenu == idMenu) {
          return null;
        }
        if (module.children) {
          for (let j = 0; j < module.children.length; j++) {
            const lesson = module.children[j];
            if (lesson.idMenu == idMenu) {
              return [module.idMenu];
            }
            if (lesson.children) {
              for (let k = 0; k < lesson.children.length; k++) {
                const ex = lesson.children[k];
                if (ex.idMenu == idMenu) {
                  return [module.idMenu, lesson.idMenu];
                }
              }
            }
          }
        }
      }
      return null;
    },

    remove(item) {
      this.toDeleteItem = item;
      this.deleteDialog = true;
    },
  },
};
</script>

<style></style>
