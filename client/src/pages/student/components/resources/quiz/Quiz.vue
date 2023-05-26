<template>
  <div id="quiz">
    <v-container fluid>
      <v-row>
        <v-col :cols="(this.screenSize=='xs' || this.screenSize=='sm') && isStudent ? 12 : 7">
          <v-card class="mx-auto" max-width="100%" outlined>
            <!--STATEMENT-->
            <Header :resource="resource" />
            <!--PLAYER-->

            <Quizzer :resource="resource" :screenSize="screenSize" ref="quizzer" />

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
    },
    screenSize: {
      type: String,
      default: () => ""
    }
  },

  data() {
    return {
    };
  },

  computed: {
    ...mapGetters(["getRole"]),
    getR() {
      return this.resource;
    },
    isStudent() {
      return this.getRole == "student";
    },
    isTeacher() {
      return this.getRole == "teacher" || this.getRole =="author" || this.getRole=="viewer";
    },
    isViewer() {
      return this.getRole == "viewer"
    },
    isAuthor() {
      return this.getRole == "author"
    }
  },
};
</script>

<style></style>
