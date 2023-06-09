<template>
  <div id="player">
    <vue-player v-if="resource.file.data.attributes.url.startsWith('/uploads')" :src="'http://localhost:1337/uploads/Porto_Oporto_in_Timelapse_97d6a9951d.mp4'" ref="vid"></vue-player>
    <vytia-player v-else
      width="100%"
      :yturl="getURL"
      ref="yt"
      :playerVars="playerVars"
      @ready="onPlayerReady"
      @playing="onPlayerPlay"
    ></vytia-player>
  </div>
</template>

<script>
import Vue from "vue";

import vuePlayer  from  '@algoz098/vue-player'
Vue.component(vuePlayer)

import { mapGetters } from 'vuex';

export default {
  name: "Player",

  components:{
    vuePlayer,
  },

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
      duration: 0,
    };
  },

  computed:{
    ...mapGetters("main",["getDomain"]),
    getURL(){
      if (this.resource.file.data.attributes.url.startsWith("https://youtube")){
        return this.resource.file.data.attributes.url
      } else {
        return this.getDomain + this.resource.file.data.attributes.url
      }
    }
  },

  methods: {
    onPlayerReady() {},
    onPlayerPlay() {
      this.$emit("onDuration", this.$refs.yt.player.getDuration());
    },
    go(seconds) {
      if (this.resource.file.data.attributes.url.startsWith("/uploads")){
        this.$refs.vid.seek(seconds);
      } else {
        this.$refs.yt.player.seekTo(seconds);
      }
    }
  }
};
</script>

<style></style>
