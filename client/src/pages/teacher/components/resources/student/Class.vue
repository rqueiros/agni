<template>
  <div id="class" style="width:100%">
    <v-container class="pa-0">
      <v-row>
        <v-spacer></v-spacer>
        <v-col class="px-16">
          <v-card
            width="100%"
            outlined
            style="border-color: #C3C3C3; border-bottom:0; border-bottom-left-radius: 0;border-bottom-right-radius: 0;"
            class="pa-0 text-center text-h6 font-weight-regular"
          >
            Current Course Sessions
          </v-card>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
      <v-row no-gutters>
        <template v-for="occ in currentOcc">
          <v-col :key="occ.id">
            <v-card
              width="100%"
              outlined
              style="border-color: #C3C3C3;"
              class="pa-4 text-center text-h5"
              @click="openCollectionType(occ)"
            >
              <div>
                {{ occ.year }}
              </div>
              <div>
                <v-icon size="xxx-large">
                  {{ getIcon(occ.course.type) }}
                </v-icon>
              </div>
              <div>
                {{ occ.course.name }}
              </div>
              <div>
                {{ occ.classes.map(c => c.name).toString() }}
              </div>
            </v-card>
          </v-col>
        </template>
      </v-row>
      <v-row id="forSearch" no-gutters>
        <v-col cols="6" class="mt-4 pr-2">
          <v-card
            width="100%"
            outlined
            style="border-color: #C3C3C3;"
            class="pt-3"
          >
            <v-card-title class="py-0 text-body-1 mb-1">
              Draft Course Sessions
              <v-text-field
                style="width:1%"
                v-model="draftSearch"
                prepend-inner-icon="mdi-magnify"
                label="Search"
                single-line
                class="pa-0 ma-0 ml-6 mr-12 mb-1 text-field"
                outlined
                dense
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :itemsPerPage="itemsPerPage"
              dense
              :headers="draftHeader"
              :items="draftOcc"
              :search="draftSearch"
              @click:row="openCollectionType"
              :loading="loading"
            >
            </v-data-table>
          </v-card>
        </v-col>
        <v-col cols="6" class="mt-4 pl-2">
          <v-card
            width="100%"
            outlined
            style="border-color: #C3C3C3;"
            class="pt-3"
          >
            <v-card-title class="py-0 text-body-1 mb-1">
              Past Course Sessions
              <v-text-field
                style="width:1%"
                v-model="pastSearch"
                prepend-inner-icon="mdi-magnify"
                label="Search"
                single-line
                class="pa-0 ma-0 ml-6 mr-12 mb-1 text-field"
                outlined
                dense
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :itemsPerPage="itemsPerPage"
              dense
              :headers="pastHeader"
              :items="pastOcc"
              :search="pastSearch"
              @click:row="openCollectionType"
              :loading="loading"
            >
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<!--
   <v-card width="100%" outlined style="border-color: #C3C3C3;" class="pa-4">
   </v-card>
-->

<script>
import { bus } from "@/main.js";
import { mapActions } from "vuex";

