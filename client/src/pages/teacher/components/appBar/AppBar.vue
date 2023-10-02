<template>
  <div id="header">

    <v-app-bar 
      rounded 
      height="auto" 
      color="appbar"
      class="py-2 px-0"
      flat
    >
      <v-row no-gutters>
        <v-col :cols="$vuetify.breakpoint.mdAndUp ? '3' : '4'" class="d-flex align-center">
          
          <v-tooltip bottom v-if="buttonConf2">
            <template v-slot:activator="{ on, attrs }">
              <v-btn 
                fab
                small
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

          <v-divider vertical v-if="buttonConf2" class="mr-4"/>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on" style="font-size:22px"> {{ title[contentType] }}
              </span>
            </template>
            <span>{{ description[contentType] }}</span>
          </v-tooltip>

        </v-col>
        <v-col cols="4">
          <v-autocomplete
            v-model="model"
            :items="items"
            :loading="isLoading"
            :search-input.sync="search"
            hide-no-data
            hide-details
            hide-selected
            item-text="Description"
            item-value="API"
            label="Search"
            placeholder="Start typing to Search"
            return-object
            outlined
            dense
          >
            <template v-slot:item="{ item }">
              <v-list-item-avatar
                class="text-h5 font-weight-light white--text"
              >
                <v-icon>
                  {{ getIcon(item.icon) }}
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="item.label"></v-list-item-title>
                <v-list-item-subtitle v-text="item.label2"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col :cols="$vuetify.breakpoint.mdAndUp ? '5' : '4'" class="d-flex align-center justify-end">

          <!-- Adds -->
          <v-tooltip bottom v-if="buttonConf1 && contentType=='occurrencess'">
            <template v-slot:activator="{ on, attrs }">
              <v-btn 
                elevation="1" 
                :rounded="$vuetify.breakpoint.mdAndUp"
                :fab="!$vuetify.breakpoint.mdAndUp"
                :small="!$vuetify.breakpoint.mdAndUp"
                color="primary" 
                @click="addCollectionType('Occurrence')" 
                v-bind="attrs" 
                v-on="on"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>Add</span>
          </v-tooltip>
          <v-menu offset-y auto v-if="buttonConf1 && contentType=='contents'">
            <template v-slot:activator="{ on, attrs }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on: tooltipOn, attrs: tooltipAttrs }">
                  <v-btn 
                    elevation="1" 
                    :rounded="$vuetify.breakpoint.mdAndUp"
                    :fab="!$vuetify.breakpoint.mdAndUp"
                    :small="!$vuetify.breakpoint.mdAndUp"
                    v-bind="{ ...attrs, ...tooltipAttrs }" 
                    v-on="{ ...on, ...tooltipOn }" 
                    color="primary"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
              <span>Add</span>
              </v-tooltip>
            </template>
            <v-list>
              <v-list-item 
                v-for="(item, index) in addList" 
                :key="index" 
                link 
                @click="addCollectionType(item.title)"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>


          <!-- Save -->
          <div>
            <v-tooltip bottom v-if="buttonConf2 && (isAuthor || contentType=='occurrences')">
              <template v-slot:activator="{ on, attrs }">
                <v-btn 
                  elevation="1" 
                  class="mr-1" 
                  :rounded="$vuetify.breakpoint.mdAndUp"
                  :fab="!$vuetify.breakpoint.mdAndUp"
                  :small="!$vuetify.breakpoint.mdAndUp"
                  color="primary" 
                  :disabled="!changed" 
                  @click="save" 
                  v-bind="attrs" 
                  v-on="on"
                >
                  <v-progress-circular 
                    :size="20"
                    v-if="loading.save"
                    indeterminate
                  ></v-progress-circular>
                  <v-icon>mdi-content-save</v-icon>
                </v-btn>
              </template>
              <span>Save</span>
            </v-tooltip>
          </div>


          <!-- Publish -->
          <div v-if="buttonConf2">
            <v-tooltip bottom v-if="isAuthor || contentType=='occurrences'">
              <template v-slot:activator="{ on, attrs }">
                <v-btn 
                  elevation="1" 
                  class="mx-1" 
                  :rounded="$vuetify.breakpoint.mdAndUp"
                  :fab="!$vuetify.breakpoint.mdAndUp"
                  :small="!$vuetify.breakpoint.mdAndUp"
                  color="primary" 
                  @click="publish" 
                  v-bind="attrs"
                  v-on="on"
                  :disabled="isNew"
                >
                  <v-progress-circular 
                    :size="20"
                    v-if="loading.publish"
                    indeterminate
                  ></v-progress-circular>
                  <v-icon v-if="isDraft">mdi-publish</v-icon>
                  <v-icon v-if="!isDraft">mdi-publish-off</v-icon>
                </v-btn>
              </template>
              <span v-if="isDraft">Publish</span>
              <span v-if="!isDraft">Unpublish</span>
            </v-tooltip>
          </div>


          <!-- Clone -->
          <div v-if="buttonConf2">
            <v-menu 
              offset-y  
              :nudge-width="350"
              v-if="contentType=='courses'" 
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on: tooltipOn, attrs: tooltipAttrs }">
                    <v-btn 
                      elevation="1" 
                      class="mx-1" 
                      :rounded="$vuetify.breakpoint.mdAndUp"
                      :fab="!$vuetify.breakpoint.mdAndUp"
                      :small="!$vuetify.breakpoint.mdAndUp"
                      color="primary" 
                      v-bind="{ ...attrs, ...tooltipAttrs }" 
                      v-on="{ ...on, ...tooltipOn }" 
                      @click="copyCourseMenu()"
                      :disabled="isNew"
                    >
                      <v-progress-circular 
                        :size="20"
                        v-if="loading.copy"
                        indeterminate
                      ></v-progress-circular>
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

            <v-tooltip bottom v-if="contentType!='courses'">
              <template v-slot:activator="{ on: tooltipOn, attrs: tooltipAttrs }">
                <v-btn 
                  elevation="1" 
                  class="mx-1" 
                  :rounded="$vuetify.breakpoint.mdAndUp"
                  :fab="!$vuetify.breakpoint.mdAndUp"
                  :small="!$vuetify.breakpoint.mdAndUp"
                  color="primary" 
                  v-bind="{...tooltipAttrs }" 
                  v-on="{...tooltipOn }" 
                  @click="copy()"
                  :disabled="isNew"
                >
                  <v-progress-circular 
                    :size="20"
                    v-if="loading.delete"
                    indeterminate
                  ></v-progress-circular>
                  <v-icon>mdi-content-copy</v-icon>
                </v-btn>
              </template>
            <span>Clone</span>
            </v-tooltip>
          </div>


          <!-- Delete -->
          <div>
            <v-tooltip bottom v-if="buttonConf2 && (isAuthor || contentType=='occurrences')">
            <template v-slot:activator="{ on, attrs }">
              <v-btn 
                elevation="1" 
                class="ml-1" 
                :rounded="$vuetify.breakpoint.mdAndUp"
                :fab="!$vuetify.breakpoint.mdAndUp"
                :small="!$vuetify.breakpoint.mdAndUp"
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
          </div>


          <!-- Account -->
          <v-tooltip bottom v-if="contentType=='accounts' && getAccountEditable">
            <template v-slot:activator="{ on, attrs }">
              <v-btn 
                elevation="1" 
                class="mr-1" 
                :rounded="$vuetify.breakpoint.mdAndUp"
                :fab="!$vuetify.breakpoint.mdAndUp"
                :small="!$vuetify.breakpoint.mdAndUp"
                color="primary" 
                @click="saveAccount" 
                v-bind="attrs" 
                v-on="on"
              >
                <v-progress-circular 
                  :size="20"
                  v-if="loading.save"
                  indeterminate
                ></v-progress-circular>
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </template>
            <span>Save</span>
          </v-tooltip>
          <v-tooltip bottom v-if="contentType=='accounts' && !getAccountEditable">
            <template v-slot:activator="{ on, attrs }">
              <v-btn 
                elevation="1" 
                class="mr-1" 
                :rounded="$vuetify.breakpoint.mdAndUp"
                :fab="!$vuetify.breakpoint.mdAndUp"
                :small="!$vuetify.breakpoint.mdAndUp"
                color="primary" 
                @click="setAccountEditable(true)" 
                v-bind="attrs" 
                v-on="on"
              >
                <v-progress-circular 
                  :size="20"
                  v-if="loading.save"
                  indeterminate
                ></v-progress-circular>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Edit</span>
          </v-tooltip>
        </v-col>
      </v-row>
    
  
    </v-app-bar>

    <YesNoDialog 
      :dialog="yesNoDialog.open" 
      :question="yesNoDialog.question" 
      :buttons="yesNoDialog.buttons" 
    />

    <DeleteDialog 
      :dialog="deleteDialog" 
      :collectionType="contentType"
    />

  </div>
