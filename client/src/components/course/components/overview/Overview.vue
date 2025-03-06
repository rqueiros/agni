<template>
  <v-container fluid>
    <v-row v-if="isStudent">
      <v-col :cols="getSMsmallerCols">
        <Account class="mb-3" />
        <Progress :resource="resource" :type="type" />
      </v-col>
      <v-col cols="5" class="pl-0" :class="getSMsmallerNone">
        <Gamification class="p-gamification" />
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

import Gamification from "./components/Gamification.vue";
import Account from "./components/Account.vue";
import Progress from "./components/Progress.vue";

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
  },
  components: {
    Gamification,
    Account,
    Progress,
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
