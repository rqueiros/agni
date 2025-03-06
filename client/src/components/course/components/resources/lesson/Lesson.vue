<template>
  <div id="lesson">
    <v-container fluid>
      <v-row class="mb-1 mt-0">
        <v-col :cols="isSMsmaller ? 12 : 7" class="py-0">
          <v-card
            outlined
            :style="{
              backgroundColor: $vuetify.theme.currentTheme.studentboxes,
            }"
          >
            <CardHeader
              :icon="getIcon(resource.contentType)"
              color="red"
              lesson
              :resource="resource"
              :editable="isAuthor"
            />

            <v-card-text>
              <div
                v-if="resource.description && (isStudent || isViewer)"
                v-html="resource.description"
              ></div>
              <Editable
                v-if="isAuthor"
                class="caption"
                type="lesson"
                placeholder="Lesson description"
                :value="resource.description"
                :id="resource.id"
                field="description"
                @input="editableInput"
                :required="true"
              />
            </v-card-text>

            <v-divider v-if="resource.expositives.length > 0" />
            <Expositives :resource="resource" ref="expositives" />

            <v-spacer class="mb-2"></v-spacer>

            <Evaluatives :resource="resource" />

            <!--
            <v-expansion-panels v-if="isStudent">
              <v-expansion-panel>
                <v-expansion-panel-header disable-icon-rotate>
                  Questions (0)
                  <template v-slot:actions>
                    <v-icon color="teal"> mdi-comment-multiple </v-icon>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <code>
                    It will be possible to pose questions in future versions
                  </code>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>-->
          </v-card>
        </v-col>
        <v-col
          cols="5"
          class="py-0 pl-0"
          :class="isSMsmaller ? 'd-none' : 'd-block'"
        >
          <Timeline
            :resource="resource.expositives[index]"
            @onMilestone="setMilestone"
          />
        </v-col>
      </v-row>
      <v-row :class="isSMsmaller ? 'd-block' : 'd-none'">
        <v-col cols="12">
          <Timeline
            :resource="resource.expositives[index]"
            @onMilestone="setMilestone"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Expositives from "./Expositives.vue";
import Evaluatives from "./Evaluatives.vue";
import Timeline from "./Timeline.vue";
import CardHeader from "../../CardHeader.vue";
import Editable from "../../../../gerneral/Editable.vue";

import { bus } from "@/main.js";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Lesson",

  components: {
    Expositives,
    Evaluatives,
    Timeline,
    CardHeader,
    Editable,
  },

  props: {
    resource: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      index: 0,
    };
  },

  created() {
    bus.$on("setIndex", (payload) => {
      this.index = payload;
    });
  },

  computed: {
    ...mapGetters("request", [
      "isStudent",
      "isTeacher",
      "isAuthor",
      "isViewer",
    ]),
    ...mapGetters("style", ["isSMsmaller", "getIcon"]),
  },
  methods: {
    ...mapActions("main", ["editableInput"]),
    setMilestone(index) {
      this.$refs.expositives.setMilestone(index);
    },
  },
};
</script>

<style scoped></style>
