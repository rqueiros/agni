<template>
  <div id="resource" class="resource">
    <component :is="getComponent" :resource="resource"></component>
  </div>
</template>

<script>
export default {
  name: "Resource",
  props: {
    resource: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    getComponent() {
      const componentName =
        this.resource.contentType.charAt(0).toUpperCase() +
        this.resource.contentType.slice(1);
      return () => import(`./${this.resource.contentType}/${componentName}`);
    }
  }
};
</script>

<style></style>
