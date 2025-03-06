<template>
  <div id="quizzer" class="pb-3">
    <div v-if="!isQuestion" class="pb-2 px-4" :class="getSubtitleClass">
      <Editable
        v-if="isAuthor"
        type="evaluative"
        :value="resource.name"
        :id="resource.id"
        placeholder="Evaluative name"
        field="name"
        @input="editableInput"
        onclick="event.stopPropagation()"
        :required="true"
      />
      <span v-if="isViewer || isStudent">
        {{ resource.name }}
      </span>
    </div>

    <v-stepper
      v-model="question"
      v-if="this.resource.questions.length > 0"
      flat
    >
      <v-stepper-header v-if="!isQuestion">
        <template v-for="n in resource.questions.length">
          <v-stepper-step
            color="error"
            :complete="question > n && isStudent"
            :step="n"
            editable
            :key="n"
            v-if="true"
          />
          <v-divider v-if="n !== resource.questions.length" :key="n + 'b'" />
        </template>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content
          class="py-2"
          v-for="n in resource.questions.length"
          :step="n"
          :key="n + 'c'"
        >
          <v-list>
            <v-list-item class="px-0">
              <v-list-item-content>
                <div
                  v-if="isStudent || isViewer"
                  v-html="resource.questions[n - 1].question"
                ></div>

                <vue-editor
                  v-if="isAuthor"
                  v-model="resource.questions[n - 1].question"
                  style="border-radius: 8px;"
                  :editor-toolbar="customToolbar"
                  placeholder="Question"
                  @text-change="(d, oldDelta) => questionChange(d, oldDelta)"
                  :style="{
                    backgroundColor: $vuetify.theme.currentTheme.editable,
                  }"
                />
              </v-list-item-content>

              <v-list-item-avatar
                v-if="isAuthor & !isQuestion"
                class="ml-0 d-flex align-self-start justify-end"
              >
                <v-btn icon>
                  <v-icon @click="deleteQue(resource.questions[n - 1].id)">
                    mdi-delete
                  </v-icon>
                </v-btn>
              </v-list-item-avatar>
            </v-list-item>

            <v-list-item>
              <v-list-item-content class="pa-0">
                <v-simple-table>
                  <tr v-if="isTeacher">
                    <td class="caption">
                      <span>Correct:</span>
                    </td>
                  </tr>
                  <tr
                    v-for="(answer, index) in getAnswers(n - 1)"
                    :key="index + 'third'"
                  >
                    <td class="py-1 pl-2" width="50">
                      <v-checkbox
                        color="error"
                        class="mt-0"
                        v-model="selected"
                        :value="index"
                        hide-details
                        :disabled="isViewer"
                      />
                    </td>
                    <td class="body-2">
                      <span v-if="isStudent || isViewer">
                        {{ answer.answer }}
                      </span>
                      <span v-if="isAuthor" class="caption">
                        <Editable
                          type="answer"
                          :value="answer.answer"
                          :id="answer.id"
                          field="answer"
                          @input="editableInput"
                          placeholder="Answer"
                          :required="true"
                        />
                      </span>
                    </td>
                    <td v-if="isAuthor" class="pl-2">
                      <v-btn icon @click="deleteAns(answer.id)" x-small>
                        <v-icon>
                          mdi-delete
                        </v-icon>
                      </v-btn>
                    </td>
                  </tr>
                  <tr v-if="isAuthor">
                    <td :colspan="3" class="px-2 pt-2">
                      <v-btn
                        class="ma-1"
                        width="100%"
                        @click="
                          addAnswerByQuestionID(resource.questions[n - 1].id)
                        "
                        small
                        color="button"
                      >
                        <v-icon> mdi-plus </v-icon>
                        Add Answer
                      </v-btn>
                    </td>
                  </tr>
                </v-simple-table>
              </v-list-item-content>
            </v-list-item>

            <v-list-item v-if="isStudent">
              <v-btn
                v-show="n != steps"
                color="success"
                @click="nextStep(n)"
                small
              >
                Continue
              </v-btn>
              <v-btn v-show="n == steps" color="error" @click="finish" small>
                Finish
              </v-btn>
            </v-list-item>
          </v-list>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <div class="px-6">
      <v-menu offset-y v-if="isAuthor && !isQuestion">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            width="100%"
            class="mb-2"
            small
            color="button"
          >
            <v-icon> mdi-plus </v-icon>
            Add Question
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item
            class="text-center"
            v-for="(item, index) in addQuestionMenu"
            :key="index"
            @click="addQuestion(item.title, resource.id)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <SelectDialog
      v-if="isAuthor"
      :dialog="dialog"
      :type="'questions'"
      :already="resource.questions.map((e) => e.id)"
      @addExistingquestions="addExistingQue"
      @closeSelectDialog="dialog = false"
    />
  </div>
