<template>
  <div id="lesson">
    <v-container fluid>
      <v-row>
        <v-col :cols="this.screenSmall ? 12 : 7">
          <v-card max-width="100%" outlined>
            <Header :resource="resource" />

            <!--<Expositives :resource="resource" />-->

            <v-spacer v-if="isTeacher" style="height: 12px"></v-spacer>

            <div id="expositives" v-if="expoLen || isTeacher">
              <v-card outlined style="border-radius: 0; display: flex;">
                <!-----------------Teacher------------------------------------->
                <v-btn style="width: 100%;" v-if="!expoLen && isTeacher && !showExpositives" 
                  class="course_button course_text" @click="showExpositives = true">
                  <v-icon>mdi-plus</v-icon>Expositives
                </v-btn>
                <!---->

                <div style="display: flex; width: 100%;">
                  <v-bottom-navigation grow style="box-shadow: none; height: 2rem;" id="navBar" v-model="index"
                    v-if="showExpositives || expoLen">
                    <v-btn v-for="(item, i) in getExpostives" :key="i" class="course_smallText"
                      style="padding: 0 0.5em; border-left: solid; border-right: solid; border-width: 0.01em; border-color: lightgray;">
                      <div style="display: flex; align-items: center;">
                        <v-icon>{{ getIcon(item.type) }}</v-icon>
                        <span v-if="isStudent">
                          {{ item.name }}
                        </span>
                        <Editable v-if="isTeacher" :type="'expositive'" :value="item.name" :id="item.strapiId" placeholder="Expositive name"
                          :field="'name'" @input="editableChange" onclick="event.stopPropagation()"></Editable>
                        <v-spacer style="width:1em"></v-spacer>
                        <v-icon class="course_IconS" v-if="isTeacher" @click="deleteExpo(item.strapiId)">mdi-delete</v-icon>
                      </div>
                    </v-btn>
                  </v-bottom-navigation>

                  <div v-if="(showExpositives || expoLen) && isTeacher" style="display: flex; height: 2rem;">
                    <v-btn icon style="min-width: 0;" @click="addExpositiveByLessonId(resource.strapiId)"
                      class="course_iconButtonL">
                      <v-icon> mdi-plus </v-icon>
                    </v-btn>
                    <v-btn icon style="min-width: 0;" @click="removeExpositives" class="course_iconButtonL">
                      <v-icon> mdi-delete </v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-card>

              <component v-if="expoLen" :is="getComponent" :resource="getExpo" ref="expo"></component>
            </div>

            <v-spacer style="height: 24px"></v-spacer>

            <Evaluatives :resource="resource" />

            <v-spacer style="height: 24px"></v-spacer>

            <v-expansion-panels v-if="isStudent">
              <v-expansion-panel>
                <v-expansion-panel-header disable-icon-rotate>
                  Questions (0)
                  <template v-slot:actions>
                    <v-icon color="teal"> mdi-comment-multiple </v-icon>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <code>
                                  It will be possible to pose questions in future versions
                                </code>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>
        </v-col>
        <v-col cols="5">
          <Timeline :resource="resource.expositives[index]" @onMilestone="setMilestone" ref="timeline"
            class="r-timeline" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <Timeline :resource="expo" @onMilestone="setMilestone" ref="timeline" class="r-timeline_XS" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Header from "@/pages/student/components/resources/Header.vue";
//import Expositives from "@/pages/student/components/resources/lesson/Expositives.vue";
import Evaluatives from "@/pages/student/components/resources/lesson/Evaluatives.vue";
import Timeline from "@/pages/student/components/resources/Timeline.vue";
import Editable from "../../../../../components/Editable.vue";

import { mapGetters, mapMutations } from "vuex";

export default {
  name: "Lesson",
  components: {
    Header,
    //Expositives,
    Evaluatives,
    Timeline,
    Editable
  },
  props: {
    resource: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      screenWidth: 0,
      expositives: [],
      index: 0,
      expo: {},
      role: "",
      showExpositives: false
    };
  },
  created() {
    this.role = this.getRole;
    if (
      !("expositives" in this.resource) ||
      this.resource.expositives.length < 1
    ) {
      this.expositives = [];
    } else {
      this.showExpositives = true;
      let i = 1;
      this.resource.expositives.forEach(expositive => {
        this.expositives.push({
          id: i,
          rid: expositive.strapiId,
          name: expositive.name,
          type: expositive.type,
          action: ""
        });
        i++;
      });
    }
  },
  mounted() {
    this.screenWidth = window.innerWidth;
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
  computed: {
    ...mapGetters(["getRole"]),
    screenSmall() {
      return this.screenWidth <= 768;
    },
    getExpostives() {
      return this.resource.expositives
    },
    getExpo() {
      return this.resource.expositives[this.index];
    },
    getComponent() {
      if (this.resource.expositives.length == 0) {
        return null
      }
      if (this.index == undefined) {
        this.setIndex(0)
      }
      const componentName =
        this.resource.expositives[this.index].type.charAt(0).toUpperCase() +
        this.resource.expositives[this.index].type.slice(1);
      return () =>
        import(`../${this.resource.expositives[this.index].type}/${componentName}`);
    },
    expoLen() {
      return this.resource.expositives.length > 0;
    },
    isStudent() {
      return this.role == "student";
    },
    isTeacher() {
      return this.role == "teacher";
    }
  },
  methods: {
    ...mapMutations([
      "addExpositiveByLessonId",
      "deleteExpositive",
      "editableInput"
    ]),
    deleteExpo(id) {
      if(this.index == this.resource.expositives.findIndex(e => e.strapiId == id)){
        if (this.index > 0){
          this.setIndex(this.index-1)
        }
      }
      this.deleteExpositive(id)
    },
    setIndex(i) {
      this.index = i
    },
    editableChange(obj) {
      this.editableInput(obj);
    },
    removeExpositives() {
      this.index = 0
      this.resource.expositives = []
      this.showExpositives = false
      //missing delete all of structure
    },
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
    setMilestone(index) {
      this.$refs.expo.setMilestone(index);
    },
    getIcon(subtype) {
      let icon = "";
      switch (subtype) {
        case "blank":
          icon = "mdi-text-box-outline";
          break;
        case "skeleton":
          icon = "mdi-text-box-plus-outline";
          break;
        case "buggy":
          icon = "mdi-bug";
          break;
        case "quiz":
          icon = "mdi-head-question-outline";
          break;
        case "video":
          icon = "mdi-video";
          break;
        case "pdf":
          icon = "mdi-file-pdf-box";
          break;
        default:
          icon = "";
          break;
      }
      return icon;
    }
  }
};
</script>

<style scoped>

.course_IconS{
  font-size:1.685em !important;
}
#navBar>>>.v-btn__content {
  flex: auto;
}

#navBar>>>.v-item-group.v-bottom-navigation .v-btn {
  max-width: none !important;
  min-width: 0 !important;
  font-weight: none !important;
}

#navBar>>>.v-btn {
  font-size: none !important;
}

.v-item-group.v-bottom-navigation .v-btn {
  max-width: none !important;
  min-width: 0 !important;
  font-weight: none !important;
}



.teacherCard {
  margin-bottom: 2vw;
}

.r-timeline {
  display: block;
}

.r-timeline_XS {
  display: none;
}

.v-item-group.v-bottom-navigation .v-btn.v-btn--active:not(:hover):before {
  opacity: 0.18 !important;
}

@media only screen and (max-width: 600px) {
  .r-timeline {
    display: none;
  }

  .r-timeline_XS {
    display: block;
  }
}
</style>
