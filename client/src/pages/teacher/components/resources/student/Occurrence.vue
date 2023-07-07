<template>
  <div id="occurrence">
    <v-container fluid class="pa-0">
      
      <v-row dense>
    
        <v-col cols="2">
          <v-card 
            width="100%" 
            height="100%" 
            outlined 
            style="border-color: #C3C3C3;" 
            class="px-2 py-1 d-flex justify-center align-center"
          >
            <Editable 
              :type="'occurrence'" 
              placeholder="Year" 
              :value="occurrence.year.toString()" 
              :id="occurrence.id"
              :field="'year'" 
              @input="editableInput" 
            />
            <span v-if="false">{{ occurrence.year }}</span>
          </v-card>
        </v-col>

        <v-col cols="2">
          <v-card 
            width="100%" 
            outlined 
            style="border-color: #C3C3C3;" 
            class="px-2"
          >
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
          </v-card>
        </v-col>

        <v-col cols="2">
          <v-card 
            width="100%" 
            outlined 
            style="border-color: #C3C3C3;" 
            class="px-2"
          >
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
                  v-on="on"/>
              </template>
              <v-date-picker no-title v-model="endDate" @input="menu2 = false"/>
            </v-menu>
          </v-card>
        </v-col>

        <v-col cols="2">
          <v-card 
            v-if="occurrence.courses != null" 
            width="180px" 
            height="50px" 
            outlined style="border-color: #C3C3C3;"
            class="pl-0 pr-4 mr-0 d-flex justify-center align-center"
          >
            <v-icon>
              {{ getIcon(occurrence.courses.type) }}
            </v-icon>
            <span class="ml-1">
              {{ occurrence.courses.name }}
            </span>
            <v-badge 
              tile 
              class="badge"
              overlap
              color="#f5f5f5"
              @click.native="removeCourse" 
              icon="mdi-close" 

              >
            </v-badge>
          </v-card>
          
          <v-card 
            v-else 
            width="100%" 
            height="100%" 
            outlined 
            style="border-color: #C3C3C3;" 
            class="px-2 d-flex justify-center align-center"
            @click="chooseCourse"
          >
            <v-icon>mdi-plus</v-icon><span>Course</span>
          </v-card>
        </v-col>
      </v-row>

      <!--
      <v-row dense>
        <v-col cols="12" >
          <v-card 
            outlined 
            style="border-color: #C3C3C3;" 
            class="px-2 d-flex justify-center align-center"
          >
            <template>
              <v-row class="fill-height">
                <v-col>
                  <v-sheet height="64">
                    <v-toolbar
                      flat
                    >
                      <v-btn
                        outlined
                        class="mr-4"
                        color="grey darken-2"
                        @click="setToday"
                      >
                        Today
                      </v-btn>
                      <v-btn
                        fab
                        text
                        small
                        color="grey darken-2"
                        @click="prev"
                      >
                        <v-icon small>
                          mdi-chevron-left
                        </v-icon>
                      </v-btn>
                      <v-btn
                        fab
                        text
                        small
                        color="grey darken-2"
                        @click="next"
                      >
                        <v-icon small>
                          mdi-chevron-right
                        </v-icon>
                      </v-btn>
                      <v-toolbar-title v-if="$refs.calendar">
                        {{ $refs.calendar.title }}
                      </v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-chip
                        v-if="true"
                        class="ma-2"
                        style="width:115px"
                        close
                        :color="datePicker.includes('Start Date') ? 'primary' : ''"
                        @click:close="startDate2 = ''"
                        @click="clickStartDate"
                      >
                        {{startDate2}}
                      </v-chip>
                      <v-chip
                        v-if="true"
                        style="width:115px"
                        class="ma-2"
                        :color="datePicker.includes('End Date') ? 'primary' : ''"
                        close
                        @click:close="endDate2 = ''"
                        @click="clickEndDate"
                      >
                        {{ endDate2 }}
                      </v-chip>

                      <v-card 
                        v-if="occurrence.courses != null" 
                        width="180px" 
                        height="46px" 
                        outlined style="border-color: #C3C3C3;"
                        class="pl-2 pr-4 ma-2 mr-0 d-flex justify-center align-center"
                      >
                        <v-icon>
                          {{ getIcon(occurrence.courses.type) }}
                        </v-icon>
                        <span class="ml-1">
                          {{ occurrence.courses.name }}
                        </span>
                        <v-badge 
                          tile 
                          class="badge"
                          overlap
                          color="#f5f5f5"
                          @click.native="removeCourse" 
                          icon="mdi-close" 

                          >
                        </v-badge>
                      </v-card>
                      
                      <v-card 
                        v-else 
                        width="100%" 
                        height="100%" 
                        outlined 
                        style="border-color: #C3C3C3;" 
                        class="px-2 d-flex justify-center align-center"
                        @click="chooseCourse"
                      >
                        <v-icon>mdi-plus</v-icon><span>Course</span>
                      </v-card>
                    </v-toolbar>
                  </v-sheet>
                  <v-sheet class="mb-2" height="410">
                    <v-calendar
                      id="calender"
                      ref="calendar"
                      v-model="focus"
                      color="primary"
                      type="month"
                      :events="events"
                      :event-color="getEventColor"
                      :event-ripple="false"
                      @click:date="clickDate"
                    >
                    </v-calendar>
                  </v-sheet>
                </v-col>
              </v-row>
            </template>
          </v-card>
        </v-col>
        
        <v-col cols="7">
          <v-card 
            height="100%" 
            outlined 
            style="border-color: #C3C3C3;" 
            class="px-2 d-flex justify-center align-center"
          >
            Statistics
          </v-card>
        </v-col>
      </v-row>
    -->

      <v-row dense>
        <template v-for="(cla, index) in occurrence.classes">
          <v-col :key="index" v-if="true">
            <v-card width="100%" outlined style="border-color: #C3C3C3;" min-height="320px" max-width="600px">
              <v-list-item>
                <v-list-item-content>
                  <v-row class="text-body-1" dense>
                    <v-col class="d-flex align-center">
                      <span class="mr-1">Class:</span>
                      <Editable 
                        style="width: 80px;" 
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
                        style="width: 80px;" 
                        :type="'class'" 
                        placeholder="Delay" 
                        :value="cla.delay != null ? cla.delay.toString() : cla.delay" :id="cla.id"
                        :field="'delay'" 
                        @input="editableInput" />
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
                    <!--
                    <v-col>
                      <v-btn small @click="addStudentByClassId(cla.id)">
                        <v-icon>mdi-plus</v-icon>St
                      </v-btn>
                    </v-col>-->
                  </v-row>
                </v-list-item-content>
                <!--
                <v-btn icon small>
                    <v-icon size="large">
                      mdi-chart-bar
                    </v-icon>
                  </v-btn>-->
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
                style="min-height:270px"
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
                <template v-slot:item.active="{ item }">
                  <v-icon :color="getActiveColor(item)">
                    {{ getActive(item) }}
                  </v-icon>
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
                  <!--
                  <v-btn 
                    icon 
                    small
                    onclick="event.stopPropagation()" 
                  >
                    <v-icon size="large">
                      mdi-chart-bar
                    </v-icon>
                  </v-btn>-->
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
                  <div class="px-2" style="border-top:thin solid rgba(0, 0, 0, 0.12)">
                    <v-btn small @click="addStudentByClassId(cla.id)" width="100%" class="mt-1">
                      <v-icon>mdi-plus</v-icon>Student
                    </v-btn>
                  </div>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </template>
        <div class="pa-1">
          <v-btn 
            style="min-width:0"
            :height="occurrence.classes.length>0 ? '100%' : '36px'"
            :width="occurrence.classes.length>0 ? '36px' : '100%'"
            @click="addClassByOccurrenceId(occurrence.id)"
          >
            <div :style="occurrence.classes.length>0 ? 'transform: rotate(90deg);' : ''">
              <v-icon>mdi-plus</v-icon>
              Class
            </div>
          </v-btn>
        </div>
      </v-row>
    </v-container>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>
          Select a Course
        </v-card-title>
        <v-card-text class="pb-2">
          <v-text-field 
            v-model="search" 
            append-icon="mdi-magnify" 
            label="Search" 
            single-line 
            hide-details
            outlined
            dense
          />

          <v-data-table 
            :items="courses" 
            :headers="tableHeaders" 
            hide-default-header 
            hide-default-footer 
            :loading="loading"
            height="200px" 
            class="overflow-y-auto mb-3 elevation-1" 
            :search="search"
            :items-per-page="courses.length"
          >
            <template v-slot:item.name="{ item }">
              <v-checkbox 
                v-model="checkboxes" 
                :value="item.id" 
                :label="item.name" 
                hide-details 
                class="mt-0"
                :prepend-icon="getIcon(item.type)"
              />
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

    <Snackbar 
      :snackbar="snackbar.open" 
      :timeout="snackbar.timeout" 
      :color="snackbar.color" 
      :icon="snackbar.icon"
      :text="snackbar.text" 
    />
  </div>
