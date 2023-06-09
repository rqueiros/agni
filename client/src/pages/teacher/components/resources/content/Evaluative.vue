<template>
  <div id="evaluative" class="ma-n3">
    <NewEval v-if="getEvaluative.contentType==''"/>
    <Code :resource="resource" :single="true" v-if="getEvaluative.contentType=='code'"/>
    <Quiz :resource="resource" :single="true" v-if="getEvaluative.contentType=='quiz'"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import Code from '../../../../../components/course/components/resources/code/Code.vue';
import Quiz from '../../../../../components/course/components/resources/quiz/Quiz.vue';
import NewEval from '../../../../../components/course/components/resources/newEval/NewEval.vue';

export default {
  name: "Evaluative",

  components:{
    Code,
    Quiz,
    NewEval,
  },

  data(){
    return {
      resource:{}
    };
  },

  created(){
    this.setItems()
  },

  computed:{
    ...mapGetters("main", ["getEvaluative"]),
  },

  methods:{
    setItems(){
      this.resource = this.getEvaluative;
    },
  }

}
</script>

<style scoped></style>