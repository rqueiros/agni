<template>
  <div>
    <!--{{ getResourceById(resource.id,"evaluative") }}-->
    <div v-if="single && !onlyQuestion" class="pa-2 mb-1">
      <Editable :type="'evaluative'" :value="resource.name" :id="resource.id" placeholder="Evaluative name"
        :field="'name'" @input="editableInput" onclick="event.stopPropagation()" />
    </div>

    <v-stepper 
    v-model="e1" 
    v-if="this.resource.questions.length > 0" 
    elevation="0">
      <v-stepper-header v-if="!onlyQuestion">
        <template v-for="n in resource.questions.length">
          <v-stepper-step :complete="e1 > n" :step="n" editable :key="n + 'abc'" v-if="isStudent || isViewer">
          </v-stepper-step>
          <v-stepper-step :step="n" editable :key="n + 'abc'" v-if="isAuthor">
          </v-stepper-step>
          <v-divider v-if="n !== resource.questions.length" :key="n + 'abcd'" />
        </template>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content class="pb-0" 
        v-for="n in resource.questions.length" 
        :step="n" 
        :key="n + 'sec'">
          <v-card>
            <v-list>
              <v-list-item>
                <v-list-item-content class="py-0">
                  <div  
                  v-if="isStudent || isViewer"
                  v-html="n + '. ' + resource.questions[n - 1].question"></div>

                  <Editable 
                  v-if="isAuthor" 
                  :type="'question'" 
                  :value="resource.questions[n - 1].question"
                  :id="resource.questions[n - 1].id" 
                  :field="'question'" 
                  @input="editableInput" 
                  placeholder="Question" />
                </v-list-item-content>
                <v-list-item-avatar v-if="isAuthor">
                  <v-icon @click="deleteQue(resource.questions[n - 1].id)">
                    mdi-delete
                  </v-icon>
                </v-list-item-avatar>
              </v-list-item>

              <v-list-item v-if="isStudent || isViewer">
                <v-list-item-content>
                  <v-list-item-subtitle>
                    <v-radio-group 
                    v-model="myAnswers[n - 1]" 
                    v-if="isStudent">
                      <v-radio 
                      v-for="(answer, index) in resource.questions[n - 1].answers" 
                      :key="index + 'third'" 
                      :label="answer.answer" 
                      :value="index" />
                    </v-radio-group>
                    <div v-if="isViewer">
                      <tr 
                      v-for="(answer, index) in resource.questions[n - 1].answers" 
                      :key="index + 'drd'">
                        <td>
                          <v-icon 
                          v-if="resource.questions[n - 1].correctAnswer == index + 1">
                            mdi-alpha-x
                          </v-icon>
                        </td>
                        <td>{{ answer.answer }}</td>
                      </tr>
                    </div>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item v-if="isAuthor">
                <v-list-item-content class="pt-0">
                  <v-container fluid>
                    <v-simple-table>
                      <tr>
                        <td>
                          <span>Correct:</span>
                        </td>
                      </tr>
                      <tr 
                      v-for="(answer, index) in getAnswers(n - 1)" 
                      :key="index + 'third'">
                        <td>
                          <v-checkbox  
                          class="mt-0 ml-3"
                          v-model="selected" 
                          :value="index" 
                          label=""
                          hide-details />
                        </td>
                        <td>
                          <Editable 
                          :type="'answer'" 
                          :value="answer.answer" 
                          :id="answer.id" 
                          :field="'answer'"
                          @input="editableInput" 
                          placeholder="Answer" />
                        </td>
                        <td>
                          <v-btn 
                          icon 
                          @click="deleteAns(answer.id)">
                            <v-icon> mdi-delete </v-icon>
                          </v-btn>
                        </td>
                      </tr>
                    </v-simple-table>

                    <v-btn 
                    class="mt-2"
                    v-if="isAuthor" 
                    width="100%" 
                    @click="addAnswerByQuestionId(resource.questions[n - 1].id)">
                      <v-icon> mdi-plus </v-icon>
                      Add Answer
                    </v-btn>
                  </v-container>
                </v-list-item-content>
              </v-list-item>
          </v-list>
          </v-card>

          <v-btn 
          v-show="n != steps" 
          color="success" 
          @click="nextStep(n)" 
          class="mr-2" 
          v-if="isStudent">
            Continue
          </v-btn>
          <v-btn 
          v-show="n == steps" 
          color="error" 
          @click="finish" 
          v-if="isStudent">
            Finish
          </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <v-menu 
    offset-y 
    auto 
    v-if="isAuthor && !onlyQuestion">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" width="100%" class="pa-1 mt-0">
          <v-icon> mdi-plus </v-icon>
          Add Question
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item 
        v-for="(item, index) in addQuestionMenu" 
        :key="index" 
        link
        @click="addQuestion(item.value, resource.id)">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <SelectDialog 
    :dialog="dialog" 
    :type="'questions'" 
    :already="resource.questions.map(e => e.id)"
    @addExistingquestions="addExistingQue" 
    @closeSelectDialog="closeSelectDialog" />

  </div>