export default {
  name: "Class",

  data() {
    return {
      currentOcc: [],
      draftOcc: [],
      pastOcc: [],
      draftSearch: "",
      pastSearch: "",
      itemsPerPage: 5,
      draftHeader: [
        { text: "Course", value: "course.name", align: "start" },
        { text: "Type", value: "course.type" },
        { text: "ID", value: "id" }
      ],
      pastHeader: [
        { text: "Year", value: "year", align: "start" },
        //{ text: "Id", value: "strapiId" },
        { text: "Course", value: "course.name" },
        { text: "Type", value: "course.type" }
      ]
    };
  },

  created() {
    this.setItems();
  },

  methods: {
    ...mapActions(["fetchOccurrence", "fetchCollectionTypes"]),
    async setItems() {
      const parameters = {
        collectionType: "occurrence"
      };
      this.loading = true;
      let items = await this.fetchCollectionTypes(parameters);
      /*
      let items = {
        currentOcc: [
          {
            id: 1,
            year: 2023,
            startDate: null,
            endDate: null,
            course: {
              id: 1,
              name: "P00 Course",
              type: "Course"
            },
            classes: [
              {
                id: 1,
                name: "C01",
                delay: null,
                students: [
                  {
                    id: 1,
                    name: "Student1",
                    delay: null
                  },
                  {
                    id: 2,
                    name: "Student2",
                    delay: null
                  }
                ]
              },
              {
                id: 2,
                name: "C022",
                delay: null,
                students: [
                  {
                    id: 3,
                    name: "Student3",
                    delay: null
                  },
                  {
                    id: 4,
                    name: "Student4",
                    delay: null
                  }
                ]
              }
            ]
          },
          {
            id: 2,
            year: 2023,
            startDate: null,
            endDate: null,
            course: {
              id: 1,
              name: "Prog 1",
              type: "Contest"
            },
            classes: [
              {
                id: 4,
                name: "C04",
                delay: null,
                students: [
                  {
                    id: 6,
                    name: "Student6",
                    delay: null
                  },
                  {
                    id: 7,
                    name: "Student7",
                    delay: null
                  }
                ]
              },
              {
                id: 5,
                name: "C028",
                delay: null,
                students: [
                  {
                    id: 8,
                    name: "Student9",
                    delay: null
                  },
                  {
                    id: 8,
                    name: "Student41",
                    delay: null
                  }
                ]
              }
            ]
          },
          {
            id: 3,
            year: 2023,
            startDate: null,
            endDate: null,
            course: {
              id: 1,
              name: "Prog 2",
              type: "Test/Exame"
            },
            classes: [
              {
                id: 4,
                name: "C04",
                delay: null,
                students: [
                  {
                    id: 6,
                    name: "Student6",
                    delay: null
                  },
                  {
                    id: 7,
                    name: "Student7",
                    delay: null
                  }
                ]
              },
              {
                id: 5,
                name: "C028",
                delay: null,
                students: [
                  {
                    id: 8,
                    name: "Student9",
                    delay: null
                  },
                  {
                    id: 8,
                    name: "Student41",
                    delay: null
                  }
                ]
              }
            ]
          }
        ],
        draftOcc: [
          {
            id: 1,
            year: null,
            startDate: null,
            endDate: null,
            course: {
              id: 1,
              name: "P00 Course",
              type: "Course"
            },
            classes: [
              {
                id: 1,
                name: "C01",
                delay: null,
                students: [
                  {
                    id: 1,
                    name: "Student1",
                    delay: null
                  },
                  {
                    id: 2,
                    name: "Student2",
                    delay: null
                  }
                ]
              },
              {
                id: 2,
                name: "C022",
                delay: null,
                students: [
                  {
                    id: 3,
                    name: "Student3",
                    delay: null
                  },
                  {
                    id: 4,
                    name: "Student4",
                    delay: null
                  }
                ]
              }
            ]
          },
          {
            id: 2,
            year: null,
            startDate: null,
            endDate: null,
            course: {
              id: 1,
              name: "Prog 1",
              type: "Contest"
            },
            classes: [
              {
                id: 4,
                name: "C04",
                delay: null,
                students: [
                  {
                    id: 6,
                    name: "Student6",
                    delay: null
                  },
                  {
                    id: 7,
                    name: "Student7",
                    delay: null
                  }
                ]
              },
              {
                id: 5,
                name: "C028",
                delay: null,
                students: [
                  {
                    id: 8,
                    name: "Student9",
                    delay: null
                  },
                  {
                    id: 8,
                    name: "Student41",
                    delay: null
                  }
                ]
              }
            ]
          }
        ],
        pastOcc: [
          {
            id: 1,
            year: 2022,
            startDate: null,
            endDate: null,
            course: {
              id: 1,
              name: "P00 Course",
              type: "Course"
            },
            classes: [
              {
                id: 1,
                name: "C01",
                delay: null,
                students: [
                  {
                    id: 1,
                    name: "Student1",
                    delay: null
                  },
                  {
                    id: 2,
                    name: "Student2",
                    delay: null
                  }
                ]
              },
              {
                id: 2,
                name: "C022",
                delay: null,
                students: [
                  {
                    id: 3,
                    name: "Student3",
                    delay: null
                  },
                  {
                    id: 4,
                    name: "Student4",
                    delay: null
                  }
                ]
              }
            ]
          },
          {
            id: 2,
            year: 2021,
            startDate: null,
            endDate: null,
            course: {
              id: 1,
              name: "Prog 1",
              type: "Contest"
            },
            classes: [
              {
                id: 4,
                name: "C04",
                delay: null,
                students: [
                  {
                    id: 6,
                    name: "Student6",
                    delay: null
                  },
                  {
                    id: 7,
                    name: "Student7",
                    delay: null
                  }
                ]
              },
              {
                id: 5,
                name: "C028",
                delay: null,
                students: [
                  {
                    id: 8,
                    name: "Student9",
                    delay: null
                  },
                  {
                    id: 8,
                    name: "Student41",
                    delay: null
                  }
                ]
              }
            ]
          }
        ]
      }*/
      this.currentOcc = items.currentOcc;
      this.draftOcc = items.draftOcc;
      this.pastOcc = items.pastOcc;
      this.loading = false;
    },
    getIcon(type) {
      if (type == "Contest") return "mdi-trophy";
      else if (type == "Course") return "mdi-school-outline";
      else if (type == "Test/Exam") return "mdi-note-edit-outline";
      else if (type == "programming-exercise") return "mdi-code-json";
      else if (type == "quiz") return "mdi-head-question-outline";
      else if (type == "pdf") return "mdi-file-pdf-box";
      else if (type == "video") return "mdi-video";
    },
    async openCollectionType(item) {
      await this.fetchOccurrence(item.id);
      bus.$emit("changePage", ["class,Occurrence", "occurrence"]);
    }
  }
};
</script>

<style scoped>
#forSearch >>> .v-text-field--outlined.v-input--dense .v-label {
  top: 0;
}
#forSearch >>> .v-text-field--outlined fieldset {
  height: 26px;
}

#forSearch
  >>> .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded)
  > .v-input__control
  > .v-input__slot,
.v-text-field.v-text-field--enclosed .v-text-field__details {
  min-height: 0 !important;
  height: 26px;
}

#forSearch
  >>> .v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined
  .v-input__prepend-inner {
  margin-top: 0;
}

#forSearch >>> .v-text-field input {
  padding: 0;
}

#forSearch
  >>> .v-text-field
  > .v-input__control
  > .v-input__slot
  > .v-text-field__slot {
  display: block;
  height: 26px;
}

#forSearch >>> .v-icon.v-icon {
  font-size: 20px;
}
</style>
