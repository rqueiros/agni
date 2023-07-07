<template>
  <div id="home" style="width:100%;" class="min_height">
    <v-container fluid class="pa-0 min_height">
      <v-row class="min_height">
        <v-col cols="8">
          <v-card
            width="100%"
            outlined
            style="border-color: #C3C3C3;"
            class="fill-height"
          >
            <template>
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
                        class="pa-4 occurrence" 
                        :style="hover ? 'background-color:#eeeeee' : ''"
                        @click="openCollectionType(slide[0])"
                      >
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
                            <v-data-table
                              hide-default-footer
                              no-data-text="Student Statistics will appear"
                              style="background-color: transparent;"
                            >
                            </v-data-table>
                            <v-data-table
                              hide-default-footer
                              no-data-text="Student Statistics will appear"
                              style="background-color: transparent;"
                            >
                            </v-data-table>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-hover>
                    <v-divider vertical></v-divider>
                    <v-hover
                      v-slot="{ hover }"
                    >
                      <v-col 
                        class="pa-4 occurrence" 
                        :style="hover ? 'background-color:#eeeeee' : ''"
                        @click="openCollectionType(slide[1])"
                      >
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
                            <v-data-table
                              hide-default-footer
                              no-data-text="Student Statistics will appear"
                              style="background-color: transparent;"
                            >
                            </v-data-table>
                            <v-data-table
                              hide-default-footer
                              no-data-text="Student Statistics will appear"
                              style="background-color: transparent;"
                            >
                            </v-data-table>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-hover>
                  </v-row>
                </v-carousel-item>
              </v-carousel>
            </template>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card
            width="100%"
            outlined
            style="border-color: #C3C3C3;"
            class="fill-height"
          >
            <v-card-title class="text-center d-flex justify-center">
              New Contents! Check it out!
            </v-card-title>
            <v-data-table
              class="px-4"
              :items="newContents"
              :headers="newContentHeaders"
              hide-default-header
              hide-default-footer
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

  components: {},

  data: () => ({
    type: "main",
    search: "",
    slides: ["a", "b"],
    occurrences: [],
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
    ]
  }),

  created(){
    this.setItems();
  },

  computed:{
    ...mapGetters("style", ["getIcon"])
  },

  methods: {
    ...mapActions("main", [
      "fetchCollectionTypes", 
      "fetchPrepareCollectionType"
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
        } else {
          newList = [items]
        }
        this.occurrences = newList;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error)
        //this.snackbar = this.getErrorSnackbar("Something went wrong fetching the occurrences")
      }
    },
    async openCollectionType(item) {
      try {
        await this.fetchPrepareCollectionType([item.id, "occurrences"]);
        bus.$emit("changePage", ["student,Occurrence", "occurrence"]);
      } catch (error) {
        console.log(error)
        //this.snackbar = this.getErrorSnackbar("Something went wrong fetching the occurrence")
      }
    },
  },
};
</script>

<style>
.occurrence:hover{
  cursor:pointer
}
</style>
