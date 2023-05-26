<template>
  <div id="resource" :class="(screenSize == 'sm' || screenSize=='xs') ? 'pt-sm-13 pl-sm-0' : 'resource'">
    <component :is="getComponent" :resource="resource" :screenSize="screenSize" ref="res"></component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "Resource",
  props: {
    resource: {
      type: Object,
      default: () => null
    },
    screenSize: {
      type: String,
      default: () => ""
    }
  },
  computed: {
    ...mapGetters(["getRole"]),
    getComponent() {
      if (this.resource && this.reosource!= null && this.resource.contentType=="code"){
        this.$refs.res.$destroy()
      }
      const componentName =
        this.resource.contentType.charAt(0).toUpperCase() +
        this.resource.contentType.slice(1);
      return () => import(`./${this.resource.contentType}/${componentName}`);
    },
    isStudent() {
      return this.getRole == "student";
    },
    isTeacher() {
      return this.getRole == "teacher" || this.getRole == "author" || this.getRole == "viewer";
    },
    isAuthor() {
      return this.getRole == "author";
    },
    isViewer() {
      return this.getRole == "viewer";
    }
  },
  methods: {
    testM(){
      this.$refs.res.testM()
      this.$refs.res.$destroy()
    },
  }
};
</script>

<style></style>
