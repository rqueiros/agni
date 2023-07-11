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
            class="mr-1 ml-n1" 
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
            :disabled="saveButton" 
            @click="save"
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

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn 
            elevation="1" 
            class="mx-1" 
            rounded 
            color="primary" 
            @click="copy()"
            v-bind="attrs"
            v-on="on"
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
  name: "AppBarOccurrence",

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
    collectionType: "occurrences",
    saveButton: true,

    cloneItems: [],
    cloneSelection: [],
    cloneOpen: [],

    deleteDialog: false,
    toDeleteItem: 0,

    yesNoDialog:{
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
            await this.deleteCollectionType([this.toDeleteItem, "occurrences"]);
            bus.$emit("successSnackbar", "Occurrence saved")
            this.toDeleteItem = 0;
            bus.$emit("changePage", "student,Occurrences");
          }
        } catch (error) {
          this.toDeleteItem = 0;
          bus.$emit("errorSnackbar", "Something went wrong saving the Occurrence")
        }
      }
    });
    bus.$on("yesNoDialogResult", async payload => {
      if (payload == "saveOcc"){
        this.yesNoDialog.open = false;
        await this.save()
        this.deleteStructure();
        bus.$emit("changePage", "student,Occurrences");
      } else if (payload == "dontSaveOcc"){
        this.yesNoDialog.open = false;
        this.deleteStructure();
        bus.$emit("changePage", "student,Occurrences");
      } else if (payload == "cancelOcc"){
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
      "getOccurrence",
    ]),
    isDraft() {
      return this.getPublishedAt("occurrences") == null;
    },
    isNew() {
      return this.getOccurrence ? this.getOccurrence.new : false
    }
  },

  methods: {
    ...mapMutations("main", [
      "deleteStructure"
    ]),
    ...mapActions("main", [
      "publishCollectionType", 
      "saveCollectionType", 
      "deleteCollectionType",
      "copyCollectionType",
    ]),

    exit() {
      if (this.title == "STUDENT"){
        bus.$emit("changePage", "student,Occurrence");
      } else {
        if (this.saveButton) {
          this.deleteStructure();
          bus.$emit("changePage", "student,Occurrences");
        } else {
          this.yesNoDialog = {
            open:true,
            question: "Do you want to save your changes before exiting?",
            buttons:[{name:"DON`T SAVE", msg:"dontSaveOcc"},{name:"SAVE", msg:"saveOcc"}]
          }
        }
      }
    },

    async publish() {
      try {
        let res = await this.publishCollectionType("occurrences");
        bus.$emit("successSnackbar", "Occurrence " + res)
      } catch (error) {
        console.log(error)
        const pub = this.isDraft ? "publishing" : "unpublishing"
        bus.$emit("errorSnackbar", "Something went wrong "+ pub +" the Occurrence")
      }
    },

    remove() {
      this.deleteDialog = true;
      this.toDeleteItem = this.getOccurrence.id
    },

    async save() {
      //TODO check if all fields are declared
      try {
        await this.saveCollectionType("occurrences")
        bus.$emit("successSnackbar", "Occurrence saved")
      } catch (error) {
        console.log(error)
        bus.$emit("errorSnackbar", "Something went wrong saving the Occurrence")
      }
    },

    async copy(){
      try {
        await this.copyCollectionType([this.getOccurrence.id, "occurrences"]);
        bus.$emit("successSnackbar", "Occurrence copied")
        bus.$emit("changePage", "student,Occurrence");
      } catch (error) {
        console.log(error)
        bus.$emit("errorSnackbar", "Something went wrong copying the Cccurrence")
      }
    }
  }
}
</script>

  
<style scoped></style>