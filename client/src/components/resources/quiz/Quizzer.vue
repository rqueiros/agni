<template>
  <v-stepper v-model="e1">
    <v-stepper-header>
      <template v-for="n in steps">
        <v-stepper-step
          :key="`${n}-step`"
          :complete="e1 > n"
          :step="n"
          editable
        >        </v-stepper-step>

        <v-divider v-if="n !== steps" :key="n"></v-divider>
      </template>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content v-for="n in steps" :key="`${n}-content`" :step="n">
        <v-card class="mb-3" color="lighten-1" height="100%">
          <v-list-item>
            <v-list-item-content>
              <div v-html="n + '. ' + quiz.questions[n - 1].question"
              ></div>
              <v-list-item-subtitle>
                <v-radio-group v-model="myAnswers[n-1]">
                  <v-radio
                    v-for="(answer,index) in quiz.questions[n - 1].answers"
                    :key="answer"
                    :label="answer"
                    :value="index"
                  ></v-radio>
                </v-radio-group>
              </v-list-item-subtitle>
            </v-list-item-content>

          </v-list-item>
        </v-card>

        <v-btn v-show="n != steps" color="success" @click="nextStep(n)" class="mr-2">
          Continue
        </v-btn>

        <v-btn v-show="n == steps" color="error" @click="finish">
          Finish
        </v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import { bus } from '@/main.js'
import { mapGetters, mapMutations } from "vuex";
import Swal from "sweetalert2";
import 'sweetalert2/src/sweetalert2.scss'

export default {
  name: "Quizzer",
  props: {
    resource: Object,
  },
  data() {
    return {
      myAnswers:[],
      e1: 1,
      steps: 0,
      quiz: {},
    };
  },
  created() {
    this.quiz = this.getQuizByResourceId(this.resource.quizId);
    this.steps = this.quiz.questions.length;
  },

  watch: {
    steps(val) {
      if (this.e1 > val) {
        this.e1 = val;
      }
    },
  },

  methods: {
    ...mapMutations(["setProgress"]),
    nextStep(n) {
      if (n === this.steps) {
        this.e1 = 1;
      } else {
        this.e1 = n + 1;
      }
    },
    finish() {
      let i = 0, cont = 0
      const wrongQuestions = []
      this.quiz.questions.forEach(question => {
        if(question.correctAnswer == this.myAnswers[i] + 1) {
          cont++
        } else {
          wrongQuestions.push(i+1)
        }
        i++
      });
      const status = (cont / this.quiz.questions.length) * 100
      this.setProgress({ id: this.resource.id, code: '', status: status });

      let htmlMsg = `${cont} from ${this.quiz.questions.length} (${status}%) answers correct!`
      if(wrongQuestions.length > 0) {
        htmlMsg +=`<br>Questions wrong: ${wrongQuestions}`
      }
      
      Swal.fire({
        title: "<strong>QUIZ RESULT</strong>",
        icon: "success",
        html: htmlMsg,
        focusConfirm: false,
        confirmButtonText: 'OK',        
      });

       bus.$emit('changeIt', this.getSheetByResourceId(this.resource.id).id);
    
    }
  },
  computed: {
    ...mapGetters(["getSheetByResourceId",  "getQuizByResourceId"]),
  },
};
</script>

<style></style>
