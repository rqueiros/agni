<template>
  <div id="menuDialog">
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>{{ this.dialogItem.contentType }}: {{ this.dialogItem.name }}</v-card-title>
        <v-card-text>
          <!--For course-->
          <div v-if="this.dialogItem.contentType == 'course'">
            Goals:
            <v-list-item v-for="goal of this.dialogItem.goals" :key="goal.strapiId">
              <!--Author-->
              <v-list-item-content v-if="isAuthor">
                <div class="d-flex">
                  <span class="mr-2">-</span>
                  <div style="flex-grow:inherit">
                    <Editable :type="'goal'" :value="goal.goal" :id="goal.strapiId" :field="'goal'"
                      :placeholder="'Insert a goal'" @input="editableInput" onclick="event.stopPropagation()" />
                  </div>
                  <v-btn icon class="course_iconButtonS ml-2" @click="deleteGoal(goal.strapiId)">
                    <v-icon :size="getIconSmallSize(screenSize)">
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </div>
              </v-list-item-content>
              <!--Viewer-->
              <v-list-item-content v-if="isViewer">
                - {{ goal.goal }}
              </v-list-item-content>
            </v-list-item>
            <!--Author-->
            <v-list-item v-if="isAuthor">
              <v-list-item-content>
                <v-btn small @click="addGoalByCourseId(dialogItem.strapiId)">
                  <v-icon>mdi-plus</v-icon>Goal
                </v-btn>
              </v-list-item-content>
            </v-list-item>
          </div>
          <!--For Modules and Lessons-->
          <v-container v-if="this.dialogItem.contentType != 'course' && dialog">
            <v-row>
              <v-col>
                After Week:
              </v-col>
              <v-col>
                <!--Author-->
                <span v-if="isAuthor">
                  <Editable :type="'condition'" :value="dialogItem.condition.afterWeek"
                    :id="dialogItem.condition.strapiId" :field="'afterWeek'"
                    :placeholder="'After Week condition for this' + dialogItem.contentType" @input="editableInput"
                    onclick="event.stopPropagation()" />
                </span>
                <!--Viewer-->
                <span v-if="isViewer">
                  {{ this.dialogItem.condition.afterWeek }}
                </span>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
              </v-col>
              <v-col>
                <!--Author-->
                <span v-if="isAuthor">
                  <vue-cascader-select :options="options"
                    @select="(selected) => setType(this.dialogItem.condition.strapiId, selected.value)"
                    class="course_text" @clear="(val) => setType(this.dialogItem.condition.strapiId, '')"
                    :value="this.dialogItem.condition.type" style="margin-left:8px;width: fit-content; margin-top:8px" />
                </span>
                <!--Viewer-->
                <span v-if="isViewer">
                  {{ this.dialogItem.condition.type }}
                </span>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                After Perc. done:
              </v-col>
              <v-col>
                <!--Author-->
                <span v-if="isAuthor">
                  <Editable :type="'condition'" :value="dialogItem.condition.afterPercDone"
                    :id="dialogItem.condition.strapiId" :field="'afterPercDone'"
                    :placeholder="'After Perc. done condition for this' + dialogItem.contentType" @input="editableInput"
                    onclick="event.stopPropagation()" />
                </span>
                <!--Viewer-->
                <span v-if="isViewer">
                  {{ this.dialogItem.condition.afterPercDone }}
                </span>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { bus } from "@/main.js";
import Vue from 'vue';
import { mapGetters, mapMutations } from 'vuex';

import VueCascaderSelect from 'vue-cascader-select';
import Editable from '../../../../components/Editable.vue';

Vue.use(VueCascaderSelect);

export default {
  name: "MenuDialog",

  components:{
    VueCascaderSelect,
    Editable
  },

  props: {
    screenSize: {
      type: String,
      default: () => ""
    },
    dialogItem: {
      type: Object,
      default: () => {}
    },
    dialog: {
      type: Boolean,
      default: () => false
    }
  },

  watch:{
    dialog(newD){
      console.log(newD)
      bus.$emit("dialogChange",newD)
    }
  },

  data: () => ({
    options: [{ label: "AND", value: "AND" }, { label: "OR", value: "OR" }]
  }),

  computed:{
    ...mapGetters(["getRole", "getIconSmallSize"]),
    isStudent() {
      return this.getRole == "student";
    },
    isTeacher() {
      return this.getRole == "teacher" || this.getRole == "author" || this.getRole == "viewer";
    },
    isAuthor() {
      return this.getRole == "author";
    },
    isViewer() {
      return this.getRole == "viewer";
    }
  } ,

  methods:{
    ...mapMutations(["editableInput", "addGoalByCourseId", "deleteGoal", "addConditionByLMId"]),
    setType(id, value) {
      const obj = {
        id: id,
        value: value,
        field: "type",
        type: "condition"
      }
      this.editableInput(obj)
    }
  }
}
</script>

<style scoped></style>