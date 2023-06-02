<template>
  <div>
    <v-app-bar rounded elevation="1" height="auto" outlined style="background-color: #F7F8F9;" class="pa-2">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn rounded text elevation="0" class="mr-1" @click="exit" v-bind="attrs" v-on="on">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </template>
        <span>back</span>
      </v-tooltip>

      <v-divider vertical />

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <span class="mx-4" v-bind="attrs" v-on="on"> {{ title }}
          </span>
        </template>
        <span>{{ description }}</span>
      </v-tooltip>

      <v-spacer></v-spacer>

      <v-text-field label="Search" outlined dense hide-details disabled></v-text-field>
      <!--TODO implement Search-->

      <v-spacer></v-spacer>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn elevation="1" class="mr-1" rounded color="primary" :disabled="saveButton" @click="save" v-if="isAuthor"
            v-bind="attrs" v-on="on">
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
        </template>
        <span>save</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn elevation="1" class="mx-1" rounded color="primary" v-if="isAuthor" @click="publish" v-bind="attrs"
            v-on="on">
            <v-icon v-if="isDraft">mdi-publish</v-icon>
            <v-icon v-if="!isDraft">mdi-publish-off</v-icon>
          </v-btn>
        </template>
        <span v-if="isDraft">publish</span>
        <span v-if="!isDraft">unpublish</span>
      </v-tooltip>

      <!--
      <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <span>
              <v-btn elevation="1" class="mx-1" rounded color="primary" v-bind="attrs" v-on="on" @click="copyMenu()">
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
            </span>
            </template>
            <v-list>
              <v-list-item>
                <v-treeview selectable dense selection-type="independent" v-model="cloneSelection"
                  :items="cloneItems.children" :open="cloneOpen"></v-treeview>
              </v-list-item>
              <v-list-item>
                <v-btn width="100%" @click="copy()">
                  Clone
                </v-btn>
              </v-list-item>
            </v-list>
          </v-menu>-->


      <v-menu offset-y auto>
        <template v-slot:activator="{ on, attrs }">
          <v-btn elevation="1" class="mx-1" rounded color="primary" v-bind="attrs" v-on="on" @click="copyMenu()">
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
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

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn elevation="1" class="ml-1" rounded color="error" v-if="isAuthor" v-bind="attrs" v-on="on"
            @click="deleteDialog = true">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
        <span>delete</span>
      </v-tooltip>

    </v-app-bar>

    <DeleteDialog :dialog="deleteDialog" :collectionType="collectionType" />

    <Snackbar :snackbar="snackbar.open" :timeout="snackbar.timeout" :color="snackbar.color" :icon="snackbar.icon"
      :text="snackbar.text" />

  </div>
</template>

<script>
import { bus } from "@/main.js";

import { mapGetters, mapState, mapMutations, mapActions } from "vuex";

import DeleteDialog from "../../../../../components/gerneral/DeleteDialog.vue";
import Snackbar from "../../../../../components/gerneral/Snackbar.vue"

export default {
  name: "CourseButtons",

  components: {
    DeleteDialog,
    Snackbar
  },

  props: {
    title: {
      type: String,
      default: () => ""
    },
    description: {
      type: String,
      default: () => ""
    }
  },

  data: () => ({
    collectionType: "Course",
    saveButton: true,

    cloneItems: [],
    cloneSelection: [],
    cloneOpen: [],

    deleteDialog: false,

    snackbar: {
      open: false,
      text: "",
      icon: "",
      color: "",
      timeout: 2000,
    },
  }),

  watch: {
    changed(newV) {
      this.saveButton = newV;
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

  created() {
    bus.$on("deleteDialog", payload => {
      this.deleteDialog = payload;
    });
    bus.$on("deleteDialogResult", async payload => {
      this.deleteDialog = false
      try {
        if (payload == "ok") {
          await this.deleteCourse(this.getCourse[0].id);
          bus.$emit("changePage", ["content,Content", "content"]);
        }
      } catch (error) {
        this.setErrorSnackBar()
      }
    });
    bus.$on("snackbarChange", payload => {
      this.snackbar.open = payload;
    });
  },

  computed: {
    ...mapState(["changed"]),
    ...mapGetters(["getPublishedAt", "isAuthor", "isViewer", "getCourse"]),
    isDraft() {
      return this.getPublishedAt == null;
    },
  },

  methods: {
    ...mapMutations(["deleteStructure"]),
    ...mapActions(["publishCourse", "saveCourse", "deleteCourse", "fetchCloneBody", "fetchClone"]),

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

    exit() {
      this.deleteStructure();
      bus.$emit("changePage", ["content,Content", "content"]);
    },

    async publish() {
      try {
        let res = await this.publishCourse();
        this.setSuccessSnackBar(res.charAt(0).toUpperCase() + res.slice(1))
      } catch (error) {
        console.log(error)
        this.setErrorSnackBar()
      }
    },

    async save() {
      //TODO check if all fields are declared
      try {
        await this.saveCourse()
        this.setSuccessSnackBar("Saved")
      } catch (error) {
        console.log(error)
        this.setErrorSnackBar()
      }
    },

    async copyMenu() {
      this.menuOpen = !this.menuOpen
      this.cloneSelection = [];
      this.cloneOpen = [];
      let cloneBody = [];
      try {
        cloneBody = await this.fetchCloneBody(this.getCourse[0].id);
      } catch (error){
        console.log(error)
        this.setErrorSnackBar()
      }
      this.cloneItems = cloneBody;
    },
    async copy() {
      let cloneData = this.cloneItems;
      delete cloneData.idMenu;
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
                  element.name = element.name.substring(5);
                  delete element.idMenu;
                  delete element.id;
                  if (children.name.includes("Exp")) {
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
      try {
        await this.fetchClone(cloneData);
        bus.$emit("changePage", ["content,Course", "content"]);
      } catch(error){
        console.log(error)
        this.setErrorSnackBar("Error copying")
      }
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
  }
}
</script>

<style scoped></style>