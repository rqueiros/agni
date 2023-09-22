<template>
  <div id="authorKit">
    <v-card color="grey lighten-3">
      <v-card-title>
        <v-avatar
          tile
        >
          <v-img 
            :src="require('@/assets/FGPE.png')" 
            height="50" 
            width="1"
            contain
          ></v-img> 
        </v-avatar>
        <div style="color:#1A9FD7" class="text-h4">AuthorKit</div>
      </v-card-title>

      <v-card-text class="pb-2">
        <div class="d-flex" v-if="!projects">
          <span class="text-subtitle-2" v-if="exercises">Exercises</span>
          <span class="text-subtitle-2" v-else>Exercise From</span>
          <v-divider vertical class="ml-2"></v-divider>
          <v-breadcrumbs :items="exercises ? breadcrumbs1 : breadcrumbs2" class="py-0 pl-2">
            <template v-slot:item="{ item }">
              <v-breadcrumbs-item
                :disabled="item.disabled"
              >
                <v-icon 
                  v-if="item.text=='Home'" 
                  color="#1A9FD7"
                  @click="back1"
                >mdi-home</v-icon>
                <span v-else-if="!item.disabled" style="color:#1A9FD7" @click="back2" class="hover">{{ item.text }}</span>
                <span v-else>{{ item.text }}</span>
              </v-breadcrumbs-item>
            </template>
            <template v-slot:divider>
              <v-icon>mdi-chevron-double-right</v-icon>
            </template>
          </v-breadcrumbs>
        </div>
        <v-data-table
          v-if="projects"
          :headers="headers"
          :items="items"
          :page.sync="page"
          :options.sync="options"
          :server-items-length="total"
          :loading="loading"
          :item-class="retClass"
          @click:row="openProject" 
          hide-default-footer
        ></v-data-table>
        <v-data-table
          v-if="exercises"
          :headers="exerciseHeaders"
          :items="items"
          :page.sync="page"
          :options.sync="options"
          :server-items-length="total"
          :loading="loading"
          :item-class="retClass"
          hide-default-footer
          @click:row="openExercise" 
        >
          <template
            v-slot:item.select="{ item }"
          >
          <div onclick="event.stopPropagation()">
          <v-checkbox v-if="(item.programmingLanguages.includes('JavaScript') 
          || item.programmingLanguages.includes('JS') 
          || item.programmingLanguages.includes('Javascript') 
          || item.programmingLanguages.includes('js') || item.programmingLanguages.length==0)"
            v-model="checkboxes"
            hide-details
            :value="item.id"
            class="mt-0"
            color="#1A9FD7"
          ></v-checkbox>
        </div>
          </template>
        </v-data-table>
        <v-pagination
          v-if="projects || exercises"
          color="#1A9FD7"
          v-model="page"
          :length="pageCount"
          total-visible="5"
        ></v-pagination>
        <div v-if="exercise" class="mt-2">
          <v-stepper non-linear>
            <v-stepper-header>
              <v-stepper-step editable step="1">
                Metadata
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step editable step="2" >
                Presentation
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step editable step="3">
                Evaluation
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step editable step="4">
                Tools
              </v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
              <v-stepper-content :step="1">
                <v-container>
                  <v-row>
                    <v-col>
                      <v-row dense>
                        <v-col>
                          <v-text-field
                            v-model="exerciseItem.title"
                            label="Title"
                            disabled
                            outlined
                            dense
                            hide-details
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col>
                          <v-text-field
                            v-model="exerciseItem.keywords"
                            label="Keywords"
                            disabled
                            outlined
                            dense
                            hide-details
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col>
                          <v-text-field
                            v-model="exerciseItem.type"
                            label="Type"
                            disabled
                            outlined
                            dense
                            hide-details
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col>
                          <v-text-field
                            v-model="exerciseItem.event"
                            label="Event"
                            disabled
                            outlined
                            dense
                            hide-details
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col>
                          <v-text-field
                            v-model="exerciseItem.timeout"
                            label="Timeout"
                            disabled
                            outlined
                            dense
                            hide-details
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col>
                      <v-row dense>
                        <v-col>
                          <v-text-field
                            v-model="exerciseItem.module"
                            label="Module"
                            disabled
                            outlined
                            dense
                            hide-details
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col>
                          <v-text-field
                            v-model="exerciseItem.status"
                            label="Status"
                            disabled
                            outlined
                            dense
                            hide-details
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col>
                          <v-text-field
                            v-model="exerciseItem.difficulty"
                            label="Difficulty"
                            disabled
                            outlined
                            dense
                            hide-details
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col>
                          <v-text-field
                            v-model="exerciseItem.platform"
                            label="Platform"
                            disabled
                            outlined
                            dense
                            hide-details
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col>
                          <v-text-field
                            v-model="exerciseItem.programmingLanguages"
                            label="Programming Languages"
                            disabled
                            outlined
                            dense
                            hide-details
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
              </v-stepper-content>
              <v-stepper-content :step="2">
                <v-container>
                  <v-row>
                    <v-col>
                      <v-row dense>
                        <v-col>
                          <v-subheader class="subheader">Instructions</v-subheader>
                          <v-list disabled dense>
                            <v-list-item-group>
                              <v-list-item
                                v-for="(item, i) in exerciseItem.instructions"
                                :key="i"
                              >
                                {{ item.pathname }}
                              </v-list-item>
                            </v-list-item-group>
                          </v-list>
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col>
                          <v-subheader class="subheader">Embeddables</v-subheader>
                          <v-list disabled dense>
                            <v-list-item-group>
                              <v-list-item
                                  v-for="(item, i) in exerciseItem.embeddables"
                                  :key="i"
                                >
                                  {{ item.pathname }}
                              </v-list-item>
                            </v-list-item-group>
                          </v-list>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col>
                      <v-row dense>
                        <v-col>
                          <v-subheader class="subheader">Statements</v-subheader>
                          <v-list disabled dense>
                            <v-list-item-group>
                              <v-list-item
                                  v-for="(item, i) in exerciseItem.statements"
                                  :key="i"
                                >
                                  {{ item.pathname }}
                              </v-list-item>
                            </v-list-item-group>
                          </v-list>
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col>
                          <v-subheader class="subheader">Skeletons</v-subheader>
                          <v-list disabled dense>
                            <v-list-item-group
                              color="primary"
                            >
                              <v-list-item
                                  v-for="(item, i) in exerciseItem.skeletons"
                                  :key="i"
                                >
                                  {{ item.pathname }}
                              </v-list-item>
                            </v-list-item-group>
                          </v-list>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
              </v-stepper-content>
              <v-stepper-content :step="3">
                <v-container>
                  <v-row>
                    <v-col>
                      <v-row dense>
                        <v-col>
                          <v-subheader class="subheader">Output Checkers</v-subheader>
                          <v-list disabled dense>
                            <v-list-item-group>
                              <v-list-item
                                  v-for="(item, i) in exerciseItem.outputCheckers"
                                  :key="i"
                                >
                                  {{ item }}
                              </v-list-item>
                            </v-list-item-group>
                          </v-list>
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col>
                          <v-subheader class="subheader">Libraries</v-subheader>
                          <v-list disabled dense>
                            <v-list-item-group>
                              <v-list-item
                                  v-for="(item, i) in exerciseItem.libraries"
                                  :key="i"
                                >
                                  {{ item }}
                              </v-list-item>
                            </v-list-item-group>
                          </v-list>
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col>
                          <v-subheader class="subheader">Solutions</v-subheader>
                          <v-list disabled dense>
                            <v-list-item-group>
                              <v-list-item
                                  v-for="(item, i) in exerciseItem.solutions"
                                  :key="i"
                                >
                                  {{ item.pathname }}
                              </v-list-item>
                            </v-list-item-group>
                          </v-list>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col>
                      <v-row dense>
                        <v-col>
                          <v-subheader class="subheader">Source-code Checkers</v-subheader>
                          <v-list disabled dense>
                            <v-list-item-group>
                              <v-list-item
                                  v-for="(item, i) in exerciseItem.sourcecodeCheckers"
                                  :key="i"
                                >
                                  {{ item }}
                              </v-list-item>
                            </v-list-item-group>
                          </v-list>
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col>
                          <v-subheader class="subheader">Templates</v-subheader>
                          <v-list disabled dense>
                            <v-list-item-group>
                              <v-list-item
                                  v-for="(item, i) in exerciseItem.templates"
                                  :key="i"
                                >
                                  {{ item }}
                              </v-list-item>
                            </v-list-item-group>
                          </v-list>
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col>
                          <v-subheader class="subheader">Tests</v-subheader>
                          <v-list disabled dense>
                            <v-list-item-group>
                              <v-list-item
                                  v-for="(item, i) in exerciseItem.tests"
                                  :key="i"
                                >
                                  {{ item.input.pathname }} ; {{ item.output.pathname }}
                              </v-list-item>
                            </v-list-item-group>
                          </v-list>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
              </v-stepper-content>
              <v-stepper-content :step="4">
                <v-container>
                  <v-row>
                    <v-col>
                      <v-row dense>
                        <v-col>
                          <v-subheader class="subheader">Feedback Generators</v-subheader>
                          <v-list disabled dense>
                            <v-list-item-group>
                              <v-list-item
                                  v-for="(item, i) in exerciseItem.feedbackGenerators"
                                  :key="i"
                                >
                                  {{ item }}
                              </v-list-item>
                            </v-list-item-group>
                          </v-list>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col>
                      <v-row dense>
                        <v-col>
                          <v-subheader class="subheader">Test Generators</v-subheader>
                          <v-list disabled dense>
                            <v-list-item-group>
                              <v-list-item
                                  v-for="(item, i) in exerciseItem.testGenerators"
                                  :key="i"
                                >
                                  {{ item }}
                              </v-list-item>
                            </v-list-item-group>
                          </v-list>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </div>

        <div class="mt-2">
          <v-chip 
            v-for="item in chipsItems" 
            close 
            :key="item.id" 
            class="mr-2 mb-1"
            @click:close="unselect(item.id)"
          >
            <span>
              {{ item.title }}
            </span>
          </v-chip>
        </div>

      </v-card-text>

      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn text @click="localDialog = false">
          Cancel
        </v-btn>
        <v-btn text @click="addExercises">
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
      
