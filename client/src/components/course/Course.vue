<template>
  <v-sheet class="rounded" color="boxes" height="100%">
    <div id="course" ref="course" class="d-flex h-full">
      <Toolbar @toggleDrawer="toggleDrawer" />
      <NavigationDrawer
        @onResourceClicked="setResource"
        :drawer.sync="drawer"
      />
      <Resource v-if="resource" :resource="resource" class="flex-grow-1" />
      <div v-else class="flex-grow-1">
        <Overview :resource="isResource" :type="type" :graph="conceptGraph" :courseID="courseID" />
      </div>
    </div>
  </v-sheet>
</template>

<script>
import { bus } from "@/main.js";
import { mapGetters, mapMutations, mapState } from "vuex";

import NavigationDrawer from "./components/menu/NavigationDrawer.vue";
import Resource from "./components/resources/Resource.vue";
import Toolbar from "./components/menu/Toolbar.vue";
import Overview from "./components/overview/Overview.vue"

export default {
  components: {
    NavigationDrawer,
    Resource,
    Overview,
    Toolbar,
  },

  data: () => ({
    resource: null,
    isResource: 0,
    type: "",
    drawer: false,
  }),

  created() {
    this.updateParentDivWidth = this.updateParentDivWidth.bind(this);
    bus.$on("changeIt", (payload) => {
      this.setResource(payload[0], payload[1]);
    });
  },

  watch: {
    courses() {
      let type;
      if (
        this.resource &&
        "contentType" in this.resource &&
        (this.resource.contentType == "course" ||
          this.resource.contentType == "module" ||
          this.resource.contentType == "lesson")
      ) {
        type = this.resource.type;
      } else {
        type = "evaluative";
      }
      let id;
      if (this.resource) {
        id = this.resource.id;
      } else {
        id = 0;
      }
      this.setResource(id, type);
    },
  },

  mounted() {
    //this.setScreenSize(this.$refs.course.offsetWidth);
    window.addEventListener("resize", this.updateParentDivWidth);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.updateParentDivWidth);
  },

  beforeDestroy() {
    clearTimeout(this.updateParentDivWidthTimeout);
    window.removeEventListener("resize", this.updateParentDivWidth);
  },

  computed: {
    ...mapState("main", { courses: (state) => state.courses }),
    ...mapGetters("main", ["getResourceByID"]),
    conceptGraph() {
      const graph = this.courses?.[0]?.conceptGraph;
      if (!graph) return null;

      return {
        nodes: graph.concepts.data.map(c => ({
          id: c.id,
          label: c.attributes.label,
        })),
        edges: graph.edges.map(e => ({
          from: e.from.data.id,
          to: e.to.data.id,
        })),
      };
    },
    courseID() {
      const courseID = this.courses?.[0]?.id;
      return courseID;
    }
  },

  methods: {
    ...mapMutations("style", ["setScreenSize"]),
    setResource(resourceId, type) {
      this.isResource = resourceId;
      this.type = type;
      if (resourceId != 0) {
        this.resource = this.getResourceByID(resourceId, type);
      } else {
        this.resource = null;
      }
    },
    updateParentDivWidth() {
      clearTimeout(this.updateParentDivWidthTimeout);
      this.updateParentDivWidthTimeout = setTimeout(() => {
        //this.setScreenSize(this.$refs.course.offsetWidth);
      }, 200);
    },
    toggleDrawer() {
      this.drawer = !this.drawer;
    },

  },
};
</script>

<style>
.v-dialog {
  overflow-y: visible !important;
}
</style>
