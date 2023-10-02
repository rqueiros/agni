<template>
  <div id="expositives" v-if="expositivesNotNull || isAuthor">
    <v-card 
      :flat="!expositivesNotNull && isAuthor"
      class="d-flex rounded-0 align-center" 
      style="border-left: 0; border-right: 0;"
      :style="{backgroundColor : $vuetify.theme.currentTheme.boxes}"
    >
      <!--Author-->
      <v-menu offset-y v-if="!expositivesNotNull && isAuthor">
        <template v-slot:activator="{ on, attrs }">
          <v-btn 
            v-bind="attrs" 
            v-on="on" 
            :small="getButtonMediumSize=='small'" 
            :medium="getButtonMediumSize=='medium'"
            height="36px"
            width="100%" 
            color="button"
          >
            <v-icon>mdi-plus</v-icon>Add Expositive
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item
            v-for="(item, index) in addExpositiveMenu" 
            :key="index" 
            class="text-center"
            :class="getSmallTextClass"
            @click="addExpositive(item.title)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-layout 
        column 
      >
        <v-app-bar flat color="boxes" class="pa-0" height="40">
          <v-tabs
            style="width:calc(100% - 44px)"
            center-active
            v-model="tab"
            color="error"
            grow
            show-arrows
            hide-slider
          >
            <v-tab 
              v-for="(item, i) in resource.expositives" 
              :key="i" 
              style="width:100px"
              :class="getSmallTextClass"
            >
              <!--Student & Viewer-->
              <span v-if="isStudent || isViewer">
                <v-icon 
                  v-if="isStudent || isViewer" 
                  :size="getIconMediumSize"
                >
                  {{ getIcon(item.type) }}
                </v-icon>
                {{item.name}}
              </span>

              <!--Author-->
              <span v-if="isAuthor" class="d-flex align-center">
                <Editable 
                  v-if="isAuthor" 
                  type="expositive" 
                  :value="item.name" 
                  :id="item.id" 
                  class="pr-1"
                  placeholder="Expositive name" 
                  field="name" 
                  @input="editableInput"
                  onclick="event.stopPropagation()" />
                <v-btn 
                  icon 
                  :x-small="getButtonSmallSize=='x-small'"
                  :small="getButtonSmallSize=='small'"
                  onclick="event.stopPropagation()"
                >
                  <v-icon 
                  v-if="isAuthor && !isExpositive" 
                  :size="getIconSmallSize" 
                  @click="deleteExpositive(item.id)">
                    mdi-delete
                  </v-icon>
                </v-btn>
              </span>
            </v-tab>
          </v-tabs>

          <!--Author-->
          <v-menu 
            offset-y 
            auto 
            v-if="(expositivesNotNull) && isAuthor && !isExpositive"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn 
                min-width="0"
                width="36px"
                height="36px"
                class="ma-1"
                v-bind="attrs" 
                v-on="on" 
                :small="getButtonMediumSize=='small'" 
                :medium="getButtonMediumSize=='medium'"
                color="button"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item 
                class="text-center"
                :class="getSmallTextClass"
                v-for="(item, index) in addExpositiveMenu" 
                :key="index" 
                @click="addExpositive(item.title)"
              >
                <v-list-item-title>
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-app-bar>

        <v-tabs-items v-model="tab">
          <v-tab-item
            v-for="(item, i) in resource.expositives"
            :key="i"
          >
            <Pdf v-if="item.type=='pdf'" :resource="item" :ref="'expo'+i"/>
            <Video v-else-if="item.type=='video'" :resource="item" :ref="'expo'+i" />
            <NewExpo v-else :resource="item" />
          </v-tab-item>
        </v-tabs-items>
      </v-layout>      
    </v-card>

    <SelectDialog 
    v-if="isAuthor"
    :dialog="dialog" 
    :type="'expositives'" 
    :already="resource.expositives.map(e => e.id)"
    @addExistingexpositives="addExistingExpo" 
    @closeSelectDialog="closeSelectDialog"/>

  </div>
</template>


<script>
import { bus } from "@/main.js";
import { mapActions, mapGetters, mapMutations } from "vuex";

import Editable from "../../../../gerneral/Editable.vue";
import SelectDialog from "../../../../gerneral/SelectDialog.vue";
import Pdf from "../pdf/Pdf.vue"
import Video from "../video/Video.vue"
import NewExpo from "../newExpo/NewExpo.vue"

export default {
  name: "Expositives",

  components: {
    Editable,
    SelectDialog,
    Pdf,
    Video,
    NewExpo
  },

  props: {
    resource: {
      type: Object,
      default: () => { }
    },
    isExpositive: {
      type: Boolean,
      default: () => false
    }
  },

  data() {
    return {
      tab: null,
      dialog:false,
      addExpositiveMenu: [
        { title: "NEW" }, 
        { title: "SELECT" }
      ],
    };
  },

  watch: {
    tab(newV) {
      bus.$emit("setIndex", newV);
    }
  },

  created() {},

  computed: {
    ...mapGetters("main", [
      "isStudent",
      "isTeacher",
      "isAuthor",
      "isViewer",
    ]),
    ...mapGetters("style", [
      "getIconSmallSize",
      "getIconMediumSize",
      "getSmallTextClass",
      "getIcon",
      "getButtonMediumSize",
      "getButtonSmallSize"
    ]),
    expositivesNotNull() {
      return this.resource.expositives.length > 0;
    }
  },

  methods: {
    ...mapMutations("main", [
      "addExpositiveByLessonId",
      "deleteExpositive",
      "editableInput"
    ]),
    ...mapActions("main", [
      "addExistingExpositives"
    ]),
    setMilestone(index) {
      this.$refs["expo"+this.tab][0].setMilestone(index);
    },
    addExpositive(title) {
      if (title == "NEW") {
        this.addExpositiveByLessonId(this.resource.id)
      } else if (title == "SELECT") {
        this.dialog=true;
      }
    },
    async addExistingExpo(ids){
      await this.addExistingExpositives([this.resource.id, ids])
      this.closeSelectDialog()
    },
    closeSelectDialog(){
      this.dialog=false
    },
  }
};
</script>


<style scoped>
/* Tab bar styles */
.theme--light.v-tabs .v-tab--active:hover::before, .theme--light.v-tabs .v-tab--active::before{
  opacity:0.12;
}
#expositives>>>.v-toolbar__content, .v-toolbar__extension{
  padding:0;
}
#expositives>>>.v-toolbar__content > .v-tabs:first-child, .v-toolbar__extension > .v-tabs:first-child{
  margin:0;
}
#expositives>>>.v-slide-group__next, .v-slide-group__prev{
  min-width: 24px;
}
</style>
