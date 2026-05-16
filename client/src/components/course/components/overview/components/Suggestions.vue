<template>
  <v-card
    class="mx-auto"
    :style="{ backgroundColor: $vuetify.theme.currentTheme.studentboxes }"
    outlined
  >
    <CardHeader
      title="SUGGESTIONS"
      subtitle="Lessons that work on concepts with low mastery"
      icon="mdi-format-list-bulleted"
      color="blue"
    />

    <v-list class="pa-0">
      <v-list-item-group>
        <template v-for="(item, index) in lessons">
          <v-divider :key="index" />
          <v-list-item v-if="true" :key="index" @click="openLesson(item)">
            <v-list-item-icon class="d-flex my-3 mr-6">
              <v-icon>mdi-circle-medium</v-icon>
            </v-list-item-icon>
            <v-list-item-content style="white-space: nowrap; text-overflow:ellipsis" 
                class="overflow-hidden text-subtitle-2 font-weight-regular">{{ item.lesson.lesson.name }}</v-list-item-content>
          </v-list-item>
        </template>
      </v-list-item-group>
    </v-list>
    
  </v-card>
</template>

<script>
import CardHeader from '../../CardHeader.vue';
import { mapActions } from "vuex";
import { bus } from "@/main.js";

export default {
  name: "Suggestions",

  props: {
   
  },
  components: {
    CardHeader,
  },


  data() {
    return {
      lessons: []
    }
  },

  async created() {
   this.fetchContent();
  },

  mounted() {
    
  },

  watch: {
    
  },

  methods: {
    ...mapActions("request", ["fetchRecommendations"]),
    async openLesson(item) {
      bus.$emit("changeIt", [item.lesson.lesson.id, "lesson"]);
    },
    async fetchContent() {
      try {
        this.lessons = await this.fetchRecommendations();
      } catch (error) {
        // deal with error
      }
      
    }
  },

  computed: {
  }
}
</script>

<style scoped>

</style>