<template>
  <div id="dashboardStudent">
    <v-container fluid class="pa-0 mb-4" style="max-width: 1200px;">
      <!--Current Occurrences-->
      <v-row dense>
        <v-col>
          <v-card width="100%" class="shadow" color="boxes">
            <v-row no-gutters>
              <!--Error-->
              <v-col v-if="error">
                <v-card
                  width="100%"
                  class="pa-6 d-flex justify-center"
                  flat
                  color="boxes"
                >
                  <ErrorChip/>
                </v-card>
              </v-col>

              <!--Loading-->
              <v-col v-else-if="loading">
                <v-card
                  width="100%"
                  class="pa-6 d-flex justify-center"
                  flat
                  color="boxes"
                >
                  <v-progress-circular
                    :size="120"
                    indeterminate
                    color="grey"
                    :width="7"
                  ></v-progress-circular>
                </v-card>
              </v-col>

              <!--Current Occurrences-->
              <template 
                v-else-if="currentOcc.length > 0" 
                v-for="(occ, index) in currentOcc"
              >
                <v-col :key="occ.id" v-if="currentOcc.length > 0" style="min-width: 200px;">
                  <v-hover v-slot="{ hover }">
                    <v-card
                      width="100%"
                      class="pa-4 pb-8"
                      flat
                      @click="openCollectionType(occ)"
                      :color="hover ? 'hover' : 'boxes'"
                    >
                      <v-row style="min-height:88px">
                        <v-col cols="3" class="d-flex align-center justify-center">
                          <v-icon size="xxx-large" color="primary">
                            {{ getIcon(occ.course.type) }}
                          </v-icon>
                        </v-col>
                        <v-col cols="8" class="d-flex justify-center flex-column">
                          <div 
                            class="text-h6 overflow-hidden" 
                            style="white-space: nowrap; text-overflow: ellipsis;"
                          >
                            {{ occ.course.name }}
                          </div>
                          <div>
                            {{ occ.year }}
                          </div>
                          <v-card 
                            style="position:absolute; top:16px; right:16px" 
                            flat 
                            :color="hover ? 'hover' : 'boxes'"
                          >
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
                          </v-card>
                        </v-col>
                      </v-row>
                      <v-row class="mt-4">
                        <v-col>
                          <v-progress-linear rounded height="10"
                            :value="progress(occ.startDate, occ.endDate)" />
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-hover>
                </v-col>
                <v-divider
                  :key="'b' + occ.id"
                  vertical
                  style="z-index:10"
                  v-if="index < currentOcc.length - 1"
                >
                </v-divider>
              </template>

              <!--No Current Occurrences-->
              <v-col v-else-if="!currentOcc.length > 0">
                <v-card
                  width="100%"
                  height="100%"
                  class="py-4 px-8 text-h6 d-flex justify-center align-center shadow font-weight-regular"
                  color="boxes"
                >
                  There are no current Occurrences !!
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <!--Draft/Future Occurrences-->
        <v-col cols="6">
          <v-card width="100%" class="shadow pb-4 px-4" max-height="250px" color="boxes">
            <div class="py-1 text-body-1 font-weight-medium text-center">
              Draft/Future
            </div>
            <v-card outlined elevation="1" style="background-color: transparent;">
              <v-text-field
                class="smallSearch mt-0"
                v-model="draftSearch"
                prepend-inner-icon="mdi-magnify"
                single-line
                dense
                hide-details
                placeholder="Search"
                filled
              />
              <v-data-table
                :items-per-page="-1"
                hide-default-header
                hide-default-footer
                dense
                :headers="draftHeader"
                :items="draftOcc"
                :search="draftSearch"
                @click:row="openCollectionType"
                :loading="loading"
                class="overflow-y-auto"
                style="height:175px; background-color: transparent;"
                mobile-breakpoint="0"
                no-data-text="There are no draft/future Occurrences."
              >
                <!--Error-->
                <template v-slot:body v-if="error">
                  <tr>
                    <td 
                      :colspan="draftHeader.length" 
                      class="pa-10 pb-15 text-center"
                    >
                      <ErrorChip/>
                    </td>
                  </tr>
                </template>

                <!--Slots-->
                <template v-slot:item.courseType="{ item }">
                  <v-icon>
                    {{ getIcon(item.courseType) }}
                  </v-icon>
                </template>
                <template v-slot:item.actions="{ item }">
                  <div class="d-flex justify-end">
                    <div style="width:60px">
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
                    </div>
                  </div>
                </template>
                <template v-slot:item.courseName="{ item }">
                  <div style="max-height: 24px; overflow-y: auto;">
                    {{ item.courseName }}
                  </div>
                </template>
              </v-data-table>
            </v-card>
          </v-card>
        </v-col>

        <!--Past Occurrences-->
        <v-col cols="6">
          <v-card width="100%" class="shadow pb-4 px-4" max-height="250px" color="boxes">
            <div class="py-1 text-body-1 font-weight-medium text-center">
              Past
            </div>
            <v-card outlined elevation="1" style="background-color: transparent;">
              <v-text-field
                class="smallSearch"
                v-model="pastSearch"
                prepend-inner-icon="mdi-magnify"
                single-line
                dense
                hide-details
                filled
                placeholder="Search"
              />
              <v-data-table
                hide-default-header
                hide-default-footer
                :itemsPerPage="-1"
                dense
                :headers="pastHeader"
                :items="pastOcc"
                :search="pastSearch"
                @click:row="openCollectionType"
                :loading="loading"
                class="overflow-y-auto"
                style="height:175px; background-color: transparent;"
                mobile-breakpoint="0"
                no-data-text="There are no past Occurrences."
              >
                <!--Error-->
                <template v-slot:body v-if="error">
                  <tr>
                    <td 
                      :colspan="pastHeader.length" 
                      class="pa-10 pb-15 text-center"
                    >
                      <ErrorChip/>
                    </td>
                  </tr>
                </template>

                <!--Slots-->
                <template v-slot:item.courseType="{ item }">
                  <v-icon>
                    {{ getIcon(item.courseType) }}
                  </v-icon>
                </template>
                <template v-slot:item.actions="{ item }">
                  <div class="d-flex justify-end">
                    <div style="width:60px">
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
                    </div>
                  </div>
                </template>
                <template v-slot:item.courseName="{ item }">
                  <div style="max-height: 24px; overflow-y: auto;">
                    {{ item.courseName }}
                  </div>
                </template>
              </v-data-table>
            </v-card>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <DeleteDialog :dialog="deleteDialog" :collectionType="'occurrence'" />
  </div>
