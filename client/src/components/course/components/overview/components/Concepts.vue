<template>
  <v-card :outlined="isLesson" :style="{ backgroundColor: $vuetify.theme.currentTheme.studentboxes }" :class="!isLesson ? 'shadow' : ''">

    <CardHeader
      title="CONCEPTS"
      subtitle="Material Concepts"
      icon="mdi-sitemap"
      color="blue"
    />

    <div class="px-2 mb-2">
      <v-btn
        small
        color="primary"
        class="ml-2"
        @click="openDialog"
      >
        Add Concepts
      </v-btn>
    </div>

    <v-divider class="my-3"></v-divider>

    <div v-if="concepts && concepts.length" style="padding: 8px">
      <v-chip
        v-for="(tag, index) in concepts"
        :key="index"
        class="ma-1"
        color="blue lighten-4"
        text-color="blue darken-3"
        small
        close
        @click:close="removeTag(tag, index)"
      >
        {{ tag.label }}
      </v-chip>
    </div>

    <div v-else class="grey--text text--darken-1 text-caption" style="padding: 8px">
      No concepts to show.
    </div>

    <SelectConceptDialog
      v-model="dialog"
      :concepts="allConcepts"
      :selected="(concepts || []).map(c => c.id)"
      @save="saveConcepts"
    />

  </v-card>
</template>

<script>
import CardHeader from "../../CardHeader.vue";
import SelectConceptDialog from "@/components/gerneral/SelectConceptDialog.vue";
import { mapGetters, mapActions } from "vuex";
import { bus } from "@/main.js";


export default {
  components: {
    CardHeader,
    SelectConceptDialog
  },

  props: {
    resource: {
      type: Object,
      default: () => {}
    },
    isLesson: {
      type: Boolean,
      default: () => false
    },
    type: {
      type: String,
      default: () => "expositives"
    }
  },

  computed: {
    ...mapGetters("style", ["getMesssage"]),
  },

  data() {
    return {
      concepts: null,
      allConcepts: [],
      dialog: false
    }
  },

  async created() {
    await this.getConcepts();
  },

  methods: {
    ...mapActions("request", ["fetchMaterialConcepts", "updateConcepts", "fetchConcepts"]),

    async openDialog() {
      try {
        const concepts = await this.fetchConcepts();
        this.allConcepts = concepts.concepts;
        this.dialog = true;
      } catch {
        bus.$emit(
          "errorSnackbar",
          this.getMesssage(["general", "course", "error"])
        );
      }
    },

    async saveConcepts(selectedIds) {
      try {
        const updated = this.allConcepts.filter(c =>
          selectedIds.includes(c.id)
        );

        await this.updateConcepts([
          this.resource.id,
          updated,
          this.type
        ]);

        this.concepts = updated;

        bus.$emit(
          "successSnackbar",
          this.getMesssage(["general", "save", "success"])
        );
      } catch {
        bus.$emit(
          "errorSnackbar",
          this.getMesssage(["general", "course", "error"])
        );
      }
    },

    async removeTag(tag, index) {
      try {
        this.concepts.splice(index, 1);
        await this.updateConcepts([this.resource.id, this.concepts, this.type]);
        bus.$emit(
          "successSnackbar",
          this.getMesssage(["general", "save", "success"])
        );
      } catch (err) {
        bus.$emit(
          "errorSnackbar",
          this.getMesssage(["general", "course", "error"])
        );
      }
    },

    async getConcepts() {
      try {
        const concepts = await this.fetchMaterialConcepts([this.resource.id, this.type]);
        this.concepts = concepts.concepts;
      } catch (err) {
        this.concepts = null;
      }
    }
  }
}
</script>

<style scoped>

</style>