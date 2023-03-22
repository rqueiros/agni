<template>
  <div id="pdf">
    <v-container fluid>
      <v-row>
        <v-col :cols="this.screenSmall ? 12 : 7">
          <v-card class="mx-auto" max-width="100%" outlined>
            <!--STATEMENT-->
            <Header :resource="resource" />
            <!--PLAYER-->
            <Player :resource="resource" ref="player" />

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
                  <code>It will be possible to pose questions in future
                      versions</code>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>
        </v-col>
        <v-col cols="5">
          <Timeline :resource="resource" @onMilestone="setMilestone" ref="timeline" class="r-timeline"/>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <Timeline :resource="resource" @onMilestone="setMilestone" ref="timeline" class="r-timeline_XS"/>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>



<script>
import Header from "@/pages/student/components/resources/Header.vue";
import Player from "@/pages/student/components/resources/pdf/Player.vue";
import Timeline from "@/pages/student/components/resources/Timeline.vue";

export default {
  name: "Pdf",
  components: {
    Header,
    Player,
    Timeline
  },
  props: {
    resource: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      screenWidth:0
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
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
};
</script>



<style>
.r-timeline{
  display: block;
}
.r-timeline_XS{
  display: none;
}

@media only screen and (max-width: 600px) {
  .r-timeline{
    display: none;
  }
  .r-timeline_XS{
    display: block;
  }
}

</style>
