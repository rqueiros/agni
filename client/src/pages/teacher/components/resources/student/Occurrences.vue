<template>
  <div id="occurrences" style="width:100%" class="min_height">
    <v-container fluid class="pa-0 mb-4 min_height d-flex flex-column">

      <v-row dense style="flex-grow: 100;">
        <v-col>
          <v-card
            width="100%" 
            height="100%"
            class="text-h6 font-weight-regular shadow"
            color=boxes
          >
              <v-row no-gutters style="height: 100%;">
                
                <template v-for="(occ, index) in currentOcc" >
                  <v-col :key="occ.id" v-if="currentOcc.length>0">
                    <v-hover
                      v-slot="{ hover }"
                    >
                      <v-card 
                        width="100%" 
                        height="100%"
                        class="py-4 px-8 text-h6  font-weight-regular"
                        flat
                        @click="openCollectionType(occ)"
                        :color="hover ? 'hover' : 'boxes'"
                      >
                        <v-list-item three-line class="pa-0">
                          <v-list-item-content>
                            <div class="mb-2">
                              <v-icon size="xxx-large" color="primary">
                                {{ getIcon(occ.course.type) }}
                              </v-icon>
                            </div>
                            <div class="mt-4">
                              {{ occ.year }} - {{ occ.course.name }}
                            </div>
                          </v-list-item-content>
                          <div style="align-self: baseline;">
                            <v-btn 
                              icon
                              small
                              @click="copy(occ.id)" 
                              onclick="event.stopPropagation()" 
                            >
                              <v-icon size="large">
                                mdi-content-copy
                              </v-icon>
                            </v-btn>
                            <v-btn 
                              icon
                              small
                              @click="remove(occ.id)"
                              onclick="event.stopPropagation()" 
                            >
                              <v-icon size="large">
                                mdi-delete
                              </v-icon>
                            </v-btn>
                          </div>
                        </v-list-item>
                        <v-card class="mt-4" outlined style="background-color: transparent;">
                          <v-row class="pa-2 align-center" >
                            <v-col class="d-flex justify-center">
                              <v-progress-circular
                                :rotate="-90"
                                :size="40"
                                :width="15"
                                :value="(new Date() - new Date(occ.startDate))/(new Date(occ.endDate) - new Date(occ.startDate))*100" 
                                color="primary"
                              >
                              </v-progress-circular>
                            </v-col>
                            <v-divider vertical class="my-4"/>
                            <v-col class="d-flex justify-center">
                              <v-icon size="xx-large" color="primary">
                                mdi-human-male-board
                              </v-icon>
                              <span class="ml-1">
                                {{ "classes" in occ && occ.classes != null ? occ.classes.length : '0' }}
                              </span>
                            </v-col>
                            <v-divider vertical class="my-4" />
                            <v-col class="d-flex justify-center">
                              <v-icon size="xx-large" color="primary">
                                mdi-account-group
                              </v-icon>
                              <span class="ml-1">
                                {{ "classes" in occ && occ.classes != null ? occ.classes.flatMap(c => c.students.data).length : "0" }}
                              </span>
                            </v-col>
                          </v-row>
                        </v-card>
                      </v-card>
                    </v-hover>
                  </v-col>
                  <v-divider 
                    :key="'b'+occ.id" 
                    vertical 
                    style="z-index:10" 
                    v-if="index < currentOcc.length-1">
                  </v-divider>
                </template>
                <v-col v-if="!currentOcc.length>0">
                  <v-card 
                    width="100%" 
                    height="100%"
                    class="py-4 px-8 text-h6 font-weight-regular d-flex justify-center align-center shadow"
                    color="boxes"
                  >
                    There are no current Occurrences!
                  </v-card>
                </v-col>
              </v-row>
          </v-card>
        </v-col>

            
      </v-row>

      <v-row>
        <v-col cols="6">
          <v-card 
            width="100%" 
            class="pt-3 shadow"
            min-height="247px"
            color="boxes"
          >
            <v-card-title class="py-0 mb-2">
              <v-row no-gutters>
                <v-col class="text-body-1 font-weight-medium" cols="5">
                  Draft/Future
                </v-col>
                <v-col class="text-body-1">
                  <v-text-field 
                    class="smallSearch"
                    v-model="draftSearch" 
                    prepend-inner-icon="mdi-magnify" 
                    single-line 
                    dense 
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-title>
            <v-data-table 
              hide-default-header 
              :itemsPerPage="itemsPerPage"
              dense 
              :headers="draftHeader" 
              :items="draftOcc"
              :search="draftSearch" 
              @click:row="openCollectionType" 
              :loading="loading"
              class="d-flex flex-column justify-space-between my-data-table"
              style="min-height:201px; background-color: transparent;"
            >
              <template v-slot:item.courseType="{ item }">
                <v-icon>
                  {{ getIcon(item.courseType) }}
                </v-icon>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn
                  small
                  @click="copy(item.id)" 
                  onclick="event.stopPropagation()" 
                  icon
                >
                  <v-icon size="large">
                    mdi-content-copy
                  </v-icon>
                </v-btn>
                <v-btn 
                  icon
                  small
                  onclick="event.stopPropagation()" 
                  @click="remove(item.id)"
                >
                  <v-icon size="large">
                    mdi-delete
                  </v-icon>
                </v-btn>

              </template>
            </v-data-table>
          </v-card>
        </v-col>

        <v-col cols="6">
          <v-card 
            width="100%" 
            class="pt-3 shadow"
            min-height="247px"
            color="boxes"
          >
            <v-card-title class="py-0 mb-2">
              <v-row no-gutters>
                <v-col class="text-body-1 font-weight-medium" cols="5">
                  Past
                </v-col>
                <v-col class="text-body-1">
                  <v-text-field 
                    class="smallSearch"
                    v-model="pastSearch" 
                    prepend-inner-icon="mdi-magnify" 
                    single-line 
                     
                    dense 
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-title>
            <v-data-table 
              hide-default-header 
              :itemsPerPage="itemsPerPage" 
              dense 
              :headers="pastHeader" 
              :items="pastOcc"
              :search="pastSearch" 
              @click:row="openCollectionType" 
              :loading="loading"
              class="d-flex flex-column justify-space-between my-data-table"
              style="min-height:201px; background-color: transparent;"
            >
              <template v-slot:item.courseType="{ item }">
                <v-icon>
                  {{ getIcon(item.courseType) }}
                </v-icon>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn
                  small
                  @click="copy(item.id)" 
                  onclick="event.stopPropagation()"
                  icon 
                >
                  <v-icon size="large">
                    mdi-content-copy
                  </v-icon>
                </v-btn>
                <v-btn 
                  small
                  onclick="event.stopPropagation()" 
                  @click="remove(item.id)"
                  icon
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

    <DeleteDialog :dialog="deleteDialog" :collectionType="'occurrence'" />
  </div>
