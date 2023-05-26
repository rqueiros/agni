<template>
  <div id="expositives" v-if="expoLen || isAuthor">

    <v-card outlined class="d-flex rounded-0" style="border-left: 0; border-right: 0;">

      <!--Author-->
      <v-btn v-if="!expoLen && isAuthor && !showExpositives" small width="100%" class="course_button"
        @click="showExpositives = true">
        <v-icon>mdi-plus</v-icon>Expositives
      </v-btn>

      <div class="d-flex" style="width:100%">
        <v-bottom-navigation grow id="navBar" v-model="index" class="elevation-0" height="2rem"
          v-if="showExpositives || expoLen">
          <template v-for="(item, i) in getExpostives">
            <v-btn :key="i" :class="getSmallTextClass(screenSize)+' px-2'" >
              <div class="d-flex align-center">
                
                <!--Student + Viewer-->
                <v-icon v-if="isStudent || isViewer" :size="getIconMediumSize(screenSize)">
                  {{ getIcon(item.type) }}
                </v-icon>
                <span v-if="isStudent || isViewer" class="pl-1">
                  {{ item.name }}
                </span>

                <!--Author-->
                <Editable v-if="isAuthor" :type="'expositive'" :value="item.name" :id="item.strapiId" class="pr-1"
                  placeholder="Expositive name" :field="'name'" @input="editableInput" onclick="event.stopPropagation()">
                </Editable>
                <v-icon v-if="isAuthor" :size="getIconSmallSize(screenSize)" @click="deleteExpo(item.strapiId)">
                  mdi-delete
                </v-icon>
              </div>
            </v-btn>
            <v-divider :key="i" vertical></v-divider>
          </template>
        </v-bottom-navigation>

        <!--Author-->
        <div v-if="(showExpositives || expoLen) && isAuthor" style="height: 2rem;" class="d-flex align-center px-1">
          <v-btn icon @click="addExpositiveByLessonId(resource.strapiId)" small>
            <v-icon :size="getIconMediumSize(screenSize)"> mdi-plus </v-icon>
          </v-btn>
          <v-btn icon @click="removeExpositives" small>
            <v-icon :size="getIconMediumSize(screenSize)"> mdi-delete </v-icon>
          </v-btn>
        </div>
      </div>
    </v-card>

    <component v-if="expoLen" :is="getComponent" :resource="getExpo" ref="expo"></component>
  </div>
</template>

<script>
import { bus } from "@/main.js";
import { mapGetters, mapMutations } from "vuex";

import Editable from "../../../../../components/Editable.vue";

export default {
  name: "Expositives",

  components: {
    Editable
  },

  props: {
    resource: {
      type: Object,
      default: () => { }
    },
    screenSize: {
      type: String,
      default: () => ""
    }
  },

  data() {
    return {
      expositives: [],
      index: 0,
      expo: {},
      showExpositives: false
    };
  },

  watch: {
    index(newV) {
      bus.$emit("setIndex", newV);
    }
  },

  created() {
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

  computed: {
    ...mapGetters([
      "getRole", "getButtonSize", "getIconSmallSize", "getIconMediumSize",
      "getSmallTextClass"
    ]),
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
      return this.getRole == "student";
    },
    isTeacher() {
      return this.getRole == "teacher" || this.getRole == "author" || this.getRole == "viewer";
    },
    isAuthor() {
      return this.getRole == "author"
    },
    isViewer() {
      return this.getRole == "viewer"
    }
  },

  methods: {
    ...mapMutations([
      "addExpositiveByLessonId",
      "deleteExpositive",
      "editableInput"
    ]),
    deleteExpo(id) {
      if (this.index == this.resource.expositives.findIndex(e => e.strapiId == id)) {
        if (this.index > 0) {
          this.setIndex(this.index - 1)
        }
      }
      this.deleteExpositive(id)
    },
    setIndex(i) {
      this.index = i
    },
    removeExpositives() {
      this.index = 0
      this.resource.expositives = []
      this.showExpositives = false
      //TODO check if all expositves in store are deleted
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

.v-item-group.v-bottom-navigation .v-btn.v-btn--active:not(:hover):before {
  opacity: 0.18 !important;
}</style>
