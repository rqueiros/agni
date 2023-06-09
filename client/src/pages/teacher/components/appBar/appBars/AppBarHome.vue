<template>
  <div id="appBarHome">
    <v-app-bar rounded elevation="1" height="auto" outlined style="background-color: #F7F8F9;" class="pa-2">

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <span class="mx-4" v-bind="attrs" v-on="on"> {{ title }}
          </span>
        </template>
        <span>{{ description }}</span>
      </v-tooltip>

      <v-spacer></v-spacer>

      <v-text-field label="Search" outlined dense hide-details disabled></v-text-field>
      <!--TODO implement Search-->

      <v-spacer></v-spacer>

    

    </v-app-bar>
  </div>
</template>
  
<script>
export default {
  name: "AppBarHome",

  components: {},

  props: {
    title: {
      type: String,
      default: () => ""
    },
    description: {
      type: String,
      default: () => ""
    }
  },

  data() {return {};},

  computed: {},

  methods: {},
}
</script>
  
<style scoped></style>