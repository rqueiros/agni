<template>
  <div>
    <div v-if="resource.includes('Course')" class="d-flex">

      <div class="d-flex flex-column">
        <v-btn color="primary" class="mb-2" height="32px" @click="publish" v-if="isAuthor" :disabled="publishButton">
          <v-icon left>
            mdi-check
          </v-icon>
          <span v-if="isDraft">Publish</span>
          <span v-if="!isDraft">Unpublish</span>
        </v-btn>
        <v-btn color="primary" class="" height="32px" @click="save" v-if="isAuthor" :disabled="saveButton">Save</v-btn>
      </div>


      <div class="d-flex flex-column ml-3">
        <v-btn color="primary" class="mb-2" height="32px">Copy</v-btn>
        <v-btn color="primary" class="" height="32px" v-if="isAuthor">Delete</v-btn>
      </div>

      <div class="d-flex flex-column ml-3">
        <v-btn color="primary" height="100%" @click="exit">Exit</v-btn>
      </div>
    </div>

    <div class="d-flex flex-column" v-if="resource.includes('Content')">
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" class="mb-2" height="32px" color="primary">
            <v-icon>mdi-plus</v-icon>Content
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in addList" :key="index" link @click="addCollectionType(item.title)">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn color="primary" disabled height="32px">Import</v-btn>
    </div>

    <div class="d-flex flex-column" v-if="resource.includes('Class')">
      <v-btn color="primary" class="mb-2" height="32px" @click="addCollectionType('Occurrence')">
        <v-icon>mdi-plus</v-icon>Course Session
      </v-btn>

      <v-btn color="primary" disabled height="32px">Import</v-btn>
    </div>

    <div v-if="resource.includes('Occurrence') || resource.includes('Student')" class="d-flex">

      <div class="d-flex flex-column">
        <v-btn color="primary" class="mb-2" height="32px" :disabled="publishButton">
          <v-icon left>
            mdi-check
          </v-icon>
          <span v-if="isDraft">Publish</span>
          <span v-if="!isDraft">Unpublish</span>
        </v-btn>
        <v-btn color="primary" class="" height="32px" :disabled="saveButton">Save</v-btn>
      </div>


      <div class="d-flex flex-column ml-3">
        <v-btn color="primary" class="mb-2" height="32px">Copy</v-btn>
        <v-btn color="primary" class="" height="32px">Delete</v-btn>
      </div>

      <div class="d-flex flex-column ml-3">
        <v-btn color="primary" height="100%" @click="exitOcc">Exit</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from "@/main.js";
import { mapMutations, mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "Buttons",
  props: {
    resource: {
      type: String,
      default: () => ""
    }
  },
  watch: {
    changed(newV) {
      this.saveButton = newV
    }
  },
  data() {
    return {
      publishButton: false,
      saveButton: true,
      addList: [
        { title: "Course" },
        { title: "Expositive" },
        { title: "Evaluative" },
        { title: "Question" }
      ],
    }
  },
  computed: {
    ...mapState(['changed']),
    ...mapGetters(["getRole", "getPublishedAt"]),
    isAuthor() {
      return this.getRole == "author"
    },
    isViewer() {
      return this.getRole == "viewer"
    },
    isDraft() {
      return this.getPublishedAt == null
    }
  },
  methods: {
    ...mapMutations(["deleteStructure"]),
    ...mapActions(["publishCourse", "saveCourse", "fetchEmptyCourse"]),
    exitOcc(){
      this.deleteStructure()
      bus.$emit("changePage", ["class,Class", "class"]);
    },
    exit() {
      this.deleteStructure()
      bus.$emit("changePage", ["content,Content", "content"]);
    },
    async publish() {
      await this.publishCourse()
    },
    async save() { //TODO check if all fields are declared
      await this.saveCourse()
    },
    addCollectionType(item) {
      switch (item) {
        case "Course":
          this.fetchEmptyCourse()
          bus.$emit("changePage", ["content,Course", "content"]);
          break;
        case "Expositive":
          console.log("todo") // TODO create Expositive
          break;
        case "Evaluative":
          console.log("todo") // TODO create Evaluative
          break;
        case "Question":
          console.log("todo") // TODO create Question
          break;
        case "Occurrence":
          console.log("todo") // TODO empty occurrence
          bus.$emit("changePage", ["class,Occurrence", "occurrence"]);
          break;
      }
    }
  }
};
</script>

<style></style>
