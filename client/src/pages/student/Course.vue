<template>
  <div ref="course" :class="getCourseClass">
    <v-sheet class="fill-height pa">
      <Menu @onResourceClicked="setResource" />
      <Resource v-if="resource" :resource="resource" />
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
    }
  },

  methods: {
    setResource(resourceId, type) {
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
/* Course Size */
.courseXS{font-size: 1em;}
.courseS{font-size: 1em;}
.courseM{font-size: 0.75em;}
.courseL{font-size: 1em;}
.courseXL{font-size: 1em;}


/* Text Styles */
.course_title {
  font-size: 1.8em;
  text-align: left;
}
.course_subtitle {
  font-size: 1.1em;
  font-weight: 500;
  text-align: left;
}
.course_text {
  font-size: 0.9em !important;
  font-weight: 400 !important;
}
.course_smallText{
  font-size: 0.8em !important;
  font-weight: 400 !important;
}


/* Paddings */
.v-list-item{
  padding: 0 0.7em;
}
.v-list-item__content{
  padding: 0.6em 0;
}
.v-card__text{
  padding: 0.7em;
}

.resource {
  padding: 0 0 0 25%;
}

/* Buttons */
.course_button{
  height: 2rem !important;
  min-height: 0 !important;
}
.course_iconButtonS {
  height: 1.1em !important;
  width: 1.1em !important;
  min-width: 0 !important;
}
.course_iconButtonL {
  height: 2.2em !important;
  width: 2.2em !important;
  min-width: 0 !important;
}
.course_IconS {
  font-size: 1.3em !important;
}



/* Boxes */
.box {
  height: 4.5em !important;
  min-width: 0 !important;
  width: 4.5em !important;
}
.box_icon {
  font-size: 2.2em !important;
}



.header {
  text-align: left;
}

/*
.right_box {
  padding-left: 0;
}*/

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


.v-data-table>.v-data-table__wrapper>table>tbody>tr>td {
  font-size: 1em;
  height: 3.5em;
}

.v-data-table>.v-data-table__wrapper>table>thead>tr>th {
  font-size: 0.9em;
  height: 3.5em;
}

.v-card__actions {
  flex-wrap: wrap;
  justify-content: center;
}

.v-data-footer,
.v-data-footer__select .v-select__selections .v-select__selection--comma {
  font-size: 0.9vw;
}
/*
.v-btn--icon.v-size--default .v-icon,
.v-btn--fab.v-size--default .v-icon {
  font-size: 1.8vw;
}

.v-data-table .v-icon {
  font-size: 1.8vw;
}*/

.v-data-table>.v-data-table__wrapper>table>tbody>tr>td,
.v-data-table>.v-data-table__wrapper>table>tbody>tr>th,
.v-data-table>.v-data-table__wrapper>table>thead>tr>td,
.v-data-table>.v-data-table__wrapper>table>thead>tr>th,
.v-data-table>.v-data-table__wrapper>table>tfoot>tr>td,
.v-data-table>.v-data-table__wrapper>table>tfoot>tr>th {
  padding: 0 0.8vw;
}

.v-btn:not(.v-btn--round).v-size--default {
  min-width: 0;
}
/*
.v-btn__content .v-icon.v-icon--left,
.v-btn__content .v-icon.v-icon--right {
  font-size: 1.4vw;
  margin-left: 0.5vw;
}*/

.v-card__actions>.v-btn.v-btn {
  padding: 0 1vw;
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

@media only screen and (max-width: 768px) {
  .resource {
    padding: 60px 0 0 0;
  }

  /*
  .resource_title {
    font-size: 5vw;
    font-weight: 400;
  }

  .resource_subtitle {
    font-size: 3vw;
    font-weight: 500;
  }

  .resource_text {
    font-size: 2.5vw;
  }

  .box {
    height: 12vw !important;
    min-width: 0 !important;
    width: 12vw !important;
  }

  .box_icon {
    font-size: 5vw !important;
  }*/

  /*
  .v-data-table>.v-data-table__wrapper>table>tbody>tr>td {
    font-size: 2.5vw;
    height: 9vw;
  }

  .v-data-table>.v-data-table__wrapper>table>thead>tr>th {
    font-size: 2.5vw;
    height: 9vw;
  }

  .v-btn--icon.v-size--default .v-icon,
  .v-btn--fab.v-size--default .v-icon {
    font-size: 4vw;
  }
  
  .v-btn:not(.v-btn--round).v-size--default {
    min-width: 0;
    font-size: 2vw;
    height: 5vw;
  }*/

  .v-card__actions>.v-btn.v-btn {
    padding: 0 1vw;
  }
}
</style>
