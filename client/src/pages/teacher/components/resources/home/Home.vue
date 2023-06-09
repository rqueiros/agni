<template>
  <div id="home" style="width:100%;" class="min_height">
    <v-container fluid class="pa-0 min-height">
      <v-row class="min_height" no-gutters>
        <v-col cols="8" class="pr-3">
          <v-card
            width="100%"
            outlined
            style="border-color: #C3C3C3;"
            class="fill-height"
          >
            current course sessions
            <template>
              <v-carousel
                cycle
                height="400"
                hide-delimiter-background
                show-arrows-on-hover
              >
                <v-carousel-item v-for="slide in slides" :key="slide + '2'">
                  <v-sheet>
                    <v-row class="fill-height" justify="center">
                      <div class="text-h2">{{ slide }} Slide</div>
                    </v-row>
                  </v-sheet>
                </v-carousel-item>
              </v-carousel>
            </template>
          </v-card>
        </v-col>
        <v-col cols="4" class="pl-3">
          <v-card
            width="100%"
            outlined
            style="border-color: #C3C3C3;"
            class="fill-height"
          >
            new contentss
            <template>

            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => ({
    type: "main",
    search: "",
    slides: ["a", "b"]
  })
};
</script>

<style></style>
