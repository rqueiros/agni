<template>
  <div id="evaluative" class="ma-n3" ref="eval">
    <NewEval v-if="getEvaluative.contentType==''"/>
    <Code :resource="resource" :isEvaluative="true" v-if="getEvaluative.contentType=='code'"/>
    <Quiz :resource="resource" :isEvaluative="true" v-if="getEvaluative.contentType=='quiz'"/>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

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

  mounted() {
    this.setScreenSize(this.$refs.eval.offsetWidth);
    window.addEventListener("resize", this.updateParentDivWidth);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.updateParentDivWidth);
  },

  beforeDestroy(){
    clearTimeout(this.updateParentDivWidthTimeout);
    window.removeEventListener("resize", this.updateParentDivWidth);
  },

  computed:{
    ...mapGetters("main", ["getEvaluative"]),
  },

  methods:{
    ...mapMutations("style",["setScreenSize"]),
    setItems(){
      this.resource = this.getEvaluative;
    },
    updateParentDivWidth() {
      clearTimeout(this.updateParentDivWidthTimeout);
      this.updateParentDivWidthTimeout = setTimeout(() => {
        this.setScreenSize(this.$refs.eval.offsetWidth);
      }, 200);
    }
  }

}
</script>

<style scoped></style>