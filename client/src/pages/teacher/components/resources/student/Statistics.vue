<template>
  <div id="statistics">
    <v-expansion-panels class="shadow" flat>
      <v-expansion-panel 
        :style="{ backgroundColor: $vuetify.theme.currentTheme.boxes }"
      >
        <v-expansion-panel-header>
          Statistics
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-radio-group v-model="radioGroup" row class="mt-0">
            <v-radio label="Occurrence" value="occ"/>
            <v-radio label="Classes" value="cla"/>
            <v-autocomplete 
              v-model="radioGroup" 
              :items="getOccurrence.classes.flatMap(c => c.students)"
              label="Student" 
              item-text="name" 
              item-value="id" 
              dense 
              hide-details 
              outlined
              class="mr-2"
            />
            <v-autocomplete 
              v-model="radioGroup" 
              :items="getOccurrence.classes.flatMap(c => c.students)"
              label="Exercise" 
              item-text="name" 
              item-value="id" 
              dense 
              hide-details 
              outlined
              class="ml-2"
            />
          </v-radio-group>

          <div v-if="error" class="pa-7 d-flex justify-center">
            <ErrorChip/>
          </div>

          <div v-else-if="loading" class="pa-4 d-flex justify-center">
            <v-progress-circular
              :size="120"
              indeterminate
              color="grey"
              :width="7"
            ></v-progress-circular>
          </div>

          <!--Occurrence-->
          <div v-else-if="radioGroup == 'occ'">
            <v-container fluid class="pa-0">
              <v-row>
                <v-col cols="6">
                  <v-card 
                    :style="{backgroundColor: $vuetify.theme.currentTheme.boxes}"
                    class="pa-2"
                  >
                    <Chart :data="studentChartData" title="Performances"/>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card 
                    :style="{backgroundColor: $vuetify.theme.currentTheme.boxes}"
                    class="pa-2"
                  >
                    <Chart 
                      :data="evaluativeChartData" 
                      :horizontal="false"
                      title="Correct Percentage"
                    />
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </div>

          <!--Classes-->
          <div v-else-if="radioGroup == 'cla'">
            <v-container fluid class="pa-0">
              <v-row v-for="(chartData, index) in classChartData" :key="index">
                <v-col>
                  <v-row>
                    <v-col class="pb-0 text-center text-h6">
                      {{ chartData.class }}:
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-card 
                        :style="{backgroundColor: $vuetify.theme.currentTheme.boxes}"
                        class="pa-2"
                      >
                        <Chart :data="chartData.student" title="Performances"/>
                      </v-card>
                    </v-col>
                    <v-col cols="6">
                      <v-card 
                        :style="{backgroundColor: $vuetify.theme.currentTheme.boxes}"
                        class="pa-2"
                      >
                        <Chart 
                          :data="chartData.evaluative" 
                          :horizontal="false"
                          title="Correct Percentage"
                        />
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
          </div>

          <!--Student-->
          <div v-else>
            <v-container class="pa-0" fluid>
              <v-row>
                <v-col>
                  <v-card 
                    outlined 
                    elevation="1" 
                    :style="{backgroundColor: $vuetify.theme.currentTheme.boxes}" 
                    class="pa-1"
                  >
                    <v-row dense>
                      <v-col class="text-center py-2">
                        Performance:
                        <v-chip 
                          :color="getColor(studentStat.performance)" 
                          text-color="white"
                          class="ml-2"
                        >
                          {{ studentStat.performance }}
                        </v-chip>
                      </v-col>
                      <v-divider vertical class="my-1"></v-divider>
                      <v-col class="text-center py-2">
                        Exercises correct:
                        <v-chip 
                          :color="getColor(studentStat.correctExercises)" 
                          text-color="white"
                          class="ml-2"
                        >
                          {{ studentStat.correctExercises }}
                        </v-chip>
                      </v-col>
                      <v-divider vertical class="my-1"></v-divider>
                      <v-col class="text-center py-2">
                        Engagement:
                        <v-chip 
                          :color="getColor(studentStat.engagment)" 
                          text-color="white"
                          class="ml-2"
                        >
                          {{ studentStat.engagment }}
                        </v-chip>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-card 
                    outlined 
                    elevation="1"
                    :style="{backgroundColor: $vuetify.theme.currentTheme.boxes}"
                  >
                    <v-text-field 
                      prepend-inner-icon="mdi-magnify" 
                      filled 
                      dense 
                      hide-details 
                      v-model="search"
                      class="smallSearch mt-0"
                    />
                    <v-data-table 
                      :headers="headers.studentStat" 
                      :items="studentStat.statuses"
                      :expanded.sync="expanded" 
                      show-expand 
                      item-key="id" 
                      :search="search" 
                      hide-default-footer 
                      dense
                      height="250px" 
                      class="overflow-y-auto"
                      style="background-color:transparent"
                    >
                      <template v-slot:expanded-item="{ headers, item }">
                        <td :colspan="headers.length" class="py-2">
                          <div v-if="!('answer' in item)">
                            Not answered yet
                          </div>
                          <div 
                            v-else-if="item.answer[0].__component == 'solution.quiz'"
                          >
                            <div 
                              v-for="question in item.answer[0].questions" 
                              :key="question.id"
                            >
                              <div 
                                v-html="question.question.question" 
                                class="mb-2"
                              ></div>
                              <div v-for="answer in JSON.parse(
                                    question.answer
                                  )" :key="answer">
                                Answer:
                                <v-icon v-if="JSON.parse(
                                  question.question.correctAnswer
                                ).includes(answer)
                                  " color="success">
                                  mdi-check
                                </v-icon>
                                <v-icon v-else color="error">
                                  mdi-alpha-x
                                </v-icon>
                                {{
                                  question.question.answers[answer - 1]
                                    .answer
                                }}
                              </div>
                              <v-divider class="my-1"></v-divider>
                            </div>
                          </div>
                          <div v-else-if="item.answer[0].__component ==
                            'solution.code'
                            ">
                            <span v-if="item.answer[0].code == ''">
                              Not answered yet
                            </span>
                            <div v-else>
                              <pre>
                                <code v-html="item.answer[0].code"></code>
                              </pre>
                            </div>
                          </div>
                        </td>
                      </template>
                      <template v-slot:item.grade="{ item }">
                        <v-chip :color="getColor(item.grade)" small text-color="white">
                          {{ item.grade }}
                        </v-chip>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>


