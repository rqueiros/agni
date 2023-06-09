<template>
  <component :is="getComponent"></component>
</template>

<script>
export default {
  name: "Resource",
  props: {
    resource: {
      type: String,
      default: () => ""
    }
  },
  computed: {
    getComponent() {
      const component = this.resource.split(",");
      return () => import(`./${component[0]}/${component[1]}`);
    }
  }
};
</script>

<style></style>
