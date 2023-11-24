<template>
  <div id="courseInfo">
    <v-card flat color="boxes" class="px-4 py-2 shadow">
      <v-row dense>
        <!--StartDate-->
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
            <v-date-picker no-title v-model="startDate" @input="menu = false"/>
          </v-menu>
        </v-col>

        <!--EndDate-->
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
            <v-date-picker no-title v-model="endDate" @input="menu2 = false"/>
          </v-menu>
        </v-col>

        <!--Choose Course-->
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

        <!--Course Preview-->
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

      <!--Course Previews-->
      <v-row dense v-if="!(getOccurrence.courses == null)">
        <!--Calender-->
        <v-col v-if="coursePreview == 'Calender'" class="pb-3">
          <v-card style="height:250px" color="boxes">
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
                    <span class="mx-1" v-bind="attrs" v-on="on">
                      {{ event.abrev }}
                    </span>
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

        <!--Structure-->
        <v-col v-if="coursePreview == 'Structure'" class="pb-3">
          <v-card  
            height="250px" 
            style="overflow-y:auto;" 
            color="boxes"
            outlined
            elevation="1"
          >
            <v-treeview 
              dense 
              open-on-click 
              hoverable 
              :items="coursePreviewStrucutre" 
              :item-key="'menuId'"
            >
              <template v-slot:label="{ item }">
                <span :style="item.afterWeek ? 'color:green' : 'color:red'">
                  {{ item.name }}
                </span>
                <v-divider vertical class="mx-2"></v-divider>
                <v-tooltip bottom v-if="item.condition &&
                  (item.condition.afterWeek != null ||
                    item.condition.afterPercDone != null)
                  ">
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip small v-bind="attrs" v-on="on">
                      <span v-if="item.condition &&
                        item.condition.afterWeek != null
                        ">
                        <v-icon small class="mr-1">mdi-calendar-week</v-icon>
                        {{ item.condition.afterWeek }}
                      </span>
                      <span v-if="item.condition &&
                        item.condition.type &&
                        item.condition.type == 'AND'
                        " class="mx-4">&&</span>
                      <span v-if="item.condition &&
                        item.condition.type &&
                        item.condition.type == 'OR'
                        " class="mx-4">||</span>
                      <span v-if="item.condition &&
                        item.condition.afterPercDone != null
                        ">
                        <v-icon small class="mr-1">mdi-progress-check</v-icon>
                        {{ item.condition.afterPercDone }}
                      </span>
                    </v-chip>
                  </template>
                  <span>Accessible</span>
                  <span v-if="item.condition && item.condition.afterWeek != null
                    ">
                    after Week {{ item.condition.afterWeek }}
                  </span>
                  <span v-if="item.condition &&
                    item.condition.type &&
                    item.condition
                    ">{{ item.condition.type.toLowerCase() }}</span>
                  <span v-if="item.condition &&
                    item.condition.afterPercDone != null
                    ">
                    after {{ item.condition.afterPercDone }}% of exercises
                    done correctly
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
                  <v-sheet color="green" width="15" height="15" rounded="xl"></v-sheet>
                </v-col>
                <v-col class="text-caption">
                  Accessible
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="2" class="d-flex align-center">
                  <v-sheet color="red" width="15" height="15" rounded="xl"></v-sheet>
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

    <!--Select Course-->
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
  </div>
</template>


<script>
import { bus } from "@/main.js";
import { mapActions, mapGetters, mapMutations } from "vuex";


