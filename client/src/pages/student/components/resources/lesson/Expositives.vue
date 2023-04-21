<template>
  <div id="expositives">
    <v-card outlined style="border-radius: 0">
      <v-bottom-navigation
        grow
        :elevation="0"
        dense
        style="box-shadow: none; height: 24px"
        v-model="index"
      >
        <v-btn
          v-for="(item, index) in expositives"
          :key="index"
          style="padding: 0"
        >
          <div>
            <v-icon>{{ getIcon(item.type) }}</v-icon> {{ item.name }}
          </div>
        </v-btn>
      </v-bottom-navigation>
    </v-card>

    <component :is="getComponent" :resource="expo"></component>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Expositives",
  components: {},
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
      expo: {}
    };
  },
  computed: {
    ...mapGetters(["getResourceById", "getProgressFromResourceId"]),
    getComponent() {
      this.func()
      const componentName =
        this.expositives[this.index].type.charAt(0).toUpperCase() +
        this.expositives[this.index].type.slice(1);
      return () =>
        import(`../${this.expositives[this.index].type}/${componentName}`);
    }
  },
  created() {
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
  },

  methods: {
    func(){
      this.expo = this.resource.expositives[this.index];
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

<style scoped>
.v-item-group.v-bottom-navigation .v-btn.v-btn--active:not(:hover):before {
  opacity: 0.18 !important;
}
</style>
