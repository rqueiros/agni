<template>
  <div id="lesson">
    <v-container fluid>
      <v-row class= "mb-1 mt-0">
        <v-col :cols="(this.screenSize=='xs' || this.screenSize=='sm') && isStudent ? 12 : 7" class="py-0">
          <v-card max-width="100%" outlined height="100%"> <!--TODO resolve double border on bottom-->
            <Header :resource="resource" :screenSize="screenSize"/>

            <v-spacer class="mb-3"></v-spacer>

            <Expositives :resource="resource" :screenSize="screenSize" ref="expositives"/>

            <v-spacer class="mb-6"></v-spacer>

            <Evaluatives :resource="resource" :screenSize="screenSize"/>

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
        <v-col cols="5" class="py-0 pl-0" :class="(screenSize=='xs' || screenSize=='sm') && isStudent ? 'd-none' : 'd-block'"> 
          <Timeline :resource="resource.expositives[index]" :screenSize="screenSize" @onMilestone="setMilestone" ref="timeline"/>
        </v-col>
      </v-row>
      <v-row :class="(screenSize=='xs' || screenSize=='sm') && isStudent ? 'd-block' : 'd-none'">
        <v-col cols="12">
          <Timeline :resource="resource.expositives[index]" :screenSize="screenSize" @onMilestone="setMilestone" ref="timeline" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Header from "@/pages/student/components/resources/Header.vue";
import Expositives from "@/pages/student/components/resources/lesson/Expositives.vue";
import Evaluatives from "@/pages/student/components/resources/lesson/Evaluatives.vue";
import Timeline from "@/pages/student/components/resources/Timeline.vue";

import { bus } from "@/main.js";
import { mapGetters } from "vuex";

export default {
  name: "Lesson",

  components: {
    Header,
    Expositives,
    Evaluatives,
    Timeline,
  },

  props: {
    resource: {
      type: Object,
      default: () => { }
    },
    screenSize: {
      type: String,
      default: () => ""
    }
  },

  data() {
    return {
      index: 0,
    };
  },

  created(){
    bus.$on("setIndex", payload => {
      this.index = payload
    });
  },

  computed: {
    ...mapGetters(["getRole"]),
    isStudent() {
      return this.getRole == "student";
    },
    isTeacher() {
      return this.getRole == "teacher" || this.getRole =="author" || this.getRole=="viewer";
    }
  },
  methods: {
    testM(){
      console.log("lesson")
    },
    setMilestone(index) {
      this.$refs.expositives.setMilestone(index);
    },
  }
};
</script>

<style scoped>
</style>
