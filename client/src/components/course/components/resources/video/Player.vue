<template>
  <div id="player">
    <v-badge
      tile
      class="badge"
      v-if="isAuthor"
      overlap
      color="#f5f5f5"
      @click.native="deleteVideo"
      icon="mdi-close"
    >
    </v-badge>
    <vue-player
      v-if="resource.file.data.attributes.url.startsWith('/uploads')"
      :src="getURL"
      ref="vid"
    />
    <vytia-player
      v-else
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
import { mapGetters, mapMutations } from "vuex";

import vuePlayer from "@algoz098/vue-player";

Vue.component(vuePlayer);

export default {
  name: "Player",

  components: {
    vuePlayer
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
      }
      //duration: 0,
    };
  },

  computed: {
    ...mapGetters("main", ["getDomain", "isAuthor"]),
    getURL() {
      if (
        this.resource.file.data.attributes.url.startsWith("https://youtube")
      ) {
        return this.resource.file.data.attributes.url;
      } else {
        return this.getDomain + this.resource.file.data.attributes.url;
      }
    }
  },

  methods: {
    ...mapMutations("main", ["setExpositiveField"]),
    /*
    onPlayerReady() {},
    onPlayerPlay() {
      this.$emit("onDuration", this.$refs.yt.player.getDuration());
    },*/
    go(seconds) {
      if (this.resource.file.data.attributes.url.startsWith("/uploads")) {
        this.$refs.vid.seek(seconds);
      } else {
        this.$refs.yt.player.seekTo(seconds);
      }
    },
    deleteVideo() {
      this.setExpositiveField([this.resource.id, "file", { data: null }]);
      this.setExpositiveField([this.resource.id, "type", null]);
    }
  }
};
</script>

<style scoped>
/* Badge styles */
.badge:hover {
  cursor: pointer;
}
.badge {
  z-index: 5;
  position: absolute;
  top: 12px;
  right: 12px;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
#player >>> .v-badge--tile .v-badge__badge {
  border-radius: 4px;
  color: black;
}
#player >>> .v-badge__badge .v-icon {
  font-size: 16px;
}
</style>
