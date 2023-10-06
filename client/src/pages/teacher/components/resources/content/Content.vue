<template>
  <div id="content" style="width: 100%;">
    <v-container fluid class="pa-0 mb-4">

      <v-row dense>
        <v-col style="max-width: 500px;" cols="12">
          <v-card class="pa-2 shadow" color="boxes">
            <v-radio-group 
              v-model="collectionType" 
              row 
              hide-details 
              inline 
              class="ma-0 pa-0"
            >
              <v-radio label="Course" value="courses"></v-radio>
              <v-radio label="Expositive" value="expositives"></v-radio>
              <v-radio label="Evaluative" value="evaluatives"></v-radio>
              <v-radio label="Question" value="questions"></v-radio>
            </v-radio-group>
          </v-card>
        </v-col>

        <v-col style="max-width: 190px;" cols="12">
          <v-card 
            width="100%" 
            class="pa-2 shadow"
            color="boxes"
          >
            <v-radio-group row hide-details inline class="ma-0 pa-0">
              <v-checkbox 
                v-model="checkboxes" 
                label="My" 
                value="my" 
                hide-details 
                class="ma-0 pa-0 mr-4"/>
              <v-checkbox 
                v-model="checkboxes" 
                label="Draft" 
                value="draft" 
                hide-details
                class="ma-0 pa-0 mr-4"
              />
            </v-radio-group>
          </v-card>
        </v-col>

        <v-col cols="12" style="max-width: 330px;">
          <v-text-field 
            v-model="search" 
            style="height:100%"
            :background-color="$vuetify.theme.currentTheme.boxes"
            prepend-inner-icon="mdi-magnify" 
            label="Search"
            single-line 
            solo
            class="pa-0 ma-0 shadow"  
            dense
            hide-details
          />
        </v-col>
      </v-row>

      <v-row dense>
        <v-col>
          <v-card width="100%" class="shadow" color="boxes">
            <v-data-table 
              class="my-data-table" 
              :itemsPerPage="itemsPerPage" 
              :headers="headers[collectionType]" 
              :items="items"
              :search="search" 
              @click:row="openCollectionType" 
              :loading="loading"
              style="background-color: transparent;"
            >
              <template v-slot:item.my="{ item }">
                <v-chip :color="color.my" outlined v-if="item.my">
                  My
                </v-chip>
              </template>
              <template v-slot:item.type="{ item }">
                <v-icon size="x-large">
                  {{ getIcon(item.type) }}
                </v-icon>
              </template>
              <template v-slot:item.state="{ item }">
                <v-chip :color="color[item.state]" label outlined>
                  {{ item.state }}
                </v-chip>
              </template>
              <template v-slot:item.question="{ item }">
                {{ item.question.substring(3, item.question.length-4) }}
              </template>
              <template v-slot:item.actions="{ item }">

                <v-menu 
                  offset-y 
                  :nudge-width="350"
                  :close-on-content-click="false" 
                  v-if="collectionType=='courses'"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn 
                      v-bind="attrs" 
                      v-on="on" 
                      @click="copyMenu(item)"
                      onclick="event.stopPropagation()"
                      icon
                      small
                    >
                      <v-icon size="large">
                        mdi-content-copy
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item>
                      <v-treeview 
                        selectable 
                        dense 
                        selection-type="independent" 
                        v-model="cloneSelection"
                        :items="cloneItems.children" 
                        :open.sync="cloneOpen" 
                        :item-key="'idMenu'"
                      />
                    </v-list-item>
                    <v-list-item>
                      <v-btn width="100%" @click="copy()">
                        Clone
                      </v-btn>
                    </v-list-item>
                  </v-list>
                </v-menu>

                <v-btn 
                  v-else 
                  @click="copy2(item)" 
                  onclick="event.stopPropagation()" 
                  icon
                  small
                >
                  <v-icon size="large">
                    mdi-content-copy
                  </v-icon>
                </v-btn>

                <v-btn 
                  v-if="item.my" 
                  @click="remove(item)" 
                  onclick="event.stopPropagation()"
                  icon
                  small
                >
                  <v-icon size="large">
                    mdi-delete
                  </v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <DeleteDialog :dialog="deleteDialog" :collectionType="collectionType" />

  </div>
</template>

<script>
import { bus } from "@/main.js";

import { mapActions, mapGetters } from "vuex";

import DeleteDialog from "../../../../../components/gerneral/DeleteDialog.vue";

