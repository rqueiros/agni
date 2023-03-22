<template>
  <v-card class="mx-auto" outlined>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="resource_title">
          TIMELINE
        </v-list-item-title>
        <v-list-item-subtitle class="resource_text"
          >Jump in the {{ resource.type.toUpperCase() }} for specific
          topics!</v-list-item-subtitle
        >
      </v-list-item-content>

      <v-list-item-avatar tile class="box" color="green">
        <v-icon color="white" class="box_icon">
          mdi-timeline-clock
        </v-icon>
      </v-list-item-avatar>
    </v-list-item>
    <v-card-text>
      
      <v-subheader v-if="resource.type == 'video'" class="resource_text">
        Video length: {{ convert(duration) }}
      </v-subheader>
      <v-subheader v-else class="resource_text"
        >PDF length:
        {{
          resource.milestones.find(milestone => milestone.label === "End").frame
        }}
        pages
      </v-subheader>

      <v-timeline align-top dense v-if="resource.milestones.length != 0" class="resource_text">
        <v-timeline-item
          class="milestone"
          @click.native="goto(milestone.frame)"
          :icon="getIcon(milestone)"
          v-for="milestone in resource.milestones"
          :color="getColor(milestone)"
          :key="milestone.frame"
        >
          <v-row>
            <v-col class="mt-1">
              <strong
                class="resource_text"
                v-html="convert(milestone.frame) + ' - ' + milestone.label"
              ></strong>
            </v-col>
          </v-row>
        </v-timeline-item>
      </v-timeline>
      <div v-else class="overline text-center">no milestones found!</div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    resource: Object
  },
  data: () => ({
    selected: 0,
    duration: 0
  }),
  methods: {
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

<style>
.milestone:hover {
  cursor: pointer;
}
</style>
