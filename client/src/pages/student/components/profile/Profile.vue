<template>
  <div id="profile" class="resource" v-if="isStudent">
    <v-container fluid>
      <v-row>
        <v-col :cols="this.screenSmall ? 12 : 7">
          <!--Profile-->
          <v-card class="mx-auto mb-2" max-width="100%" outlined>
            <div class="header">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="resource_title">
                    GUEST
                  </v-list-item-title>
                  <v-list-item-subtitle class="resource_subtitle">
                    guest@esmad.ipp.pt
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-avatar tile color="red" class="box">
                  <v-icon color="white" class="box_icon">
                    mdi-card-account-details
                  </v-icon>
                </v-list-item-avatar>
              </v-list-item>
              <v-card-text class="resource_text">
                <code>User data will appear here in future versions</code>
              </v-card-text>
            </div>
          </v-card>

          <!--Course Progression-->
          <v-card class="mx-auto" max-width="100%" outlined>
            <div class="header">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="resource_title">
                    COURSE PROGRESSION
                  </v-list-item-title>
                  <v-list-item-subtitle class="resource_text">
                    Status on the course exercises sheets
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-avatar tile color="blue" class="box">
                  <v-icon color="white" class="box_icon">
                    mdi-rocket-launch
                  </v-icon>
                </v-list-item-avatar>
              </v-list-item>
            </div>

            <!--PLAYER-->
            <div id="exercises" style="text-align: left">
              <v-data-table
                :headers="headers"
                :items="sheets"
                class="elevation-1 exercise"
                mobile-breakpoint="0"
                @click:row="play2"
              >
                <template v-slot:item.name="{ item }">
                  {{ item.name }}
                </template>

                <template v-slot:item.type="{ item }">
                  <v-icon>
                    {{ getIcon(item.type) }}
                  </v-icon>
                </template>

                <template v-slot:item.status="{ item }">
                  <v-chip
                    :color="getColor(item.status)"
                    dark
                    style="font-size: 1vw; height: 2.2vw"
                  >
                    {{ item.status }}%
                  </v-chip>
                </template>

                <template v-slot:item.action="{ item }">
                  <v-btn icon @click="play(item.rid)">
                    <v-icon>mdi-clipboard-play</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </div>
          </v-card>
        </v-col>

        <v-col cols="5" class="right_box">
          <Gamification class="p-gamification" />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <Gamification class="p-gamification_XS" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { bus } from "@/main.js";
import Gamification from "@/pages/student/components/profile/Gamification.vue";
import { mapGetters } from "vuex";

export default {
  name: "Profile",
  props: {
    resource: {
      type: Number,
      default: () => null
    },
    type: {
      type: String,
      default: () => null
    }
  },
  components: {
    Gamification
  },
  created() {
    this.role = this.getRole;
    if (this.role == "student") {
      let lessons;
      if (this.type == "course") {
        lessons = this.getLessonsByCourse(this.resource);
      } else {
        lessons = this.getLessonsByModule(this.resource);
      }
      this.sheets = [];
      lessons.forEach(lesson => {
        const id =
          this.getModuleByLesson(lesson.strapiId).internalId +
          ":" +
          lesson.internalId;
        const rid = lesson.strapiId;
        const name = lesson.name;
        const status = this.getCompletationStatusByLesson(lesson.strapiId);
        if (status) {
          this.sheets.push({ id, rid, name, status });
        }
      });
    }
  },
  data() {
    return {
      headers: [
        {
          text: "#",
          align: "start",
          sortable: true,
          value: "id"
        },
        { text: "Name", value: "name" },
        { text: "Solving status (%)", value: "status" },
        { text: "Actions", value: "action" }
      ],
      sheets: [],
      screenWidth: 0,
      role: ""
    };
  },
  methods: {
    getColor(status) {
      status = +status;
      if (status == 0) return "red";
      else if (status < 100) return "orange";
      else return "green";
    },
    play(id) {
      bus.$emit("changeIt", [id, "lesson"]);
    },
    play2(value) {
      bus.$emit("changeIt", [value.rid, "lesson"]);
    },
    handleResize() {
      this.screenWidth = window.innerWidth;
    }
  },
  computed: {
    ...mapGetters([
      "getLessonsByCourse",
      "getCompletationStatusByLesson",
      "getModuleByLesson",
      "getLessonsByModule",
      "getRole"
    ]),
    screenSmall() {
      return this.screenWidth <= 768;
    },
    isStudent() {
      return this.role == "student";
    },
    isTeacher() {
      return this.role == "teacher";
    }
  },
  mounted() {
    this.screenWidth = window.innerWidth;
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
};
</script>

<style scoped>
.p-gamification {
  display: block;
}

.p-gamification_XS {
  display: none;
}

@media only screen and (max-width: 768px) {
  .p-gamification {
    display: none;
  }
  .p-gamification_XS {
    display: block;
  }
}
</style>
