<template>
  <div id="expositives">
    expositives
    <v-data-table
      :headers="headers"
      :items="expositives"
      class="elevation-1 exercise"
      @click:row="play2"
    >
      <!--<template v-slot:item.type="{ item }">
            <v-icon :title="item.type">
               {{ getIcon(item.type) }}
            </v-icon>
         </template>
         <template v-slot:item.status="{ item }">
            <v-chip :color="getColor(item.status)" dark>
               {{ item.status }}%
            </v-chip>
         </template>-->
      <template v-slot:item.action="{ item }">
        <v-btn icon @click="play(item)">
          <v-icon>mdi-clipboard-play</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { bus } from "@/main.js";
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
  computed: {
    ...mapGetters(["getResourceById", "getProgressFromResourceId"])
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
        { text: "Type", value: "type" },
        { text: "Actions", value: "action" }
      ],
      expositives: []
    };
  },

  methods: {
    play(value) {
      bus.$emit("changeIt", [value.rid, "expositive"]);
    },
    play2(value) {
      bus.$emit("changeIt", [value.rid, "expositive"]);
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
        default:
          icon = "mdi-code-json";
          break;
      }
      return icon;
    },
    getColor(status) {
      status = +status;
      if (status == 0) return "red";
      else if (status < 100) return "orange";
      else return "green";
    }
  }
};
</script>

<style>
.exercise:hover {
  cursor: pointer;
}
</style>
