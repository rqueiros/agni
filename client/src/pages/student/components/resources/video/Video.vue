<template>
  <div id="player">
    <v-container fluid>
      <v-row>
        <v-col cols="7">
          <v-card class="mx-auto" max-width="100%" outlined>
            <!--STATEMENT-->
            <Header :resource="resource" />
            <!--PLAYER-->
            <Player
              :resource="resource"
              @onDuration="setDuration"
              ref="player"
            />
            <v-rating
              v-model="rating"
              background-color="orange lighten-3"
              color="orange"
            ></v-rating>

            <!--FEEDBACK-->
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
        <v-col cols="5">
          <v-row>
            <v-col cols="12">
              <Timeline
                :resource="resource"
                @onMilestone="setMilestone"
                ref="timeline"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12"> </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Header from "@/pages/student/components/resources/Header.vue";
import Player from "@/pages/student/components/resources/video/Player.vue";
import Timeline from "@/pages/student/components/resources/Timeline.vue";

export default {
  name: "Video",
  components: {
    Header,
    Player,
    Timeline
  },
  props: {
    resource: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      playerVars: {
        autoplay: 1
      },
      duration: 0,
      rating: ""
    };
  },
  methods: {
    setDuration(seconds) {
      this.duration = seconds;
      this.$refs.timeline.setDuration(this.duration);
    },
    convertSecondsToMinutes(seconds) {
      if (seconds < 60) {
        return `${seconds}s`;
      } else {
        return `${Math.trunc(seconds / 60)}m ${Math.trunc(seconds % 60)}s`;
      }
    },
    setMilestone(seconds) {
      console.log("video->" + seconds);
      this.$refs.player.go(seconds);
    }
  }
};
</script>

<style></style>
