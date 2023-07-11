<template>
  <div>
    <v-app-bar 
      rounded 
      elevation="2" 
      height="auto" 
      outlined
      style="background-color: #F7F8F9;" 
      class="pa-2"
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn 
            rounded 
            text 
            elevation="0" 
            class="mr-1" 
            @click="exit" 
            v-bind="attrs" 
            v-on="on"
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </template>
        <span>Back</span>
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

      <v-text-field label="Search" outlined dense hide-details disabled/>
      <!--TODO implement Search-->

      <v-spacer></v-spacer>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn 
            elevation="1" 
            class="mr-1" 
            rounded 
            color="primary" 
            :disabled="saveButton || (getEvaluative && getEvaluative.contentType == '')" 
            @click="save" 
            v-if="isAuthor"
            v-bind="attrs" 
            v-on="on"
          >
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
        </template>
        <span>Save</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn 
            elevation="1" 
            class="mx-1" 
            rounded 
            color="primary" 
            v-if="isAuthor" 
            @click="publish" 
            v-bind="attrs"
            v-on="on"
            :disabled="isNew"
          >
            <v-icon v-if="isDraft">mdi-publish</v-icon>
            <v-icon v-if="!isDraft">mdi-publish-off</v-icon>
          </v-btn>
        </template>
        <span v-if="isDraft">Publish</span>
        <span v-if="!isDraft">Unpublish</span>
      </v-tooltip>

      <!--
      <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <span>
              <v-btn elevation="1" class="mx-1" rounded color="primary" v-bind="attrs" v-on="on" @click="copyCourseMenu()">
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

          
      <v-menu 
        offset-y  
        :nudge-width="350"
        v-if="collectionType=='courses'" 
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltipOn, attrs: tooltipAttrs }">
              <v-btn 
                elevation="1" 
                class="mx-1" 
                rounded 
                color="primary" 
                v-bind="{ ...attrs, ...tooltipAttrs }" 
                v-on="{ ...on, ...tooltipOn }" 
                @click="copyCourseMenu()"
                :disabled="isNew"
              >
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
            </template>
          <span>Clone</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item>
            <v-treeview 
              selectable 
              dense 
              selection-type="independent" 
              v-model="cloneSelection"
              :items="cloneItems.children" 
              :open="cloneOpen" 
              :item-key="'idMenu'"
            ></v-treeview>
          </v-list-item>
          <v-list-item>
            <v-btn width="100%" @click="copyCourse()">
              Clone
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-tooltip bottom v-else>
        <template v-slot:activator="{ on: tooltipOn, attrs: tooltipAttrs }">
          <v-btn 
            elevation="1" 
            class="mx-1" 
            rounded 
            color="primary" 
            v-bind="{...tooltipAttrs }" 
            v-on="{...tooltipOn }" 
            @click="copy()"
            :disabled="isNew"
          >
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </template>
      <span>Clone</span>
      </v-tooltip>
      
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn 
            elevation="1" 
            class="ml-1" 
            rounded 
            color="error" 
            v-if="isAuthor" 
            v-bind="attrs" 
            v-on="on"
            @click="remove()"
            :disabled="isNew"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
        <span>Delete</span>
      </v-tooltip>

    </v-app-bar>

    <DeleteDialog 
      :dialog="deleteDialog" 
      :collectionType="collectionType"
    />

    <YesNoDialog 
      :dialog="yesNoDialog.open" 
      :question="yesNoDialog.question" 
      :buttons="yesNoDialog.buttons" 
    />

  </div>
</template>


<script>
import { bus } from "@/main.js";

import { mapGetters, mapState, mapMutations, mapActions } from "vuex";

import DeleteDialog from "../../../../../components/gerneral/DeleteDialog.vue";
import YesNoDialog from "../../../../../components/gerneral/YesNoDialog.vue";

