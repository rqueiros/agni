<template>
  <div id="home" style="width:100%;" class="min_height">
    <v-container fluid class="pa-0 min_height">
      <v-row class="min_height">
        <v-col cols="8">
          <v-card
            v-if="occurrences.length>0"
            width="100%"
            class="fill-height shadow"
            color="boxes"
          >
            <v-carousel
              cycle
              height="100%"
              hide-delimiter-background
              :show-arrows="occurrences.length>1"
              :show-arrows-on-hover="occurrences.length>1"
              :hide-delimiters="!(occurrences.length>1)"
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
                      <v-card 
                        flat :color="hover ? 'hover' : 'boxes'" 
                        class="pa-4" 
                        height="100%"
                      >
                        <v-row style="min-height:88px">
                          <v-col cols="3" class="d-flex align-center">
                            <v-icon 
                              size="xxx-large" 
                              color="primary" 
                            >
                              {{ getIcon(slide[0].course.type) }}
                            </v-icon> 
                          </v-col>
                          <v-col class="text-h6 d-flex align-center">
                            {{ slide[0].year }} - {{ slide[0].course.name }}
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
                        <v-row style="min-height:150px">
                          <v-col>
                            <v-card 
                              outlined 
                              style="background-color: transparent;"
                            >
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
                                    <td 
                                      colspan="2" 
                                      class="text-caption font-weight-bold" 
                                    >
                                      <div class="pa-1 px-3">
                                        Top 3 - Students Performance
                                      </div>
                                      <v-divider ></v-divider>
                                    </td>
                                  </tr>
                                </template>
                                <template v-slot:item="{ item }">
                                  <tr 
                                    @mouseover="hover = true" 
                                    @mouseleave="hover = false" 
                                    :style="{backgroundColor: hover ? 'transparent' : ''}"
                                  >
                                    <td>{{ item.name }}</td>
                                    <td>{{ item.performance }}</td>
                                  </tr>
                                </template>
                              </v-data-table>
                            </v-card>
                          </v-col>
                        </v-row>
                        <v-row style="min-height:150px">
                          <v-col>
                            <v-card 
                              outlined 
                              style="background-color: transparent;"
                            >
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
                                    <td 
                                      colspan="2" 
                                      class="text-caption font-weight-bold" 
                                    >
                                      <div class="pa-1 px-3">
                                        Top 3 - Exercise Correctness
                                      </div>
                                      <v-divider ></v-divider>
                                    </td>
                                  </tr>
                                </template>
                                <template v-slot:item="{ item }">
                                  <tr 
                                    @mouseover="hover = true" 
                                    @mouseleave="hover = false" 
                                    :style="{backgroundColor: hover ? 'transparent' : ''}"
                                  >
                                    <td>{{ item.name }}</td>
                                    <td>{{ item.correctPerc }}</td>
                                  </tr>
                                </template>
                              </v-data-table>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>
                  </v-hover>
                  <v-divider 
                    vertical 
                    v-if="occurrences[0].length > 1" style="z-index:10"
                  />
                  <v-hover v-if="occurrences[0].length > 1"
                    v-slot="{ hover }"
                  >
                    <v-col 
                      class="occurrence" 
                      @click="openCollectionType(slide[1])"
                    >
                      <v-card 
                        flat :color="hover ? 'hover' : 'boxes'" 
                        class="pa-4" 
                        height="100%"
                      >
                        <v-row style="min-height:88px">
                          <v-col cols="3" class="d-flex align-center">
                            <v-icon 
                              size="xxx-large" 
                              color="primary" 
                            >
                              {{ getIcon(slide[1].course.type) }}
                            </v-icon> 
                          </v-col>
                          <v-col class="text-h6 d-flex align-center">
                            {{ slide[1].year }} - {{ slide[1].course.name }}
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
                        <v-row style="min-height:150px">
                          <v-col>
                            <v-card 
                              outlined 
                              style="background-color: transparent;"
                            >
                              <v-data-table
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
                                    <td 
                                      colspan="2" 
                                      class="text-caption font-weight-bold" 
                                    >
                                      <div class="pa-1 px-3">
                                        Top 3 - Students Performance
                                      </div>
                                      <v-divider ></v-divider>
                                    </td>
                                  </tr>
                                </template>
                                <template v-slot:item="{ item }">
                                  <tr 
                                    @mouseover="hover = true" 
                                    @mouseleave="hover = false" 
                                    :style="{backgroundColor: hover ? 'transparent' : ''}"
                                  >
                                    <td>{{ item.name }}</td>
                                    <td>{{ item.performance }}</td>
                                  </tr>
                                </template>
                              </v-data-table>
                            </v-card>
                          </v-col>
                        </v-row>
                        <v-row style="min-height:150px">
                          <v-col>
                            <v-card 
                              outlined 
                              style="background-color: transparent;"
                            >
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
                                    <td 
                                      colspan="2" 
                                      class="text-caption font-weight-bold" 
                                    >
                                      <div class="pa-1 px-3">
                                        Top 3 - Exercise Correctness
                                      </div>
                                      <v-divider ></v-divider>
                                    </td>
                                  </tr>
                                </template>
                                <template v-slot:item="{ item }">
                                  <tr 
                                    @mouseover="hover = true" 
                                    @mouseleave="hover = false" 
                                    :style="{backgroundColor: hover ? 'transparent' : ''}"
                                  >
                                    <td>{{ item.name }}</td>
                                    <td>{{ item.correctPerc }}</td>
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
            color="boxes"
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
            color="boxes"
          >
            <v-card-title class="d-flex justify-center align-center">
              <v-icon class="mr-2" color="#FFD700" large>
                mdi-lightbulb-on
              </v-icon>
                New Content !!
            </v-card-title>
            <v-data-table
              style="background-color: transparent;"
              class="px-4 my-data-table"
              :items="newContents"
              :headers="newContentHeaders"
              hide-default-header
              hide-default-footer
              item-key="tableKey"
              @click:row="openCollectionType2" 
            >
            <template v-slot:item="{ item, index }">
              <tr 
                @click="openCollectionType2(item)"
                @mouseover="setHover(index, true)" 
                @mouseleave="setHover(index, false)" 
                :style="{backgroundColor: isHovered[index] ? $vuetify.theme.currentTheme.hover : ''}"
              >
                <td>
                  <v-icon>
                    {{ getIcon(item.type) }}
                  </v-icon>
                </td>
                <td>{{ item.name }}</td>
              </tr>
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
    hover: false,
    isHovered: {}, 

    occurrences: [],
    occurrencesStat:{},

    newContents: [],
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
    ...mapGetters("style", ["getIcon"]),
  },

  methods: {
    ...mapActions("main", [
      "fetchCollectionTypes", 
      "fetchPrepareCollectionType",
      "fetchNewContents",
      "fetchOccStat"
    ]),
    setHover(index, value) {
      this.$set(this.isHovered, index, value);
    },
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
