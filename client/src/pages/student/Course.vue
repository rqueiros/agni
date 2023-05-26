<template>
  <div id="course" ref="course" :class="getCourseClass" class="fill-height">
    <v-sheet class="fill-height rounded">
      <Menu @onResourceClicked="setResource" :screenSize="screenSize"/>
      <Resource v-if="resource" :resource="resource" :screenSize="screenSize" ref="resource"/>
      <div v-else>
        <Profile v-if="isResource != 0" :resource="isResource" :type="type" />
      </div>
    </v-sheet>
  </div>
</template>

<script>
import { bus } from "@/main.js";
import { mapGetters } from "vuex";

import Menu from "./components/Menu.vue";
import Resource from "./components/resources/Resource.vue";
import Profile from "./components/profile/Profile.vue";

export default {
  name: "Course",

  components: {
    Menu,
    Resource,
    Profile
  },

  data: () => ({
    resource: null,
    isResource: 0,
    type: "",
    courseWidth: 0
  }),

  created() {
    bus.$on("changeIt", payload => {
      this.setResource(payload[0], payload[1]);
    });
  },

  mounted() {
    this.courseWidth = this.$refs.course.offsetWidth;
    window.addEventListener('resize', this.updateParentDivWidth);
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.updateParentDivWidth);
  },

  computed: {
    ...mapGetters(["getResourceById"]),
    getCourseClass(){
      if (this.courseWidth <= 480){
        return "courseXS"
      } else if (this.courseWidth <= 768){
        return "courseS" 
      } else if (this.courseWidth <= 1024){
        return "courseM"
      } else if (this.courseWidth <= 1200){
        return "courseL"
      } else {
        return "courseXL"
      }
    },
    screenSize(){
      const size = this.courseWidth
      if (size <= 480) return "xs"
      else if (size <= 768) return "sm"
      else if (size <= 1024) return "md"
      else if (size <= 1280) return "lg"
      else return "xl"
    },
  },

  methods: {
    setResource(resourceId, type) {
      if (this.resource && this.resource != null && this.resource.contentType=="code"){
        this.$refs.resource.testM()
      }
      this.resource = null;
      this.isResource = resourceId;
      this.type = type;
      if (resourceId > 0) {
        this.resource = this.getResourceById(resourceId, type);
      }
    },
    updateParentDivWidth() {
      clearTimeout(this.updateParentDivWidthTimeout);
      this.updateParentDivWidthTimeout = setTimeout(() => {
        this.courseWidth = this.$refs.course.offsetWidth;
      }, 200);
    }
  },
};
</script>

<style>
/*IMPORTANT */
.course_iconButtonS {
  height: 1.1em !important;
  width: 1.1em !important;
  min-width: 0 !important;
}

/* Course Size */
.courseXS{font-size: 1em;}
.courseS{font-size: 1em;}
.courseM{font-size: 0.85em;}
.courseL{font-size: 1em;}
.courseXL{font-size: 1em;}


.resource {
  padding: 0 0 0 25% !important;
}


/* Buttons */
.course_button{
  height: 2rem !important;
  min-height: 0 !important;
}
.course_iconButtonL {
  height: 2.2em !important;
  width: 2.2em !important;
  min-width: 0 !important;
}
.course_IconS {
  font-size: 1.3em !important;
}



.v-stepper__header{
  height: 4em !important;
  align-content:center;
}
.v-stepper__step{
  height: 100% !important;
  padding:0 0.5em !important;
}
.v-stepper__step__step{
  min-height: 0 !important;
  min-width: 0 !important;
  font-size: 0.7em !important;
  width: 2em !important;
  height: 2em !important;
}
.v-stepper__header{
  padding:0 0.5em !important;
}
.v-stepper__header .v-divider{
  margin:0 !important;
}

.v-btn:not(.v-btn--round).v-size--default {
  min-width: 0;
}

.v-application--is-ltr .v-data-footer__select {
  margin-right: 1vw;
}

.v-application--is-ltr .v-data-footer__pagination {
  margin-right: 1vw;
  margin-left: 1vw;
}

.v-application--is-ltr .v-data-footer__icons-before .v-btn:last-child {
  margin-right: 0.55vw;
}

.v-application--is-ltr .v-data-footer__icons-after .v-btn:first-child {
  margin-left: 0.55vw;
}

</style>
