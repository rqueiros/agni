<template>
  <div id="resource" :class="isSMsmaller ? 'pt-sm-10 pl-sm-0' : 'resource'">
    <component :is="getComponent" :resource="resource"></component>
    <GPT 
      v-if="(resource.contentType == 'lesson') && isAuthor && gpt"
      :resource="resource" 
    />
  </div>
  <!-- resource.contentType=='code' -->
</template>

<script>
import { mapGetters, mapState } from "vuex";

import GPT from "./GPT.vue"

export default {
  name: "Resource",

  components:{
    GPT
  },

  props: {
    resource: {
      type: Object,
      default: () => null
    }
  },

  computed: {
    ...mapState("main", { gpt: state => state.gpt }),
    ...mapGetters("style", ["isSMsmaller"]),
    ...mapGetters("request", ["isAuthor"]),
    getComponent() {
      const componentName =
        this.resource.contentType.charAt(0).toUpperCase() +
        this.resource.contentType.slice(1);
      return () => import(`./${this.resource.contentType}/${componentName}`);
    }
  }
};
</script>

<style scoped>

</style>
