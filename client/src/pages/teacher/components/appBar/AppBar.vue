<template>
  <div id="header">

    <AppBarHomeVue v-if="resource.includes('Home')" :title="getTitle" :description="getDescription"/>

    <AppBarCourse v-if="resource.includes('Course') || resource.includes('Expositive') || resource.includes('Evaluative') || resource.includes('Question')" :title="getTitle" :description="getDescription"/>

    <AppBarContent v-if="resource.includes('Content')" :title="getTitle" :description="getDescription"/>

    <AppBarStudentDashboard v-if="resource.includes('StudentDashboard')" :title="getTitle" :description="getDescription"/>

    <AppBarOccurrence v-if="resource.includes('Occurrence') || (resource.includes('Student') && !resource.includes('StudentDashboard'))" :title="getTitle" :description="getDescription"/>

    <!--
    <v-row>
      <v-col cols="7">
        <div class="text-h5 text-left">
          {{ getTitle }}
        </div>
        <div class="text-body-2 text-left">
          {{ getDescription }}
        </div>
      </v-col>
      <v-col cols="5" class="d-flex flex-row-reverse">
        <Buttons :resource="resource"/>
      </v-col>
    </v-row>-->
  </div>
</template>

<script>
import AppBarContent from "./appBars/AppBarContent.vue";
import AppBarCourse from "./appBars/AppBarCourse.vue";
import AppBarStudentDashboard from "./appBars/AppBarStudentDashboard.vue";
import AppBarOccurrence from "./appBars/AppBarOccurrence.vue";
import AppBarHomeVue from "./appBars/AppBarHome.vue";

export default {
  name: "Header",

  props: {
    resource: {
      type: String,
      default: () => null
    }
  },

  components:{
    AppBarContent,
    AppBarCourse,
    AppBarStudentDashboard,
    AppBarOccurrence,
    AppBarHomeVue,
  },

  data() {
    return {};
  },

  computed: {
    getTitle() {
      if (this.resource.includes("StudentDashboard")) {
        return "OCCURRENCES";
      } else if (this.resource.includes("Course")) {
        return "COURSE";
      }  else if (this.resource.includes("Expositive")) {
        return "EXPOSITIVE";
      } else if (this.resource.includes("Evaluative")) {
        return "EVALUATIVE";
      } else if (this.resource.includes("Question")) {
        return "QUESTION";
      } else if (this.resource.includes("content")) {
        return "CONTENT";
      } else if (this.resource.includes("Occurrence")) {
        return "OCCURRENCE";
      } else if (this.resource.includes("Student")) {
        return "STUDENT";
      } else if (this.resource.includes("Home")) {
        return "WELCOME";
      } else if (this.resource.includes("account")) {
        return "Account";
      } else {
        return "Content Managing";
      }
    },
    getDescription() {
      if (this.resource.includes("StudentDashboard")) {
        return "Create, edit or view your current, draft/past and past course sessions";
      } else if (this.resource.includes("Course")) {
        return "Create, edit or view courses";
      } else if (this.resource.includes("content")) {
        return "Create and manage courses, expositives (pdf,.. content), evaluative (progEx, Quiz) and questions";
      } else if (this.resource.includes("Occurrence")) {
        return "Create edit or view this course session";
      } else {
        return "Create and manage a course, expositives (pdf,.. content), evaluative (progEx, Quiz) and questions";
      }
    }
  },

  methods: {}
};
</script>

<style scoped>
#header >>> .v-toolbar__content,
.v-toolbar__extension {
  padding: 0 !important;
}
</style>