</template>

<script>
import { bus } from "@/main.js";
import { mapActions, mapGetters, mapMutations } from "vuex";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

import Editable from "../../../../gerneral/Editable.vue";
import SelectDialog from "../../../../gerneral/SelectDialog.vue";

export default {
  name: "Quizzer",

  props: {
    resource: {
      type: Object,
      default: () => { }
    },
    single: {
      type: Boolean,
      default: () => false
    },
    onlyQuestion: {
      type: Boolean,
      default: () => false
    }
  },

  components: {
    Editable,
    SelectDialog
  },

  data() {
    return {
      myAnswers: [],
      e1: 1,
      steps: 0,
      quiz: {},
      selected: [],

      dialog: false,

      addQuestionMenu: [
        { title: "New Question", value: "new" },
        { title: "Select Question", value: "select" }
      ],
    };
  },

  created() {
    //this.quiz = this.getQuizByResourceId(this.resource.quizId);
    this.selected = this.resource.questions[this.e1 - 1].correctAnswer.map(v => v - 1)
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
      this.selected = this.resource.questions[newE1 - 1].correctAnswer.map(v => v - 1)
      bus.$emit("setIndex", newE1 - 1);
    },
    selected(newS) {
      const obj = {
        value: newS.map(v => v + 1),
        type: "question",
        field: "correctAnswer",
        id: this.resource.questions[this.e1 - 1].id
      };
      this.editableInput(obj);
    },
  },

  computed: {
    ...mapGetters("main", [
      "getLessonByResourceId",
      "getQuizByResourceId",
      "getRole",
      "getResourceById",
      "isStudent",
      "isTeacher",
      "isViewer",
      "isAuthor",
      "getLessonByResourceId"
    ]),
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
      return this.resource.correctAnswer;
    }
  },

  methods: {
    ...mapMutations("main", [
      "editableInput",
      "addAnswerByQuestionId",
      "addQuestionByQuestionId",
      "deleteAnswer",
      "deleteQuestion",
      "addQuestionByResourceId",
    ]),
    ...mapActions("main", ["setProgress", "fetchCollectionTypes", "addExistingQuestions"]),
    async addExistingQue(ids) {
      await this.addExistingQuestions([this.resource.id, ids])
      this.closeSelectDialog()
    },
    closeSelectDialog() {
      this.dialog = false
    },
    deleteAns(id) {
      this.deleteAnswer(id);
      this.selected = this.resource.questions[this.e1 - 1].correctAnswer.map(v => v - 1);
    },
    deleteQue(id) {
      this.deleteQuestion(id);
      if (this.e1 > this.resource.questions.length && this.e1 > 1) {
        this.e1 = this.e1 - 1;
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
        id: this.resource.id,
        data: {
          grade: status,
          answer: [{ __component: "solution.quiz", questions: ques }]
        }
      });

      const lesson = this.getLessonByResourceId(this.resource.id);
      bus.$emit("changeIt", [lesson.id, lesson.contentType]);
    },
    addQuestion(type, id) {
      if (type == "new") {
        this.addQuestionByResourceId(id)
      } else if (type == "select") {
        this.dialog = true;
      }
    }
  }
};
</script>

<style scoped></style>
