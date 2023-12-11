<template>
  <div id="course" ref="course">
    <v-sheet class="rounded" color="boxes">
      <CourseMenu @onResourceClicked="setResource" />
      <Resource v-if="resource" :resource="resource" ref="resource" />
      <div v-else>
        <Profile :resource="isResource" :type="type" />
      </div>
    </v-sheet>
  </div>
</template>

<script>
import { bus } from "@/main.js";
import { mapGetters, mapMutations, mapState } from "vuex";

import CourseMenu from "./components/menu/CourseMenu.vue";
import Resource from "./components/resources/Resource.vue";
import Profile from "./components/profile/Profile.vue";

export default {
  name: "Course",

  components: {
    CourseMenu,
    Resource,
    Profile
  },

  data: () => ({
    resource: null,
    isResource: 0,
    type: ""
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
    }
  }
};
</script>

<style>
.v-dialog {
  overflow-y: visible !important;
}

/*

.iconButton{
  height: 20px !important;
  width: 20px !important;
  margin-bottom:1px;
  margin-top:1px;
}*/

</style>
