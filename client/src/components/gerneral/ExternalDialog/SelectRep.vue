<template>
  <div id="selectRep">
    <v-card>
      <v-card-title>
        Choose an external library
      </v-card-title>

      <v-card-text class="pb-2">
        <v-container>
          <v-row>
            <v-col>
              <v-hover v-slot="{ hover }">
                <v-card
                  class="d-flex justify-center align-center hover"
                  :color="hover ? 'hover' : ''"
                  @click="$emit('changeType', 'authorkit')"
                >
                  <v-img
                    :src="require('@/assets/authorkit.png')"
                    height="150"
                    contain
                  ></v-img>
                </v-card>
              </v-hover>
            </v-col>
            <v-col>
              <v-card
                style="min-height:100%"
                class="d-flex justify-center align-center"
              >
                Other Repositories will come
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn text @click="localDialog = false">
          Cancel
        </v-btn>
        <v-btn text>
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "SelectRep",

  methods: {}
};
</script>

<style scoped>
.hover:hover {
  cursor: pointer;
}
</style>
