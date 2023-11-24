<template>
  <div id="content" style="width: 100%;">
    <v-container fluid class="pa-0 mb-4" style="max-width: 1200px;">
      <v-row dense>

        <!--Collection Type Selection-->
        <v-col cols="12" class="collectionSelect">
          <v-card class="pa-2 shadow d-flex justify-center" color="boxes">
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

        <!--<v-col style="max-width: 190px;" cols="12">
          <v-card width="100%" class="pa-2 shadow" color="boxes">
            <v-radio-group row hide-details inline class="ma-0 pa-0">
              <v-checkbox
                v-model="checkboxes"
                label="My"
                value="my"
                hide-details
                class="ma-0 pa-0 mr-4"
              />
              <v-checkbox
                v-model="checkboxes"
                label="Draft"
                value="draft"
                hide-details
                class="ma-0 pa-0 mr-4"
              />
            </v-radio-group>
          </v-card>
        </v-col>-->

        <!--Search-->
        <v-col style="min-width: 176px">
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

      <!--Data Table-->
      <v-row dense>
        <v-col>
          <v-card width="100%" class="shadow" color="boxes">
            <v-data-table
              show-select
              :itemsPerPage="itemsPerPage"
              :headers="headers[collectionType]"
              :items="items"
              :search="search"
              @click:row="openCollectionType"
              @current-items="setCurrentItems"
              :loading="loading"
              style="background-color: transparent;"
              mobile-breakpoint="0"
            >
              <!--Error-->
              <template v-slot:body v-if="error">
                <tr>
                  <td 
                    :colspan="headers[collectionType].length+1" 
                    class="pa-10 pb-15 text-center"
                  >
                    <ErrorChip/>
                  </td>
                </tr>
              </template>

              <!--CheckBox Thins-->
              <template v-slot:header.data-table-select>
                <v-checkbox 
                  hide-details
                  class="mt-0" 
                  color="darkgrey"
                  :indeterminate="allCheckInd"
                  v-model="allCheck"
                  @click.stop="clickCheckbox"
                />
              </template>
              <template v-slot:header>
                <v-btn 
                  color="error" 
                  small 
                  class="px-1" 
                  style="position: absolute; top:10px; left:50px"
                  v-if="selected.length>0"
                  @click="remove(selected)"
                >
                  Delete
                </v-btn>
              </template>
              <template v-slot:item.data-table-select="{ item }">
                <v-checkbox 
                  v-if="item.my" 
                  v-model="selected"
                  :value="item.id"
                  hide-details 
                  class="mt-0" 
                  @click.stop="() => {}" 
                  color="darkgrey"
                />
              </template>

              <!--Table Slots-->
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
                <div 
                  style="max-height: 40px; overflow-y: auto;" 
                  v-html="item.question"
                ></div>
              </template>
              <template v-slot:item.name="{ item }">
                <div style="max-height: 40px; overflow-y: auto;">
                  {{ item.name }}
                </div>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-menu
                  offset-y
                  :nudge-width="350"
                  :close-on-content-click="false"
                  v-if="collectionType == 'courses'"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      onclick="event.stopPropagation()"
                      icon
                      small
                    >
                      <v-icon size="large">
                        mdi-content-copy
                      </v-icon>
                    </v-btn>
                  </template>
                  <CopyCourseMenu :course="item"/>
                </v-menu>
                <v-btn
                  v-else
                  @click="copy(item)"
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
                  @click="remove([item.id])"
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
import ErrorChip from "../../../../../components/gerneral/ErrorChip.vue"
import CopyCourseMenu from "../../../../../components/gerneral/CopyCourseMenu.vue"

