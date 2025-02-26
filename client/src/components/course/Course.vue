<template>
  <v-sheet class="rounded" color="boxes" height="100%">
    <div id="course" ref="course" class="d-flex h-full">
      <CourseToolbar @toggleDrawer="toggleDrawer" />
      <CourseMenu @onResourceClicked="setResource" :drawer.sync="drawer" />
      <Resource v-if="resource" :resource="resource" class="flex-grow-1" />
      <div v-else class="flex-grow-1">
        <Profile :resource="isResource" :type="type" />
      </div>
    </div>
  </v-sheet>
</template>

<script>
import { bus } from "@/main.js";
import { mapGetters, mapMutations, mapState } from "vuex";

import CourseMenu from "./components/menu/CourseMenu.vue";
import Resource from "./components/resources/Resource.vue";
import Profile from "./components/profile/Profile.vue";
import CourseToolbar from "./components/menu/CourseToolbar.vue";

export default {
  name: "Course",

  components: {
    CourseMenu,
    Resource,
    Profile,
    CourseToolbar
  },

  data: () => ({
    resource: null,
    isResource: 0,
    type: "",
    drawer: false
  }),

  created() {
    this.updateParentDivWidth = this.updateParentDivWidth.bind(this);
    bus.$on("changeIt", payload => {
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
    }
  },

  mounted() {
    this.setScreenSize(this.$refs.course.offsetWidth);
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
    ...mapState("main", { courses: state => state.courses }),
    ...mapGetters("main", ["getResourceByID"])
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
        this.setScreenSize(this.$refs.course.offsetWidth);
      }, 200);
    },
    toggleDrawer() {
      this.drawer = !this.drawer;
    }
  }
};
</script>

<style>
.v-dialog {
  overflow-y: visible !important;
}
</style>
