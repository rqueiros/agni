<template>
  <div>
    <!--{{ getResourceById(resource.strapiId,"evaluative") }}-->
    <v-stepper v-model="e1" v-if="this.resource.questions.length>0" id="stepper">
      <v-stepper-header>
        <template v-for="n in resource.questions.length">
          <v-stepper-step :complete="e1 > n" :step="n" editable :key="n + 'abc'" v-if="isStudent">
          </v-stepper-step>
          <v-stepper-step :step="n" editable :key="n + 'abc'" v-if="isTeacher">
          </v-stepper-step>

          <v-divider v-if="n !== resource.questions.length" :key="n + 'abcd'"></v-divider>
        </template>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content v-for="n in resource.questions.length" :step="n" :key="n + 'sec'">
          <v-btn v-if="isTeacher" style="position: absolute; top:8px; right: 6px; z-index: 1;" icon
            class="course_iconButtonL" @click="delQ(resource.questions[n - 1].strapiId)">
            <v-icon class=""> mdi-delete </v-icon>
          </v-btn>
          <v-card class="mb-3" color="lighten-1" height="100%">
            <v-list-item v-if="isStudent">
              <v-list-item-content>
                <div v-html="n + '. ' + resource.questions[n - 1].question"></div>
                <v-list-item-subtitle>
                  <v-radio-group v-model="myAnswers[n - 1]">
                    <v-radio v-for="(answer, index) in resource.questions[n - 1]
                      .answers" :key="index + 'third'" :label="answer.answer" :value="index"></v-radio>
                  </v-radio-group>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item v-if="isTeacher">
              <v-list-item-content>
                <Editable :type="'question'" style="padding-right: 1em;" :value="resource.questions[n - 1].question"
                  :id="resource.questions[n - 1].strapiId" :field="'question'" @input="editableChange"
                  placeholder="Question" />
                <v-container fluid>
                  <table style="width: 100%">
                    <tr>
                      <td>
                        <span>Correct:</span>
                      </td>
                    </tr>
                    <tr v-for="(answer, index) in getAnswers(n - 1)" :key="index + 'third'">
                      <td>
                        <v-checkbox v-model="selected" :value="index" :label="''" class="checkboxes">
                        </v-checkbox>
                      </td>
                      <td>
                        <Editable :type="'answer'" :value="answer.answer" :id="answer.strapiId" :field="'answer'"
                          @input="editableChange" placeholder="Answer" />
                      </td>
                      <td>
                        <v-btn icon @click="del(answer.strapiId)" class="course_iconButtonS">
                          <v-icon class="course_IconS"> mdi-delete </v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </table>

                  <v-btn v-if="isTeacher" class="course_button course_text" width="100%" @click="
                    addAnswerByQuestionId(resource.questions[n - 1].strapiId)
                  ">
                    <v-icon> mdi-plus </v-icon>
                    Add Answer
                  </v-btn>
                </v-container>
              </v-list-item-content>
            </v-list-item>
          </v-card>

          <v-btn v-show="n != steps" color="success" @click="nextStep(n)" class="mr-2" v-if="isStudent">
            Continue
          </v-btn>

          <v-btn v-show="n == steps" color="error" @click="finish" v-if="isStudent">
            Finish
          </v-btn>

          <v-btn v-if="isTeacher" class="course_button course_text" width="100%"
            @click="addQuestionByQuestionId(resource.questions[n - 1].strapiId)">
            <v-icon> mdi-plus </v-icon>
            Add Question
          </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <v-btn v-if="isTeacher && resource.questions.length==0" class="course_button course_text" width="100%"
      @click="addQuestionByResourceId(resource.strapiId)">
      <v-icon> mdi-plus </v-icon>
      Add Question
    </v-btn>
  </div>
</template>

<script>
import { bus } from "@/main.js";
import { mapActions, mapGetters, mapMutations } from "vuex";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import Editable from "../../../../../components/Editable.vue";

export default {
  name: "Quizzer",
  props: {
    resource: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    Editable
  },
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
    if ("questions" in this.resource) {
      this.steps = this.resource.questions.length;
    } else {
      this.steps = 1;
    }
  },
  watch: {
    steps(val) {
      if (this.e1 > val) {
        this.e1 = val;
      }
    },
    e1(newE1) {
      this.selected = this.resource.questions[newE1 - 1].correctAnswer
    },
    selected(newS) {
      const obj = {
        value: newS,
        type: "question",
        field: "correctAnswer",
        id: this.resource.questions[this.e1 - 1].strapiId
      }
      this.editableInput(obj);
    }
  },

  computed: {
    ...mapGetters([
      "getLessonByResourceId",
      "getQuizByResourceId",
      "getRole",
      "getResourceById"
    ]),
    isStudent() {
      return this.role == "student";
    },
    isTeacher() {
      return this.role == "teacher";
    },
    getSteps() {
      return this.resource.questions.length;
      //return toRef(this.resource.questions, 'length');
    },
    getAnswers() {
      return function (n) {
        return this.resource.questions[n].answers;
      };
    },
    getCorrectAnswers() {
      return this.resource.correctAnswer
    }
  },

  methods: {
    ...mapMutations([
      "editableInput",
      "addAnswerByQuestionId",
      "addQuestionByQuestionId",
      "deleteAnswer",
      "deleteQuestion",
      "editableInput",
      "addQuestionByResourceId"
    ]),
    ...mapActions(["setProgress"]),
    editableChange(obj) {
      this.editableInput(obj);
    },
    del(id) {
      this.deleteAnswer(id)
      this.selected = this.resource.questions[this.e1 - 1].correctAnswer
    },
    delQ(id) {
      this.deleteQuestion(id)
      if (this.e1 > this.resource.questions.length && this.e1 > 1) {
        this.e1 = this.e1 - 1
      }
    },
    nextStep(n) {
      if (n === this.steps) {
        this.e1 = 1;
      } else {
        this.e1 = n + 1;
      }
    },
    async finish() {
      let i = 0,
        cont = 0;
      const wrongQuestions = [];
      this.resource.questions.forEach(question => {
        if (question.correctAnswer == this.myAnswers[i] + 1) {
          cont++;
        } else {
          wrongQuestions.push(i + 1);
        }
        i++;
      });
      const status = (cont / this.resource.questions.length) * 100;
      const ques = this.resource.questions.map(q => {
        return { question: q.id };
      });
      for (let i = 0; i < ques.length; i++) {
        ques[i].answer = this.myAnswers[i] + 1;
      }

      let htmlMsg = `${cont} from ${this.resource.questions.length} (${status}%) answers correct!`;
      if (wrongQuestions.length > 0) {
        htmlMsg += `<br>Questions wrong: ${wrongQuestions}`;
      }

      Swal.fire({
        title: "<strong>QUIZ RESULT</strong>",
        icon: "success",
        html: htmlMsg,
        focusConfirm: false,
        confirmButtonText: "OK"
      });

      await this.setProgress({
        id: this.resource.strapiId,
        data: {
          grade: status,
          answer: [{ __component: "solution.quiz", questions: ques }]
        }
      });

      const lesson = this.getLessonByResourceId(this.resource.strapiId);
      bus.$emit("changeIt", [lesson.strapiId, lesson.contentType]);
    }
  }
};
</script>

<style scoped>

#stepper>>>.v-input--selection-controls{
  margin-top: 0 !important;
  padding-bottom: 0 !important;
}
#stepper>>>.v-messages{
  min-height: 0 !important;
}
.checkboxes>>> .v-icon{
  font-size: 1.2em !important;
}
</style>