<script>
import { bus } from "@/main.js";

import axios from "axios";

import JSZip from 'jszip';


export default {
  name: "AuthorKit",

  data() {
    return {
      projects:true,
      exercises: false,
      exercise: false,
      projectId:null,
      exerciseId:null,
      jwt:null,
      items:[],
      chipsItems:[],
      exerciseItem:{},
      checkboxes:[],
      total:0,
      page:1,
      pageCount:0,
      options:{},
      loading:true,
      params:{page:1,limit:6,sort:"updated_at,DESC"},
      headers: [
          {
            text: 'Name',
            align: 'start',
            sortable: false,
            value: 'name',
          },
          { text: 'Description', value: 'description' },
          { text: 'Status', value: 'status' },
        ],
      exerciseHeaders: [
          {
            text: '',
            align: 'start',
            sortable: false,
            value: 'select',
          },
          {
            text: 'Title',
            align: 'start',
            sortable: false,
            value: 'title',
          },
          { text: 'Module', value: 'module' },
          { text: 'Type', value: 'type' },
          { text: 'Difficulty', value: 'difficulty' },
          { text: 'Status', value: 'status' },
        ],
      breadcrumbs1:[
          {
            text: 'Home',
            disabled: false,
          },
          {
            text: 'Exercises',
            disabled: true,
          },
        ],
      breadcrumbs2:[
          {
            text: 'Home',
            disabled: false,
          },
          {
            text: 'Exercises',
            disabled: false,
          },
          {
            text: 'Exercise Form',
            disabled: true,
          },
        ],
      typeConverter:{
        "blank_sheet" : "blank",
        "extension" : "skeleton",
        "improvement" : "skeleton",
        "bug_fix" : "buggy",
        "fill-in_the_gaps" : "skeleton",
        "sort_blocks" : "skeleton",
        "spot_the_bug" : "buggy"
      }
    }
  },

  watch: {
    options(newV){
      this.params.page = newV.page
      if (this.projects){
        this.getItems()
      } else {
        this.getExercises()
      }
    },
    checkboxes(newV, oldV){
      if (newV.length > oldV.length){
        let item = newV.filter(i => !oldV.includes(i));
        this.chipsItems.push(this.items.find(i => i.id == item))
      } else if (newV.length < oldV.length) {
        let item = oldV.filter(i => !newV.includes(i));
        this.chipsItems = this.chipsItems.filter(i => i.id != item)
      }
    }
  },

  async beforeCreate() {
    await axios
      .post(
        "https://python.usz.edu.pl/authorkit/api/auth/login",
        { email: "y4nm45@gmail.com", password: "Llollol1!" },
      )
      .then(response => {
        this.jwt = response.data.accessToken
      })
      await this.getItems()
  },

  methods:{
    async addExercises(){
      let exercises = this.chipsItems
      let newEx = []
      await exercises.forEach(async ex => {
        let exercise = {}
        exercise.new = true
        exercise.name = ex.title
        exercise.type = this.typeConverter[ex.type]
        exercise.contentType = "code"
        exercise.contexts = [],
        exercise.skeleton = "",
        exercise.tests = [],
        
        await axios
        .get("https://python.usz.edu.pl/authorkit/api/exercises/" + ex.id + "/export/mef", 
          {
          responseType: 'arraybuffer',
          headers: {
            Authorization: "Bearer "+this.jwt,
          },
          params: {
            format:"zip"
          }
        })
        .then(async response => {
          const jszip = new JSZip();
          const zip = await jszip.loadAsync(response.data);
          let filenames = Object.keys(zip.files);
          if (filenames.length === 0) {
              console.error("No files in the zip.");
              return;
          }

          let solutionFiles = filenames.filter(f => f.includes("solutions"))
          if (solutionFiles.length == 1){
            let fileObject = zip.files[solutionFiles[0]];
            fileObject.async("string").then(content => {
              exercise.solution = content
            });
          } else if (solutionFiles.length > 1){
            let jsSolutionFiles = solutionFiles.filter(f => f.endsWith(".js"))
            let fileObject = zip.files[jsSolutionFiles[0]];
            fileObject.async("string").then(content => {
              exercise.solution = content
            });
          } else {
            exercise.solution = ""
          }


          let testFiles = filenames.filter(f => f.includes("tests"))
          let grouped = testFiles.reduce((acc, path) => {
            const parts = path.split('/');
            const key = parts[1];
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(path);
            return acc;
          }, {});
          grouped = Object.values(grouped);
          grouped.forEach(test => {
            let t = {new: true}
            let fileObject = zip.files[test.find(t => t.includes("in"))];
            fileObject.async("string").then(content => {
                t.input = content
            });
            let fileObject2 = zip.files[test.find(t => t.includes("out"))];
            fileObject2.async("string").then(content => {
                t.expected = content
            });
            exercise.tests.push(t)
          })


          let statementFiles = filenames.filter(f => f.includes("statement"))
          if (statementFiles.length == 1){
            let fileObject2 = zip.files[statementFiles[0]];
            fileObject2.async("string").then(content => {
              exercise.statement = content
            });
          } else if (statementFiles.length > 1){
            let file = statementFiles.find(f => f.includes("_en")) ? statementFiles.find(f => f.includes("_en")) : statementFiles.find(f => f.includes("en_")) ? statementFiles.find(f => f.includes("en_")) : statementFiles[0]
            let fileObject2 = zip.files[file];
            fileObject2.async("string").then(content => {
              exercise.statement = content
            });
          } else {
            exercise.statement = ""
          }

          newEx.push(exercise)
          console.log("here")
          bus.$emit("addExternalExercises", [exercise]);
        })
      })
      //console.log("addExxxx")
      //bus.$emit("addExternalExercises", newEx);
    },
    unselect(id){
      this.chipsItems = this.chipsItems.filter(i => i.id != id)
      this.checkboxes = this.checkboxes.filter(i => i != id)
    },
    async getItems(){
      this.laoding = true
      await axios
        .get("https://python.usz.edu.pl/authorkit/api/projects", 
          {
          headers: {
            Authorization: "Bearer "+this.jwt
          },
          params: this.params
        })
        .then(response => {
          this.items = response.data.data
          this.pageCount = response.data.pageCount
          this.total = response.data.total
        });
      this.loading = false
    },
    async getExercises(){
      this.laoding = true
      await axios
        .get("https://python.usz.edu.pl/authorkit/api/exercises", 
          {
          headers: {
            Authorization: "Bearer "+this.jwt,
            Project: this.projectId
          },
          params: this.params
        })
        .then(response => {
          this.items = response.data.data
          this.pageCount = response.data.pageCount
          this.total = response.data.total
        });
      this.loading = false
    },
    async getExercise(){
      this.laoding = true
      await axios
        .get("https://python.usz.edu.pl/authorkit/api/exercises/" + this.exerciseId, 
          {
          headers: {
            Authorization: "Bearer "+this.jwt,
            Project: this.projectId
          },
          params: {
            join: [
              'instructions',
              'statements',
              'embeddables',
              'skeletons',
              'libraries',
              'static_correctors',
              'dynamic_correctors',
              'solutions',
              'templates',
              'tests',
              'test_sets',
              'test_generators',
              'feedback_generators'
            ]
          }
        })
        .then(response => {
          this.exerciseItem = response.data
        });
        await axios
        .get("https://python.usz.edu.pl/authorkit/api/exercises/" + this.exerciseId + "/export/mef", 
          {
          responseType: 'arraybuffer',
          headers: {
            Authorization: "Bearer "+this.jwt,
          },
          params: {
            format:"zip"
          }
        })
        .then(async response => {
          const jszip = new JSZip();
          const zip = await jszip.loadAsync(response.data);
          let filenames = Object.keys(zip.files);
          if (filenames.length === 0) {
              console.error("No files in the zip.");
              return;
          }

          let solutionFiles = filenames.filter(f => f.includes("solutions"))
          if (solutionFiles.length == 1){
            let fileObject = zip.files[solutionFiles[0]];
            fileObject.async("string").then(content => {
                console.log(content[0]);
            });
          } else if (solutionFiles.length > 1){
            let jsSolutionFiles = solutionFiles.filter(f => f.endsWith(".js"))
            let fileObject = zip.files[jsSolutionFiles[0]];
            fileObject.async("string").then(content => {
                console.log(content[0]);
            });
          } else {
            console.log("solution is null")
          }


          let testFiles = filenames.filter(f => f.includes("tests"))
          let grouped = testFiles.reduce((acc, path) => {
            const parts = path.split('/');
            const key = parts[1];
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(path);
            return acc;
          }, {});
          grouped = Object.values(grouped);
          grouped.forEach(test => {
            let fileObject = zip.files[test.find(t => t.includes("in"))];
            fileObject.async("string").then(content => {
                console.log(content[0]);
            });
            let fileObject2 = zip.files[test.find(t => t.includes("out"))];
            fileObject2.async("string").then(content => {
                console.log(content[0]);
            });
          })


          let statementFiles = filenames.filter(f => f.includes("statement"))
          if (statementFiles.length == 1){
            let fileObject2 = zip.files[statementFiles[0]];
            fileObject2.async("string").then(content => {
                console.log(content);
            });
          } else if (statementFiles.length > 1){
            let file = statementFiles.find(f => f.includes("_en")) ? statementFiles.find(f => f.includes("_en")) : statementFiles.find(f => f.includes("en_")) ? statementFiles.find(f => f.includes("en_")) : statementFiles[0]
            let fileObject2 = zip.files[file];
            fileObject2.async("string").then(content => {
                console.log(content);
            });
          } else {
            console.log("not")
          }
        })
      this.loading = false
    },
    retClass(item){
      if ("programmingLanguages" in item && ((item.programmingLanguages.includes("JavaScript") 
        || item.programmingLanguages.includes("JS") 
        || item.programmingLanguages.includes("Javascript") 
        || item.programmingLanguages.includes("js") || item.programmingLanguages.length==0))
      ){
        return "authorKitTableRow"
      } else if (this.projects){
        return "authorKitTableRow"
      } else {
        return "authorKitTableRowDisabled"
      }
    },
    openProject(project){
      this.projects = false
      this.exercises = true
      this.params.page = 1
      this.page = 1
      this.projectId=project.id
      this.getExercises()
    },  
    openExercise(item){
      if ("programmingLanguages" in item && ((item.programmingLanguages.includes("JavaScript") 
        || item.programmingLanguages.includes("JS") 
        || item.programmingLanguages.includes("Javascript") 
        || item.programmingLanguages.includes("js") || item.programmingLanguages.length==0))
      ){
        this.exerciseId = item.id
        this.exercises = false
        this.exercise = true
        this.getExercise()
      }
    },
    back1(){
      this.projects = true
      this.exercises = false
      this.exercise = false
      this.page = 1
      this.params.page = 1
      this.projectId = null
      this.getItems()
    },
    back2(){
      this.options.page = 1
      this.page = 1
      this.params.page = 1
      this.getExercises()
      this.exercises = true
      this.exercise = false
    }
  }
}
</script>
  
<style  lang="css">
.authorKitTableRow{
  background-color: white;
  box-shadow: 0px 0px 3px rgb(184, 184, 184) !important;
}
.authorKitTableRow:hover{
  background-color: white !important;
  box-shadow: 0px 0px 12px rgb(162, 162, 162) !important;
  cursor: pointer;
}
.authorKitTableRowDisabled{
  background-color: rgb(225, 225, 225);
}
.authorKitTableRowDisabled:hover{
  background-color: rgb(225, 225, 225) !important;
}
</style>

<style scoped>
.hover:hover {
  cursor: pointer;
}
#authorKit>>>.v-data-table > .v-data-table__wrapper > table{
  border-spacing: 0px 8px;
  background-color: #EEEEEE;
}
#authorKit>>>.text-start{
  border-bottom: 0;
}
#authorKit>>>.v-data-table__wrapper{
  padding: 12px;
  background-color: #EEEEEE
}

.subheader{
  color:#1A9FD7;
  font-weight: 800;
  background-color:lightgray;
  height:32px
}

</style>
  