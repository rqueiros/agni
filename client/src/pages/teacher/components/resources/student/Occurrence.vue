<template>
  <div id="occurrence" v-if="getOccurrence">
    <v-container fluid class="pa-0">

      <v-row dense>
        <v-col cols="12">
          <v-card 
            flat
            color="boxes" 
            class="px-4 py-1 shadow"
          >
            <v-row dense>
              <v-col>
                <v-menu 
                  v-model="menu" 
                  :close-on-content-click="false" 
                  :nudge-right="40" 
                  transition="scale-transition"
                  offset-y 
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field 
                      hide-details 
                      v-model="startDate" 
                      label="Start Date" 
                      prepend-icon="mdi-calendar" 
                      readonly
                      v-bind="attrs" 
                      v-on="on" 
                    />
                  </template>
                  <v-date-picker 
                    no-title 
                    v-model="startDate" 
                    @input="menu = false" 
                  />
                </v-menu>
              </v-col>
              <v-col>
                <v-menu 
                  v-model="menu2" 
                  :close-on-content-click="false" 
                  :nudge-right="40" 
                  transition="scale-transition"
                  offset-y 
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field 
                      hide-details 
                      v-model="endDate" 
                      label="End Date" 
                      prepend-icon="mdi-calendar" 
                      readonly
                      v-bind="attrs" 
                      v-on="on" 
                    />
                  </template>
                  <v-date-picker 
                    no-title 
                    v-model="endDate" 
                    @input="menu2 = false" 
                  />
                </v-menu>
              </v-col>
              <v-col>
                <v-card 
                  v-if="getOccurrence.courses != null" 
                  width="180px" 
                  height="50px"
                  class="pl-0 pr-4 mr-0 d-flex justify-center align-center" 
                  flat
                  color="boxes"
                >
                  <v-icon>
                    {{ getIcon(getOccurrence.courses.type) }}
                  </v-icon>
                  <span class="ml-1">
                    {{ getOccurrence.courses.name }}
                  </span>
                  <v-badge 
                    tile 
                    class="badge" 
                    overlap 
                    color="#f5f5f5" 
                    @click.native="removeCourse" 
                    icon="mdi-close"
                  />
                </v-card>
                <v-card 
                  v-else 
                  width="100%" 
                  height="100%" 
                  class="px-2 d-flex justify-center align-center"
                  @click="chooseCourse" 
                  flat
                  color="boxes"
                >
                  <v-icon>mdi-plus</v-icon><span>Course</span>
                </v-card>
              </v-col>
              <v-col class="d-flex align-center">
                <v-select 
                  :disabled="getOccurrence.courses == null"
                  :items="coursePreviews" 
                  v-model="coursePreview" 
                  outlined 
                  hide-details 
                  dense
                  label="Course Preview"
                />
              </v-col>
            </v-row>
            <v-row dense v-if="!(getOccurrence.courses == null)">
              <v-col v-if="coursePreview == 'Calender'" class="pb-3">
                <v-card flat style="height:250px" color=boxes>
                  <v-calendar 
                    id="calender" 
                    ref="calendar" 
                    v-model="focus" 
                    color="primary" 
                    type="month" 
                    :events="events"
                    :event-color="getEventColor" 
                    :event-more="false"
                  >
                    <template v-slot:event="{ event }">
                      <v-tooltip bottom v-if="event.abrev">
                        <template v-slot:activator="{ on, attrs }">
                          <span 
                            class="mx-1" 
                            v-bind="attrs"
                            v-on="on"
                          > {{event.abrev}} </span>
                        </template>
                        <span>
                          Accessible {{ event.type }} {{ event.name }}
                        </span>
                      </v-tooltip>
                      <span v-else class="mx-1">{{ event.name }}</span>
                    </template>
                  </v-calendar>
                  <v-btn
                    elevation="1"
                    fab
                    small
                    @click="prev"
                    class="mr-4"
                    color="grey lighten-3"
                    style="position:absolute; top:100px; left:5px"
                  >
                    <v-icon small>
                      mdi-chevron-left
                    </v-icon>
                  </v-btn>
                  <v-btn
                    elevation="1"
                    fab
                    small
                    @click="next"
                    color="grey lighten-3"
                    style="position:absolute; top:100px; right:5px"
                  >
                    <v-icon small>
                      mdi-chevron-right
                    </v-icon>
                  </v-btn>
                </v-card>
              </v-col>
              <v-col v-if="coursePreview == 'Structure'" class="pb-3">
                <v-card 
                  outlined 
                  height="250px" 
                  style="overflow-y:auto;" 
                  color="boxes"
                >
                  <v-treeview 
                    dense 
                    open-on-click 
                    hoverable
                    :items="coursePreviewStrucutre" 
                    :item-key="'menuId'" 
                  >
                    <template v-slot:label="{ item }">
                      <span 
                        :style="item.afterWeek ? 'color:green' : 'color:red'"
                      >{{ item.name }}</span>
                      <v-divider vertical class="mx-2"></v-divider>
                      <v-tooltip bottom v-if="item.condition && (item.condition.afterWeek != null || item.condition.afterPercDone != null)">
                        <template v-slot:activator="{ on, attrs }">
                          <v-chip small v-bind="attrs" v-on="on">
                            <span v-if="item.condition && item.condition.afterWeek != null">
                              <v-icon small class="mr-1">mdi-calendar-week</v-icon>
                              {{ item.condition.afterWeek }}
                            </span>
                            <span v-if="item.condition && item.condition.type && item.condition.type == 'AND'" class="mx-4">&&</span>
                            <span v-if="item.condition && item.condition.type && item.condition.type == 'OR'" class="mx-4">||</span>
                            <span v-if="item.condition && item.condition.afterPercDone != null">
                              <v-icon small class="mr-1">mdi-progress-check</v-icon>
                            {{ item.condition.afterPercDone }}
                            </span>
                          </v-chip>
                        </template>
                        <span>Accessible</span>
                        <span v-if="item.condition && item.condition.afterWeek != null">
                          after Week {{ item.condition.afterWeek }}
                        </span>
                        <span v-if="item.condition && item.condition.type && item.condition">{{ item.condition.type.toLowerCase() }}</span>
                        <span v-if="item.condition && item.condition.afterPercDone != null">
                          after {{ item.condition.afterPercDone }}% of exercises done correctly
                        </span>
                      </v-tooltip>

                    </template>
                  </v-treeview>
                  <v-card 
                    outlined 
                    width="150px" 
                    style="position:absolute; top:5px; right:5px" 
                    class="pa-1"
                    color="boxes"
                  >
                    <v-row dense>
                      <v-col cols="2" class="d-flex align-center">
                        <v-sheet 
                          color="green" 
                          width="15" 
                          height="15" 
                          rounded="xl"
                        ></v-sheet>
                      </v-col>
                      <v-col class="text-caption">
                        Accessible
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <v-col cols="2" class="d-flex align-center">
                        <v-sheet 
                          color="red" 
                          width="15" 
                          height="15" 
                          rounded="xl"
                        ></v-sheet>
                      </v-col>
                      <v-col class="text-caption">
                        Not yet Accessible 
                      </v-col>
                    </v-row>
                  </v-card>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols=12>
          <v-expansion-panels 
            class="shadow" 
            v-if="getOccurrence.classes.length > 0" 
            v-model="panel" 
            flat
          >
            <v-expansion-panel  
              :style="{backgroundColor : $vuetify.theme.currentTheme.boxes}"
            >
              <v-expansion-panel-header>
                <div>
                  Classes
                </div>
              </v-expansion-panel-header>
              <v-expansion-panel-content v-if="getOccurrence.classes.length > 0">
                <v-row dense>
                  <template v-for="(cla, index) in getOccurrence.classes">
                    <v-col :key="index" v-if="true" style="max-width:500px">
                      <v-card 
                        width="100%" 
                        outlined 
                        min-height="320px" 
                        max-width="600px"
                        :style="{backgroundColor : $vuetify.theme.currentTheme.boxes}"
                      >
                        <v-list-item>
                          <v-list-item-content>
                            <v-row class="text-body-1" dense>
                              <v-col class="d-flex align-center">
                                <Editable 
                                  style="width: 100px;" 
                                  :type="'class'" 
                                  placeholder="Name" 
                                  :value="cla.name" 
                                  :id="cla.id"
                                  :field="'name'" 
                                  @input="editableInput" 
                                />
                              </v-col>
                              <v-col class="d-flex align-center">
                                <span class="mr-1">Delay:</span>
                                <Editable 
                                  style="width: 60px;" 
                                  :type="'class'" 
                                  placeholder="Delay"
                                  :value="cla.delay != null ? cla.delay.toString() : cla.delay" 
                                  :id="cla.id" 
                                  :field="'delay'"
                                  @input="editableInput" 
                                />
                              </v-col>
                              <v-col>
                                <v-text-field 
                                  v-model="cla.search" 
                                  prepend-inner-icon="mdi-magnify" 
                                  single-line
                                  class="pa-0 ma-0 mr-2 text-field smallSearch" 
                                  dense 
                                  hide-details 
                                />
                              </v-col>
                            </v-row>
                          </v-list-item-content>
                          <v-btn icon small @click="deleteClass(cla.id)">
                            <v-icon size="large"> mdi-delete </v-icon>
                          </v-btn>
                        </v-list-item>
                        <v-data-table 
                          dense 
                          :headers="studentHeader" 
                          :items="cla.students" 
                          :search="cla.search" 
                          :loading="loading"
                          :itemsPerPage="itemsPerPage" 
                          class="d-flex flex-column" 
                          style="min-height:270px; background-color:transparent"
                        >
                          <template v-slot:item.name="{ item }">
                            <Editable 
                              :type="'student'" 
                              placeholder="Name" 
                              :value="item.name" 
                              :id="item.id" 
                              :field="'name'"
                              @input="editableInput" 
                              onclick="event.stopPropagation()" 
                            />
                          </template>
                          <template v-slot:item.delay="{ item }">
                            <Editable 
                              :type="'student'" 
                              placeholder="Delay"
                              :value="item.delay != null ? item.delay.toString() : item.delay" 
                              :id="item.id" 
                              :field="'delay'"
                              @input="editableInput" 
                              onclick="event.stopPropagation()" 
                            />
                          </template>
                          <template v-slot:item.actions="{ item }">
                            <v-btn 
                              icon 
                              small 
                              onclick="event.stopPropagation()" 
                              @click="deleteStudent(item.id)"
                            >
                              <v-icon size="large">
                                mdi-delete
                              </v-icon>
                            </v-btn>
                          </template>
                          <template v-slot:footer>
                            <v-spacer></v-spacer>
                            <div 
                              class="px-2" 
                              style="border-top:thin solid rgba(0, 0, 0, 0.12)"
                            >
                              <v-btn 
                                small 
                                @click="addStudentByClassId(cla.id)" 
                                width="100%" 
                                class="mt-1"
                                color="button"
                              >
                                <v-icon>mdi-plus</v-icon>Student
                              </v-btn>
                            </div>
                          </template>
                        </v-data-table>
                      </v-card>
                    </v-col>
                  </template>
                  <v-col style="width:50px;flex-grow: 0;">
                    <v-btn 
                      @click="importDialog = true"
                      style="min-width:0" 
                      width="36px"
                      height="29%"
                      color="button"
                    >
                      <v-icon>mdi-import</v-icon>
                    </v-btn>
                    <v-spacer class="ma-1"></v-spacer>
                    <v-btn 
                      style="min-width:0" 
                      height="69%"
                      width="36px"
                      @click="addClass"
                      color="button"
                    >
                      <div style="transform: rotate(90deg)">
                        <v-icon>mdi-plus</v-icon>
                        Class
                      </div>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-card v-else class="pa-4 shadow" color="boxes">
            <div class="d-flex">
              <v-btn 
                @click="importDialog = true"
                width="39%"
              >
                <v-icon>mdi-import</v-icon>
              </v-btn>
              <v-spacer class="ma-1"></v-spacer>
              <v-btn 
                width="59%"
                @click="addClassByOccurrenceId(getOccurrence.id)"
              >
                <div>
                  <v-icon>mdi-plus</v-icon>
                  Class
                </div>
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>      

      <v-row dense v-if="new Date(startDate) < new Date()">
        <v-col cols=12>
          <v-expansion-panels class="shadow" flat>
            <v-expansion-panel 
              :style="{backgroundColor : $vuetify.theme.currentTheme.boxes}"
            >
              <v-expansion-panel-header>
                Statistics
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-radio-group v-model="radioGroup" row class="mt-0">
                  <v-radio label="Occurrence" value="occ"></v-radio>
                  <v-radio label="Classes" value="cla"></v-radio>
                  <v-autocomplete v-model="radioGroup" :items="getOccurrence.classes.flatMap(c => c.students)"
                    label="Student" item-text="name" item-value="id" dense hide-details outlined></v-autocomplete>
                </v-radio-group>

                <div v-if="radioGroup == 'occ'">
                  <v-container fluid class="pa-0">
                    <v-row>
                      <v-col>
                        <v-card 
                          outlined 
                          :style="{backgroundColor : $vuetify.theme.currentTheme.boxes}"
                        >
                          <v-data-table 
                            :headers="headers.studentPerf" 
                            :items="studentsStatTable" 
                            item-key="name"
                            :search="search" 
                            hide-default-footer 
                            dense 
                            height="200px"
                            style="background-color:transparent"
                          >
                            <template v-slot:top>
                              <div class="pb-1">
                                <v-text-field 
                                  outlined 
                                  dense 
                                  hide-details 
                                  v-model="search"
                                  label="Search Students"
                                ></v-text-field>
                              </div>
                            </template>
                            <template v-slot:item.performance="{ item }">
                              <span :style="getColor(item.performance)">
                                {{ item.performance }}
                              </span>
                            </template>
                          </v-data-table>
                        </v-card>
                      </v-col>
                      <v-col>
                        <v-card 
                          outlined 
                          :style="{backgroundColor : $vuetify.theme.currentTheme.boxes}"
                        >
                          <v-data-table 
                            :headers="headers.evaluativesTable" 
                            :items="evaluativesStatTable" 
                            item-key="name"
                            :search="search" 
                            hide-default-footer 
                            dense 
                            height="200px"
                            style="background-color:transparent"
                          >
                            <template v-slot:top>
                              <div class="pb-1">
                                <v-text-field 
                                  outlined
                                  dense 
                                  hide-details 
                                  v-model="search"
                                  label="Search Exercises"
                                ></v-text-field>
                              </div>
                            </template>
                            <template v-slot:item.correctPerc="{ item }">
                              <span :style="getColor(item.correctPerc)">
                                {{ item.correctPerc }}
                              </span>
                            </template>
                          </v-data-table>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-container>
                </div>
                <div v-else-if="radioGroup == 'cla'">
                  <v-container fluid class="pa-0">
                    <v-row v-if="classeStatTable.length == 1">
                      <v-col>
                        <v-card 
                          outlined
                          :style="{backgroundColor : $vuetify.theme.currentTheme.boxes}"
                        >
                          <v-data-table 
                            :headers="headers.studentPerf" 
                            :items="classeStatTable[0].students"
                            item-key="name" 
                            :search="search" 
                            hide-default-footer 
                            dense 
                            height="200px"
                            style="background-color:transparent"
                          >
                            <template v-slot:top>
                              <div class="pb-1">
                                <v-text-field 
                                  outlined 
                                  dense 
                                  hide-details 
                                  v-model="search"
                                  label="Search Students"
                                ></v-text-field>
                              </div>
                            </template>
                            <template v-slot:item.performance="{ item }">
                              <span :style="getColor(item.performance)">
                                {{ item.performance }}
                              </span>
                            </template>
                          </v-data-table>
                        </v-card>
                      </v-col>
                      <v-col>
                        <v-card 
                          outlined 
                          :style="{backgroundColor : $vuetify.theme.currentTheme.boxes}"
                        >
                          <v-data-table 
                            :headers="headers.evaluativesTable" 
                            :items="classeStatTable[0].evaluatives"
                            item-key="name" 
                            :search="search" 
                            hide-default-footer 
                            dense 
                            height="200px"
                            style="background-color:transparent"
                          >
                            <template v-slot:top>
                              <div class="pb-1">
                                <v-text-field outlined dense hide-details v-model="search"
                                  label="Search Exercises"></v-text-field>
                              </div>
                            </template>
                            <template v-slot:item.correctPerc="{ item }">
                              <span :style="getColor(item.correctPerc)">
                                {{ item.correctPerc }}
                              </span>
                            </template>
                          </v-data-table>
                        </v-card>
                      </v-col>
                    </v-row>
                    <div v-else>
                      <v-row>
                        <v-col 
                          v-for="classe of classeStatTable" 
                          :key="classe.id" 
                          class="d-flex justify-center text-h6 pb-0"
                        >
                          {{classe.name}}:
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col v-for="classe of classeStatTable" :key="classe.id">
                          <v-card 
                            outlined 
                            :style="{backgroundColor : $vuetify.theme.currentTheme.boxes}"
                          >
                            <v-data-table 
                              :headers="headers.studentPerf" 
                              :items="classe.students" 
                              item-key="name"
                              :search="search" 
                              hide-default-footer 
                              height="200px" 
                              dense
                              style="background-color:transparent"
                            >
                              <template v-slot:top>
                                <div class="pb-1">
                                  <v-text-field outlined dense hide-details v-model="search"
                                    label="Search Students"></v-text-field>
                                </div>
                              </template>
                              <template v-slot:item.performance="{ item }">
                                <span :style="getColor(item.performance)">
                                  {{ item.performance }}
                                </span>
                              </template>
                            </v-data-table>
                          </v-card>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col v-for="classe of classeStatTable" :key="classe.id">
                          <v-card 
                            outlined 
                            :style="{backgroundColor : $vuetify.theme.currentTheme.boxes}"
                          >
                            <v-data-table 
                              :headers="headers.evaluativesTable" 
                              :items="classe.evaluatives" 
                              item-key="name"
                              :search="search" 
                              hide-default-footer 
                              dense 
                              height="200px"
                              style="background-color:transparent"
                            >
                              <template v-slot:top>
                                <div class="pb-1">
                                  <v-text-field 
                                    outlined 
                                    dense 
                                    hide-details 
                                    v-model="search"
                                    label="Search Exercises"
                                  ></v-text-field>
                                </div>
                              </template>
                              <template v-slot:item.correctPerc="{ item }">
                                <span :style="getColor(item.correctPerc)">
                                  {{ item.correctPerc }}
                                </span>
                              </template>
                            </v-data-table>
                          </v-card>
                        </v-col>
                      </v-row>
                    </div>
                  </v-container>
                </div>
                <div v-else>
                  <v-container class="pa-0" fluid>
                    <v-row>
                      <v-col>
                        <v-card 
                          outlined 
                          :style="{backgroundColor : $vuetify.theme.currentTheme.boxes}"
                          class="pa-1"
                        >
                          <v-row dense>
                            <v-col class="text-center">
                              Performance:
                            </v-col>
                            <v-divider vertical class="mt-1"></v-divider>
                            <v-col class="text-center">
                              Exercises correct:
                            </v-col>
                            <v-divider vertical class="mt-1"></v-divider>
                            <v-col class="text-center">
                              Engagement:
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col class="text-center pt-0">
                              <span :style="getColor(studentStat.performance)">
                                {{ studentStat.performance }}
                              </span>
                            </v-col>
                            <v-divider vertical class="mb-1"></v-divider>
                            <v-col class="text-center pt-0">
                              <span :style="getColor(studentStat.correctExercises)">
                                {{ studentStat.correctExercises }}%
                              </span>
                            </v-col>
                            <v-divider vertical class="mb-1"></v-divider>
                            <v-col class="text-center pt-0">
                              <span :style="getColor(studentStat.engagment)">
                                {{ studentStat.engagment }}
                              </span>
                            </v-col>
                          </v-row>
                        </v-card>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-card 
                          outlined 
                          :style="{backgroundColor : $vuetify.theme.currentTheme.boxes}"
                        >
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
                            style="background-color:transparent"
                          >
                            <template v-slot:top>
                              <div class="pb-1">
                                <v-text-field outlined dense hide-details v-model="search"
                                  label="Search Exercises"></v-text-field>
                              </div>
                            </template>
                            <template v-slot:expanded-item="{ headers, item }">
                              <td :colspan="headers.length" class="py-2">
                                <div v-if="!('answer' in item)">
                                  Not answered yet
                                </div>
                                <div v-else-if="item.answer[0].__component == 'solution.quiz'">
                                  <div v-for="question in item.answer[0].questions" :key="question.id">
                                    <div v-html="question.question.question" class="mb-2"></div>
                                    <div v-for="answer in JSON.parse(question.answer)" :key="answer">
                                      Answer: 
                                      <v-icon v-if="JSON.parse(question.question.correctAnswer).includes(answer)" color="success">
                                        mdi-check
                                      </v-icon>
                                      <v-icon v-else color="error">
                                        mdi-alpha-x
                                      </v-icon>
                                      {{ question.question.answers[answer-1].answer }}
                                    </div>
                                    <v-divider class="my-1"></v-divider>
                                  </div>
                                </div>
                                <div v-else-if="item.answer[0].__component == 'solution.code'">
                                  <span v-if="item.answer[0].code==''">Not answered yet</span>
                                  <div v-else>
                                    <pre><code v-html="item.answer[0].code"></code></pre>
                                  </div>
                                </div>
                              </td>
                            </template>
                            <template v-slot:item.grade="{ item }">
                              <span :style="getColor(item.grade)">
                                {{ item.grade }}
                              </span>
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
        </v-col>
      </v-row>

    </v-container>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>
          Select a Course
        </v-card-title>
        <v-card-text class="pb-2">
          <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details outlined
            dense />

          <v-data-table :items="courses" :headers="tableHeaders" hide-default-header hide-default-footer
            :loading="loading" height="200px" class="overflow-y-auto mb-3 elevation-1" :search="search"
            :items-per-page="courses.length">
            <template v-slot:item.name="{ item }">
              <v-checkbox v-model="checkboxes" :value="item.id" :label="item.name" hide-details class="mt-0"
                :prepend-icon="getIcon(item.type)" />
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn text @click="addCourses">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <ImportDialog :dialog="importDialog" @closeSelectDialog="importDialog = false" />
  </div>
