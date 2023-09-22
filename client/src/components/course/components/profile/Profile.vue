<template>
  <div id="profile" class="resource">
    <v-container fluid>
      <v-row v-if="isStudent">
        <v-col :cols="isSMsmaller ? 12 : 7">
          <v-card class="mx-auto mb-2" max-width="100%" outlined>
            <div class="header">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title :class="getTitleClass">
                    GUEST
                  </v-list-item-title>
                  <v-list-item-subtitle :class="getSmallTextClass">
                    guest@esmad.ipp.pt
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-avatar tile color="red" class="box" :size="getAvatarMediumSize">
                  <v-icon color="white" class="box_icon" :size="getIconBigSize">
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
                  <v-list-item-title :class="getTitleClass">
                    COURSE PROGRESSION
                  </v-list-item-title>
                  <v-list-item-subtitle :class="getSmallTextClass">
                    Status on the course exercises sheets
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-avatar tile color="blue" class="box" :size="getAvatarMediumSize">
                  <v-icon color="white" class="box_icon" :size="getIconBigSize">
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

        <v-col
          cols="5"
          class="pl-0"
          :class="isSMsmaller ? 'd-none' : 'd-block'"
        >
          <Gamification class="p-gamification" />
        </v-col>
      </v-row>

      <v-row :class="isSMsmaller ? 'd-block' : 'd-none'" v-if="isStudent">
        <v-col cols="12">
          <Gamification/>
        </v-col>
      </v-row>

      <v-row v-if="isTeacher">
        <v-col cols="12">
          <Gamification />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { bus } from "@/main.js";
import Gamification from "./Gamification.vue";
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
    if (this.isStudent) {
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
  },
  computed: {
    ...mapGetters("main",[
      "getLessonsByCourse",
      "getCompletationStatusByLesson",
      "getModuleByLesson",
      "getLessonsByModule",
      "getRole",
      "isStudent",
      "isTeacher"
    ]),
    ...mapGetters("style", [
      "getTitleClass",
      "getSmallTextClass",
      "getAvatarMediumSize",
      "getIconBigSize",
      "isSMsmaller"
    ]),
  },
};
</script>

<style scoped>
.resource {
  padding: 0 0 0 25% !important;
}
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
