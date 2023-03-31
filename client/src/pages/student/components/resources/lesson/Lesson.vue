<template>
  <div id="lesson">
    <v-container fluid>
      <v-row>
        <v-col :cols="this.screenSmall ? 12 : 7">
          <v-card class="mx-auto" max-width="100%" outlined>

            <Header :resource="resource" />

            <!--<Expositives :resource="resource" />-->
            <div id="expositives" v-if="expoLen || isTeacher">
              <v-card outlined style="border-radius: 0;">
                <v-btn style="width: 100%; margin-bottom: 2vw;" v-if="!evalLen && isTeacher && !showExpositives"
                  @click="showExpositives = true">
                  <v-icon>mdi-plus</v-icon>Expositives
                </v-btn>
                <v-bottom-navigation grow :elevation="0" dense style="box-shadow: none; height: 24px;" v-model="index"
                  v-if="showExpositives || expoLen">
                  <v-btn v-for="(item, index) in expositives" :key="index" style="padding:0">
                    <div>
                      <v-icon>{{ getIcon(item.type) }}</v-icon> {{ item.name }}
                    </div>
                  </v-btn>
                  <v-btn icon v-if="isTeacher">
                    <v-icon class="box_icon" small>
                      mdi-plus
                    </v-icon>
                  </v-btn>
                  <v-btn icon v-if="isTeacher" @click="removeExpositives">
                    <v-icon class="box_icon" small>
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </v-bottom-navigation>
              </v-card>

              <component v-if="expoLen" :is="getComponent" :resource="expo" ref="expo"></component>
            </div>

            <Evaluatives :resource="resource" />

            <v-expansion-panels v-if="isStudent">
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
                  <code>
                          It will be possible to pose questions in future versions
                        </code>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>
        </v-col>
        <v-col cols="5">
          <Timeline :resource="expo" @onMilestone="setMilestone" ref="timeline" class="r-timeline" />
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
import Timeline from "@/pages/student/components/resources/Timeline.vue"

import { mapGetters } from "vuex";


export default {
  name: "Lesson",
  components: {
    Header,
    //Expositives,
    Evaluatives,
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
      screenWidth: 0,
      expositives: [],
      index: 0,
      expo: {},
      role: "",
      showExpositives: false
    };
  },
  created() {
    this.role = this.getRole
    if (!("expositives" in this.resource) || (this.resource.expositives.lenght == 0)) {
      this.expositives = []
    } else {
      this.showExpositives = true
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
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  computed: {
    ...mapGetters(["getRole"]),
    screenSmall() {
      return this.screenWidth <= 768;
    },
    getComponent() {
      this.expo = this.resource.expositives[this.index]
      const componentName =
        this.expositives[this.index].type.charAt(0).toUpperCase() +
        this.expositives[this.index].type.slice(1);
      return () => import(`../${this.expositives[this.index].type}/${componentName}`);
    },
    expoLen() {
      return this.expositives.length > 0
    },
    isStudent() {
      return this.role == "student"
    },
    isTeacher() {
      return this.role == "teacher"
    }
  },
  methods: {
    removeExpositives(){
      this.index=0,
      this.expositives=[],
      this.showExpositives=false
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
          icon = "mdi-code-json";
          break;
      }
      return icon;
    }
  }
};
</script>

<style>
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
