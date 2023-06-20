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
            @click="remove()">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
        <span>delete</span>
      </v-tooltip>

    </v-app-bar>

    <DeleteDialog :dialog="deleteDialog" :collectionType="collectionType" />

    <YesNoDialog :dialog="yesNoDialog.open" :question="yesNoDialog.question" :buttons="yesNoDialog.buttons" />

    <Snackbar :snackbar="snackbar.open" :timeout="snackbar.timeout" :color="snackbar.color" :icon="snackbar.icon"
      :text="snackbar.text" />

  </div>
</template>

<script>
import { bus } from "@/main.js";

import { mapGetters, mapState, mapMutations, mapActions } from "vuex";

import DeleteDialog from "../../../../../components/gerneral/DeleteDialog.vue";
import Snackbar from "../../../../../components/gerneral/Snackbar.vue"
import YesNoDialog from "../../../../../components/gerneral/YesNoDialog.vue";

export default {
  name: "AppBarCourse",

  components: {
    DeleteDialog,
    Snackbar,
    YesNoDialog,
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
    toDeleteItem: 0,

    snackbar: {
      open: false,
      text: "",
      icon: "",
      color: "",
      timeout: 2000,
    },

    yesNoDialog: {
      open: false,
      question: "",
      buttons: [],
    },
  }),

  watch: {
    changed(newV) {
      this.saveButton = !newV;
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
    this.saveButton = !this.changed

    bus.$on("deleteDialog", payload => {
      this.deleteDialog = payload;
    });
    bus.$on("yesNoDialog", payload => {
      this.yesNoDialog.open = payload;
    });
    bus.$on("deleteDialogResult", async payload => {
      this.deleteDialog = false
      if (this.toDeleteItem != 0) {
        try {
          if (payload == "ok") {
            await this.deleteCourse(this.toDeleteItem);
            this.toDeleteItem = 0;
            this.snackbar = this.getErrorSnackbar(this.collectionType + " deleted")
            bus.$emit("changePage", ["content,Content", "content"]);
          }
        } catch (error) {
          this.toDeleteItem = 0;
          this.snackbar = this.getErrorSnackbar("Something went wrong deleting the " + this.collectionType)
        }
      }
    });
    bus.$on("snackbarChange", payload => {
      this.snackbar.open = payload;
    });
    bus.$on("yesNoDialogResult", async payload => {
      if (payload == "save") {
        this.yesNoDialog.open = false;
        await this.save()
        if (!this.snackbar.color == "error") {
          await bus.$emit("changePage", ["content,Content", "content"]);
          this.deleteStructure();
        }
      } else if (payload == "dontSave") {
        this.yesNoDialog.open = false;
        await bus.$emit("changePage", ["content,Content", "content"]);
        this.deleteStructure();
      } else if (payload == "cancel") {
        this.yesNoDialog.open = false;
      }
    })
  },

  computed: {
    ...mapState("main", { changed: state => state.changed }),
    ...mapGetters("main", ["getPublishedAt", "isAuthor", "isViewer", "getCourse"]),
    ...mapGetters("style", ["getErrorSnackbar", "getSuccessSnackbar"]),
    isDraft() {
      switch (this.title) {
        case "COURSE": return this.getPublishedAt("courses") == null;
        case "EXPOSITIVE": return this.getPublishedAt("expositives") == null;
        case "EVALUATIVE": return this.getPublishedAt("evaluatives") == null;
        case "QUESTION": return this.getPublishedAt("questions") == null;
        default: return false
      }
    },
  },

  methods: {
    ...mapMutations("main", ["deleteStructure"]),
    ...mapActions("main", [
      "saveCourse",
      "deleteCourse",
      "fetchCloneBody",
      "fetchClone",
      "saveCollectionType",
      "publishCollectionType",
    ]),

    async exit() {
      if (this.saveButton) {
        await bus.$emit("changePage", ["content,Content", "content"]);
        this.deleteStructure();
      } else {
        this.yesNoDialog = {
          open: true,
          question: "Do you want to save your changes before exiting?",
          buttons: [{ name: "DON`T SAVE", msg: "dontSave" }, { name: "SAVE", msg: "save" }]
        }
      }
    },

    async publish() {
      if (this.title == "COURSE") {
        try {
          let res = await this.publishCollectionType(this.title.toLowerCase() + "s");
          this.snackbar = this.getSuccessSnackbar(this.collectionType + " " + res.charAt(0).toUpperCase() + res.slice(1))
        } catch (error) {
          console.log(error)
          const pub = this.isDraft ? "publishing" : "unpublishing"
          this.snackbar = this.getErrorSnackbar("Something went wrong " + pub + " the " + this.collectionType)
        }
      } else {
        try {
          let res = await this.publishCollectionType(this.title.toLowerCase() + "s");
          this.snackbar = this.getSuccessSnackbar(this.title.toLowerCase() + " " + res.charAt(0).toUpperCase() + res.slice(1))
        } catch (error) {
          console.log(error)
          const pub = this.isDraft ? "publishing" : "unpublishing"
          this.snackbar = this.getErrorSnackbar("Something went wrong " + pub + " the " + this.title.toLowerCase())
        }
      }
    },

    remove() {
      this.deleteDialog = true;
      this.toDeleteItem = this.getCourse[0].id
    },

    async save() {
      //TODO check if all fields are declared
      if (this.title == "COURSE") {
        try {
          await this.saveCollectionType("courses")
          this.snackbar = this.getSuccessSnackbar(this.collectionType + " saved")
        } catch (error) {
          console.log(error)
          this.snackbar = this.getErrorSnackbar("Something went wrong saving the " + this.collectionType)
        }
      } else if (this.title == "EXPOSITIVE") {
        try {
          await this.saveCollectionType("expositives")
          this.snackbar = this.getSuccessSnackbar("Expositive saved")
        } catch (error) {
          console.log(error)
          this.snackbar = this.getErrorSnackbar("Something went wrong saving the expositive")
        }
      } else if (this.title == "EVALUATIVE") {
        try {
          await this.saveCollectionType("evaluatives")
          this.snackbar = this.getSuccessSnackbar("Evaluative saved")
        } catch (error) {
          console.log(error)
          this.snackbar = this.getErrorSnackbar("Something went wrong saving the evaluative")
        }
      } else if (this.title == "QUESTION") {
        try {
          await this.saveCollectionType("questions")
          this.snackbar = this.getSuccessSnackbar("Question saved")
        } catch (error) {
          console.log(error)
          this.snackbar = this.getErrorSnackbar("Something went wrong saving the question")
        }
      }
    },

    async copyMenu() {
      this.menuOpen = !this.menuOpen
      this.cloneSelection = [];
      this.cloneOpen = [];
      let cloneBody = [];
      try {
        cloneBody = await this.fetchCloneBody(this.getCourse[0].id);
      } catch (error) {
        console.log(error)
        this.snackbar = this.getErrorSnackbar("Something went wrong fetching the Clone Menu")
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
        this.snackbar = this.getSuccessSnackbar(this.collectionType + " copied")
        bus.$emit("changePage", ["content,Course", "content"]);
      } catch (error) {
        console.log(error)
        this.snackbar = this.getErrorSnackbar("Something went wrong copying the " + this.collectionType)
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