export default {
  name: "AppBarCourse",

  components: {
    DeleteDialog,
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
    collectionType: "courses",
    saveButton: true,

    cloneItems: [],
    cloneSelection: [],
    cloneOpen: [],

    deleteDialog: false,
    toDeleteItem: 0,

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
        if (parent != null) {
          let addIds = [];
          parent.forEach(v => {
            if (!newV.includes(v)) {
              addIds.push(v);
            }
          });
          this.cloneSelection.push(...addIds);
        }
        let addIds = this.findChilrens(newItem)
        this.cloneSelection.push(...addIds)
      } else if (newV.length < oldV.length){
        const remItem = oldV.find(v => !newV.includes(v));
        let remIds = this.findChilrens(remItem)
        this.cloneSelection = this.cloneSelection.filter(id => !remIds.includes(id))
      }
    }
  },

  created() {
    this.saveButton = !this.changed

    switch (this.title) {
      case "COURSE": this.collectionType = "courses"; break;
      case "EXPOSITIVE": this.collectionType = "expositives"; break;
      case "EVALUATIVE": this.collectionType = "evaluatives"; break;
      case "QUESTION": this.collectionType = "questions"; break;
      default: this.collectionType = ""; break;
    }

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
            await this.deleteCollectionType([this.toDeleteItem.id, this.collectionType]);
            this.toDeleteItem = 0;
            bus.$emit("successSnackbar", this.collTypeName() + " deleted")
            bus.$emit("changePage", "content,Content");
          }
        } catch (error) {
          console.log(error)
          this.toDeleteItem = 0;
          bus.$emit("errorSnackbar", "Something went wrong deleting the "+this.collTypeName())
        }
      }
    });
    bus.$on("yesNoDialogResult", async payload => {
      if (payload == "save") {
        this.yesNoDialog.open = false;
        await this.save()
        if (!this.snackbar.color == "error") {
          await bus.$emit("changePage", "content,Content");
          this.deleteStructure();
        }
      } else if (payload == "dontSave") {
        this.yesNoDialog.open = false;
        await bus.$emit("changePage", "content,Content");
        this.deleteStructure();
      } else if (payload == "cancel") {
        this.yesNoDialog.open = false;
      }
    })
  },

  computed: {
    ...mapState("main", { changed: state => state.changed }),
    ...mapGetters("main", [
      "getPublishedAt", 
      "isAuthor", 
      "isViewer", 
      "getCourse",
      "getExpositive",
      "getEvaluative",
      "getQuestion"
    ]),
    isDraft() {
      switch (this.title) {
        case "COURSE": return this.getPublishedAt("courses") == null;
        case "EXPOSITIVE": return this.getPublishedAt("expositives") == null;
        case "EVALUATIVE": return this.getPublishedAt("evaluatives") == null;
        case "QUESTION": return this.getPublishedAt("questions") == null;
        default: return false
      }
    },
    isNew(){
      switch (this.title) {
        case "COURSE": return this.getCourse ? this.getCourse.new : false;
        case "EXPOSITIVE": return this.getExpositive ? this.getExpositive.new : false;
        case "EVALUATIVE": return this.getEvaluative ? this.getEvaluative.new : false;
        case "QUESTION": return this.getQuestion ? this.getQuestion.new : false;
        default: return false
      }
    }
  },

  methods: {
    ...mapMutations("main", ["deleteStructure"]),
    ...mapActions("main", [
      "saveCourse",
      "deleteCollectionType",
      "fetchCloneBody",
      "fetchClone",
      "saveCollectionType",
      "publishCollectionType",
      "copyCollectionType"
    ]),

    async exit() {
      if (this.saveButton) {
        await bus.$emit("changePage", "content,Content");
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
      try {
        let res = await this.publishCollectionType(this.title.toLowerCase() + "s");
        bus.$emit("successSnackbar", this.collTypeName() + " " + res)
      } catch (error) {
        console.log(error)
        const pub = this.isDraft ? "publishing" : "unpublishing"
        bus.$emit("errorSnackbar", "Something went wrong " + pub + " the " + this.collTypeName())
      }
    },

    remove() {
      this.deleteDialog = true;
      if (this.title =="COURSE"){
        this.toDeleteItem = this.getCourse
      } else if (this.title == "EXPOSITIVE"){
        this.toDeleteItem = this.getExpositive
      } else if (this.title == "EVALUATIVE"){
        this.toDeleteItem = this.getEvaluative
      } else if (this.title == "QUESTION"){
        this.toDeleteItem = this.getQuestion
      }
    },

    async save() {
      //TODO check if all fields are declared
      try {
        await this.saveCollectionType(this.collectionType)
        bus.$emit("successSnackbar", this.collTypeName() + " saved")
      } catch (error) {
        console.log(error)
        let message = "Something went wrong saving the "+this.collTypeName()
        let errorMsg = error.response.data.error.details.errors[0].message
        if (errorMsg.includes(".tests") && errorMsg.includes(".type")){
          message = this.collTypeName()+" not saved - The Type of all Tests must be defined"
        } else if (errorMsg.includes("content") && errorMsg.includes(".type")){
          message = this.collTypeName()+" not saved - The Type of all Porg. Exercises must be defined"
        } else if (errorMsg.includes("content") && errorMsg.includes(".statement")){
          message = this.collTypeName()+" not saved - The Statement of all Porg. Exercises must be defined"
        }
        bus.$emit("errorSnackbar", message)
      }
    },

    async copy() {
      let id = 0
      if (this.title =="COURSE"){
        id = this.getCourse.id
      } else if (this.title == "EXPOSITIVE"){
        id = this.getExpositive.id
      } else if (this.title == "EVALUATIVE"){
        id = this.getEvaluative.id
      } else if (this.title == "QUESTION"){
        id = this.getQuestion.id
      }

      try {
        await this.copyCollectionType([id, this.collectionType])
        bus.$emit("successSnackbar", this.collTypeName() + " copied")
      } catch (error) {
        console.log(error)
        bus.$emit("errorSnackbar", "Something went wrong copying the " + this.collTypeName())
      }
    },
    async copyCourseMenu() {
      this.menuOpen = !this.menuOpen
      this.cloneSelection = [];
      this.cloneOpen = [];
      let cloneBody = [];
      try {
        cloneBody = await this.fetchCloneBody(this.getCourse.id);
      } catch (error) {
        console.log(error)
        bus.$emit("errorSnackbar", "Something went wrong fetching the Clone Menu")
      }
      this.cloneItems = cloneBody;
    },
    async copyCourse() {
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
        bus.$emit("successSnackbar", this.collTypeName() + " copied")
        bus.$emit("changePage", "content,Course");
      } catch (error) {
        console.log(error)
        bus.$emit("errorSnackbar", "Something went wrong copying the "+this.collTypeName())
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
    findChilrens(idMenu){
      const items = this.cloneItems.children;
      let array = []
      if (items.find(i => i.idMenu == idMenu)){
        let item = items.find(i => i.idMenu == idMenu)
        item.children.forEach(c => {
          array.push(c.idMenu)
          c.children.forEach(ch => {
            array.push(ch.idMenu)
          })
        })
      } else if (items.flatMap(i => i.children).find(i => i.idMenu == idMenu)){
        let item = items.flatMap(i => i.children).find(i => i.idMenu == idMenu)
        item.children.forEach(c => {
          array.push(c.idMenu)
        })
      }
      return array
    },

    collTypeName(){
      return this.collectionType.charAt(0).toUpperCase() + this.collectionType.slice(1,-1)
    },
  }
}
</script>


<style scoped></style>