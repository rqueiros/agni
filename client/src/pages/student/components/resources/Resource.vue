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
      default: () => null
    }
  },
  computed: {
    getComponent() {
      const componentName =
        this.resource.contentType.charAt(0).toUpperCase() +
        this.resource.contentType.slice(1);
      return () => import(`./${this.resource.contentType}/${componentName}`);
      /*
      if (componentName!="Code"){
        return () => import(`./${this.resource.type}/${componentName}`)
      }
      return null*/
    }
  }
};
</script>

<style></style>