<script>
import { mapActions, mapGetters } from "vuex";

import Chart from "./Chart.vue";
import ErrorChip from "../../../../../components/gerneral/ErrorChip.vue";

export default {
  name: "Statistics",

  components:{
    Chart,
    ErrorChip
  },

  data() {
    return {
      studentChartData: [],
      evaluativeChartData: [],
      classChartData: [],

      loading: true,
      error: false,

      occurrence: this.getOccurrence,

      radioGroup: "occ",
      search:"",
      expanded: [],
      studentStat: {
        performance: 0,
        correctExercises: 0,
        engagment: 0,
        statuses: []
      },
      headers: {
        studentStat: [
          { text: "Exercise", value: "evaluative.name" },
          { text: "Grade", value: "grade", align: "start" }
        ],
      },
    };
  },

  watch: {
    async radioGroup(newV) {
      if (newV == "occ") {
        await this.setOccurrenceStatistics()
      } else if (newV == "cla") {
        await this.setClassStatistics()
      } else {
        await this.setStudentStatistics(newV)
      }
    },
  },

  async created() {
    await this.setOccurrenceStatistics()
  },

  computed: {
    ...mapGetters("main", ["getOccurrence"]),
    ...mapGetters("style", ["getIcon"])
  },

  methods: {
    ...mapActions("request", [
      "fetchStudentStat",
      "fetchOccStat",
      "fetchClassStat",
    ]),
    async setStudentStatistics(newV){
      this.loading = true
      try{
        let data = await this.fetchStudentStat(newV);
        this.studentStat = data;
      } catch(error){
        console.log(error)
        this.error = true
      }
      this.loading = false
    },
    async setOccurrenceStatistics(){
      this.loading = true
      try {
        let data = await this.fetchOccStat(this.getOccurrence.id);
        this.studentChartData = data.students.map(s => [s.name, s.performance])
        this.evaluativeChartData = data.evaluatives.map(s => [s.name, s.correctPerc])
      } catch(error){
        console.log(error)
        this.error = false
      }
      this.loading = false
    },
    async setClassStatistics(){
      this.loading = true
      try {
        let stat = []
        for (let classe of this.getOccurrence.classes) {
          let data = await this.fetchClassStat(classe.id);
          let obj = {
            class: classe.name,
            student: data.students.map(s => [s.name, s.performance]),
            evaluative: data.evaluatives.map(s => [s.name, s.correctPerc])
          }
          stat.push(obj)
        }
        this.classChartData = stat;
      } catch(error){
        console.log(error)
        this.error = false
      }
      this.loading = false
    },
    getColor(num) {
      if (num > 80) {
        return "green";
      } else if (num > 50) {
        return "#F7BD03";
      } else {
        return "red";
      }
    },
  }

}
</script>


<style scoped>
#statistics>>> .smallSearch > .v-input--hide-details > .v-input__control > .v-input__slot{
  padding-left: 8px;
  padding-right: 8px;
  min-height:20px;
}
#statistics>>> .smallSearch > .v-text-field.v-input--dense .v-input__prepend-inner, .v-text-field.v-input--dense .v-input__append-inner {
  margin-top: 2px !important;
}
#statistics>>>.smallSearch > .v-text-field > .v-input__control > .v-input__slot:before{
  border-color: rgba(0, 0, 0, 0.12);
}
#statistics>>>.smallSearch .v-icon.v-icon{
  font-size: 20px;
}
</style>