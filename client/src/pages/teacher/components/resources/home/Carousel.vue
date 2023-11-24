<template>
  <div id="carousel" class="fill-height">
    <!--Error-->
    <div v-if="error" class="fill-height d-flex justify-center pa-10">
      <ErrorChip/>
    </div>

    <!--Loading-->
    <div 
      v-else-if="loading" 
      class="fill-height d-flex justify-center align-center"
    >
      <v-progress-circular
        :size="200"
        indeterminate
        color="grey"
        :width="7"
      ></v-progress-circular>
    </div>

    <!--Large Screen-->
    <v-carousel 
      v-else-if="occurrencePairs.length > 0 && $vuetify.breakpoint.mdAndUp" 
      cycle height="100%" 
      hide-delimiter-background
      :show-arrows="occurrencePairs.length > 1" 
      :show-arrows-on-hover="occurrencePairs.length > 1"
      :hide-delimiters="!(occurrencePairs.length > 1)"
    >
      <v-carousel-item v-for="(slide, index) in occurrencePairs" :key="index">
        <v-row class="fill-height" justify="center" no-gutters>
          <v-hover v-slot="{ hover }">
            <v-col 
              class="occurrence" 
              @click="openCollectionType(slide[0])" 
              :cols="slide.length==1 ? '12' : '6'"
            >
              <OccPreview :hover="hover" :occurrence="slide[0]" />
            </v-col>
          </v-hover>
          <v-divider 
            vertical 
            v-if="occurrencePairs[0].length > 1" 
            style="z-index:10" 
          />
          <v-hover v-if="occurrencePairs[0].length > 1" v-slot="{ hover }">
            <v-col 
              class="occurrence" 
              @click="openCollectionType(slide[1])" 
              cols="6"
            >
              <OccPreview :hover="hover" :occurrence="slide[1]" />
            </v-col>
          </v-hover>
        </v-row>
      </v-carousel-item>
    </v-carousel>

    <!--Small Screen-->
    <v-carousel 
      v-else-if="occurrences.length > 0" 
      cycle height="100%" 
      hide-delimiter-background
      :show-arrows="occurrences.length > 1" 
      :show-arrows-on-hover="occurrences.length > 1"
      :hide-delimiters="!(occurrences.length > 1)"
    >
      <v-carousel-item v-for="(slide, index) in occurrences" :key="index">
        <v-row class="fill-height" justify="center" no-gutters>
          <v-hover v-slot="{ hover }">
            <v-col class="occurrence" @click="openCollectionType(slide)">
              <OccPreview :hover="hover" :occurrence="slide" />
            </v-col>
          </v-hover>
        </v-row>
      </v-carousel-item>
    </v-carousel>

    <!--No Current Occurrences-->
    <div 
      v-else 
      class="fill-height d-flex justify-center flex-column align-center"
    >
      <div class="mb-4 text-h6 font-weight-regular">
        There are no current Occurrences !!
      </div>
      <div class="mb-8">
        <v-btn 
          color="primary"
          @click="addOccurrence()"
        >
          Create Occurrence
        </v-btn>
      </div>
    </div>
  </div>
</template>


<script>
import { bus } from "@/main.js";
import { mapActions } from "vuex";

import OccPreview from "./OccPreview.vue";
import ErrorChip from "../../../../../components/gerneral/ErrorChip.vue"

export default {
  name: "carousel",

  components: {
    OccPreview,
    ErrorChip
  },

  data() {
    return {
      hover: false,
      error:false,
      loading:true,
      occurrencePairs: [],
      occurrences: [],
    };
  },

  async created() {
    this.setItems();
  },

  methods: {
    ...mapActions("main", [
      "fetchCollectionTypes",
      "fetchPrepareCollectionType",
      "fetchEmptyOccurrence",
    ]),
    setHover(index, value) {
      this.$set(this.isHovered, index, value);
    },
    async setItems() {
      const parameters = { collectionType: "occurrences" };
      this.loading=true
      try {
        let items = await this.fetchCollectionTypes(parameters);
        this.occurrences = items.currentOcc
        items = items.currentOcc;
        let newList = [];
        if (items.length > 2) {
          for (let i = 0; i < items.length; i++) {
            const pair = [items[i], items[(i + 1) % items.length]];
            newList.push(pair);
          }
        } else if (items.length >= 1) {
          newList = [items];
        }
        this.occurrencePairs = newList;
      } catch (error) {
        console.log(error);
        this.error = true
      }
      this.loading=false
    },
    async openCollectionType(item) {
      try {
        await this.fetchPrepareCollectionType([item.id, "occurrences"]);
        bus.$emit("changePage", "student,Occurrence");
      } catch (error) {
        console.log(error);
        bus.$emit(
          "errorSnackbar",
          "Something went wrong fetching the Occurrence"
        );
      }
    },
    addOccurrence() {
      this.fetchEmptyOccurrence();
      bus.$emit("changePage", "student,Occurrence");
    },
  }
}
</script>


<style scoped>
.occurrence:hover {
  cursor: pointer;
}
</style>