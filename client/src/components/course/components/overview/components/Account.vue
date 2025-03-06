<template>
  <v-card class="mx-auto mb-2" max-width="100%" outlined>
    <CardHeader
      :title="getUsername.toUpperCase()"
      :subtitle="getUserEmail"
      icon="mdi-card-account-details"
      color="red"
    />
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import CardHeader from "../../CardHeader.vue";

export default {
  components: {
    CardHeader,
  },
  computed: {
    ...mapGetters("request", ["getUsername", "getUserEmail"]),
  },
};
</script>
