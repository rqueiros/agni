<template>
  <div id="quiz">
    <v-container fluid>
      <v-row class="mb-1 mt-0">
        <v-col class="py-0" :cols="isSMsmaller ? 12 : 7">
          <v-card outlined>

            <Header :resource="resource" v-if="!isEvaluative && !isQuestion"/>

            <Quizzer
              :resource="resource"
              ref="quizzer"
              :isEvaluative="isEvaluative"
              :isQuestion="isQuestion"
            />

            <!--
            <v-rating
              v-model="rating"
              background-color="orange lighten-3"
              color="orange"
            ></v-rating>-->

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
        <v-col
          cols="5"
          class="py-0 pl-0"
          :class="isSMsmaller ? 'd-none' : 'd-block'"
        >
          <Img :question="getQuestion"/>
        </v-col>
      </v-row>
      <v-row :class="isSMsmaller ? 'd-block' : 'd-none'">
        <v-col cols="12">
          <Img :question="getQuestion"/>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<script>
import { bus } from "@/main.js";
import { mapGetters } from "vuex";

import Header from "../Header.vue";
import Quizzer from "./Quizzer.vue";
import Img from "./Img.vue";

export default {
  name: "Quiz",

  components: {
    Header,
    Quizzer,
    Img,
  },

  props: {
    resource: {
      type: Object,
      default: () => {}
    },
    isEvaluative:{
      type:Boolean,
      default: () => false
    },
    isQuestion:{
      type:Boolean,
      default: () => false
    }
  },

  data() {
    return {
      index:0,
    };
  },

  created(){
    bus.$on("setIndex", payload => {
      this.index = payload;
    });
  },

  computed: {
    ...mapGetters("main",[
      "isStudent", 
      "isTeacher", 
      "isViewer", 
      "isAuthor"
    ]),
    ...mapGetters("style", [
      "isSMsmaller"
    ]),
    getQuestion(){
      return this.resource.questions[this.index]
    }
  }
};
</script>


<style scoped></style>
