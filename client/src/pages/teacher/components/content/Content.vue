<template>
  <!--class="pa-sm-4"-->
  <div id="content" style="width: 100%;">
    <v-container class="pa-0 mb-4">
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
            <v-data-table class="" :itemsPerPage="itemsPerPage" :headers="getHeader" :items="items" :search="search" @click:row="openCollectionType"
              :loading="loading" >
              <template v-slot:item.my="{ item }">
                <v-chip :color="getColor('my')" outlined v-if="item.my">
                  My
                </v-chip>
              </template>
              <template v-slot:item.type="{ item }">
                <v-icon size="x-large">
                  {{ getIcon(item.type) }}
                </v-icon>
              </template>
              <template v-slot:item.state="{ item }">
                <v-chip :color="getColor(item.state)" label outlined>
                  {{ item.state }}
                </v-chip>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon size="large" v-bind="attrs" v-on="on" class="mr-2" @click="copyMenu(item)"
                      onclick="event.stopPropagation()">
                      mdi-content-copy
                    </v-icon>
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
                </v-menu>
                <!--<v-icon small class="mr-2" v-if="item.my" @click="edit(item)">
          mdi-pencil
        </v-icon>-->
                <!--<v-icon small class="mr-2" v-if="!item.my" @click="see(item)">
          mdi-eye
        </v-icon>-->
                <v-icon size="large" v-if="item.my" @click="remove(item)" onclick="event.stopPropagation()">
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent width="auto">
          <v-card>
            <v-card-title class="text-h7">
              Are you sure you want to delete this {{ collectionType }}?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="darken-1" text @click="dialog = false" width="84px">
                Cancel
              </v-btn>
              <v-btn color="darken-1" text @click="removeConfirm" width="84px">
                OK
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
  </div>
</template>




<script>
import { bus } from "@/main.js";

import { mapActions } from 'vuex';

