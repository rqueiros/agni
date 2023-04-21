<template>
  <div>
    <v-btn v-if="isTeacher" width="100%" @click="someFunction">
      <v-icon> mdi-plus </v-icon>
      Add Question
    </v-btn>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
//import { toRef } from 'vue';

export default {
  name: "Quizzer",
  props: {
    resource: {
      type: Object,
      default: () => {}
    }
  },
  components: {},
  data() {
    return {
      myAnswers: [],
      e1: 1,
      steps: 0,
      quiz: {},
      selected: []
    };
  },
  created() {
    //this.quiz = this.getQuizByResourceId(this.resource.quizId);
    this.role = this.getRole;
  },

  computed: {
    ...mapGetters(["getLessonByResourceId", "getQuizByResourceId", "getRole"]),
    isStudent() {
      return this.role == "student";
    },
    isTeacher() {
      return this.role == "teacher";
    }
  },

  methods: {
    ...mapMutations([
      "editableInput",
      "addAnswerByQuestionId",
      "addQuestionByQuestionId",
      "changeEvaluativeName"
    ]),
    someFunction() {
      this.addQuestionByQuestionId(1);
    }
  }
};
</script>

<style></style>
