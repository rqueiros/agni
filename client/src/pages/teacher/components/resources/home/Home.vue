<template>
  <div id="home" style="width:100%;" class="min_height">
    <v-container fluid class="pa-0 min_height">
      <v-row class="min_height">
        <v-col cols="8">
          <v-card
            v-if="occurrences.length>0"
            width="100%"
            class="fill-height shadow"
          >
            <v-carousel
              cycle
              height="100%"
              hide-delimiter-background
              show-arrows-on-hover
            >
              <v-carousel-item 
                v-for="(slide, index) in occurrences" 
                :key="index"
              >
                <v-row class="fill-height" justify="center" no-gutters>
                  <v-hover
                    v-slot="{ hover }"
                  >
                    <v-col 
                      class="occurrence" 
                      @click="openCollectionType(slide[0])"
                    >
                      <v-card flat :color="hover ? 'hover' : ''" class="pa-4" height="100%">
                        <v-row>
                          <v-col>
                            <v-icon size="xxx-large" color="primary" class="mr-4">
                              {{ getIcon(slide[0].course.type) }}
                            </v-icon> {{ slide[0].year }} - {{ slide[0].course.name }}
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            <v-progress-linear 
                              rounded
                              height="10"
                              :value="(new Date() - new Date(slide[0].startDate))/(new Date(slide[0].endDate) - new Date(slide[0].startDate))*100" 
                            />
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            <v-card outlined class="mb-6" style="background-color: transparent;">
                              <v-data-table
                                hide-default-footer
                                hide-default-header
                                no-data-text="No Students associated"
                                style="background-color: transparent;"
                                :headers="headers.students"
                                dense
                                :items="occurrencesStat[slide[0].id].students.slice(0,3)"
                              >
                                <template v-slot:header="{ }">
                                  <tr>
                                    <td colspan="2" class="text-caption font-weight-bold" style="color:gray">
                                      <div class="pa-1 px-3">
                                        Top 3 - Students Performance
                                      </div>
                                      <v-divider ></v-divider>
                                    </td>
                                  </tr>
                                </template>
                              </v-data-table>
                            </v-card>
                            <v-card outlined class="mt-6" style="background-color: transparent;">
                              <v-data-table
                                hide-default-footer
                                hide-default-header
                                no-data-text="No Exercises associated"
                                style="background-color: transparent;"
                                :headers="headers.evaluatives"
                                dense
                                :items="occurrencesStat[slide[0].id].evaluatives.slice(0,3)"
                              >
                                <template v-slot:header="{ }">
                                  <tr>
                                    <td colspan="2" class="text-caption font-weight-bold" style="color:gray">
                                      <div class="pa-1 px-3">
                                        Top 3 - Exercise Correctness
                                      </div>
                                      <v-divider ></v-divider>
                                    </td>
                                  </tr>
                                </template>
                              </v-data-table>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>
                  </v-hover>
                  <v-divider vertical v-if="occurrences[0].length > 1" style="z-index:10"/>
                  <v-hover v-if="occurrences[0].length > 1"
                    v-slot="{ hover }"
                  >
                    <v-col 
                      class="occurrence" 
                      @click="openCollectionType(slide[1])"
                    >
                      <v-card flat :color="hover ? 'hover' : ''" class="pa-4" height="100%">
                        <v-row>
                          <v-col>
                            <v-icon size="xxx-large" color="primary" class="mr-4">
                              {{ getIcon(slide[1].course.type) }}
                            </v-icon> {{ slide[1].year }} - {{ slide[1].course.name }}
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            <v-progress-linear 
                              rounded
                              height="10"
                              :value="(new Date() - new Date(slide[1].startDate))/(new Date(slide[1].endDate) - new Date(slide[1].startDate))*100" 
                            />
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            <v-card outlined class="mb-6" style="background-color: transparent;">
                              <v-data-table
                                class="mb-4"
                                hide-default-footer
                                hide-default-header
                                no-data-text="No Students associated"
                                style="background-color: transparent;"
                                :headers="headers.students"
                                :items="occurrencesStat[slide[1].id].students.slice(0,3)"
                                dense
                              >
                                <template v-slot:header="{ }">
                                  <tr>
                                    <td colspan="2" class="text-caption font-weight-bold" style="color:gray">
                                      <div class="pa-1 px-3">
                                        Top 3 - Students Performance
                                      </div>
                                      <v-divider ></v-divider>
                                    </td>
                                  </tr>
                                </template>
                              </v-data-table>
                            </v-card>
                            <v-card outlined class="mt-6" style="background-color: transparent;">
                              <v-data-table
                                hide-default-footer
                                hide-default-header
                                no-data-text="No Exercises associated"
                                style="background-color: transparent;"
                                :headers="headers.evaluatives"
                                :items="occurrencesStat[slide[1].id].evaluatives.slice(0,3)"
                                dense
                              >
                                <template v-slot:header="{ }">
                                  <tr>
                                    <td colspan="2" class="text-caption font-weight-bold" style="color:gray">
                                      <div class="pa-1 px-3">
                                        Top 3 - Exercise Correctness
                                      </div>
                                      <v-divider ></v-divider>
                                    </td>
                                  </tr>
                                </template>
                              </v-data-table>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>
                  </v-hover>
                </v-row>
              </v-carousel-item>
            </v-carousel>

          </v-card>
          <v-card
            v-else
            width="100%"
            class="fill-height d-flex justify-center align-center text-h6 font-weight-regular shadow"
          >
            There are no current Occurrences!
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card
            width="100%"
            class="fill-height shadow"
          >
            <v-card-title class="text-center d-flex justify-center">
              New Contents! Check it out!
            </v-card-title>
            <v-data-table
              class="px-4 my-data-table"
              :items="newContents"
              :headers="newContentHeaders"
              hide-default-header
              hide-default-footer
              item-key="tableKey"
              @click:row="openCollectionType2" 
            >
              <template v-slot:item.type="{ item }">
                <v-icon>
                  {{ getIcon(item.type) }}
                </v-icon>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { bus } from "@/main.js";