</template>

<script>
import { bus } from "@/main.js";
import { mapActions, mapGetters, mapMutations } from "vuex";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

import Editable from "../../../../gerneral/Editable.vue";
import SelectDialog from "../../../../gerneral/SelectDialog.vue";

import { VueEditor } from "vue2-editor";

export default {
  name: "Quizzer",

  props: {
    resource: {
      type: Object,
      default: () => {},
    },
    isEvaluative: {
      type: Boolean,
      default: () => false,
    },
    isQuestion: {
      type: Boolean,
      default: () => false,
    },
  },

  components: {
    Editable,
    SelectDialog,
    VueEditor,
  },

  data() {
    return {
      valid: true,

      studentAnswers: {},
      question: 1,
      steps: 0,
      quiz: {},
      selected: [],

      dialog: false,

      addQuestionMenu: [{ title: "NEW" }, { title: "SELECT" }],

      customToolbar: [
        ["bold", "italic", "underline"],
        [{ align: "" }, { align: "center" }],
        ["code-block"],
        [{ list: "bullet" }],
        [{ color: [] }, { background: [] }],
      ],
    };
  },

  created() {
    //this.quiz = this.getQuizByResourceID(this.resource.quizId);
    if (this.isTeacher) {
      this.selected = this.resource.questions[
        this.question - 1
      ].correctAnswer.map((v) => v - 1);
    }
    if ("questions" in this.resource) {
      this.steps = this.resource.questions.length;
    } else {
      this.steps = 1;
    }
  },

  watch: {
    steps(val) {
      if (this.question > val) {
        this.question = val;
      }
    },
    question(newE1) {
      if (this.isTeacher) {
        this.selected = this.resource.questions[newE1 - 1].correctAnswer.map(
          (v) => v - 1
        );
      } else if (this.isStudent) {
        this.selected =
          newE1 - 1 in this.studentAnswers
            ? this.studentAnswers[newE1 - 1]
            : [];
      }
      bus.$emit("setIndex", newE1 - 1);
    },
    selected(newS) {
      if (this.isTeacher) {
        let corrA = this.resource.questions[
          this.question - 1
        ].correctAnswer.map((v) => v - 1);
        if (
          !(newS.length == corrA.length && newS.every((v, i) => v == corrA[i]))
        ) {
          const obj = {
            value: newS.map((v) => v + 1),
            type: "question",
            field: "correctAnswer",
            id: this.resource.questions[this.question - 1].id,
          };
          this.editableInput(obj);
        }
      } else if (this.isStudent) {
        this.studentAnswers[this.question - 1] = newS;
      }
    },
  },

  computed: {
    ...mapGetters("main", ["getLessonByResourceID", "getQuizByResourceID"]),
    ...mapGetters("request", [
      "isStudent",
      "isTeacher",
      "isViewer",
      "isAuthor",
    ]),
    ...mapGetters("style", ["getSubtitleClass"]),
    getSteps() {
      return this.resource.questions.length;
    },
    getAnswers() {
      return function(n) {
        return this.resource.questions[n].answers;
      };
    },
  },

  methods: {
    ...mapActions("main", [
      "editableInput",
      "addAnswerByQuestionID",
      "deleteAnswerByID",
      "deleteQuestionByID",
      "addQuestionByResourceID",
    ]),
    ...mapMutations("main", ["setChanged"]),
    ...mapActions("request", ["setProgress", "addExistingQuestions"]),
    async addExistingQue(ids) {
      await this.addExistingQuestions([this.resource.id, ids]);
      this.dialog = false;
    },
    deleteAns(id) {
      this.deleteAnswerByID(id);
      this.selected = this.resource.questions[
        this.question - 1
      ].correctAnswer.map((v) => v - 1);
    },
    questionChange(delta, oldDelta) {
      if (oldDelta.ops[0].insert != "\n") {
        this.setChanged(true);
      }
    },
    deleteQue(id) {
      this.deleteQuestionByID(id);
      if (this.question > this.resource.questions.length && this.question > 1) {
        this.question = this.question - 1;
      }
    },
    nextStep(n) {
      if (n === this.steps) {
        this.question = 1;
      } else {
        this.question = n + 1;
      }
    },
    async finish() {
      let i = 0;
      let cont = 0;
      const wrongQuestions = [];
      this.resource.questions.forEach((question) => {
        let studentAnswer =
          i in this.studentAnswers
            ? this.studentAnswers[i].map((v) => v + 1)
            : [];
        if (studentAnswer.length != question.correctAnswer.length) {
          wrongQuestions.push(i);
          i++;
          return;
        }
        for (let j = 0; j < question.correctAnswer.length; j++) {
          if (question.correctAnswer[j] != studentAnswer[j]) {
            wrongQuestions.push(i);
            i++;
            return;
          }
        }
        cont++;
        i++;
      });

      const status = (cont / this.resource.questions.length) * 100;
      const ques = this.resource.questions.map((q) => {
        return { question: q.id };
      });
      for (let i = 0; i < ques.length; i++) {
        ques[i].answer = JSON.stringify(
          this.studentAnswers[i].map((v) => v + 1)
        );
      }
      console.log(ques);

      let htmlMsg = `${cont} from ${this.resource.questions.length} (${status}%) answers correct!`;
      if (wrongQuestions.length > 0) {
        htmlMsg += `<br>Questions wrong: ${wrongQuestions.map((v) => v + 1)}`;
      }

      await Swal.fire({
        title: "<strong>QUIZ RESULT</strong>",
        icon: "success",
        html: htmlMsg,
        focusConfirm: false,
        confirmButtonText: "OK",
      });

      const lesson = this.getLessonByResourceID(this.resource.id); //TODO problem with contentType

      bus.$emit("changeIt", [lesson.id, lesson.contentType]);

      await this.setProgress({
        id: this.resource.id,
        data: {
          grade: status,
          answer: [{ __component: "solution.quiz", questions: ques }],
        },
      });
    },
    addQuestion(type, id) {
      if (type == "NEW") {
        this.addQuestionByResourceID(id);
      } else if (type == "SELECT") {
        this.dialog = true;
      }
    },
  },
};
</script>

<style scoped>
/* Text editor */
#quizzer >>> .ql-toolbar.ql-snow {
  border: none;
  border-bottom: 1px solid #ccc;
}
#quizzer >>> .ql-container.ql-snow {
  border: none;
}
#quizzer >>> .ql-editor {
  font-size: 0.75rem;
  min-height: 100px;
}
#quizzer >>> .quillWrapper .ql-snow.ql-toolbar .ql-formats {
  margin-bottom: 2px;
}
#quizzer >>> .quillWrapper .ql-snow.ql-toolbar {
  padding-top: 4px;
  padding-bottom: 4px;
}
</style>