</template>

<script>
import { bus } from "@/main.js";
import { mapActions, mapGetters, mapMutations } from "vuex";

import Editable from "../../../../../components/gerneral/Editable.vue";
import ImportDialog from "../../../../../components/gerneral/ImportDialog.vue";

export default {
  name: "Occurrence",

  components: {
    Editable,
    ImportDialog,
  },

  data() {
    return {
      importDialog: false,

      panel:null,

      itemsPerPage: 5,
      startDate: "",
      menu: false,
      endDate: "",
      menu2: false,
      loading: false,
      occurrence: this.getOccurrence,
      search: "",
      studentHeader: [
        { text: "Name", value: "name", align: "start" },
        { text: "Delay", value: "delay", width: "20%" },
        { text: "", value: "actions", sortable: false, align: "end" }
      ],
      dialog: false,
      tableHeaders: [{ text: "Name", value: "name" }],
      courses: [],
      checkboxes: [],

      events: [],
      focus:"",

      radioGroup: "occ",
      expanded: [],
      studentsStatTable: [],
      evaluativesStatTable: [],
      classeStatTable: [],
      studentStat: {
        performance: 0,
        correctExercises: 0,
        engagment: 0,
        statuses: []
      },
      headers: {
        studentStat: [
          { text: "Exercise", value: "evaluative.name" },
          { text: "Grade", value: "grade", align: "start" },
        ],
        studentPerf: [
          { text: "Student", value: "name" },
          { text: "Performance", value: "performance", align: "start" },
        ],
        evaluativesTable: [
          { text: "Exercise", value: "name" },
          { text: "Correct", value: "correctPerc", align: "start" },
        ]
      },

      coursePreview: "",
      coursePreviews: ["","Calender", "Structure"],
      coursePreviewStrucutre: [],
    };
  },

  watch: {
    checkboxes(newV) {
      if (newV.length > 1) {
        this.checkboxes = [newV[newV.length - 1]]
      }
    },
    startDate(newV) {
      const obj = {
        id: this.getOccurrence.id,
        value: newV,
        field: "startDate",
        type: "occurrence"
      };
      this.editableInput(obj);
    },
    endDate(newV) {
      const obj = {
        id: this.getOccurrence.id,
        value: newV,
        field: "endDate",
        type: "occurrence"
      };
      this.editableInput(obj);
    },
    dialog(newV) {
      if (!newV) {
        this.checkboxes = []
      }
    },
    async radioGroup(newV) {
      if (newV == "occ") {
        let data = await this.fetchOccStat(this.getOccurrence.id)
        this.studentsStatTable = data.students
        this.evaluativesStatTable = data.evaluatives
      } else if (newV == "cla") {
        let table = []
        for (let classe of this.getOccurrence.classes) {
          let data = await this.fetchClassStat(classe.id)
          data.name = classe.name
          table.push(data)
        }
        this.classeStatTable = table
      } else {
        let data = await this.fetchStudentStat(newV)
        this.studentStat = data
      }
    },
    coursePreview(newV) {
      if (newV == "Calender") {
        this.setEvents()
      } else if (newV == "Structure") {
        this.prepareCourseStructure()
      }
    },
    "getOccurrence.classes.length"(newV, oldV){
      if (oldV == 0 && newV > 0){
        this.panel = 0
      }
    }, 
    "getOccurrence.courses"(newV){
      if(newV == null){
        this.coursePreview=null
      }
    }
  },

  async created() {
    this.setItems();
    let data = await this.fetchOccStat(this.getOccurrence.id)
    this.studentsStatTable = data.students
    this.evaluativesStatTable = data.evaluatives
  },

  computed: {
    ...mapGetters("main", [
      "getOccurrence"
    ]),
    ...mapGetters("style", [
      "getIcon",
    ]),
  },

  methods: {
    ...mapMutations("main", [
      "editableInput",
      "addClassByOccurrenceId",
      "addStudentByClassId",
      "deleteClass",
      "deleteStudent"
    ]),
    ...mapActions("main", [
      "fetchCollectionTypes",
      "fetchStudentStat",
      "fetchOccStat",
      "fetchClassStat",
      "fetchCollectionType"
    ]),
    prepareCourseStructure() {
      let course = this.getOccurrence.courses

      const currentDate = new Date();
      const startDate = new Date(this.getOccurrence.startDate)

      let newCourse = {}
      newCourse.id = course.id
      newCourse.name = course.name
      newCourse.menuId = 1
      newCourse.contentType = "course"
      newCourse.children = []

      let count = 2

      for (let j = 0; j < course.modules.length; j++) {
        let module = course.modules[j]
        let newModule = {}
        newModule.id = module.id
        newModule.name = "M"+j+" "+ module.name
        newModule.contentType = "module"
        newModule.menuId = count
        count++
        newModule.afterWeek = true
        newModule.afterPercDone = null
        newModule.children = []
        if (module.condition && (module.condition.type != null || module.condition.afterPercDone != null || module.condition.afterWeek != null)) {
          newModule.condition = module.condition
          if (module.condition.afterWeek) {
            let limit = new Date(startDate.getTime())
            limit = new Date(limit.setDate(limit.getDate() + (module.condition.afterWeek * 7)))
            if (currentDate <= limit) {
              newModule.afterWeek = false
            }
          }
          if (module.condition.afterPercDone) {
            newModule.afterPercDone = module.condition.afterPercDone
          }
        }

        for (let k = 0; k < module.lessons.length; k++) {
          let lesson = module.lessons[k]
          let newLesson = {}
          newLesson.id = lesson.id
          newLesson.name = "L"+k+" "+lesson.name
          newLesson.contentType = "lesson"
          newLesson.menuId = count
          count++
          newLesson.afterWeek = true
          newLesson.afterPercDone = null
          newLesson.children = []
          newLesson.children.push({
            name: "Expositives",
            menuId: count,
            children: [],
            afterWeek: newLesson.afterWeek
          })
          count++
          newLesson.children.push({
            name: "Evaluatives",
            menuId: count,
            children: [],
            afterWeek:newLesson.afterWeek
          })
          count++

          if (!newModule.afterWeek){
            newLesson.afterWeek = false
            newLesson.children[0].afterWeek = false
            newLesson.children[1].afterWeek = false
            if (lesson.condition){
              newLesson.condition = lesson.condition
            }
          } else if (lesson.condition && (lesson.condition.type != null || lesson.condition.afterPercDone != null || lesson.condition.afterWeek != null)) {
            newLesson.condition = lesson.condition
            if (lesson.condition.afterWeek) {
              let limit = new Date(startDate.getTime())
              limit = new Date(limit.setDate(limit.getDate() + (lesson.condition.afterWeek * 7)))
              if (currentDate <= limit) {
                newLesson.afterWeek = false
                newLesson.children[0].afterWeek = false
                newLesson.children[1].afterWeek = false
              }
            }
            if (lesson.condition.afterPercDone) {
              newLesson.afterPercDone = lesson.condition.afterPercDone
            }
          }

          lesson.expositives.data.forEach(expositive => {
            let newExpositive = {}
            newExpositive.id = expositive.id
            newExpositive.name = expositive.attributes.name
            newExpositive.contentType = "expositive"
            newExpositive.menuId = count
            count++
            newExpositive.afterWeek = newLesson.afterWeek
            newLesson.children[0].children.push(newExpositive)
          })
          lesson.evaluatives.data.forEach(evaluative => {
            let newEvaluative = {}
            newEvaluative.id = evaluative.id
            newEvaluative.name = evaluative.attributes.name
            newEvaluative.contentType = "evaluative"
            newEvaluative.menuId = count
            count++
            newEvaluative.afterWeek = newLesson.afterWeek
            newLesson.children[1].children.push(newEvaluative)
          })


          newModule.children.push(newLesson)
        }
        newCourse.children.push(newModule)
      }
      console.log(newCourse)
      this.coursePreviewStrucutre = newCourse.children
    },
    getColor(num) {
      if (num > 80) {
        return "color:green"
      } else if (num > 50) {
        return "color:#F7BD03"
      } else {
        return "color:red"
      }
    },
    setItems() {
      this.loading = true;
      this.occurrence = this.getOccurrence;
      this.events = []
      if ("startDate" in this.occurrence) {
        this.startDate2 = this.occurrence.startDate
        this.startDate = new Date(this.occurrence.startDate);
        this.startDate = this.startDate.toISOString().substring(0, 10);
      }
      if ("endDate" in this.occurrence) {
        this.endDate2 = this.occurrence.endDate
        //TODO comment this if nec
        this.endDate = new Date(this.occurrence.endDate);
        this.endDate = this.endDate.toISOString().substring(0, 10);
      }

      this.loading = false;
    },

    setEvents(){
      this.events = []
      let newEvents = {modules:[], lessons:[]}

      this.events.push({
        id: 0,
        name: "Start",
        start: this.occurrence.startDate,
        end: this.occurrence.startDate,
        color: "green",
        type: "startEnd"
      })
      this.events.push({
        id: 1,
        name: "End",
        start: this.occurrence.endDate,
        end: this.occurrence.endDate,
        color: "red",
        type: "startEnd"
      })

      let moduleCount = 1
      let lessonCount = 1

      this.occurrence.courses.modules.forEach(module => {
        if (module.condition != null && module.condition.afterWeek != null){
          let start = new Date(this.startDate)
          start.setDate(start.getDate()+(module.condition.afterWeek*7))
          newEvents.modules.push({
            id:module.id,
            abrev: "M"+moduleCount,
            name: module.name,
            start: start,
            end: start,
            color: "indigo",
            type:"module"
          })
          ++moduleCount
        } else {
          newEvents.modules.push({
            id:module.id,
            abrev: "M"+moduleCount,
            name: module.name,
            start: new Date(this.startDate),
            end: new Date(this.startDate),
            color: "indigo",
            type:"module"
          })
          ++moduleCount
        }


        module.lessons.forEach(lesson => {
          let start = null
          if (module.condition != null && module.condition.afterWeek != null){
            start = new Date(this.startDate)
            start.setDate(start.getDate()+(module.condition.afterWeek*7))
          } else {
            start = new Date(this.startDate)
            start.setDate(start.getDate()+(module.condition.afterWeek*7))
          }
          



          if (lesson.condition != null && lesson.condition.afterWeek != null){
            let start2 = new Date(this.startDate)
            start2.setDate(start2.getDate()+(lesson.condition.afterWeek*7))
            if (start> start2){
              newEvents.lessons.push({
                id:lesson.id,
                abrev: "L"+lessonCount,
                name: lesson.name,
                start: start,
                end: start,
                color: "indigo lighten-3",
                type:"lesson"
              })
              ++lessonCount
            } else {
              newEvents.lessons.push({
                id: lesson.id,
                abrev: "L"+lessonCount,
                name: lesson.name,
                start: start2,
                end: start2,
                color: "indigo lighten-3",
                type:"lesson"
              })
              ++lessonCount
            }
          } else {
            newEvents.lessons.push({
              id:lesson.id,
              abrev: "L"+lessonCount,
              name: lesson.name,
              start: start,
              end: start,
              color: "indigo lighten-3",
              type:"lesson"
            })
            ++lessonCount
          }
        })
      })

      newEvents.modules.forEach(event => {
        this.events.push(event)
      })
      newEvents.lessons.forEach(event => {
        this.events.push(event)
      })

    },
    async chooseCourse() {
      try {
        this.courses = await this.fetchCollectionTypes({ collectionType: "courses" })
        this.dialog = true
      } catch (error) {
        console.log(error)
        bus.$emit("errorSnackbar", "Something went wrong fetching the Courses")

      }
    },
    async addCourses() {
      let c = this.courses.find(c => c.id == this.checkboxes[0])
      let course = await this.fetchCollectionType([c.id,"courses"])
      course = course.attributes
      course.id = c.id
      const obj = {
        id: this.occurrence.id,
        value: course,
        field: "courses",
        type: "occurrence"
      };
      this.editableInput(obj);
      this.dialog = false;
      this.setItems()
    },
    removeCourse() {
      const obj = {
        id: this.getOccurrence.id,
        value: null,
        field: "courses",
        type: "occurrence"
      };
      this.editableInput(obj);
      this.setItems()
    },
    getEventColor(event) {
      return event.color
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    addClass(){
      this.addClassByOccurrenceId(this.getOccurrence.id)
      this.panel = 0
    },
  }
};
</script>

<style scoped>
#occurrence>>>.v-data-footer__select {
  height: 40px;
}

#occurrence>>>.v-text-field>.v-input__control>.v-input__slot:before {
  border-style: none !important;
}

.smallSearch>>>.v-icon.v-icon {
  font-size: 20px;
}

.badge:hover {
  cursor: pointer;
}

.badge {
  z-index: 5;
  position: absolute;
  right: 12px;
  top: 12px;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14),
    0px 1px 5px 0px rgba(0, 0, 0, 0.12)
}

#occurrence>>>.v-badge--tile .v-badge__badge {
  border-radius: 4px;
  color: black;
}

#occurrence>>>.v-badge__badge .v-icon {
  font-size: 16px;
}

#occurrence>>>.theme--light.v-data-table .v-data-footer {
  border-top: none;
}



#calender>>>.v-btn--fab {
  height: auto;
  width: 80px;
}

#calender>>>.v-btn--round {
  border-radius: 4px;
}

#calender>>>.v-calendar-weekly__day-label {
  margin: 0;
  width:100%;
} 

#calender>>>.v-calendar-weekly__day{
  display: flex;
  flex-wrap: wrap;
}

#calender>>>.v-event{
  width:fit-content !important
}
</style>
