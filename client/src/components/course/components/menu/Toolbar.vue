<template>
  <div>
    <v-toolbar
      absolute
      height="40px"
      width="100vw"
      :color="isStudent ? 'grey lighten-2' : ''"
      elevation="1"
      :class="isSMsmaller ? 'd-block' : 'd-none'"
      rounded="t"
    >
      <v-app-bar-nav-icon
        @click.stop="$emit('toggleDrawer')"
        small
        class="ml-n1"
      />
      <v-spacer />
      <div v-if="isStudent" class="mr-2">
        <v-icon class="mr-2">mdi-school</v-icon>
        learnJS v0.7.7
      </div>
    </v-toolbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "CourseToolbar",
  computed: {
    ...mapGetters("request", ["isStudent"]),
    ...mapGetters("style", ["isSMsmaller"])
  }
};
</script>
