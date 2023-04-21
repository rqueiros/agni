<template>
  <div id="quiz">
    <v-container fluid>
      <v-row>
        <v-col :cols="this.screenSmall ? 12 : 7">
          <v-card class="mx-auto" max-width="100%" outlined>
            <!--STATEMENT-->
            <Header :resource="resource" />
            <!--PLAYER-->

            <Quizzer :resource="resource" ref="quizzer" />

            <!--
            <v-rating
              v-model="rating"
              background-color="orange lighten-3"
              color="orange"
            ></v-rating>-->

            <!--FEEDBACK-->
            <v-expansion-panels v-if="isStudent">
              <v-expansion-panel>
                <v-expansion-panel-header disable-icon-rotate>
                  Questions (0)
                  <template v-slot:actions>
                    <v-icon color="teal"> mdi-comment-multiple </v-icon>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <code
                    >It will be possible to pose questions in future
                    versions</code
                  >
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>
        </v-col>
        <v-col cols="5">
          <v-row>
            <v-col cols="12"> </v-col>
          </v-row>
          <v-row>
            <v-col cols="12"> </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Header from "@/pages/student/components/resources/Header.vue";
import Quizzer from "@/pages/student/components/resources/quiz/Quizzer.vue";
export default {
  name: "Quiz",
  components: {
    Header,
    Quizzer
  },
  props: {
    resource: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      screenWidth: 0
    };
  },
  created() {
    this.role = this.getRole;
  },
  computed: {
    ...mapGetters(["getRole"]),
    getR() {
      return this.resource;
    },
    screenSmall() {
      return this.screenWidth <= 768;
    },
    isStudent() {
      return this.role == "student";
    },
    isTeacher() {
      return this.role == "teacher";
    }
  },
  methods: {
    handleResize() {
      this.screenWidth = window.innerWidth;
    }
  },
  mounted() {
    this.screenWidth = window.innerWidth;
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
};
</script>

<style></style>
