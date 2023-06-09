<template>
  <div id="question" class="ma-n3">
    <Quiz :resource="{questions:[getQuestion]}" :onlyQuestion="true"/>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

import Quiz from '../../../../../components/course/components/resources/quiz/Quiz.vue';

export default {
  name:"Question",

  components:{
    Quiz,
  },

  data(){
    return{
      resource:{},
      selected:[],
    };
  },

  created(){
    this.setItems()
    this.selected = this.resource.correctAnswer.map(v=>v-1)
  },

  watch: {
    selected(newS) {
      const obj = {
        value: newS.map(v => v+1),
        type: "question",
        field: "correctAnswer",
        id: this.resource.id
      };
      this.editableInput(obj);
    },
  },

  computed:{
    ...mapGetters("main", ["getQuestion"]),
  },

  methods:{
    ...mapMutations("main", ["addAnswerByQuestionId", "editableInput", "deleteAnswer"]),
    setItems(){
      this.resource = this.getQuestion;
    },
    del(id) {
      this.deleteAnswer(id);
      this.selected = this.resource.correctAnswer.map(v=>v-1);
    },
  },
}
</script>

<style scoped></style>