<template>
  <div id="DialogModuleLesson">
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="pb-2" :class="getTitleClass">
          {{ dialogItem.contentType[0].toUpperCase() }}. {{ dialogItem.name }} - Condition:
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col class="text-center">
                After Week:
              </v-col>
              <v-col>
              </v-col>
              <v-col class="text-center">
                After Perc Done:
              </v-col>
            </v-row>
            <v-row class="mt-0">
              <v-col>
                <!--Author-->
                <span v-if="isAuthor">
                  <Editable :type="'condition'" :value="dialogItem.condition.afterWeek"
                    :id="dialogItem.condition.strapiId" :field="'afterWeek'" @input="editableInput"
                    onclick="event.stopPropagation()" />
                </span>
                <!--Viewer-->
                <span v-if="isViewer">
                  {{ this.dialogItem.condition.afterWeek }}
                </span>
              </v-col>
              <v-col class="py-0">
                <!--Author-->
                <span v-if="isAuthor">
                  <vue-cascader-select :placeholder="'Type'" :options="options" @select="selected =>
                    setType(
                      this.dialogItem.condition.strapiId,
                      selected.value
                    )" class="course_text mt-0 ml-0" @clear="val => setType(this.dialogItem.condition.strapiId, '')"
                    :value="this.dialogItem.condition.type" style="margin-left:8px;width: fit-content; margin-top:8px" />
                </span>
                <!--Viewer-->
                <span v-if="isViewer">
                  {{ this.dialogItem.condition.type }}
                </span>
              </v-col>
              <v-col>
                <!--Author-->
                <span v-if="isAuthor">
                  <Editable :type="'condition'" :value="dialogItem.condition.afterPercDone"
                    :id="dialogItem.condition.strapiId" :field="'afterPercDone'" @input="editableInput"
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
import Vue from "vue";
import { mapGetters, mapMutations } from "vuex";

import { bus } from "@/main.js";

import VueCascaderSelect from "vue-cascader-select";
import Editable from "../../../gerneral/Editable.vue";

Vue.use(VueCascaderSelect);

export default {
  name: "DialogModuleLesson",

  components: {
    VueCascaderSelect,
    Editable,
  },

  props: {
    dialogItem: {
      type: Object,
      default: () => { return { "afterWeek": "", "afterPercDone": "", "contentType": "a" } }
    },
    dialog: {
      type: Boolean,
      default: () => false
    }
  },

  data: () => ({
    options: [
      { label: "AND", value: "AND" },
      { label: "OR", value: "OR" }
    ]
  }),

  watch: {
    dialog(newValue) {
      bus.$emit("dialogModuleLessonChange", newValue);
    }
  },

  computed: {
    ...mapGetters([
      "isStudent",
      "isTeacher",
      "isViewer",
      "isAuthor",
      "getIconSmallSize",
      "getSmallTextClass",
      "getTitleClass"
    ]),
  },

  methods: {
    ...mapMutations([
      "editableInput",
    ]),
    setType(id, value) {
      const obj = {
        id: id,
        value: value,
        field: "type",
        type: "condition"
      };
      this.editableInput(obj);
    }
  }

}
</script>

<style scoped></style>