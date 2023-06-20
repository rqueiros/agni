<template>
  <div
    id="resource"
    :class="isSMsmaller ? 'pt-sm-10 pl-sm-0' : 'resource'"
  >
    <component
      :is="getComponent"
      :resource="resource"
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
      const componentName =
        this.resource.contentType.charAt(0).toUpperCase() +
        this.resource.contentType.slice(1);
      return () => import(`./${this.resource.contentType}/${componentName}`);
    },
  },
};
</script>


<style scoped>
.resource {
  padding: 0 0 0 25% !important;
}
</style>
