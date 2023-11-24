<template>
  <div id="occPreview" class="fill-height">
    <v-card 
      flat :color="hover ? 'hover' : 'boxes'" 
      class="pa-4 pb-6" 
      height="100%"
    >
      <v-row style="min-height:88px">
        <v-col cols="3" class="d-flex align-center justify-center">
          <v-icon size="xxx-large" color="primary">
            {{ getIcon(occurrence.course.type) }}
          </v-icon>
        </v-col>
        <v-col cols="9" class="d-flex justify-center flex-column">
          <div 
            class="text-h6 overflow-hidden" 
            style="white-space: nowrap; text-overflow: ellipsis;"
          >
            {{ occurrence.course.name }}
          </div>
          <div>
            {{ occurrence.year }}
          </div>
        </v-col>
      </v-row>
      <v-row class="mt-4">
        <v-col>
          <v-progress-linear rounded height="10"
            :value="progress" />
        </v-col>
      </v-row>
      <v-row style="min-height:150px" class="mt-6">
        <v-col class="px-5">
          <v-card 
            outlined 
            style="background-color: transparent; max-width: 350px;" 
            elevation="1" 
            class="mx-auto"
          >
            <!--Error-->
            <div v-if="error" class="pa-10 pb-15">
              <ErrorChip/>
            </div>

            <!--Loading-->
            <div v-else-if="loading" class="pa-10 d-flex justify-center">
              <v-progress-circular
                :size="120"
                indeterminate
                color="grey"
                :width="7"
              ></v-progress-circular>
            </div>

            <!--Occurrence Statistic-->
            <v-list 
              v-else 
              class="pa-0" 
              dense 
              style="background-color: transparent;"
            >
              <v-list-item style="min-height: 0px;">
                <v-list-item-content class="text-caption font-weight-bold py-2">
                  <div class="text-center">Student Performances</div>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <template v-for="(item, index) in items">
                <v-list-item 
                  :key="index" 
                  v-if="item.stop" 
                  style="min-height: 0px;"
                >
                  <v-list-item-content class="py-0">
                    <v-icon small>mdi-dots-horizontal</v-icon>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-else :key="index+'b'" style="min-height: 0px;">
                  <v-list-item-content
                    style="white-space: nowrap; text-overflow:ellipsis;" 
                    class="overflow-hidden text-subtitle-2 font-weight-regular"
                  >
                    {{ item.name }}
                  </v-list-item-content>
                  <v-list-item-icon class="d-flex justify-center mt-1 mx-1">
                    <v-chip
                      class="ma-1"
                      :color="getColor(item.performance)"
                      text-color="white"
                      small
                    >
                      {{ item.performance }}
                    </v-chip>
                  </v-list-item-icon>
                </v-list-item>
                <v-divider v-if="index<items.length-1" :key="index+'a'"/>
              </template>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>


<script>
import { mapGetters, mapActions } from "vuex";

import ErrorChip from "../../../../../components/gerneral/ErrorChip.vue"

export default {
  name: "occPreview",

  components:{
    ErrorChip
  },

  props: {
    hover: {
      type: Boolean,
      default: () => false
    },
    occurrence: {
      type: Object,
      default: () => null
    },
  },

  data() {
    return {
      items:[],
      error:false,
      loading:true,
    }
  },

  async created() {
    this.setItems();
  },

  computed: {
    ...mapGetters("style", ["getIcon"]),
    progress(){
      return ((new Date() - new Date(this.occurrence.startDate)) / 
        (new Date(this.occurrence.endDate) - new Date(this.occurrence.startDate))) 
        * 100
    }
  },

  methods: {
    ...mapActions("main", [
      "fetchOccStat"
    ]),
    async setItems(){
      this.loading=true
      try{
        let stat = await this.fetchOccStat(this.occurrence.id);
        if(stat.students.length>=3){
          this.items = [...stat.students.slice(0,3), {stop:true}, ...stat.students.slice(-3)]
        } else {
          this.items = stat.students
        }
      } catch (error){
        console.log(error)
        this.error = true
      }
      this.loading=false
    },
    getColor(num) {
      if (num > 80) {
        return "green";
      } else if (num > 50) {
        return "#F7BD03";
      } else {
        return "red";
      }
    },
  }
}
</script>


<style scoped>
</style>