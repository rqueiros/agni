<template>
  <div id="expositives" v-if="expositivesNotNull || isAuthor">
    <v-card
      outlined
      class="d-flex rounded-0"
      style="border-left: 0; border-right: 0;"
    >
      <!--Author-->
      <v-btn
        v-if="!expositivesNotNull && isAuthor && !showExpositives"
        small
        width="100%"
        class="course_button"
        @click="showExpositives = true"
      >
        <v-icon>mdi-plus</v-icon>Expositives
      </v-btn>

      <div class="d-flex" style="width:100%">
        <v-bottom-navigation
          v-if="showExpositives || expositivesNotNull"
          grow
          id="navBar"
          v-model="index"
          class="elevation-0"
          height="2rem"
        >
          <template v-for="(item, i) in resource.expositives">
            <v-btn :key="i" :class="getSmallTextClass + ' px-2'">
              <div class="d-flex align-center">
                <!--Student + Viewer-->
                <v-icon v-if="isStudent || isViewer" :size="getIconMediumSize">
                  {{ getIcon(item.type) }}
                </v-icon>
                <span v-if="isStudent || isViewer" class="pl-1">
                  {{ item.name }}
                </span>

                <!--Author-->
                <Editable
                  v-if="isAuthor"
                  :type="'expositive'"
                  :value="item.name"
                  :id="item.id"
                  class="pr-1"
                  placeholder="Expositive name"
                  :field="'name'"
                  @input="editableInput"
                  onclick="event.stopPropagation()"
                />
                <v-icon
                  v-if="isAuthor"
                  :size="getIconSmallSize"
                  @click="deleteExpo(item.id)"
                >
                  mdi-delete
                </v-icon>
              </div>
            </v-btn>
            <v-divider :key="i+'b'" vertical></v-divider>
          </template>
        </v-bottom-navigation>

        <!--Author-->
        <div
          v-if="(showExpositives || expositivesNotNull) && isAuthor"
          style="height: 2rem;"
          class="d-flex align-center px-1"
        >
          <v-btn icon @click="addExpositiveByLessonId(resource.id)" small>
            <v-icon :size="getIconMediumSize"> mdi-plus </v-icon>
          </v-btn>
          <v-btn icon @click="removeExpositives" small>
            <v-icon :size="getIconMediumSize"> mdi-delete </v-icon>
          </v-btn>
        </div>
      </div>
    </v-card>

    <component
      v-if="expositivesNotNull"
      :is="getComponent"
      :resource="resource.expositives[this.index]"
      ref="expo"
    />

  </div>
</template>

<script>
import { bus } from "@/main.js";
import { mapGetters, mapMutations } from "vuex";

import Editable from "../../../../gerneral/Editable.vue";

export default {
  name: "Expositives",

  components: {
    Editable
  },

  props: {
    resource: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      expositives: [],
      index: 0,
      showExpositives: false,
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
          rid: expositive.id,
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
      "getButtonSize",
      "getIconSmallSize",
      "getIconMediumSize",
      "getSmallTextClass",
      "isStudent",
      "isTeacher",
      "isAuthor",
      "isViewer"
    ]),
    getComponent() {
      if (this.resource.expositives.length == 0) {
        return null;
      }
      if (this.index == undefined) {
        this.setIndex(0);
      }
      const componentName =
        this.resource.expositives[this.index].type.charAt(0).toUpperCase() +
        this.resource.expositives[this.index].type.slice(1);
      return () =>
        import(
          `../${this.resource.expositives[this.index].type}/${componentName}`
        );
    },
    expositivesNotNull() {
      return this.resource.expositives.length > 0;
    }
  },

  methods: {
    ...mapMutations([
      "addExpositiveByLessonId",
      "deleteExpositive",
      "editableInput"
    ]),
    deleteExpo(id) {
      if (
        this.index == this.resource.expositives.findIndex(e => e.id == id)
      ) {
        if (this.index > 0) {
          this.setIndex(this.index - 1);
        }
      }
      this.deleteExpositive(id);
    },
    setIndex(i) {
      this.index = i;
    },
    removeExpositives() {
      this.index = 0;
      this.resource.expositives = [];
      this.showExpositives = false;
      //TODO check if all expositves in store are deleted
    },
    setMilestone(index) {
      this.$refs.expo.setMilestone(index);
    },
    getIcon(type) {
      let icon = "";
      switch (type) {
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
#navBar >>> .v-btn__content {
  flex: auto;
}

.v-item-group.v-bottom-navigation .v-btn {
  max-width: none !important;
  min-width: 0 !important;
  font-weight: none !important;
}

.v-item-group.v-bottom-navigation .v-btn.v-btn--active:not(:hover):before {
  opacity: 0.18 !important;
}
</style>
