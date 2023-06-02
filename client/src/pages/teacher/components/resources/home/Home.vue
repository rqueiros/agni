<template>
  <div id="main" style="width:100%;">
    <v-container class="pa-0 mb-4">
      <v-row no-gutters class="mb-4">
        <v-col>
          <v-text-field
            v-model="search"
            style="background-color: white;"
            prepend-inner-icon="mdi-magnify"
            label="Search for Students, Classes, Courses, ..."
            single-line
            class="pa-0 ma-0"
            outlined
            dense
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col class="mr-2">
          <v-card
            width="100%"
            outlined
            style="border-color: #C3C3C3;"
            height="400px"
          >
            <!--TODO exchange height for relative-->
            current course sessions
            <template>
              <v-carousel
                cycle
                height="400"
                hide-delimiter-background
                show-arrows-on-hover
              >
                <v-carousel-item v-for="slide in slides" :key="slide + '2'">
                  <v-sheet height="100%">
                    <v-row class="fill-height" align="center" justify="center">
                      <div class="text-h2">{{ slide }} Slide</div>
                    </v-row>
                  </v-sheet>
                </v-carousel-item>
              </v-carousel>
            </template>
          </v-card>
        </v-col>
        <v-col class="mx-2">
          <v-card
            width="100%"
            outlined
            style="border-color: #C3C3C3;"
            height="400px"
          >
            Student news
          </v-card>
        </v-col>
        <v-col class="ml-2">
          <v-card
            width="100%"
            outlined
            style="border-color: #C3C3C3;"
            height="400px"
          >
            new contentss
            <template>
              <v-carousel
                cycle
                height="400"
                hide-delimiter-background
                show-arrows-on-hover
              >
                <v-carousel-item v-for="slide in slides" :key="slide">
                  <v-sheet height="100%">
                    <v-row class="fill-height" align="center" justify="center">
                      <div class="text-h2">{{ slide }} Slide</div>
                    </v-row>
                  </v-sheet>
                </v-carousel-item>
              </v-carousel>
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
