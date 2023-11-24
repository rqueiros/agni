<template>
  <div class="d-flex justify-center">
    <v-card width="100%" class="min_height shadow" color="boxes" style="max-width: 1200px;">
      <Course outlined />
    </v-card>
  </div>
</template>

<script>
import Course from "../../../../../components/course/Course.vue";

export default {
  name: "Cou",
  components: {
    Course
  }
};
</script>

<style></style>
