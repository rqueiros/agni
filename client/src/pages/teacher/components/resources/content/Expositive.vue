<template>
  <div id="expositive">
    <v-container fluid class="pa-0">
      <v-row class="mb-1 mt-0">
        <v-col cols="7" class="py-0">
          <v-card outlined>
            <Expositives :single="true" :resource="{ expositives: [expositive] }" ref="expositives" />
          </v-card>
        </v-col>
        <v-col cols="5" class="py-0 pl-0">
          <Timeline :resource="expositive" @onMilestone="setMilestone" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Expositives from '../../../../../components/course/components/resources/lesson/Expositives.vue';
import Timeline from '../../../../../components/course/components/resources/lesson/Timeline.vue';


export default {
  name: "Expositive",

  components: {
    Expositives,
    Timeline
  },

  data() {
    return {
      expositive: {},
    };
  },

  created() {
    this.setItems()
  },

  computed: {
    ...mapGetters("main", ["getExpositive"])
  },

  methods: {
    setItems() {
      this.expositive = this.getExpositive
    },
    setMilestone(index) {
      this.$refs.expositives.setMilestone(index);
    }
  },

}
</script>

<style scoped></style>