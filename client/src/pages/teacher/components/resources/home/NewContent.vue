<template>
  <div id="newContent" class="fill-height d-flex flex-column">
    <v-card-title class="d-flex justify-center align-center pr-8">
      <v-icon class="mr-2" color="#FFD700" large>
        mdi-lightbulb-on
      </v-icon>
      New Content !!
    </v-card-title>
    <v-card 
      outlined 
      elevation="1" 
      class="mx-6 mt-1" 
      style="background-color: transparent;"
    >
      <!--Error-->
      <div v-if="error" class="pa-10 d-flex justify-center flex-column">
        <ErrorChip/>
      </div>

      <!--Loading-->
      <div 
        v-else-if="loading" 
        class="d-flex justify-center align-center pa-10"
      >
        <v-progress-circular
          :size="120"
          indeterminate
          color="grey"
          :width="7"
        ></v-progress-circular>
      </div>

      <!--New Content-->
      <v-list v-else class="pa-0" style="background-color: transparent;">
        <v-list-item-group>
          <template v-for="(item, index) in newContents">
            <v-list-item 
              v-if="true"
              :key="index" 
              style="max-height:48px !important"
              @click="openCollectionType(item)" 
              @mouseover="setHover(index, true)" 
              @mouseleave="setHover(index, false)"
              :style="{ backgroundColor: isHovered[index] ? $vuetify.theme.currentTheme.hover : '' }"
            >
              <v-list-item-icon class="d-flex justify-center my-3 mr-6">
                <v-icon>
                  {{ getIcon(item.type) }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content 
                style="white-space: nowrap; text-overflow:ellipsis" 
                class="overflow-hidden text-subtitle-2 font-weight-regular"
              >
                {{ item.name }}
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="index<newContents.length-1" :key="index+'a'"/>
          </template>
        </v-list-item-group>
      </v-list>
    </v-card>
  </div>
</template>


<script>
import { bus } from "@/main.js";
import { mapGetters, mapActions } from "vuex";

import ErrorChip from "../../../../../components/gerneral/ErrorChip.vue"

export default {
  name: "newContent",

  components:{
    ErrorChip
  },

  data() {
    return {
      loading:true,
      error:false,
      isHovered: {},
      newContents: [],
    }
  },

  async created() {
    this.fetchContent()
  },

  computed: {
    ...mapGetters("style", ["getIcon"])
  },

  methods: {
    ...mapActions("request", [
      "fetchPrepareCollectionType",
      "fetchNewContents",
    ]),
    setHover(index, value) {
      this.$set(this.isHovered, index, value);
    },
    async openCollectionType(item) {
      try {
        await this.fetchPrepareCollectionType([item.id, item.contentType]);
        switch (item.contentType) {
          case "courses":
            bus.$emit("changePage", "content,Course");
            break;
          case "expositives":
            bus.$emit("changePage", "content,Expositive");
            break;
          case "evaluatives":
            bus.$emit("changePage", "content,Evaluative");
            break;
          case "questions":
            bus.$emit("changePage", "content,Question");
            break;
        }
      } catch (error) {
        console.log(error);
        bus.$emit(
          "errorSnackbar",
          "Something went wrong fetching the " + item.contentType
        );
      }
    },
    async fetchContent(){
      this.loading=true
      try {
        this.newContents = await this.fetchNewContents();
      } catch (error) {
        console.log(error);
        this.error = true
      }
      this.loading=false
    }
  }
}
</script>


<style scoped>
</style>
