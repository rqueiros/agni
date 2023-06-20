<template>
  <div id="player">
    <Player :resource="resource" ref="player" />
    <!--  @onDuration="setDuration" 
    <v-rating
      v-model="rating"
      background-color="orange lighten-3"
      color="orange"
    ></v-rating>-->

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
  </div>
</template>

<script>
import Player from "./Player.vue";

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
      /*
      playerVars: {
        autoplay: 1
      },
      duration: 0,*/
    };
  },
  methods: {
    /*setDuration(seconds) {
      this.duration = seconds;
      this.$refs.timeline.setDuration(this.duration);
    },*/
    convertSecondsToMinutes(seconds) {
      if (seconds < 60) {
        return `${seconds}s`;
      } else {
        return `${Math.trunc(seconds / 60)}m ${Math.trunc(seconds % 60)}s`;
      }
    },
    setMilestone(seconds) {
      this.$refs.player.go(seconds);
    }
  }
};
</script>

<style></style>