</template>
<!--
   <v-card width="100%" outlined style="border-color: #C3C3C3;" class="pa-4">
   </v-card>
-->

<script>
import { bus } from "@/main.js";
import { mapActions, mapGetters } from "vuex";

import DeleteDialog from "../../../../../components/gerneral/DeleteDialog.vue";

export default {
  name: "Occurrences",

  components: {
    DeleteDialog,
  },

  data() {
    return {
      currentOcc: [],
      draftOcc: [],
      pastOcc: [],
      draftSearch: "",
      pastSearch: "",
      itemsPerPage: 5,
      draftHeader: [
        { text: "Type", value: "courseType", align: "center" },
        { text: "Year", value: "year", align: "start" },
        { text: "Course", value: "courseName", align: "center" },
        { text: "", value: "actions", sortable: false, align: "end" }
      ],      
      pastHeader: [
        { text: "Type", value: "courseType", align: "center" },
        { text: "Year", value: "year", align: "start" },
        { text: "Course", value: "courseName", align: "center" },
        { text: "", value: "actions", sortable: false, align: "end" }
      ],

      deleteDialog: false,
      toDeleteItem: 0,
    };
  },

  created() {
    this.setItems();

    bus.$on("deleteDialog", payload => {
      this.deleteDialog = payload;
    });
    bus.$on("deleteDialogResult", async payload => {
      this.deleteDialog = false
      if (this.toDeleteItem != 0) {
        try {
          if (payload == "ok") {
            await this.deleteCollectionType([this.toDeleteItem, "occurrences"]);
            await this.setItems();
            this.toDeleteItem = 0;
            bus.$emit("successSnackbar", "Occurrence deleted")
          }
        } catch (error) {
          console.log(error)
          this.toDeleteItem = 0;
          bus.$emit("errorSnackbar", "Something went wrong deleting the occurrence")
        }
      }
    });
  },

  computed:{
    ...mapGetters("style", [
      "getIcon", 
    ])
  },

  methods: {
    ...mapActions("main", [
      "fetchPrepareCollectionType", 
      "fetchCollectionTypes", 
      "deleteCollectionType", 
      "copyCollectionType"
    ]),

    async setItems() {
      const parameters = {
        collectionType: "occurrences"
      };
      try {
        this.loading = true;
        let items = await this.fetchCollectionTypes(parameters);
        this.currentOcc = items.currentOcc;
        this.draftOcc = items.draftOcc;
        this.draftOcc.forEach(occ => {
          occ.courseName = occ.course.name
          occ.courseType = occ.course.type
        })
        this.pastOcc = items.pastOcc;
        this.pastOcc.forEach(occ => {
          occ.courseName = occ.course.name
          occ.courseType = occ.course.type
        })
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error)
        bus.$emit("errorSnackbar", "Something went wrong fetching the occurrences")
      }
    },

    async openCollectionType(item) {
      try {
        await this.fetchPrepareCollectionType([item.id, "occurrences"]);
        bus.$emit("changePage", "student,Occurrence");
      } catch (error) {
        bus.$emit("errorSnackbar", "Something went wrong fetching the occurrence")
      }
    },

    remove(id) {
      this.toDeleteItem = id;
      this.deleteDialog = true;
    },

    async copy(id){
      try {
        await this.copyCollectionType([id, "occurrences"]);
        bus.$emit("successSnackbar", "Occurrence copied")
        bus.$emit("changePage", "student,Occurrence");
      } catch (error) {
        console.log(error)
        bus.$emit("errorSnackbar", "Something went wrong copying the occurrence")
      }
    }
  }
};
</script>


