<template>
  <div id="pdf">
    <v-card
      class="mx-auto rounded-0"
      max-width="100%"
      outlined
      style="border-left: 0;border-right: 0;border-top: 0;"
    >
      <!--STATEMENT-->
      <!--<Header :resource="resource" />-->
      <!--PLAYER-->
      <Player :resource="resource" ref="player" />

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
            <code>It will be possible to pose questions in future
                        versions</code>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>-->
    </v-card>
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
  data() {
    return {
      screenWidth: 0
    };
  },
  methods: {
    setMilestone(index) {
      this.$refs.player.pageUrl(index);
    },
    handleResize() {
      this.screenWidth = window.innerWidth;
    }
  },
  computed: {
    screenSmall() {
      return this.screenWidth <= 768;
    }
  },
  mounted() {
    this.screenWidth = window.innerWidth;
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
};
</script>

<style></style>