</template>


<script>
import { bus } from "@/main.js";
import { mapActions, mapGetters } from "vuex";

import DeleteDialog from "../../../../../components/gerneral/DeleteDialog.vue";
import ErrorChip from "../../../../../components/gerneral/ErrorChip.vue";

export default {
  name: "dashboardStudent",

  components: {
    DeleteDialog,
    ErrorChip
  },

  data() {
    return {
      loading:true,
      error:false,
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
        { text: "", value: "actions", sortable: false, align: "end"}
      ],

      deleteDialog: false,
      toDeleteItem: 0
    };
  },

  created() {
    this.setItems();

    bus.$on("deleteDialog", payload => {
      this.deleteDialog = payload;
    });
    bus.$on("deleteDialogResult", async payload => {
      this.deleteDialog = false;
      if (this.toDeleteItem != 0) {
        try {
          if (payload == "ok") {
            await this.deleteCollectionType([this.toDeleteItem, "occurrences"]);
            await this.setItems();
            this.toDeleteItem = 0;
            bus.$emit("successSnackbar", "Occurrence deleted");
          }
        } catch (error) {
          console.log(error);
          this.toDeleteItem = 0;
          bus.$emit(
            "errorSnackbar",
            "Something went wrong deleting the occurrence"
          );
        }
      }
    });
  },

  computed: {
    ...mapGetters("style", ["getIcon"]),
  },

  methods: {
    ...mapActions("request", [
      "fetchPrepareCollectionType",
      "fetchCollectionTypes",
      "deleteCollectionType",
      "copyCollectionType"
    ]),
    progress(startDate, endDate){
      return ((new Date() - new Date(startDate)) / 
        (new Date(endDate) - new Date(startDate))) 
        * 100
    },

    async setItems() {
      const parameters = {
        collectionType: "occurrences"
      };
      this.loading = true;
      try {
        let items = await this.fetchCollectionTypes(parameters);
        this.currentOcc = items.currentOcc;
        this.draftOcc = items.draftOcc;
        this.draftOcc.forEach(occ => {
          occ.courseName = occ.course.name;
          occ.courseType = occ.course.type;
        });
        this.pastOcc = items.pastOcc;
        this.pastOcc.forEach(occ => {
          occ.courseName = occ.course.name;
          occ.courseType = occ.course.type;
        });
      } catch (error) {
        console.log(error);
        this.error = true;
      }
      this.loading = false;
    },

    async openCollectionType(item) {
      try {
        await this.fetchPrepareCollectionType([item.id, "occurrences"]);
        bus.$emit("changePage", "student,Occurrence");
      } catch (error) {
        bus.$emit(
          "errorSnackbar",
          "Something went wrong fetching the occurrence"
        );
      }
    },

    remove(id) {
      this.toDeleteItem = id;
      this.deleteDialog = true;
    },

    async copy(id) {
      try {
        await this.copyCollectionType([id, "occurrences"]);
        bus.$emit("successSnackbar", "Occurrence copied");
        bus.$emit("changePage", "student,Occurrence");
      } catch (error) {
        console.log(error);
        bus.$emit(
          "errorSnackbar",
          "Something went wrong copying the occurrence"
        );
      }
    }
  }
};
</script>


<style scoped>
#dashboardStudent>>> tbody tr:hover {
  cursor: pointer;
}

#dashboardStudent>>> .v-input--hide-details > .v-input__control > .v-input__slot{
  padding-left: 8px;
  padding-right: 8px;
  min-height:20px;
}

#dashboardStudent>>> .v-text-field.v-input--dense .v-input__prepend-inner, .v-text-field.v-input--dense .v-input__append-inner {
  margin-top: 2px !important;
}


#dashboardStudent>>>.v-text-field > .v-input__control > .v-input__slot:before{
  border-color: rgba(0, 0, 0, 0.12);
}

#dashboardStudent>>>.smallSearch .v-icon.v-icon{
  font-size: 20px;
}
</style>
