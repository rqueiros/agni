<template>
  <div id="resource">
    <component :is="getComponent" :resource="resource"></component>
  </div>
</template>

<script>
export default {
  name: "Resource",
  props: {
    resource: {
      type: Object,
      default: () => null,
    },
  },
  computed: {
    getComponent() {
      const componentName = this.resource.type.charAt(0).toUpperCase() + this.resource.type.slice(1) ;
      return () => import(`./${this.resource.type}/${componentName}`);
    },
  },
};
</script>

<style></style>
