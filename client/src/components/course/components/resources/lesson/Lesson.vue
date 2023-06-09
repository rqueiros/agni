<template>
  <div id="lesson">
    <v-container fluid>
      <v-row class="mb-1 mt-0">
        <v-col :cols="isSMsmaller && isStudent ? 12 : 7" class="py-0">
          <v-card outlined>
            <Header :resource="resource" />

            <v-spacer class="mb-3"></v-spacer>

            <Expositives :resource="resource" ref="expositives" />

            <v-spacer class="mb-6"></v-spacer>

            <Evaluatives :resource="resource" />

            <v-spacer v-if="isStudent" class="mb-6"></v-spacer>

            <v-expansion-panels v-if="isStudent">
              <v-expansion-panel>
                <v-expansion-panel-header disable-icon-rotate>
                  Questions (0)
                  <template v-slot:actions>
                    <v-icon color="teal"> mdi-comment-multiple </v-icon>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <code>
                    It will be possible to pose questions in future versions
                  </code>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>
        </v-col>
        <v-col
          cols="5"
          class="py-0 pl-0"
          :class="isSMsmaller && isStudent ? 'd-none' : 'd-block'"
        >
          <Timeline
            :resource="resource.expositives[index]"
            @onMilestone="setMilestone"
          />
        </v-col>
      </v-row>
      <v-row :class="isSMsmaller && isStudent ? 'd-block' : 'd-none'">
        <v-col cols="12">
          <Timeline
            :resource="resource.expositives[index]"
            @onMilestone="setMilestone"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Header from "../Header.vue";
import Expositives from "./Expositives.vue";
import Evaluatives from "./Evaluatives.vue";
import Timeline from "./Timeline.vue";

import { bus } from "@/main.js";
import { mapGetters } from "vuex";

export default {
  name: "Lesson",

  components: {
    Header,
    Expositives,
    Evaluatives,
    Timeline
  },

  props: {
    resource: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      index: 0
    };
  },

  created() {
    bus.$on("setIndex", payload => {
      this.index = payload;
    });
  },

  computed: {
    ...mapGetters("main",[
      "isStudent",
      "isTeacher",
      "isAuthor",
      "isViewer",
    ]),
    ...mapGetters("style",[
      "isSMsmaller"
    ])
  },
  methods: {
    testM() {
      console.log("testM-lesson");
    },
    setMilestone(index) {
      this.$refs.expositives.setMilestone(index);
    }
  }
};
</script>

<style scoped></style>
