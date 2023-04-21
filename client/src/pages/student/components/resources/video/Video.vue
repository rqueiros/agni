<template>
  <div id="player">
    <v-card class="mx-auto" max-width="100%" outlined>
      <!--STATEMENT-->
      <!--PLAYER-->
      <Player :resource="resource" @onDuration="setDuration" ref="player" />
      <!--
            <v-rating
              v-model="rating"
              background-color="orange lighten-3"
              color="orange"
            ></v-rating>-->

      <!--FEEDBACK-->
      <!--
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
            </v-expansion-panels>-->
    </v-card>
  </div>
</template>

<script>
import Player from "@/pages/student/components/resources/video/Player.vue";

export default {
  name: "Video",
  components: {
    Player
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
