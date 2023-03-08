<template>
  <div id="player">
    <vytia-player
      width="100%"
      :yturl="resource.url"
      ref="yt"
      :playerVars="playerVars"
      @ready="onPlayerReady"
      @playing="onPlayerPlay"
    ></vytia-player>
  </div>
</template>

<script>
export default {
  name: "Player",
  props: {
    resource: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // Video
      playerVars: {
        autoplay: 1
      },
      duration: 0
    };
  },
  methods: {
    onPlayerReady() {},
    onPlayerPlay() {
      this.$emit("onDuration", this.$refs.yt.player.getDuration());
    },
    go(seconds) {
      console.log("go->" + seconds);
      this.$refs.yt.player.seekTo(seconds);
    }
  }
};
</script>

<style></style>
