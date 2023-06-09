<template>
  <div
    id="resource"
    :class="isSMsmaller ? 'pt-sm-13 pl-sm-0' : 'resource'"
  >
    <component
      :is="getComponent"
      :resource="resource"
      ref="res"
    ></component>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Resource",

  props: {
    resource: {
      type: Object,
      default: () => null
    },
  },

  computed: {
    ...mapGetters("style",["isSMsmaller"]),
    getComponent() {
      if (
        this.resource &&
        this.reosource != null &&
        this.resource.contentType == "code"
      ) {
        this.$refs.res.$destroy();
      }
      const componentName =
        this.resource.contentType.charAt(0).toUpperCase() +
        this.resource.contentType.slice(1);
      return () => import(`./${this.resource.contentType}/${componentName}`);
    },
  },

  methods: {
    testM() {
      this.$refs.res.testM();
      this.$refs.res.$destroy();
    }
  }
};
</script>

<style></style>
