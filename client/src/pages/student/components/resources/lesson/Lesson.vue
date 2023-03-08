<template>
  <div id="lesson">
    <v-container fluid>
      <v-row>
        <v-col cols="7">
          <v-card class="mx-auto" max-width="100%" outlined>
            <Header :resource="resource" />

            <Expositives :resource="resource" />

            <Evaluatives :resource="resource" />

            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header disable-icon-rotate>
                  Questions (0)
                  <template v-slot:actions>
                    <v-icon color="teal">
                      mdi-comment-multiple
                    </v-icon>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <code
                    >It will be possible to pose questions in future
                    versions</code
                  >
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Header from "@/pages/student/components/resources/Header.vue";
import Expositives from "@/pages/student/components/resources/lesson/Expositives.vue";
import Evaluatives from "@/pages/student/components/resources/lesson/Evaluatives.vue";

export default {
  name: "Lesson",
  components: {
    Header,
    Expositives,
    Evaluatives
  },
  props: {
    resource: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  }
};
</script>
