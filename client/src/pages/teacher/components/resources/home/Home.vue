<template>
  <div id="home" class="min_height">
    <v-container fluid class="pa-0 min_height" style="max-width: 1200px;">
      <v-row class="min_height">
        <v-col lg="8">
          <v-card 
            width="100%" 
            class="fill-height shadow"
            color="boxes" 
            max-height="500"
          >
            <Carousel />
          </v-card>
        </v-col>
        <v-col lg="4">
          <v-card 
            width="100%" 
            class="fill-height shadow pb-6" 
            color="boxes" 
            max-height="500"
          >
            <NewContent />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<script>
import Carousel from "./Carousel.vue";
import NewContent from "./NewContent.vue"

export default {
  name: "home",

  components: {
    Carousel,
    NewContent
  },
};
</script>


<style scoped>
</style>
