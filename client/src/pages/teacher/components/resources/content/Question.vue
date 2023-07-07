<template>
  <div id="question" ref="ques">
    <Quiz :resource="{questions:[getQuestion]}" :isQuestion="true" class="ma-n3" v-if="getQuestion"/>
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
    };
  },

  created(){
    this.updateParentDivWidth = this.updateParentDivWidth.bind(this);
    this.setItems()
  },

  mounted() {
    this.setScreenSize(this.$refs.ques.offsetWidth);
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
    ...mapGetters("main", ["getQuestion"]),
  },

  methods:{
    ...mapMutations("style",["setScreenSize"]),
    ...mapMutations("main", ["addAnswerByQuestionId", "editableInput", "deleteAnswer"]),
    setItems(){
      this.resource = this.getQuestion;
    },
    updateParentDivWidth() {
      clearTimeout(this.updateParentDivWidthTimeout);
      this.updateParentDivWidthTimeout = setTimeout(() => {
        this.setScreenSize(this.$refs.ques.offsetWidth);
      }, 200);
    }
  },
}
</script>

<style scoped></style>