export default {
  name: "Content",

  components: {
    DeleteDialog,
    ErrorChip,
    CopyCourseMenu
  },

  data() {
    return {
      collectionType: "courses",
      search: "",
      loading: true,
      error: false,
      items: [],
      //checkboxes: [],
      itemsPerPage: 5,

      deleteDialog: false,
      toDeleteItem: [],

      selected: [],
      allCheck:false,
      allCheckInd:false,
      currentItems:[],

      screenHeight:0,

      color: {
        Published: "green",
        Draft: "primary",
        my: "green"
      },

      headers: {
        courses: [
          { text: "", value: "type", align: "center", width: "12%", sortable: false },
          { text: "Id", value: "id", cellClass:"columnWidth3" },
          { text: "Name", value: "name" },
          { text: "Author", value: "my", cellClass:"columnWidth1" },
          { text: "State", value: "state", cellClass:"columnWidth2" },
          { text: "", value: "actions", sortable: false, width: "90px" }
        ],
        expositives: [
          { text: "", value: "type", align: "center", width: "12%", sortable: false },
          { text: "Id", value: "id", cellClass:"columnWidth3" },
          { text: "Name", value: "name" },
          { text: "Author", value: "my", cellClass:"columnWidth1" },
          { text: "State", value: "state", cellClass:"columnWidth2" },
          { text: "", value: "actions", sortable: false, width: "90px" }
        ],
        evaluatives: [
          { text: "", value: "type", align: "center", width: "12%", sortable: false },
          { text: "Id", value: "id", cellClass:"columnWidth3" },
          { text: "Name", value: "name" },
          { text: "Author", value: "my", cellClass:"columnWidth1" },
          { text: "State", value: "state", cellClass:"columnWidth2" },
          { text: "", value: "actions", sortable: false, width: "90px" }
        ],
        questions: [
          { text: "Id", value: "id", cellClass:"columnWidth3" },
          { text: "Question", value: "question" },
          { text: "Author", value: "my", cellClass:"columnWidth1" },
          { text: "State", value: "state", cellClass:"columnWidth2" },
          { text: "", value: "actions", sortable: false, width: "90px" }
        ]
      },
    };
  },

  created() {
    this.updateParentDivWidth = this.updateParentDivWidth.bind(this);

    let contentCollType = localStorage.getItem("contentCollType") || "";
    if (contentCollType != "") {
      this.collectionType = contentCollType;
    }

    this.setItems();

    bus.$on("deleteDialog", payload => {
      this.deleteDialog = payload;
    });
    bus.$on("deleteDialogResult", async payload => {
      this.deleteDialog = false;
      if (this.toDeleteItem != "") {
        try {
          if (payload == "ok") {
            for (let id of this.toDeleteItem){
              await this.deleteCollectionType([id,this.collectionType]);
            }
            await this.setItems();
            bus.$emit("successSnackbar", " deleted");
          }
        } catch (error) {
          console.log(error);
          bus.$emit("errorSnackbar", "Something went wrong deleting the ");
        }
        this.toDeleteItem = [];
        this.selected = [];
      }
    });
  },

  beforeDestroy() {
    localStorage.setItem("contentCollType", this.collectionType);
    clearTimeout(this.updateParentDivWidthTimeout);
    window.removeEventListener("resize", this.updateParentDivWidth);
  },

  mounted() {
    this.screenHeight = window.innerHeight
    window.addEventListener("resize", this.updateParentDivWidth);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.updateParentDivWidth);
  },

  watch: {
    selected(newVal){
      const selectableItems = this.currentItems.filter(i => i.my).length;
      if (newVal.length === selectableItems && selectableItems > 0) {
        this.allCheck = true;
        this.allCheckInd = false;
      } else if (newVal.length > 0) {
        this.allCheckInd = true;
        this.allCheck = false;
      } else {
        this.allCheckInd = false;
        this.allCheck = false;
      }
    },
    collectionType() {
      this.selected= [];
      this.setItems();
    },
    screenHeight(newV){
      if(newV > 800){
        this.itemsPerPage=10
      } else {
        this.itemsPerPage=5
      }
    }
    /*checkboxes() {
      this.setItems();
    },*/
  },

  computed: {
    ...mapGetters("style", [
      "getIcon"
    ]),
  },

  methods: {
    ...mapActions("main", [
      "fetchCollectionTypes",
      "fetchPrepareCollectionType",
      "deleteCollectionType",
      "copyCollectionType"
    ]),

    updateParentDivWidth() {
      clearTimeout(this.updateParentDivWidthTimeout);
      this.updateParentDivWidthTimeout = setTimeout(() => {
        this.screenHeight = window.innerHeight
      }, 200);
    },

    setCurrentItems(items) {
      this.currentItems = items;
    },

    async setItems() {
      const parameters = {
        collectionType: this.collectionType,
        //my: this.checkboxes.includes("my"),
        //draft: this.checkboxes.includes("draft")
      };
      this.loading = true;
      try {
        this.items = await this.fetchCollectionTypes(parameters);
      } catch (error) {
        console.log(error);
        this.error = true;
      }
      this.loading = false;
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
        console.log(error);
        bus.$emit("errorSnackbar", "Something went wrong fetching the ");
      }
    },

    clickCheckbox(){
      if (this.currentItems.filter(i => i.my).length == this.selected.length){
        this.selected = []
      } else {
        this.selected = this.currentItems.filter(i => i.my).flatMap(i => i.id)
      }
    },

    async copy(item) {
      try {
        await this.copyCollectionType([item.id, this.collectionType]);
        switch (this.collectionType) {
          case "expositives":
            bus.$emit("changePage", "content,Expositive");
            bus.$emit("successSnackbar", "Expositive copied");
            break;
          case "evaluatives":
            bus.$emit("changePage", "content,Evaluative");
            bus.$emit("successSnackbar", "Evaluative copied");
            break;
          case "questions":
            bus.$emit("changePage", "content,Question");
            bus.$emit("successSnackbar", "Question copied");
            break;
        }
      } catch (error) {
        console.log(error);
        bus.$emit("errorSnackbar", "Something went wrong copying the ");
      }
    },

    remove(list) {
      this.toDeleteItem = list;
      this.deleteDialog = true;
    },
  }
};
</script>


<style scoped>
#content>>> tbody tr:hover {
  cursor: pointer;
}
#content
  >>> .v-text-field.v-text-field--solo:not(.v-text-field--solo-flat)
  > .v-input__control
  > .v-input__slot {
  box-shadow: none;
}

#content>>> .v-data-table > .v-data-table__wrapper > table > tbody > tr > td{
  padding: 0 16px 0 16px !important;
}
#content>>> .v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th{
  padding:0 16px 0 16px !important;
}

.collectionSelect{
  max-width: 475px;
}

@media only screen and (max-width: 768px) {
  .collectionSelect{
    max-width: none;
  }
}

@media only screen and (max-width: 1000px) {
  #content>>> .v-data-table > .v-data-table__wrapper > table > tbody > tr > td{
    padding: 0 0px 0 16px !important;
  }
  #content>>> .v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th{
    padding:0 0px 0 16px !important;
  }
}
</style>


<style>
.columnWidth1{
  min-width: 87px;
}
.columnWidth2{
  min-width: 120px;
}
.columnWidth3{
  min-width: 61px;
}
</style>
