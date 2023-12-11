<template>
  <div id="dialogModuleLesson">
    <v-dialog v-model="localDialog" max-width="500px">
      <v-card v-if="dialog">
        <v-card-title class="pb-2" :class="getSubtitleClass">
          {{ dialogItem.contentType[0].toUpperCase() }}. {{ dialogItem.name }} -
          Condition:
        </v-card-title>

        <v-card-text style="color:rgba(0, 0, 0, 0.87)">
          <v-container fluid :class="getSmallTextClass">
            <v-row>
              <v-col class="text-center">
                After Week:
              </v-col>
              <v-col> </v-col>
              <v-col class="text-center">
                After Perc Done:
              </v-col>
            </v-row>
            <v-row class="mt-0">
              <v-col>
                <!--Author-->
                <span v-if="isAuthor">
                  <Editable
                    :type="'condition'"
                    :value="
                      dialogItem.condition.afterWeek == null
                        ? ''
                        : dialogItem.condition.afterWeek.toString()
                    "
                    :id="dialogItem.condition.id"
                    :field="'afterWeek'"
                    @input="editableInput"
                    onclick="event.stopPropagation()"
                  />
                </span>
                <!--Viewer-->
                <span v-if="isViewer">
                  {{ this.dialogItem.condition.afterWeek }}
                </span>
              </v-col>
              <v-col class="py-0">
                <!--Author-->
                <span v-if="isAuthor">
                  <vue-cascader-select
                    :placeholder="'Type'"
                    :options="options"
                    @select="
                      selected =>
                        setType(dialogItem.condition.id, selected.value)
                    "
                    @clear="val => setType(dialogItem.condition.id, null)"
                    :value="
                      dialogItem.condition.type == null
                        ? ''
                        : dialogItem.condition.type
                    "
                  />
                </span>
                <!--Viewer-->
                <span v-if="isViewer">
                  {{ this.dialogItem.condition.type }}
                </span>
              </v-col>
              <v-col>
                <!--Author-->
                <span v-if="isAuthor">
                  <Editable
                    :type="'condition'"
                    :value="
                      dialogItem.condition.afterPercDone == null
                        ? ''
                        : dialogItem.condition.afterPercDone.toString()
                    "
                    :id="dialogItem.condition.id"
                    :field="'afterPercDone'"
                    @input="editableInput"
                    onclick="event.stopPropagation()"
                  />
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
import { mapGetters, mapActions } from "vuex";
import { bus } from "@/main.js";

import VueCascaderSelect from "vue-cascader-select";
import Editable from "../../../gerneral/Editable.vue";

Vue.use(VueCascaderSelect);

export default {
  name: "DialogModuleLesson",

  components: {
    VueCascaderSelect,
    Editable
  },

  props: {
    dialogItem: {
      type: Object,
      default: () => {
        return {
          afterWeek: "",
          afterPercDone: "",
          contentType: "",
          type: ""
        };
      }
    },
    dialog: {
      type: Boolean,
      default: () => false
    }
  },

  data() {
    return {
      localDialog: this.dialog,
      options: [
        { label: "AND", value: "AND" },
        { label: "OR", value: "OR" }
      ]
    };
  },

  watch: {
    dialog(newValue) {
      this.localDialog = newValue;
    },
    localDialog(newValue) {
      bus.$emit("dialogModuleLessonChange", newValue);
    }
  },

  computed: {
    ...mapGetters("request", ["isStudent", "isTeacher", "isViewer", "isAuthor"]),
    ...mapGetters("style", [
      "getIconSmallSize",
      "getSmallTextClass",
      "getSubtitleClass"
    ])
  },

  methods: {
    ...mapActions("main", ["editableInput"]),
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
};
</script>

<style scoped></style>
