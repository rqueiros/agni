<template>
  <v-card class="mx-auto d-flex flex-column" :style="{ backgroundColor: $vuetify.theme.currentTheme.studentboxes }" style="padding-bottom: 12px" outlined>

    <CardHeader
      title="HINT"
      subtitle="Get help from AI"
      icon="mdi-help"
      color="blue"
    />

    <div class="graph-toolbar d-flex align-center justify-end px-4 pt-2" style="margin-bottom: 6px">
      <v-btn small color="primary" class="ml-2" @click="getHint" :disabled="loading">
        <template v-if="!loading">
          Get a hint
        </template>
        <template v-else>
          <v-progress-circular
            indeterminate
            size="18"
            width="2"
            color="white"
          />
        </template>
      </v-btn>
    </div>

    <div v-if="!loading">{{ hint }}</div>

  </v-card>
</template>

<script>
import CardHeader from "../../CardHeader.vue";
import { mapActions, mapState } from "vuex";
import { bus } from "@/main.js";

export default {
  components: {
    CardHeader,
  },

  props: {
    description: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true,
    }
  },

  data() {
    return {
      hint: "",
      loading: false
    }
  },

  computed: {
    ...mapState("main", { courses: (state) => state.courses })
  },

  methods: {
    ...mapActions("request", ["fetchHint"]),

    async getHint() {
      try {
        this.loading = true;
        this.hint = "";

        const hint = await this.fetchHint([this.description, this.code, this.courses?.[0]?.id]);
        this.hint = hint.hint.hint;
      } catch (err) {
        bus.$emit("errorSnackbar", "Something went wrong generating the hint.");
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>

</style>