export default {
  name: "Content",

  components: {
    DeleteDialog
  },

  data() {
    return {
      collectionType: "courses",
      search: "",
      loading: true,
      items: [],
      checkboxes: [],
      itemsPerPage: 7,

      cloneItems: [],
      cloneSelection: [],
      cloneOpen: [],

      deleteDialog: false,
      toDeleteItem: "",

      headers: {
        courses: [
          { text: "", value: "type", align: "center", width: "15%" },
          { text: "Id", value: "id", cellClass: "text-body-1" },
          { text: "Name", value: "name", cellClass: "text-body-1" },
          { text: "Author", value: "my" },
          { text: "State", value: "state" },
          { text: "", value: "actions", sortable: false, width: "15%", align: "center" }
        ],
        expositives: [
          { text: "", value: "type", align: "center", width:"15%"},
          { text: "Id", value: "id" },
          { text: "Name", value: "name" },
          { text: "Author", value: "my" },
          { text: "State", value: "state" },
          { text: "", value: "actions", sortable: false, width: "15%", align: "center" }
        ],
        evaluatives: [
          { text: "", value: "type", align: "center", width:"15%"},
          { text: "Id", value: "id" },
          { text: "Name", value: "name" },
          { text: "Author", value: "my" },
          { text: "State", value: "state" },
          { text: "", value: "actions", sortable: false, width:"15%", align: "center" }
        ],
        questions: [
          { text: "Id", value: "id", align: "center", width:"15%"},
          { text: "Question", value: "question" },
          { text: "Author", value: "my" },
          { text: "State", value: "state" },
          { text: "", value: "actions", sortable: false, width:"15%", align: "center" }
        ]
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
      if (this.toDeleteItem != "") {
        try {
          if (payload == "ok") {
            await this.deleteCollectionType([this.toDeleteItem.id, this.collectionType]);
            await this.setItems();
            this.toDeleteItem = "";
            bus.$emit("successSnackbar", this.collTypeName() + " deleted")
          }
        } catch (error) {
          console.log(error)
          this.toDeleteItem = "";
          bus.$emit("errorSnackbar", "Something went wrong deleting the "+this.collTypeName())
        }
      }
    });
    let contentCollType = localStorage.getItem("contentCollType") || "";
    if (contentCollType != ""){
      this.collectionType = contentCollType
    }
    this.setItems();
  },

  beforeDestroy(){
    localStorage.setItem('contentCollType', this.collectionType);
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

  computed: {
    ...mapGetters("style", [
      "getErrorSnackbar", 
      "getSuccessSnackbar", 
      "getIcon"
    ]),
  },

  methods: {
    ...mapActions("main", [
      "fetchCollectionTypes",
      "fetchPrepareCollectionType",
      "fetchEmptyCourse",
      "deleteCollectionType",
      "fetchCloneBody",
      "fetchClone",
      "copyCollectionType",
    ]),

    async setItems() {
      const parameters = {
        collectionType: this.collectionType,
        my: this.checkboxes.includes("my"),
        draft: this.checkboxes.includes("draft")
      };
      this.loading = true;
      try {
        this.items = await this.fetchCollectionTypes(parameters);
        this.loading = false;
      } catch (error) {
        console.log(error)
        this.loading = false;
        bus.$emit("errorSnackbar", "Something went wrong fetching the "+this.collTypeName())
      }
    },

    async openCollectionType(item) {
      try {
        await this.fetchPrepareCollectionType([item.id, this.collectionType]);
        switch (this.collectionType) {
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
        bus.$emit("errorSnackbar", "Something went wrong fetching the "+this.collTypeName())
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
        bus.$emit("errorSnackbar", "Something went wrong fetching the Clone Menu")
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
        bus.$emit("successSnackbar", "Course copied")
        bus.$emit("changePage", "content,Course");
      } catch (error) {
        console.log(error)
        bus.$emit("errorSnackbar", "Something went wrong copying the Course")
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

    async copy2(item){
      try {
        await this.copyCollectionType([item.id,this.collectionType])
        switch (this.collectionType) {
          case "expositives":
            bus.$emit("changePage", "content,Expositive");
            bus.$emit("successSnackbar", "Expositive copied")
            break;
          case "evaluatives":
            bus.$emit("changePage", "content,Evaluative");
            bus.$emit("successSnackbar", "Evaluative copied")
            break;
          case "questions":
            bus.$emit("changePage", "content,Question");
            bus.$emit("successSnackbar", "Question copied")
            break;
        }
      } catch (error) {
        console.log(error)
        bus.$emit("errorSnackbar", "Something went wrong copying the "+this.collTypeName())
      }
    },

    remove(item) {
      this.toDeleteItem = item;
      this.deleteDialog = true;
    },

    collTypeName(){
      return this.collectionType.charAt(0).toUpperCase() + this.collectionType.slice(1,-1)
    },
  },
};
</script>

<style scoped>
.my-data-table tbody tr:hover {
  cursor: pointer;
}
#content>>>.v-text-field.v-text-field--solo:not(.v-text-field--solo-flat) > .v-input__control > .v-input__slot{
  box-shadow: none;
}


</style>
