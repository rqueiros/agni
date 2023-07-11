<template>
  <div id="header">

    <AppBarHomeVue v-if="resource.includes('Home')" :title="getTitle" :description="getDescription"/>

    <AppBarSettings v-if="resource.includes('Settings')" :title="getTitle" :description="getDescription"/>

    <AppBarAccount v-if="resource.includes('Account')" :title="getTitle" :description="getDescription"/>

    <AppBarContent v-if="resource.includes('Course') || resource.includes('Expositive') || resource.includes('Evaluative') || resource.includes('Question')" :title="getTitle" :description="getDescription"/>

    <AppBarContents v-if="resource.includes('Content')" :title="getTitle" :description="getDescription"/>

    <AppBarOccurrences v-if="resource.includes('Occurrences')" :title="getTitle" :description="getDescription"/>

    <AppBarOccurrence v-if="resource.endsWith('Occurrence') || (resource.includes('Student') && !resource.includes('StudentDashboard'))" :title="getTitle" :description="getDescription"/>

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
import AppBarContents from "./appBars/AppBarContents.vue";
import AppBarContent from "./appBars/AppBarContent.vue";
import AppBarOccurrences from "./appBars/AppBarOccurrences.vue";
import AppBarOccurrence from "./appBars/AppBarOccurrence.vue";
import AppBarHomeVue from "./appBars/AppBarHome.vue";
import AppBarAccount from "./appBars/AppBarAccount.vue";
import AppBarSettings from "./appBars/AppBarSettings.vue"

export default {
  name: "Header",

  props: {
    resource: {
      type: String,
      default: () => null
    }
  },

  components:{
    AppBarContents,
    AppBarContent,
    AppBarOccurrences,
    AppBarOccurrence,
    AppBarHomeVue,
    AppBarAccount,
    AppBarSettings
  },

  data() {
    return {};
  },

  computed: {
    getTitle() {
      if (this.resource.includes("Occurrences")) {
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
        return "ACCOUNT";
      } else if (this.resource.includes("settings")) {
        return "SETTINGS";
      } else {
        return "";
      }
    },
    getDescription() {
      if (this.resource.includes("Occurrences")) {
        return "Manage your current, draft and past occurrences";
      } else if (this.resource.includes("Content")) {
        return "Manage courses, expositives (pdf,..), evaluatives (progEx, Quiz) and questions";
      } else if (this.resource.includes("Course")) {
        return "Create, edit or view this course";
      } else if (this.resource.includes("Expositive")) {
        return "Create, edit or view this expositive";
      }  else if (this.resource.includes("Evaluative")) {
        return "Create, edit or view this evaluative";
      }  else if (this.resource.includes("Question")) {
        return "Create, edit or view this question";
      }  else if (this.resource.includes("Occurrence")) {
        return "Create, edit or view this occurrence";
      } else {
        return "";
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
