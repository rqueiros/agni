<template>
  <div id="evaluative" ref="eval">
    <div style="max-width: 1200px;" class="ma-auto">
      <NewEval
        :isEvaluative="true"
        v-if="getEvaluative && getEvaluative.contentType == ''"
        class="ma-n3"
      />
      <Code
        :resource="getEvaluative"
        :isEvaluative="true"
        v-if="getEvaluative && getEvaluative.contentType == 'code'"
        class="ma-n3"
      />
      <Quiz
        :resource="getEvaluative"
        :isEvaluative="true"
        v-if="getEvaluative && getEvaluative.contentType == 'quiz'"
        class="ma-n3"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

import Code from "../../../../../components/course/components/resources/code/Code.vue";
import Quiz from "../../../../../components/course/components/resources/quiz/Quiz.vue";
import NewEval from "../../../../../components/course/components/resources/newEval/NewEval.vue";

export default {
  name: "Evaluative",

  components: {
    Code,
    Quiz,
    NewEval
  },

  data() {
    return {
      resource: {}
    };
  },

  created() {
    this.updateParentDivWidth = this.updateParentDivWidth.bind(this);
  },

  mounted() {
    this.setScreenSize(this.$refs.eval.offsetWidth);
    window.addEventListener("resize", this.updateParentDivWidth);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.updateParentDivWidth);
  },

  beforeDestroy() {
    clearTimeout(this.updateParentDivWidthTimeout);
    window.removeEventListener("resize", this.updateParentDivWidth);
  },

  computed: {
    ...mapGetters("main", ["getEvaluative"])
  },

  methods: {
    ...mapMutations("style", ["setScreenSize"]),
    updateParentDivWidth() {
      clearTimeout(this.updateParentDivWidthTimeout);
      this.updateParentDivWidthTimeout = setTimeout(() => {
        this.setScreenSize(this.$refs.eval.offsetWidth);
      }, 200);
    }
  }
};
</script>

<style scoped></style>
