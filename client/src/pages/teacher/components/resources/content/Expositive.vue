<template>
  <div id="expositive" ref="expo">
    <Expo :expositive="getExpositive" v-if="getExpositive"/>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

import Expo from './Expo.vue';

export default {
  name: "Expositive",

  components: {
    Expo
  },

  data() {
    return {
      expositive: {},
    };
  },

  created() {
    this.updateParentDivWidth = this.updateParentDivWidth.bind(this);
  },

  mounted() {
    this.setScreenSize(this.$refs.expo.offsetWidth);
    window.addEventListener("resize", this.updateParentDivWidth);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.updateParentDivWidth);
  },

  beforeDestroy(){
    clearTimeout(this.updateParentDivWidthTimeout);
    window.removeEventListener("resize", this.updateParentDivWidth);
  },

  computed: {
    ...mapGetters("main", ["getExpositive"]),
  },

  methods: {
    ...mapMutations("style",["setScreenSize"]),
    updateParentDivWidth() {
      clearTimeout(this.updateParentDivWidthTimeout);
      this.updateParentDivWidthTimeout = setTimeout(() => {
        this.setScreenSize(this.$refs.expo.offsetWidth);
      }, 200);
    }
  },

}
</script>

<style scoped></style>