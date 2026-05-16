<template>
  <v-container fluid>
    <v-row v-if="isStudent">
      <v-col :cols="getSMsmallerCols">
        <Account class="mb-3" />
        <Progress :resource="resource" :type="type" />
      </v-col>
      <v-col cols="5" class="pl-0" :class="getSMsmallerNone">
        <Gamification class="p-gamification" />
        <Suggestions class="p-gamification" style="margin-top: 15px" />
      </v-col>
    </v-row>
    <!--<v-row :class="getSMsmallerBlock" v-if="isStudent">
      <v-col cols="12" class="pt-0">
        <Gamification />
      </v-col>
    </v-row>-->

    <v-row v-if="isTeacher">
      <v-col cols="12">
        <Gamification />
        <ConceptGraph v-if="courseID" :graph="graph" :courseID="courseID" style="margin-top: 15px" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

import Gamification from "./components/Gamification.vue";
import Account from "./components/Account.vue";
import Progress from "./components/Progress.vue";
import Suggestions from "./components/Suggestions.vue";
import ConceptGraph from "./components/ConceptGraph.vue";

export default {
  props: {
    resource: {
      type: Number,
      default: () => null,
    },
    type: {
      type: String,
      default: () => null,
    },
    graph: {
      type: Object,
      default: () => null,
    },
    courseID: {
      type: Number,
      default: () => null,
    }
  },
  components: {
    Gamification,
    Account,
    Progress,
    Suggestions,
    ConceptGraph,
  },
  computed: {
    ...mapGetters("request", ["isStudent", "isTeacher"]),
    ...mapGetters("style", [
      "getSMsmallerBlock",
      "getSMsmallerNone",
      "getSMsmallerCols",
    ]),
  },
};
</script>