<style scoped>

.my-data-table tbody tr:hover {
  cursor: pointer;
}

#occurrences>>>.v-data-footer__select {
  height: 40px;
}

#occurrences>>>.v-text-field>.v-input__control>.v-input__slot:before {
  border-style: none !important;
}




#occurrences>>>.v-text-field--outlined.v-input--dense .v-label {
  top: 2px;
  font-size: smaller;
}

#occurrences>>>.v-text-field--outlined fieldset {
  /*height: 28px;*/
}

#occurrences>>>.v-text-field.v-text-field--enclosed:not(.v-text-field--rounded)>.v-input__control>.v-input__slot,
.v-text-field.v-text-field--enclosed .v-text-field__details {
  min-height: 0 !important;
  /*height: 28px;*/
}

#occurrences>>>.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__prepend-inner {
  margin-top: 1px;
}


#occurrences>>>.v-text-field input {
  padding: 0px;
  font-size: smaller;
}


#occurrences>>>.v-text-field>.v-input__control>.v-input__slot>.v-text-field__slot {
  display: block;
  /*height: 28px;*/
}


/*
#occurrences>>>.v-text-field--outlined fieldset{
  border-color: rgb(195, 195, 195);
}*/



.smallSearch>>>.v-icon.v-icon {
  font-size: 20px;
}

.smallSearch>>>.v-text-field--outlined fieldset{
  border-color: none !important;
}
#occurrences>>>.v-text-field.v-input--dense{
  margin-top:0px;
}
</style>