</template>

<script>
import { bus } from "@/main.js";
import { mapActions, mapGetters, mapMutations } from "vuex";

import Editable from "../../../../../components/gerneral/Editable.vue";
import Snackbar from "../../../../../components/gerneral/Snackbar.vue";

export default {
  name: "Occurrence",

  components: {
    Editable,
    Snackbar,
  },

  data() {
    return {
      itemsPerPage: 5,
      startDate: "",
      menu: false,
      endDate: "",
      menu2: false,
      loading: false,
      occurrence: this.getOccurrence,
      search: "",
      studentHeader: [
        { text: "", value: "active", width:"10%"},
        { text: "Name", value: "name", align: "start" },
        { text: "Delay", value: "delay", width:"20%"},
        { text: "", value: "actions", sortable:false, align: "end" }
      ],
      dialog: false,
      tableHeaders: [{ text: "Name", value: "name" }],
      courses: [],
      checkboxes: [],

      snackbar: {
        open: false,
        text: "",
        icon: "",
        color: "",
        timeout: 2000,
      },

      datePicker:[],
      events: [],

      startDate2:"",
      endDate2:"",
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
    
    };
  },

  watch: {
    checkboxes(newV){
      if (newV.length>1){
        this.checkboxes = [newV[newV.length-1]]
      }
    },
    startDate(newV) {
      const obj = {
        id: this.occurrence.id,
        value: newV,
        field: "startDate",
        type: "occurrence"
      };
      this.editableInput(obj);
    },
    endDate(newV) {
      const obj = {
        id: this.occurrence.id,
        value: newV,
        field: "endDate",
        type: "occurrence"
      };
      this.editableInput(obj);
    },
    datePicker(newV){
      if(newV.length>1){
        this.datePicker = [newV[1]]
      }
    }
  },

  created() {
    this.setItems();
  },

  computed: {
    ...mapGetters("main", ["getOccurrence"]),
    ...mapGetters("style", ["getIcon", "getErrorSnackbar", "getSuccessSnackbar"]),
  },

  methods: {
    ...mapMutations("main", [
      "editableInput",
      "addClassByOccurrenceId",
      "addStudentByClassId",
      "deleteClass",
      "deleteStudent"
    ]),
    ...mapActions("main", ["fetchCollectionTypes"]),
    ...mapMutations("main", ["setStudents"]),
    openCollectionType(item) {
      this.setStudents([item]);
      bus.$emit("changePage", ["student,Student", "student"]);
    },
    setItems() {
      this.loading = true;
      this.occurrence = this.getOccurrence;
      this.events = []
      if ("startDate" in this.occurrence) {
        this.startDate2 = this.occurrence.startDate
        this.events.push({
          id:0,
          name: "Start Date",
          start: this.occurrence.startDate,
          end: this.occurrence.startDate,
          color: "green",
          type:"startEnd"
        })
        //TODO comment this if nec
        this.startDate = new Date(this.occurrence.startDate);
        this.startDate = this.startDate.toISOString().substring(0, 10);
      }
      if ("endDate" in this.occurrence) {
        this.endDate2 = this.occurrence.endDate
        this.events.push({
          id:1,
          name: "End Date",
          start: this.occurrence.endDate,
          end: this.occurrence.endDate,
          color: "red",
          type:"startEnd"
        })
        //TODO comment this if nec
        this.endDate = new Date(this.occurrence.endDate);
        this.endDate = this.endDate.toISOString().substring(0, 10);
      }

      /*
      let newEvents = {modules:[], lessons:[]}

      let moduleCount = 1
      let lessonCount = 1

      this.occurrence.courses.modules.forEach(module => {
        if (module.condition != null && module.condition.afterWeek != null){
          let start = new Date(this.startDate2)
          start.setDate(start.getDate()+(module.condition.afterWeek*7))
          if (newEvents.modules.length>0){
            let date = new Date(start)
            date.setDate(date.getDate()-1)
            newEvents.modules[newEvents.modules.length-1].end = date
            newEvents.lessons.forEach(event => {
              let datte = new Date(this.endDate2)
              if (event.end.getTime() == datte.getTime()){
                event.end = date
              }
            })
          }
          newEvents.modules.push({
            id:[module.id],
            name: "M"+moduleCount+" "+module.name,
            start: start,
            end: new Date(this.endDate2),
            color: "indigo",
            type:"module"
          })
          ++moduleCount
        } else {
          if (!(newEvents.modules.length>0)){
            newEvents.modules.push({
              id:[module.id],
              name: "M"+moduleCount+" "+module.name,
              start: new Date(this.startDate2),
              end: new Date(this.endDate2),
              color: "indigo",
              type:"module"
            })
            ++moduleCount
          } else {
            newEvents.modules[newEvents.modules.length-1].id.push(module.id)
            newEvents.modules[newEvents.modules.length-1].name += "; M"+moduleCount+" "+module.name
            ++moduleCount
          }
        }


        let first = true
        module.lessons.forEach(lesson => {
          if (lesson.condition != null && lesson.condition.afterWeek != null){
            let start = new Date(this.startDate2)
            start.setDate(start.getDate()+(lesson.condition.afterWeek*7))
            let date = new Date(start)
            date.setDate(date.getDate()-1)
            newEvents.lessons.forEach(event => {
              let datte = new Date(this.endDate2)
              if (event.end.getTime() == datte.getTime()){
                event.end = date
              }
            })
            if (first){
              if (newEvents.modules[newEvents.modules.length-1].start > start){
                start = newEvents.modules[newEvents.modules.length-1].start
              }
              newEvents.lessons.push({
                id:[lesson.id],
                name: "L"+lessonCount+" "+lesson.name,
                start: start,
                end: new Date(this.endDate2),
                color: "indigo lighten-3",
                type:"lesson"
              })
              ++lessonCount
              newEvents.modules[newEvents.modules.length-1].start = start
            } else {
              newEvents.lessons.push({
                id:[lesson.id],
                name: "L"+lessonCount+" "+lesson.name,
                start: start,
                end: new Date(this.endDate2),
                color: "indigo lighten-3",
                type:"lesson"
              })
              ++lessonCount
            }
          } else {
            if (newEvents.lessons.length>0){
              let start2 = new Date(Math.max(newEvents.modules[newEvents.modules.length-1].start.getTime(),newEvents.lessons[newEvents.lessons.length-1].start.getTime()))
              if (start2.getTime()==newEvents.lessons[newEvents.lessons.length-1].start.getTime()){
                newEvents.lessons[newEvents.lessons.length-1].id.push(lesson.id)
                newEvents.lessons[newEvents.lessons.length-1].name += "; L"+lessonCount+" "+lesson.name
                ++lessonCount
              } else {
                newEvents.lessons.push({
                  id:[lesson.id],
                  name: "L"+lessonCount+" "+lesson.name,
                  start: start2,
                  end: new Date(this.endDate2),
                  color: "indigo lighten-3",
                  type:"lesson"
                })
                ++lessonCount
              }
            } else {
              newEvents.lessons.push({
                id:[lesson.id],
                name: "L"+lessonCount+" "+lesson.name,
                start: newEvents.modules[newEvents.modules.length-1].start,
                end: new Date(this.endDate2),
                color: "indigo lighten-3",
                type:"lesson"
              })
              ++lessonCount
            }
          }
          first = false
        })
      })

      newEvents.lessons.forEach(event => {
        this.events.push(event)
      })
      newEvents.modules.forEach(event => {
        this.events.push(event)
      })*/
      
      
      this.loading = false;
    },
    async chooseCourse() {
      try {
        this.courses = await this.fetchCollectionTypes({ collectionType: "courses" })
        this.dialog = true
      } catch(error) {
        console.log(error)
        this.getErrorSnackbar("Something went wrong fetching the courses")
      }
    },
    addCourses() {
      let course = this.courses.find(c => c.id == this.checkboxes[0])
      const obj = {
        id: this.occurrence.id,
        value: course,
        field: "courses",
        type: "occurrence"
      };
      this.editableInput(obj);
      this.dialog = false;
    },
    removeCourse() {
      const obj = {
        id: this.occurrence.id,
        value: null,
        field: "courses",
        type: "occurrence"
      };
      this.editableInput(obj);
    },
    getActiveColor(item){ //TODO
      if (item.delay == 1){
        return "error"
      } else if (item.delay == 2){
        return ""
      } else {
        return "success"
      }
    },
    getActive(item){ //TODO
      if (item.delay == 1){
        return "mdi-arrow-bottom-right"
      } else if (item.delay == 2){
        return "mdi-arrow-right"
      } else {
        return "mdi-arrow-top-right"
      }
    },
    clickDate(date){
      if (this.datePicker.length>0){
        if (this.datePicker[0]=="Start Date"){
          const obj = {
            id: this.occurrence.id,
            value: date.date,
            field: "startDate",
            type: "occurrence"
          };
          this.editableInput(obj);
          this.startDate2 = date.date
          if (this.events.find(e => e.id==0)){
            let index = this.events.findIndex(e => e.id == 0)
            this.events.splice(index,1)
          }
          this.events.push({
            id:0,
            name: "Start Date",
            start: date.date,
            end: date.date,
            color: "green",
          })
        } else if (this.datePicker[0]=="End Date"){
          const obj = {
            id: this.occurrence.id,
            value: date.date,
            field: "endDate",
            type: "occurrence"
          };
          this.editableInput(obj);
          this.endDate2 = date.date
          if (this.events.find(e => e.id==1)){
            let index = this.events.findIndex(e => e.id == 1)
            this.events.splice(index,1)
          }
          this.events.push({
            id:1,
            name: "End Date",
            start: date.date,
            end: date.date,
            color: "red",
          })
        }
        this.setItems()
      }
    },
    clickEndDate(){
      if (this.datePicker.includes('End Date')){
        this.datePicker = []
      } else {
        this.datePicker = ['End Date']
      }
    },
    clickStartDate(){
      if (this.datePicker.includes('Start Date')){
        this.datePicker = []
      } else {
        this.datePicker = ['Start Date']
      }
    },



    viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
    },
    getEventColor (event) {
      return event.color
    },
    setToday () {
      this.focus = ''
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    updateRange ({ start, end }) {
      const events = []

      const min = new Date(`${start.date}T00:00:00`)
      const max = new Date(`${end.date}T23:59:59`)
      const days = (max.getTime() - min.getTime()) / 86400000
      const eventCount = this.rnd(days, days + 20)

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0
        const firstTimestamp = this.rnd(min.getTime(), max.getTime())
        const first = new Date(firstTimestamp - (firstTimestamp % 900000))
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
        const second = new Date(first.getTime() + secondTimestamp)

        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: first,
          end: second,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: !allDay,
        })
      }

      this.events = events
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
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

.badge:hover{
  cursor: pointer;
}
.badge{
  z-index:5; 
  position:absolute; 
  right:12px;
  top:12px; 
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 
    0px 1px 5px 0px rgba(0, 0, 0, 0.12)
}
#occurrence>>>.v-badge--tile .v-badge__badge{
  border-radius: 4px;
  color:black;
}
#occurrence>>>.v-badge__badge .v-icon{
  font-size: 16px;
}

#occurrence>>>.theme--light.v-data-table .v-data-footer{
  border-top:none;
}


#calender>>> .v-btn--fab{
  height: auto;
  width:80px;
}
#calender>>>.v-btn--round{
  border-radius:4px;
}
#calender>>>.v-calendar-weekly__day-label{
  margin:0;
}


</style>
