<template>
  <div id="contentButtons">
    <v-app-bar 
      rounded 
      elevation="2" 
      height="auto" 
      outlined 
      style="background-color: #F7F8F9;" 
      class="pa-2"
    >

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <span class="mx-4" v-bind="attrs" v-on="on"> {{ title }}
          </span>
        </template>
        <span>{{ description }}</span>
      </v-tooltip>

      <v-spacer></v-spacer>

      <v-text-field label="Search" outlined dense hide-details disabled/>
      <!--TODO implement Search-->

      <v-spacer></v-spacer>

      <v-menu offset-y auto>
        <template v-slot:activator="{ on, attrs }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltipOn, attrs: tooltipAttrs }">
              <v-btn 
                elevation="1" 
                rounded  
                v-bind="{ ...attrs, ...tooltipAttrs }" 
                v-on="{ ...on, ...tooltipOn }" 
                color="primary"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
          <span>Add</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item 
            v-for="(item, index) in addList" 
            :key="index" 
            link 
            @click="addCollectionType(item.title)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

    </v-app-bar>
  </div>
</template>


<script>
import { bus } from "@/main.js";

import { mapActions, mapMutations } from "vuex";

export default {
  name: "ContentButtons",

  props: {
    title: {
      type: String,
      default: () => ""
    },
    description: {
      type: String,
      default: () => ""
    }
  },

  data() {
    return {
      addList: [
        { title: "Course" },
        { title: "Expositive" },
        { title: "Evaluative" },
        { title: "Question" }
      ],
    };
  },

  methods: {
    ...mapActions("main",["fetchEmptyCourse"]),
    ...mapMutations("main", [
      "createNewQuestion", 
      "createNewExpositive", 
      "createNewEvaluative"
    ]),
    addCollectionType(item) {
      switch (item) {
        case "Course":
          this.fetchEmptyCourse();
          bus.$emit("changePage", "content,Course");
          break;
        case "Expositive":
          this.createNewExpositive();
          bus.$emit("changePage", "content,Expositive");
          break;
        case "Evaluative":
          this.createNewEvaluative();
          bus.$emit("changePage", "content,Evaluative");
          break;
        case "Question":
          this.createNewQuestion();
          bus.$emit("changePage", "content,Question");
          break;
      }
    },
  }
}
</script>


<style scoped></style>