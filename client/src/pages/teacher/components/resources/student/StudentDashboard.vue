<template>
  <div id="studentDashboard" style="width:100%" class="min_height">
    <v-container fluid class="pa-0 ma-0 min-height">
      <v-row no-gutters class="pb-3">
        <template v-for="occ in currentOcc">
          <v-col :key="occ.id">
            <v-card width="100%" outlined style="border-color: #C3C3C3;" class="pa-4 text-h5 px-8"
              @click="openCollectionType(occ)">
              <v-list-item three-line class="pa-0">
                <v-list-item-content>
                  <div class="mb-2">
                    {{ occ.year }}
                  </div>
                  <div class="my-2">
                    <v-icon size="xxx-large" class="mr-4">
                      {{ getIcon(occ.course.type) }}
                    </v-icon> {{ occ.course.name }}
                  </div>
                  <div class="my-2">
                    {{ occ.classes.map(c => c.name).toString() }}
                  </div>
                </v-list-item-content>

                <v-list-item-avatar>
                  <v-icon size="large" @click="copy(occ.id)" onclick="event.stopPropagation()" class="mr-2">
                    mdi-content-copy
                  </v-icon>
                  <v-icon size="large" onclick="event.stopPropagation()" @click="remove(occ.id)">
                    mdi-delete
                  </v-icon>
                </v-list-item-avatar>
              </v-list-item>
              <div class="mt-2 mb-2">
                <v-progress-linear color="primary" height="10" :value="(new Date() - new Date(occ.startDate))/(new Date(occ.endDate) - new Date(occ.startDate))*100" rounded></v-progress-linear>
              </div>
            </v-card>
          </v-col>
        </template>
      </v-row>
      <v-row id="forSearch" no-gutters class="pt-3">
        <v-col cols="6" class="pr-3">
          <v-card width="100%" outlined style="border-color: #C3C3C3;" class="pt-3">
            <v-card-title class="py-0 text-body-1 mb-1">
              Draft Course Sessions
              <v-text-field style="width:1%" v-model="draftSearch" prepend-inner-icon="mdi-magnify" label="Search"
                single-line class="pa-0 ma-0 ml-6 mr-12 mb-1 text-field" outlined dense hide-details></v-text-field>
            </v-card-title>
            <v-data-table hide-default-header :itemsPerPage="itemsPerPage" dense :headers="draftHeader" :items="draftOcc"
              :search="draftSearch" @click:row="openCollectionType" :loading="loading">
              <template v-slot:item.actions="{ item }">
                <v-icon size="large" @click="copy(item.id)" onclick="event.stopPropagation()" class="mr-2">
                  mdi-content-copy
                </v-icon>
                <v-icon size="large" onclick="event.stopPropagation()" @click="remove(item.id)">
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
        <v-col cols="6" class="pl-3">
          <v-card width="100%" outlined style="border-color: #C3C3C3;" class="pt-3">
            <v-card-title class="py-0 text-body-1 mb-1">
              Past Course Sessions
              <v-text-field style="width:1%" v-model="pastSearch" prepend-inner-icon="mdi-magnify" label="Search"
                single-line class="pa-0 ma-0 ml-6 mr-12 mb-1 text-field" outlined dense hide-details></v-text-field>
            </v-card-title>
            <v-data-table hide-default-header :itemsPerPage="itemsPerPage" dense :headers="pastHeader" :items="pastOcc"
              :search="pastSearch" @click:row="openCollectionType" :loading="loading">
              <template v-slot:item.actions="{ item }">
                <v-icon size="large" @click="copy(item.id)" onclick="event.stopPropagation()" class="mr-2">
                  mdi-content-copy
                </v-icon>
                <v-icon size="large" onclick="event.stopPropagation()" @click="remove(item.id)">
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <Snackbar :snackbar="snackbar.open" :timeout="snackbar.timeout" :color="snackbar.color" :icon="snackbar.icon"
      :text="snackbar.text" />

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

import Snackbar from "../../../../../components/gerneral/Snackbar.vue";
import DeleteDialog from "../../../../../components/gerneral/DeleteDialog.vue";

export default {
  name: "Class",

  components: {
    Snackbar,
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
        { text: "Year", value: "year", align: "start" },
        { text: "Course", value: "course.name" },
        { text: "Type", value: "course.type" },
        { text: "", value: "actions", sortable: false }
      ],
      pastHeader: [
        { text: "Year", value: "year", align: "start" },
        { text: "Course", value: "course.name" },
        { text: "Type", value: "course.type" },
        { text: "", value: "actions", sortable: false }
      ],

      snackbar: {
        open: false,
        text: "",
        icon: "",
        color: "",
        timeout: 2000,
      },

      deleteDialog: false,
      toDeleteItem: 0,
    };
  },

  created() {
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
            this.snackbar = this.getSuccessSnackbar("Occurrence deleted")
          }
        } catch (error) {
          console.log(error)
          this.toDeleteItem = 0;
          this.snackbar = this.getErrorSnackbar("Something went wrong deleting the occurrence")
        }
      }
    });
    this.setItems();
  },

  computed:{
    ...mapGetters("style", ["getIcon", "getErrorSnackbar", "getSuccessSnackbar"])
  },

  methods: {
    ...mapActions("main", ["fetchPrepareCollectionType", "fetchCollectionTypes", "deleteCollectionType", "copyCollectionType"]),

    async setItems() {
      const parameters = {
        collectionType: "occurrences"
      };
      try {
        this.loading = true;
        let items = await this.fetchCollectionTypes(parameters);
        this.currentOcc = items.currentOcc;
        this.draftOcc = items.draftOcc;
        this.pastOcc = items.pastOcc;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error)
        this.snackbar = this.getErrorSnackbar("Something went wrong fetching the occurrences")
      }
    },
    async openCollectionType(item) {
      try {
        await this.fetchPrepareCollectionType([item.id, "occurrences"]);
        bus.$emit("changePage", ["student,Occurrence", "occurrence"]);
      } catch (error) {
        this.snackbar = this.getErrorSnackbar("Something went wrong fetching the occurrence")
      }
    },
    remove(id) {
      this.toDeleteItem = id;
      this.deleteDialog = true;
    },
    async copy(id){
      try {
        await this.copyCollectionType([id, "occurrences"]);
        this.snackbar = this.getSuccessSnackbar("Occurrence copied")
        bus.$emit("changePage", ["student,Occurrence", "occurrence"]);
      } catch (error) {
        console.log(error)
        this.snackbar = this.getErrorSnackbar("Something went wrong copying the occurrence")
      }
    }
  }
};
</script>

<style scoped>
#studentDashboard>>>.v-data-footer__select {
  height: 40px;
}

#studentDashboard>>>.v-text-field>.v-input__control>.v-input__slot:before {
  border-style: none !important;
}

#forSearch>>>.v-text-field--outlined.v-input--dense .v-label {
  top: 0;
}

#forSearch>>>.v-text-field--outlined fieldset {
  height: 26px;
}

#forSearch>>>.v-text-field.v-text-field--enclosed:not(.v-text-field--rounded)>.v-input__control>.v-input__slot,
.v-text-field.v-text-field--enclosed .v-text-field__details {
  min-height: 0 !important;
  height: 26px;
}

#forSearch>>>.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__prepend-inner {
  margin-top: 0;
}

#forSearch>>>.v-text-field input {
  padding: 0;
}

#forSearch>>>.v-text-field>.v-input__control>.v-input__slot>.v-text-field__slot {
  display: block;
  height: 26px;
}

#forSearch>>>.v-icon.v-icon {
  font-size: 20px;
}
</style>