export default {
  name: "Occurrence",

  components: {},

  data() {
    return {
      startDate: "",
      menu: false,
      endDate: "",
      menu2: false,
      loading: false,
      occurrence: this.getOccurrence,
      search: "",
      dialog: false,
      tableHeaders: [{ text: "Name", value: "name" }],
      courses: [],
      checkboxes: [],

      events: [],
      focus: "",

      coursePreview: "",
      coursePreviews: ["", "Calender", "Structure"],
      coursePreviewStrucutre: []
    };
  },

  watch: {
    checkboxes(newV) {
      if (newV.length > 1) {
        this.checkboxes = [newV[newV.length - 1]];
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
        this.checkboxes = [];
      }
    },
    coursePreview(newV) {
      if (newV == "Calender") {
        this.setEvents();
      } else if (newV == "Structure") {
        this.prepareCourseStructure();
      }
    },
    "getOccurrence.courses"(newV) {
      if (newV == null) {
        this.coursePreview = null;
      }
    }
  },

  created() {
    this.setItems();
  },

  computed: {
    ...mapGetters("main", ["getOccurrence"]),
    ...mapGetters("style", ["getIcon"])
  },

  methods: {
    ...mapMutations("main", [
      "editableInput",
    ]),
    ...mapActions("main", [
      "fetchCollectionTypes",
      "fetchCollectionType"
    ]),
    prepareCourseStructure() {
      let course = this.getOccurrence.courses;

      const currentDate = new Date();
      const startDate = new Date(this.getOccurrence.startDate);

      let newCourse = {};
      newCourse.id = course.id;
      newCourse.name = course.name;
      newCourse.menuId = 1;
      newCourse.contentType = "course";
      newCourse.children = [];

      let count = 2;

      for (let j = 0; j < course.modules.length; j++) {
        let module = course.modules[j];
        let newModule = {};
        newModule.id = module.id;
        newModule.name = "M" + j + " " + module.name;
        newModule.contentType = "module";
        newModule.menuId = count;
        count++;
        newModule.afterWeek = true;
        newModule.afterPercDone = null;
        newModule.children = [];
        if (
          module.condition &&
          (module.condition.type != null ||
            module.condition.afterPercDone != null ||
            module.condition.afterWeek != null)
        ) {
          newModule.condition = module.condition;
          if (module.condition.afterWeek) {
            let limit = new Date(startDate.getTime());
            limit = new Date(
              limit.setDate(limit.getDate() + module.condition.afterWeek * 7)
            );
            if (currentDate <= limit) {
              newModule.afterWeek = false;
            }
          }
          if (module.condition.afterPercDone) {
            newModule.afterPercDone = module.condition.afterPercDone;
          }
        }

        for (let k = 0; k < module.lessons.length; k++) {
          let lesson = module.lessons[k];
          let newLesson = {};
          newLesson.id = lesson.id;
          newLesson.name = "L" + k + " " + lesson.name;
          newLesson.contentType = "lesson";
          newLesson.menuId = count;
          count++;
          newLesson.afterWeek = true;
          newLesson.afterPercDone = null;
          newLesson.children = [];
          newLesson.children.push({
            name: "Expositives",
            menuId: count,
            children: [],
            afterWeek: newLesson.afterWeek
          });
          count++;
          newLesson.children.push({
            name: "Evaluatives",
            menuId: count,
            children: [],
            afterWeek: newLesson.afterWeek
          });
          count++;

          if (!newModule.afterWeek) {
            newLesson.afterWeek = false;
            newLesson.children[0].afterWeek = false;
            newLesson.children[1].afterWeek = false;
            if (lesson.condition) {
              newLesson.condition = lesson.condition;
            }
          } else if (
            lesson.condition &&
            (lesson.condition.type != null ||
              lesson.condition.afterPercDone != null ||
              lesson.condition.afterWeek != null)
          ) {
            newLesson.condition = lesson.condition;
            if (lesson.condition.afterWeek) {
              let limit = new Date(startDate.getTime());
              limit = new Date(
                limit.setDate(limit.getDate() + lesson.condition.afterWeek * 7)
              );
              if (currentDate <= limit) {
                newLesson.afterWeek = false;
                newLesson.children[0].afterWeek = false;
                newLesson.children[1].afterWeek = false;
              }
            }
            if (lesson.condition.afterPercDone) {
              newLesson.afterPercDone = lesson.condition.afterPercDone;
            }
          }

          lesson.expositives.data.forEach(expositive => {
            let newExpositive = {};
            newExpositive.id = expositive.id;
            newExpositive.name = expositive.attributes.name;
            newExpositive.contentType = "expositive";
            newExpositive.menuId = count;
            count++;
            newExpositive.afterWeek = newLesson.afterWeek;
            newLesson.children[0].children.push(newExpositive);
          });
          lesson.evaluatives.data.forEach(evaluative => {
            let newEvaluative = {};
            newEvaluative.id = evaluative.id;
            newEvaluative.name = evaluative.attributes.name;
            newEvaluative.contentType = "evaluative";
            newEvaluative.menuId = count;
            count++;
            newEvaluative.afterWeek = newLesson.afterWeek;
            newLesson.children[1].children.push(newEvaluative);
          });

          newModule.children.push(newLesson);
        }
        newCourse.children.push(newModule);
      }
      console.log(newCourse);
      this.coursePreviewStrucutre = newCourse.children;
    },
    setItems() {
      this.occurrence = this.getOccurrence;
      this.events = [];
      if ("startDate" in this.occurrence) {
        this.startDate = new Date(this.occurrence.startDate);
        this.startDate = this.startDate.toISOString().substring(0, 10);
      }
      if ("endDate" in this.occurrence) {
        this.endDate = new Date(this.occurrence.endDate);
        this.endDate = this.endDate.toISOString().substring(0, 10);
      }
    },
    setEvents() {
      this.events = [];
      let newEvents = { modules: [], lessons: [] };

      this.events.push({
        id: 0,
        name: "Start",
        start: this.occurrence.startDate,
        end: this.occurrence.startDate,
        color: "green",
        type: "startEnd"
      });
      this.events.push({
        id: 1,
        name: "End",
        start: this.occurrence.endDate,
        end: this.occurrence.endDate,
        color: "red",
        type: "startEnd"
      });

      let moduleCount = 1;
      let lessonCount = 1;

      this.occurrence.courses.modules.forEach(module => {
        if (module.condition != null && module.condition.afterWeek != null) {
          let start = new Date(this.startDate);
          start.setDate(start.getDate() + module.condition.afterWeek * 7);
          newEvents.modules.push({
            id: module.id,
            abrev: "M" + moduleCount,
            name: module.name,
            start: start,
            end: start,
            color: "indigo",
            type: "module"
          });
          ++moduleCount;
        } else {
          newEvents.modules.push({
            id: module.id,
            abrev: "M" + moduleCount,
            name: module.name,
            start: new Date(this.startDate),
            end: new Date(this.startDate),
            color: "indigo",
            type: "module"
          });
          ++moduleCount;
        }

        module.lessons.forEach(lesson => {
          let start = null;
          if (module.condition != null && module.condition.afterWeek != null) {
            start = new Date(this.startDate);
            start.setDate(start.getDate() + module.condition.afterWeek * 7);
          } else {
            start = new Date(this.startDate);
            start.setDate(start.getDate() + module.condition.afterWeek * 7);
          }

          if (lesson.condition != null && lesson.condition.afterWeek != null) {
            let start2 = new Date(this.startDate);
            start2.setDate(start2.getDate() + lesson.condition.afterWeek * 7);
            if (start > start2) {
              newEvents.lessons.push({
                id: lesson.id,
                abrev: "L" + lessonCount,
                name: lesson.name,
                start: start,
                end: start,
                color: "indigo lighten-3",
                type: "lesson"
              });
              ++lessonCount;
            } else {
              newEvents.lessons.push({
                id: lesson.id,
                abrev: "L" + lessonCount,
                name: lesson.name,
                start: start2,
                end: start2,
                color: "indigo lighten-3",
                type: "lesson"
              });
              ++lessonCount;
            }
          } else {
            newEvents.lessons.push({
              id: lesson.id,
              abrev: "L" + lessonCount,
              name: lesson.name,
              start: start,
              end: start,
              color: "indigo lighten-3",
              type: "lesson"
            });
            ++lessonCount;
          }
        });
      });

      newEvents.modules.forEach(event => {
        this.events.push(event);
      });
      newEvents.lessons.forEach(event => {
        this.events.push(event);
      });
    },
    async chooseCourse() {
      try {
        this.courses = await this.fetchCollectionTypes({
          collectionType: "courses"
        });
        this.dialog = true;
      } catch (error) {
        console.log(error);
        bus.$emit("errorSnackbar", "Something went wrong fetching the Courses");
      }
    },
    async addCourses() {
      let c = this.courses.find(c => c.id == this.checkboxes[0]);
      let course = await this.fetchCollectionType([c.id, "courses"]);
      course = course.attributes;
      course.id = c.id;
      const obj = {
        id: this.occurrence.id,
        value: course,
        field: "courses",
        type: "occurrence"
      };
      this.editableInput(obj);
      this.dialog = false;
      this.setItems();
    },
    removeCourse() {
      const obj = {
        id: this.getOccurrence.id,
        value: null,
        field: "courses",
        type: "occurrence"
      };
      this.editableInput(obj);
      this.setItems();
    },
    getEventColor(event) {
      return event.color;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
  }
};
</script>


<style scoped>

.badge:hover {
  cursor: pointer;
}
.badge {
  z-index: 5;
  position: absolute;
  right: 12px;
  top: 12px;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
#courseInfo>>>.v-badge--tile .v-badge__badge {
  border-radius: 4px;
  color: black;
}
#courseInfo>>>.v-badge__badge .v-icon {
  font-size: 16px;
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
  width: 100%;
}
#calender>>>.v-calendar-weekly__day {
  display: flex;
  flex-wrap: wrap;
}
#calender>>>.v-event {
  width: fit-content !important;
}
</style>