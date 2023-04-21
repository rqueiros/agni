<template>
  <!--v-if="resExist"-->
  <v-card class="mx-auto" outlined v-if="resource != undefined && resExist" id="timeline">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="course_title"> TIMELINE </v-list-item-title>
        <v-list-item-subtitle class="course_text">Jump in the {{ resource.type.toUpperCase() }} for specific
          topics!</v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-avatar tile class="box" color="green">
        <v-icon color="white" class="box_icon"> mdi-timeline-clock </v-icon>
      </v-list-item-avatar>
    </v-list-item>
      <v-subheader v-if="resource.type == 'video'" class="resource_text">
        Video length: {{ convert(duration) }}
      </v-subheader>
      <v-subheader v-else class="course_text">PDF length:
        <!--{{
          resource.milestones.find(milestone => milestone.label === "End").frame
        }}-->
        pages
      </v-subheader>

      <v-timeline align-top dense v-if="resource.milestones.length != 0 || isTeacher" class="resource_text">
        <v-timeline-item class="milestone" @click.native="goto(parseInt(milestone.frame))" :icon="getIcon(milestone)"
          v-for="(milestone,i) in resource.milestones" :color="getColor(milestone)" :key="i">
          <v-row v-if="isStudent">
            <v-col class="mt-1">
              <span class="resource_smallText" v-html="convert(milestone.frame) + ' - ' + milestone.label"></span>
            </v-col>
          </v-row>
          <v-row v-if="isTeacher" style="margin-left:0">
            <v-col class="mt-1" style="padding:2px; padding-top: 12px;" cols="2">
              <Editable :type="'milestone'" :value="milestone.frame" :id="milestone.strapiId" :field="'frame'" placeholder="Frame"
                @input="editableChange" onclick="event.stopPropagation()"></Editable>
            </v-col>
            <v-col class="mt-1" style="padding:2px; padding-top: 12px;">
              <Editable :type="'milestone'" :value="milestone.label" :id="milestone.strapiId" :field="'label'" placeholder="Label"
                @input="editableChange" onclick="event.stopPropagation()"></Editable>
            </v-col>
            <v-col style="padding:2px; padding-top: 12px;">
              <v-btn icon @click="deleteMilestone(milestone.strapiId)" style="height: 1.8em; width: 1.8em">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-timeline-item>
        <v-timeline-item hide-dot v-if="isTeacher">
          <v-btn style="width:calc(100% - 1em);" @click="addMilestoneByExpositiveId(resource.strapiId)" class="course_button course_text">
            <v-icon>mdi-plus</v-icon>Add Milestone
          </v-btn>
        </v-timeline-item>
      </v-timeline>
      <div v-else class="overline text-center">no milestones found!</div>
  </v-card>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import Editable from "../../../../components/Editable.vue";

export default {
  components: {
    Editable
  },
  props: {
    resource: {
      type: Object,
      default: () => { }
    }
  },
  data: () => ({
    selected: 0,
    duration: 0
  }),
  created() {
    this.role = this.getRole
  },
  computed: {
    ...mapGetters(["getRole"]),
    resExist() {
      return this.resource.type != "newExpo";
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
      "editableInput",
      "addMilestoneByExpositiveId",
      "deleteMilestone"
    ]),
    editableChange(obj) {
      console.log(obj.id)
      console.log(this.resource)
      this.editableInput(obj);
    },
    setDuration(duration) {
      this.duration = duration;
    },
    goto(index) {
      this.selected = index;
      this.$emit("onMilestone", index);
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
      let color;
      if (milestone.frame == this.selected) {
        color = "black";
      } else {
        if (milestone.label == "Start") {
          color = "green";
        } else if (milestone.label == "End") {
          color = "red";
        } else {
          color = "blue";
        }
      }
      return color;
    },
    getIcon(milestone) {
      let icone;
      if (milestone.label == "Start") {
        icone = "mdi-flag-triangle";
      } else if (milestone.label == "End") {
        icone = "mdi-flag-triangle";
      } else {
        icone = "mdi-play";
      }
      return icone;
    }
  }
};
</script>

<style scoped>
.milestone:hover {
  cursor: pointer;
}

#timeline>>>.v-timeline-item__dot{
  height: 2.2em !important;
  width: 2.2em !important;
}
#timeline>>>.v-timeline-item__dot .v-timeline-item__inner-dot{
  height: 1.8em !important;
  width: 1.8em !important;
  margin:0.2em !important;
}

#timeline>>> .v-icon.v-icon{
  font-size:1.5em;
}

#timeline>>>.v-timeline{
  padding-top:1em;
  margin-bottom:1em;
}
#timeline>>> .v-timeline-item{
  padding-bottom: 1em;
}

#timeline>>>.v-timeline--dense .v-timeline-item__body{
  max-width: calc(100% - 6em) !important;
}
#timeline>>>.v-timeline-item__divider{
  min-width: 6em !important;
}
.v-application--is-ltr .v-timeline--dense:not(.v-timeline--reverse)::before{
  left:calc(3em - 1px) !important;
}
</style>