import { mapGetters, mapActions } from 'vuex';

export default {
  name:"home",

  data: () => ({
    occurrences: [],
    occurrencesStat:{},

    newContents: [
      {type:"Course", name:"Bla Bla Course"}, 
      {type:"Contest", name:"New Contest Na"},
      {type:"quiz", name:"This is a quiz"},
      {type:"blank", name:"Prog ex"},
      {type:"blank", name:"Calculator"},
      {type:"question", name:"Here comes a question that could be longer?"},
      {type:"pdf", name:"Intro JS"},
      {type:"blank", name:"Calculator"},
    ],
    newContentHeaders:[
      { text: "", value: "type", align: "center" },
      { text: "Name", value: "name", align: "start" },
    ],
    headers:{
        students:[
          { text: "Top 3 - Students Performance", value: "name", sortable:false},
          { text: "", value: "performance", sortable:false },
        ],
        evaluatives:[
          { text: "Top 3 - Exercises correctness", value: "name", sortable:false},
          { text: "", value: "correctPerc", sortable:false },
        ]
      }
  }),

  async created(){
    await this.setItems();
    this.newContents = await this.fetchNewContents()
  },

  computed:{
    ...mapGetters("style", ["getIcon"])
  },

  methods: {
    ...mapActions("main", [
      "fetchCollectionTypes", 
      "fetchPrepareCollectionType",
      "fetchNewContents",
      "fetchOccStat"
    ]),
    async setItems(){
      const parameters = {
        collectionType: "occurrences"
      };
      try {
        this.loading = true;
        let items = await this.fetchCollectionTypes(parameters);
        items = items.currentOcc
        let newList = [];
        if (items.length >2){
          for (let i = 0; i < items.length; i++) {
            const pair = [items[i], items[(i + 1) % items.length]];
            newList.push(pair);
          }
        } else if (items.length >= 1){
          newList = [items]
        }

        let dic = {}
        for (let occ of items){
          let data = await this.fetchOccStat(occ.id)
          dic[occ.id] = data
        }
        this.occurrencesStat = dic

        console.log(this.occurrencesStat)

        this.occurrences = newList;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error)
        bus.$emit("errorSnackbar", "Something went wrong fetching the Occurrences")
      }
    },
    async openCollectionType(item) {
      try {
        await this.fetchPrepareCollectionType([item.id, "occurrences"]);
        bus.$emit("changePage", "student,Occurrence");
      } catch (error) {
        console.log(error)
        bus.$emit("errorSnackbar", "Something went wrong fetching the Occurrence")
      }
    },
    async openCollectionType2(item) {
      try {
        await this.fetchPrepareCollectionType([item.id, item.contentType]);
        switch (item.contentType) {
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
        bus.$emit("errorSnackbar", "Something went wrong fetching the "+item.contentType)
      }
    },
  },
};
</script>

<style>
.occurrence:hover{
  cursor:pointer
}
.my-data-table tbody tr:hover {
  cursor: pointer;
}
</style>
