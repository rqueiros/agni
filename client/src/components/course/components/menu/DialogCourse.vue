<template>
  <div id="DialogCourse">
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="pb-2" :class="getTitleClass">
          Course - {{ dialogItem.name }}
        </v-card-title>
        <v-card-text>

          <vue-cascader-select :options="options" @select="selected => setType(dialogItem.id, selected.value)"
            class="ml-2 mt-2" :value="dialogItem.type" v-if="isAuthor" style="width: fit-content" />

          <v-list-item v-for="goal of this.dialogItem.goals" :key="goal.id" dense>
            <v-list-item-content v-if="isAuthor">
              <div class="d-flex" :class="getSmallTextClass">
                <span class="mr-2">-</span>
                <div style="flex-grow:inherit">
                  <Editable :type="'goal'" :value="goal.goal" :id="goal.id" :field="'goal'" :placeholder="'Insert a goal'"
                    @input="editableInput" onclick="event.stopPropagation()" />
                </div>
                <v-btn icon class="ml-2" @click="deleteGoal(goal.id)" x-small>
                  <v-icon :size="getIconSmallSize">
                    mdi-delete
                  </v-icon>
                </v-btn>
              </div>
            </v-list-item-content>
            <v-list-item-content v-if="isViewer">
              - {{ goal.goal }}
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="isAuthor">
            <v-list-item-content class="pa-1">
              <v-btn small @click="addGoalByCourseId(dialogItem.id)">
                <v-icon>mdi-plus</v-icon>Goal
              </v-btn>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

import { bus } from "@/main.js";

import Vue from "vue";
import Editable from "../../../gerneral/Editable.vue";
import VueCascaderSelect from "vue-cascader-select";
Vue.use(VueCascaderSelect);

export default {
  name: "DialogCourse",

  components: {
    Editable,
    VueCascaderSelect
  },

  props: {
    dialogItem: {
      type: Object,
      default: () => { }
    },
    dialog: {
      type: Boolean,
      default: () => false
    }
  },

  data() {
    return {
      options: [
        {
          label: "Course",
          value: "Course"
        },
        {
          label: "Contest",
          value: "Contest"
        },
        {
          label: "Test/Exam",
          value: "Test/Exam"
        }
      ],
    }
  },

  watch: {
    dialog(newValue) {
      bus.$emit("dialogCourseChange", newValue);
    }
  },

  computed: {
    ...mapGetters("main",[
      "isStudent",
      "isTeacher",
      "isViewer",
      "isAuthor",
    ]),
    ...mapGetters("style",[
      "getIconSmallSize",
      "getSmallTextClass",
      "getTitleClass"
    ]),
  },

  methods: {
    ...mapMutations("main",[
      "editableInput",
      "addGoalByCourseId",
      "deleteGoal",
      "editableInput"
    ]),
    setType(id, value) {
      const obj = {
        id: id,
        value: value,
        field: "type",
        type: "course"
      };
      this.editableInput(obj);
    }
  }

}
</script>

<style scoped>
#courseDialog>>>.vcs__select-menu {
  z-index: 10
}
</style>