</template>

<script>
import { bus } from "@/main.js";

import { mapGetters, mapActions, mapMutations, mapState } from 'vuex';

import DeleteDialog from "../../../../components/gerneral/DeleteDialog.vue";
import YesNoDialog from "../../../../components/gerneral/YesNoDialog.vue";

export default {
  name: "Header",

  props: {
    resource: {
      type: String,
      default: () => null
    }
  },

  components:{
    YesNoDialog,
    DeleteDialog
  },

  data() {
    return {
      buttonConf1: false,
      buttonConf2: false,

      entries : [],
      isLoading: false,
      model: null,
      search: null,

      cloneItems: [],
      cloneSelection: [],
      cloneOpen: [],

      addList:[
        { title: "Course" },
        { title: "Expositive" },
        { title: "Evaluative" },
        { title: "Question" }
      ],
      title: {
        occurrencess:"OCCURRENCES",
        occurrences:"OCCURRENCE",
        contents:"CONTENT",
        courses:"COURSE",
        expositives:"EXPOSITIVE",
        evaluatives:"EVALUATIVE",
        questions:"QUESTION",
        homes:"WELCOME TO AGNI",
        accounts:"ACCOUNT",
        settingss:"SETTINGS"
      },
      description: {
        occurrencess:"Manage your current, draft and past occurrences",
        occurrences:"Create, edit or view this occurrence",
        contents:"Manage courses, expositives (pdf,..), evaluatives (progEx, Quiz) and questions",
        courses:"Create, edit or view this course",
        expositives:"Create, edit or view this expositive",
        evaluatives:"Create, edit or view this evaluative",
        questions:"Create, edit or view this question",
        homes:"",
        accounts:"",
        settingss:""
      },

      deleteDialog: false,
      toDeleteItem: 0,

      yesNoDialog: {
        open: false,
        question: "",
        buttons: [],
      },

      loading: {
        save:false,
        publish:false,
        copy:false,
        delete:false
      }
    };
  },

  computed: {
    ...mapState("main", { changed: state => state.changed }),
    ...mapGetters("style", [
      "getIcon",
      "isSMsmaller"
    ]),
    ...mapGetters("main", [
      "isAuthor",
      "getPublishedAt",
      "getCourse",
      "getExpositive",
      "getEvaluative",
      "getQuestion",
      "getOccurrence",
      "getAccountEditable"
    ]),
    contentType() {
      return this.resource.split(",")[1].toLowerCase()+"s"
    },
    isDraft() {
      switch (this.contentType) {
        case "courses": return this.getPublishedAt("courses") == null;
        case "expositives": return this.getPublishedAt("expositives") == null;
        case "evaluatives": return this.getPublishedAt("evaluatives") == null;
        case "questions": return this.getPublishedAt("questions") == null;
        default: return false
      }
    },
    isNew(){
      switch (this.contentType) {
        case "courses": return this.getCourse ? this.getCourse.new : false;
        case "expositives": return this.getExpositive ? this.getExpositive.new : false;
        case "evaluatives": return this.getEvaluative ? this.getEvaluative.new : false;
        case "questions": return this.getQuestion ? this.getQuestion.new : false;
        default: return false
      }
    },
    fields () {
      if (!this.model) return []

      return Object.keys(this.model).map(key => {
        return {
          key,
          value: this.model[key] || 'n/a',
        }
      })
    },
    items () {
      return this.entries.map(entry => {
        let Description = entry.label + entry.label2
        return Object.assign({}, entry, { Description })
      })
    },
  },

  created() {
    bus.$on("yesNoDialog", payload => {
      this.yesNoDialog.open = payload;
    });
    bus.$on("yesNoDialogResult", async payload => {
      if (payload == "save") {
        this.yesNoDialog.open = false;
        await this.save() 
        if (!this.snackbar.color == "error") {
          if (this.contentType=="occurrences"){
          bus.$emit("changePage", "student,Occurrences");
          } else {
            await bus.$emit("changePage", "content,Content");
          }
          this.deleteStructure();
        }
      } else if (payload == "dontSave") {
        this.yesNoDialog.open = false;
        if (this.contentType=="occurrences"){
          bus.$emit("changePage", "student,Occurrences");
        } else {
          await bus.$emit("changePage", "content,Content");
        }
        this.deleteStructure();
      } else if (payload == "cancel") {
        this.yesNoDialog.open = false;
      }
    });
    bus.$on("deleteDialog", payload => {
      this.deleteDialog = payload;
    });
    bus.$on("deleteDialogResult", async payload => {
      this.deleteDialog = false
      if (this.toDeleteItem != 0) {
        try {
          if (payload == "ok") {
            this.loading.delete = true
            await this.deleteCollectionType([this.toDeleteItem.id, this.contentType]);
            bus.$emit("successSnackbar", "Occurrence saved")
            this.toDeleteItem = 0;
            bus.$emit("changePage", "student,Occurrences");
          }
        } catch (error) {
          this.toDeleteItem = 0;
          bus.$emit("errorSnackbar", "Something went wrong saving the Occurrence")
        }
        this.loading.delete = false
      }
    });
  },

  watch: {
    resource(newV){
      if (newV.includes("Occurrences")) {
        this.buttonConf1 = true
        this.buttonConf2 = false
      } else if (newV.includes("Course")) {
        this.buttonConf1 = false
        this.buttonConf2 = true
      }  else if (newV.includes("Expositive")) {
        this.buttonConf1 = false
        this.buttonConf2 = true
      } else if (newV.includes("Evaluative")) {
        this.buttonConf1 = false
        this.buttonConf2 = true
      } else if (newV.includes("Question")) {
        this.buttonConf1 = false
        this.buttonConf2 = true
      } else if (newV.includes("content")) {
        this.buttonConf1 = true
        this.buttonConf2 = false
      } else if (newV.includes("Occurrence")) {
        this.buttonConf1 = false
        this.buttonConf2 = true
      } else if (newV.includes("Home")) {
        this.buttonConf1 = false
        this.buttonConf2 = false
      } else if (newV.includes("account")) {
        this.buttonConf1 = false
        this.buttonConf2 = false
      } else if (newV.includes("settings")) {
        this.buttonConf1 = false
        this.buttonConf2 = false
      }
    },
    model(newV){
      if (newV != null){
        this.openCollectionType(newV)
        this.model = null
      }
    },
    async search(newV) {
      // Items have already been loaded
      //if (this.items.length > 0) return

      // Items have already been requested
      if (this.isLoading) return

      this.isLoading = true

      let params = {
        filters: {
          name: {
            $containsi: newV
          }
        }
      }
      let a = await this.fetchContents(params)
      this.entries = a
      this.isLoading = false
      
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

  methods: {
    ...mapActions("main", [
      "fetchContents",
      "fetchPrepareCollectionType",
      "fetchEmptyOccurrence",
      "fetchEmptyCourse",
      "deleteCollectionType",
      "saveCollectionType",
      "publishCollectionType",
      "copyCollectionType",
      "fetchCloneBody",
      "fetchClone",
      "updateUser"
    ]),
    ...mapMutations("main", [
      "createNewQuestion", 
      "createNewExpositive", 
      "createNewEvaluative",
      "deleteStructure",
      "setAccountEditable"
    ]),
    async saveAccount(){
      this.setAccountEditable(false)
      this.updateUser()
    },
    async copy() {
      let id = 0
      if (this.contentType =="courses"){
        id = this.getCourse.id
      } else if (this.contentType == "expositives"){
        id = this.getExpositive.id
      } else if (this.contentType == "evaluatives"){
        id = this.getEvaluative.id
      } else if (this.contentType == "questions"){
        id = this.getQuestion.id
      }

      try {
        this.loading.copy = true
        await this.copyCollectionType([id, this.contentType])
        bus.$emit("successSnackbar", this.contentType + " copied")
      } catch (error) {
        console.log(error)
        bus.$emit("errorSnackbar", "Something went wrong copying the " + this.collTypeName())
      }
      this.loading.copy = false
    },
    async publish() {
      try {
        this.loading.publish = true
        let res = await this.publishCollectionType(this.contentType);
        bus.$emit("successSnackbar", this.contentType + " " + res)
      } catch (error) {
        console.log(error)
        const pub = this.isDraft ? "publishing" : "unpublishing"
        bus.$emit("errorSnackbar", "Something went wrong " + pub + " the " + this.collTypeName())
      }
      this.loading.publish = false
    },
    async save() {
      //TODO check if all fields are declared
      try {
        this.loading.save = true
        await this.saveCollectionType(this.contentType)
        bus.$emit("successSnackbar", this.contentType + " saved")
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
      this.loading.save = false
    },
    async exit() {
      if (!this.changed) {
        let contentCollType = localStorage.getItem("menuItem") || "";
        if (this.contentType=="occurrences"){
          if (contentCollType=="student"){
            bus.$emit("changePage", "student,Occurrences");
          } else {
            bus.$emit("changePage", "home,Home");
          }
        } else {
          if (contentCollType=="home"){
            bus.$emit("changePage", "home,Home");
          } else {
            await bus.$emit("changePage", "content,Content");
          }
        }
        this.deleteStructure();
      } else {
        this.yesNoDialog = {
          open: true,
          question: "Do you want to save your changes before exiting?",
          buttons: [{ name: "DON`T SAVE", msg: "dontSave" }, { name: "SAVE", msg: "save" }]
        }
      }
    },
    addCollectionType(item) {
      switch (item) {
        case "Course":
          this.fetchEmptyCourse();
          bus.$emit("changePage", "content,Course");
          break;
        case "Expositive":
          this.createNewExpositive();
          bus.$emit("changePage", "content,Expositive");
          break;
        case "Evaluative":
          this.createNewEvaluative();
          bus.$emit("changePage", "content,Evaluative");
          break;
        case "Question":
          this.createNewQuestion();
          bus.$emit("changePage", "content,Question");
          break;
        case "Occurrence":
          this.fetchEmptyOccurrence();
          bus.$emit("changePage", "student,Occurrence");
          break;
      }
    },
    async openCollectionType(item) {
      try {
        await this.fetchPrepareCollectionType([item.id, item.collectionType]);
        switch (item.collectionType) {
          case "courses":
            bus.$emit("changePage", "content,Course");
            break;
          case "expositives":
            bus.$emit("changePage", "content,Expositive");
            break;
          case "evaluatives":
            bus.$emit("changePage", "content,Evaluative");
            break;
          case "questions":
            bus.$emit("changePage", "content,Question");
            break;
        }
      } catch (error) {
        console.log(error)
        bus.$emit("errorSnackbar", "Something went wrong fetching the "+item.collectionType)
      }
    },
    remove() {
      this.deleteDialog = true;
      if (this.contentType =="courses"){
        this.toDeleteItem = this.getCourse
      } else if (this.contentType == "expositives"){
        this.toDeleteItem = this.getExpositive
      } else if (this.contentType == "evaluatives"){
        this.toDeleteItem = this.getEvaluative
      } else if (this.contentType == "questions"){
        this.toDeleteItem = this.getQuestion
      } else if (this.contentType == "occurrences"){
        this.toDeleteItem = this.getOccurrence
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
  },
};
</script>

<style scoped>
#header >>> .v-toolbar__content,
.v-toolbar__extension {
  padding: 0 !important;
}

#header>>>.v-text-field fieldset, .v-text-field .v-input__control, .v-text-field .v-input__slot{
  border-radius: 20px !important;
}
</style>
