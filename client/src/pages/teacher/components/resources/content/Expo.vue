<template>
  <div id="expo">
    <v-container fluid class="pa-0" style="max-width: 1200px;">
      <v-row class="mb-1 mt-0">
        <v-col :cols="isSMsmaller ? 12 : 7" class="py-0">
          <v-card class="shadow" color="boxes">
            <Expositives
              :isExpositive="true"
              :resource="{ expositives: [expositive] }"
              ref="expositives"
            />
          </v-card>
        </v-col>
        <v-col :class="isSMsmaller ? 'd-none' : 'd-block'" class="py-0 pl-0">
          <Timeline
            :isExpositive="true"
            :resource="expositive"
            @onMilestone="setMilestone"
          />
        </v-col>
      </v-row>
      <v-row :class="isSMsmaller ? 'd-block' : 'd-none'">
        <v-col cols="12">
          <Timeline
            :isExpositive="true"
            :resource="expositive"
            @onMilestone="setMilestone"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import Expositives from "../../../../../components/course/components/resources/lesson/Expositives.vue";
import Timeline from "../../../../../components/course/components/resources/lesson/Timeline.vue";

export default {
  name: "Expo",

  components: {
    Expositives,
    Timeline
  },

  props: {
    expositive: {
      type: Object,
      default: () => null
    }
  },

  computed: {
    ...mapGetters("style", ["isSMsmaller"])
  },

  methods: {
    setMilestone(index) {
      this.$refs.expositives.setMilestone(index);
    }
  }
};
</script>

<style scoped></style>
