<template>
  <div id="pdf">
    <Player :resource="resource" ref="player" />

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
          <code>It will be possible to pose questions in future
                      versions</code>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>-->
  </div>
</template>

<script>
import Player from "./Player.vue";

export default {
  name: "Pdf",

  components: {
    Player
  },

  props: {
    resource: {
      type: Object,
      default: () => {}
    }
  },

  methods: {
    setMilestone(index) {
      this.$refs.player.pageUrl(index);
    }
  }
};
</script>

<style scoped></style>
