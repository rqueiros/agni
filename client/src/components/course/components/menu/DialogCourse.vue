<template>
  <div id="dialogCourse">
    <v-dialog v-model="localDialog" max-width="500px">
      <v-card>

        <v-card-title class="pb-2" :class="getSubtitleClass">
          Course - {{ dialogItem.name }}
        </v-card-title>

        <v-card-text>
          <v-list-item id="d_selectItem" class="pa-0">
            <v-list-item-content :class="getSmallTextClass">
              <div class="d-flex align-center">
                <span class="mr-4">Type:</span>
                <vue-cascader-select 
                  :options="options" 
                  @select="selected => setType(dialogItem.id, selected.value)"
                  :value="dialogItem.type" 
                  v-if="isAuthor" 
                />
                <span v-if="isViewer">{{ dialogItem.type }}</span>
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item class="pa-0">
            <v-list-item-content class="pb-0" :class="getSmallTextClass">
              <div class="d-flex">
                <div class="mr-4">Goals:</div>
                <v-list class="pa-0 mt-n3" width="100%">
                  <v-list-item 
                    v-for="goal of this.dialogItem.goals" 
                    :key="goal.id" 
                    dense       
                    class="pa-0"  
                  >
                    <v-list-item-content v-if="isAuthor">
                      <div class="d-flex align-center">
                        <span class="mr-2">-</span>
                        <div style="flex-grow:inherit">
                          <Editable 
                            :type="'goal'" 
                            :value="goal.goal" 
                            :id="goal.id" 
                            :field="'goal'" 
                            :placeholder="'Insert a goal'"
                            @input="editableInput" 
                            onclick="event.stopPropagation()" 
                          />
                        </div>
                        <v-btn 
                          icon 
                          class="ml-2" 
                          @click="deleteGoal(goal.id)" 
                          :x-small="getButtonSmallSize=='x-small'"
                          :small="getButtonSmallSize=='small'"
                        >
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

                  <v-list-item v-if="isAuthor" class="pa-0">
                    <v-list-item-content class="pa-1">
                      <v-btn 
                        @click="addGoalByCourseId(dialogItem.id)"
                        :small="getButtonMediumSize=='small'"
                        :medium="getButtonMediumSize=='medium'"
                      >
                        <v-icon>mdi-plus</v-icon>Goal
                      </v-btn>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </div>
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
      default: () => { return { 
        "afterWeek": "", 
        "afterPercDone": "", 
        "contentType": "",
        "type":""
      }}
    },
    dialog: {
      type: Boolean,
      default: () => false
    }
  },

  data() {
    return {
      localDialog:this.dailog,
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
      this.localDialog = newValue
    },
    localDialog(newValue) {
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
      "getButtonSmallSize",
      "getSmallTextClass",
      "getSubtitleClass",
      "getButtonMediumSize"
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
#d_selectItem>>>.vcs__select-menu {
  z-index: 204 !important;
  position:fixed !important;
  top:auto !important;
  left:auto !important;
  width:212px;
}
</style>