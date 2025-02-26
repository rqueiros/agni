<template>
  <div id="timeline">
    <v-card
      :outlined="!isExpositive"
      :class="isExpositive ? 'shadow' : ''"
      v-if="resource != undefined"
      :style="{ backgroundColor: $vuetify.theme.currentTheme.studentboxes }"
    >
      <v-list-item :class="!isMDsmaller ? 'px-4' : isMD ? 'px-2' : 'px-4'">
        <v-list-item-content class="align-self-start">
          <v-list-item-title :class="getTitleClass">
            TIMELINE
          </v-list-item-title>
          <v-list-item-subtitle
            :class="getSmallTextClass"
            v-if="'type' in resource && resource.type != null"
            >Jump in the {{ resource.type.toUpperCase() }} for specific
            topics!</v-list-item-subtitle
          >
        </v-list-item-content>
        <v-list-item-avatar tile :size="getAvatarMediumSize" color="green">
          <v-icon color="white" :size="getIconBigSize">
            mdi-timeline-clock
          </v-icon>
        </v-list-item-avatar>
      </v-list-item>

      <!--
      <v-subheader v-if="resource.type == 'video'" 
      :class="getSmallTextClass(screenSize)">
        Video length: {{ convert(duration) }}
      </v-subheader>
      <v-subheader v-else :class="getSmallTextClass(screenSize)">PDF length:
        {{
          resource.milestones
          .find(milestone => milestone.label === "End").frame
        }}
        pages
      </v-subheader>-->

      <v-timeline
        class="py-2 mb-3 overflow-hidden"
        align-top
        dense
        v-if="
          (resource.milestones && resource.milestones.length > 0) || isTeacher
        "
        :class="getSmallTextClass"
      >
        <v-timeline-item
          v-for="(milestone, i) in resource.milestones"
          small
          class="pointer py-1"
          @click.native="goto(parseInt(milestone.frame))"
          :icon="getIcon(milestone)"
          :color="getColor(milestone)"
          :key="i"
        >
          <div v-if="isStudent || isViewer">
            {{ convert(milestone.frame) }} - {{ milestone.label }}
          </div>
          <v-row v-if="isAuthor" no-gutters class="d-flex align-center">
            <v-col cols="2" class="pr-1">
              <Editable
                type="milestone"
                :value="milestone.frame != null ? String(milestone.frame) : ''"
                :id="milestone.id"
                field="frame"
                placeholder="Frame"
                @input="editableInput"
                onclick="event.stopPropagation()"
                :required="true"
              />
            </v-col>
            <v-col class="pl-1 pr-1">
              <Editable
                type="milestone"
                :value="milestone.label"
                :id="milestone.id"
                field="label"
                placeholder="Label"
                @input="editableInput"
                onclick="event.stopPropagation()"
                :required="true"
              />
            </v-col>
            <v-col cols="2" class="pl-1">
              <v-btn
                icon
                :x-small="getButtonSmallSize == 'x-small'"
                :small="getButtonSmallSize == 'small'"
                @click="deleteMilestoneByID(milestone.id)"
              >
                <v-icon :size="getIconSmallSize">mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-timeline-item>
        <v-timeline-item hide-dot v-if="isAuthor" class="pb-2">
          <v-btn
            class="mt-1"
            @click="addMilestoneByExpositiveID(resource.id)"
            :small="getButtonMediumSize == 'small'"
            :medium="getButtonMediumSize == 'medium'"
            color="button"
          >
            <v-icon>mdi-plus</v-icon>Add Milestone
          </v-btn>
        </v-timeline-item>
      </v-timeline>
      <div v-else class="overline text-center">no milestones found!</div>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import Editable from "../../../../gerneral/Editable.vue";

export default {
  components: {
    Editable
  },

  props: {
    resource: {
      type: Object,
      default: () => {}
    },
    isExpositive: {
      type: Boolean,
      default: () => false
    }
  },

  data: () => ({
    selected: 0,
    duration: 0
  }),

  computed: {
    ...mapGetters("request", [
      "getRole",
      "isStudent",
      "isTeacher",
      "isViewer",
      "isAuthor"
    ]),
    ...mapGetters("style", [
      "getTitleClass",
      "getSmallTextClass",
      "getAvatarMediumSize",
      "getIconBigSize",
      "getIconSmallSize",
      "isMDsmaller",
      "isMD",
      "getButtonMediumSize",
      "getButtonSmallSize"
    ])
  },
  methods: {
    ...mapActions("main", [
      "editableInput",
      "addMilestoneByExpositiveID",
      "deleteMilestoneByID"
    ]),
    goto(index) {
      this.selected = index;
      if (index > 0) {
        this.$emit("onMilestone", index);
      }
    },
    convert(index) {
      if (this.resource.type == "video") {
        if (index < 60) {
          return `${index}''`;
        } else {
          return `${Math.trunc(index / 60)}'${Math.trunc(index % 60)}''`;
        }
      } else {
        return `${index}`;
      }
    },
    getColor(milestone) {
      let ids = this.resource.milestones.map(m => m.id);
      if (milestone.frame == this.selected) {
        return "black";
      } else if (ids[0] == milestone.id) {
        return "green";
      } else if (ids[ids.length - 1] == milestone.id) {
        return "red";
      } else {
        return "blue";
      }
    },
    getIcon(milestone) {
      let ids = this.resource.milestones.map(m => m.id);
      if (ids[0] == milestone.id) {
        return "mdi-flag-triangle";
      } else if (ids[ids.length - 1] == milestone.id) {
        return "mdi-flag-triangle";
      } else {
        return "mdi-play";
      }
    }
  }
};
</script>