export default {
  name: "Content",

  data() {
    return {
      collectionType: "course",
      items: [],
      cloneItems: [],
      cloneSelection: [],
      cloneOpen: [],
      search: '',
      loading: true,
      dialog: false,
      checkboxes: [],
      selectedItem: "",
      itemsPerPage:5,
      headersCourse: [
        { text: "", value: "type", align: "center", width:"15%" },
        { text: "Id", value: "strapiId", cellClass:"text-body-1"},
        { text: "Name", value: "name", cellClass:"text-body-1"},
        { text: "Author", value: "my" },
        { text: "State", value: "state" },
        { text: '', value: 'actions', sortable: false, width:"15%"},
      ],
      headersEvaluative: [
        { text: "Id", value: "strapiId", align: "start" },
        { text: "Name", value: "name" },
        { text: "Type", value: "type" },
        { text: "Author", value: "my" },
        { text: "State", value: "state" },
        { text: '', value: 'actions', sortable: false },
      ],
      headersExpositive: [
        { text: "Id", value: "strapiId", align: "start" },
        { text: "Name", value: "name" },
        { text: "Type", value: "type" },
        { text: "Author", value: "my" },
        { text: "State", value: "state" },
        { text: '', value: 'actions', sortable: false },
      ],
      headersQuestion: [
        { text: "Id", value: "strapiId", align: "start" },
        { text: "Question", value: "question" },
        { text: "Author", value: "my" },
        { text: "State", value: "state" },
        { text: '', value: 'actions', sortable: false },
      ],
    }
  },
  watch: {
    collectionType() {
      this.setItems()
    },
    checkboxes() {
      this.setItems()
    },
    cloneSelection(newV, oldV) {
      if (newV.length > oldV.length) {
        const newItem = newV.find(v => !oldV.includes(v))
        const parent = this.findParentofCloneBody(newItem)
        let addIds = []
        if (parent != null) {
          parent.forEach(v => {
            if (!newV.includes(v)) {
              addIds.push(v)
            }
          })
          this.addParents(addIds)
        }
      }
    }
  },
  methods: {
    ...mapActions(["fetchCollectionTypes", "fetchCourseTeacher", "fetchEmptyCourse", "deleteCourse", "fetchCloneBody", "fetchClone"]),
    async setItems() {
      const parameters = {
        collectionType: this.collectionType,
        my: this.checkboxes.includes("my"),
        draft: this.checkboxes.includes("draft")
      }
      this.loading = true
      this.items = await this.fetchCollectionTypes(parameters)
      this.loading = false
    },
    addParents(list) {
      this.cloneSelection.push(...list)
    },
    findParentofCloneBody(id) {
      const items = this.cloneItems.children
      for (let i = 0; i < items.length; i++) {
        const module = items[i]
        if (module.id == id) {
          return null
        }
        if (module.children) {
          for (let j = 0; j < module.children.length; j++) {
            const lesson = module.children[j]
            if (lesson.id == id) {
              return [module.id]
            }
            if (lesson.children) {
              for (let k = 0; k < lesson.children.length; k++) {
                const ex = lesson.children[k]
                if (ex.id == id) {
                  return [module.id, lesson.id]
                }
              }
            }
          }
        }
      }
      return null
    },
    async openCollectionType(item) {
      if (this.collectionType == "course") {
        await this.fetchCourseTeacher(item.strapiId)
        bus.$emit("changePage", ["content,Course", "content"]);
      } else if (this.collectionType == "expositive") {
        // TODO show expositive
      } else if (this.collectionType == "evaluative") {
        // TODO show evaluative
      } else if (this.collectionType == "question") {
        // TODO show question
      }
    },
    getColor(item) {
      if (item == "Published") return "green"
      else if (item == "Draft") return "primary"
      else if (item == "my") return 'green'
      else return 'black'
    },
    getIcon(type) {
      if (type == "Contest") return "mdi-trophy"
      else if (type == "Course") return "mdi-school-outline"
      else if (type == "Test/Exam") return "mdi-note-edit-outline"
      else if (type == "programming-exercise") return "mdi-code-json"
      else if (type == "quiz") return "mdi-head-question-outline"
      else if (type == "pdf") return "mdi-file-pdf-box"
      else if (type == "video") return "mdi-video"
    },
    async copyMenu(item) {
      this.cloneSelection = []
      this.cloneOpen = []
      const cloneBody = await this.fetchCloneBody(item.strapiId)
      this.cloneItems = cloneBody
    },
    async copy() {
      let cloneData = this.cloneItems
      cloneData.id = cloneData.strapiId
      delete cloneData.strapiId
      if (cloneData.children) {
        cloneData.modules = cloneData.children
        cloneData.modules.forEach(module => {
          if (this.cloneSelection.includes(module.id)) {
            module.clone = true
          }
          delete module.strapiId
          delete module.id
          module.name = module.name.substring(3)
          if (module.children) {
            module.lessons = module.children
            module.lessons.forEach(lesson => {
              if (this.cloneSelection.includes(lesson.id)) {
                lesson.clone = true
              }
              delete lesson.strapiId
              delete lesson.id
              lesson.name = lesson.name.substring(3)
              if (lesson.children) {
                lesson.expositives = []
                lesson.evaluatives = []
                lesson.children.forEach(children => {
                  let element = children
                  if (this.cloneSelection.includes(element.id)) {
                    element.clone = true
                  }
                  element.name = element.name.substring(5)
                  delete element.strapiId
                  delete element.id
                  if (children.name.includes("Exp")) {
                    lesson.expositives.push(element)
                  } else {
                    lesson.evaluatives.push(element)
                  }
                })
                delete lesson.children
              }
            })
            delete module.children
          }
        })
        delete cloneData.children
      }
      await this.fetchClone(cloneData)
      bus.$emit("changePage", ["content,Course", "content"]);
    },
    edit(item) {
      this.openCollectionType(item)
    },
    remove(item) {
      this.selectedItem = item
      this.dialog = true
    },
    async removeConfirm() {
      this.dialog = false
      await this.deleteCourse(this.selectedItem.strapiId)
      await this.setItems()
      this.selectedItem = ""
    },
    see(item) {
      this.openCollectionType(item)
    }
  },
  created() {
    this.setItems()
  },
  computed: {
    getHeader() {
      switch (this.collectionType) {
        case "course":
          return this.headersCourse
        case "expositive":
          return this.headersExpositive
        case "evaluative":
          return this.headersEvaluative
        case "question":
          return this.headersQuestion
        default:
          return []
      }
    }
  },
}
</script>

<style></style>
