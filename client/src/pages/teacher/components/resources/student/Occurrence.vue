<template>
  <div id="occurrence" style="width:100%">
    <v-container class="pa-0">
      <v-row no-gutters class="mb-4">
        <v-col cols="2" class="mr-2">
          <v-card
            width="100%"
            height="100%"
            outlined
            style="border-color: #C3C3C3;"
            class="px-2"
          >
            {{ occurrence.year }}
          </v-card>
        </v-col>
        <v-col cols="2" class="mx-2">
          <v-card
            width="100%"
            outlined
            style="border-color: #C3C3C3;"
            class="px-2"
          >
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="Start Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                no-title
                v-model="date"
                @input="menu = false"
              ></v-date-picker>
            </v-menu>
          </v-card>
        </v-col>
        <v-col cols="2" class="mx-2">
          <v-card
            width="100%"
            outlined
            style="border-color: #C3C3C3;"
            class="px-2"
          >
            <v-menu
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date2"
                  label="End Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                no-title
                v-model="date2"
                @input="menu2 = false"
              ></v-date-picker>
            </v-menu>
          </v-card>
        </v-col>
        <v-col cols="2" class="ml-2">
          <v-card
            width="100%"
            height="100%"
            outlined
            style="border-color: #C3C3C3;"
            class="px-2"
          >
            <v-btn style="width:100%; height: 100%;">
              Course
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters class="mb-4">
        <v-col cols="5" class="pr-2">
          <v-card
            height="180px"
            outlined
            style="border-color: #C3C3C3;"
            class="px-2"
          >
          </v-card>
        </v-col>
        <v-col cols="7" class="pl-2">
          <v-card
            height="100%"
            outlined
            style="border-color: #C3C3C3;"
            class="px-2"
          >
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters class="mx-n2">
        <template v-for="cla in occurrence.classes">
          <v-col :key="cla.id" class="mx-2">
            <v-card width="100%" outlined style="border-color: #C3C3C3;">
              <div class="text-body-1 pa-2 pb-1 pl-4">
                <span class="mr-10"> Class: {{ cla.name }} </span>
                <span> Delay: {{ cla.delay }} </span>
              </div>
              <v-data-table
                dense
                :headers="studentHeader"
                :items="cla.students"
                :search="search"
                @click:row="openCollectionType"
                :loading="loading"
              >
              </v-data-table>
            </v-card>
          </v-col>
        </template>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { bus } from "@/main.js";
import { mapGetters } from "vuex";

export default {
  name: "Occurrence",

  data() {
    return {
      date: "",
      menu: false,
      date2: "",
      menu2: false,
      loading: false,
      occurrence: {},
      search: "",
      studentHeader: [
        { text: "Name", value: "name", align: "start" },
        { text: "Delay", value: "delay" }
      ]
    };
  },

  created() {
    this.setItems();
  },

  computed: {
    ...mapGetters(["getOccurrence"])
  },

  methods: {
    openCollectionType(item) {
      console.log(item.id); // TODO open occurrence
      bus.$emit("changePage", ["class,Student", "occurrence"]);
    },
    setItems() {
      this.loading = true;
      this.occurrence = this.getOccurrence[0];
      this.date = new Date(this.occurrence.startDate);
      this.date = this.date.toISOString().substring(0, 10);
      this.date2 = new Date(this.occurrence.endDate);
      this.date2 = this.date2.toISOString().substring(0, 10);
      this.loading = false;
    }
  }
};
</script>

<style></style>
