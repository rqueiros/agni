<template>
  <v-card outlined>
    <CardHeader
      title="COURSE PROGRESSION"
      subtitle="Status on the course exercises sheets"
      icon="mdi-rocket-launch"
      color="blue"
    />

    <v-data-table
      :headers="headers"
      :items="sheets"
      mobile-breakpoint="0"
      @click:row="navigateTo"
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
        <v-chip :color="getColor(item.status)" dark class="pointer">
          <div class="text-center" style="width: 32px">
            {{ Math.floor(item.status) }}%
          </div>
        </v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { bus } from "@/main.js";
import { mapGetters } from "vuex";

import CardHeader from "../../CardHeader.vue";

export default {
  props: {
    resource: {
      type: Number,
      default: () => null,
    },
    type: {
      type: String,
      default: () => null,
    },
  },
  components: {
    CardHeader,
  },
  created() {
    if (this.isStudent) {
      let lessons = this.getLessons;
      this.sheets = [];
      lessons.forEach((lesson) => {
        const id =
          this.getModuleByLessonID(lesson.id).internalId +
          ":" +
          lesson.internalId;
        const rid = lesson.id;
        const name = lesson.name;
        let status = this.getCompletationStatusByLessonID(lesson.id);
        if (status) {
          status = status.toFixed(2);
          this.sheets.push({ id, rid, name, status });
        }
      });
    }
  },
  data() {
    return {
      headers: [
        { text: "#", value: "id", cellClass: "pointer" },
        { text: "Name", value: "name", cellClass: "pointer" },
        { text: "Solved (%)", value: "status", cellClass: "pointer" },
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
    navigateTo(value) {
      bus.$emit("changeIt", [value.rid, "lesson"]);
    },
  },
  computed: {
    ...mapGetters("main", [
      "getCompletationStatusByLessonID",
      "getModuleByLessonID",
      "getLessons",
    ]),
    ...mapGetters("request", ["isStudent", "isTeacher"]),
    ...mapGetters("style", [
      "getTitleClass",
      "getSmallTextClass",
      "getAvatarMediumSize",
    ]),
  },
};
</script>
