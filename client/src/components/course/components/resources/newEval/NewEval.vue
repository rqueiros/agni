<template>
  <div id="newEval">
    <v-container fluid>
      <v-row>
        <v-col :cols="isSMsmaller ? 12 : 7">
          <v-card :outlined="!isEvaluative" :class="isEvaluative ? 'shadow' : ''" height="200px">
            <v-row no-gutters style="height: 100%;">
              <v-col cols="6">
                <v-btn 
                  outlined 
                  @click="changeEvaluativeTypeById([getEvaluative.id, 'quiz'])"
                  width="100%"
                  height="100%"
                  style="border-color: rgba(0, 0, 0, 0.12);"
                >
                  Quiz
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn 
                  outlined 
                  @click="changeEvaluativeTypeById([getEvaluative.id, 'code'])"
                  width="100%"
                  height="100%"
                  style="border-color: rgba(0, 0, 0, 0.12);"
                >
                  Programming Ex
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: "NewEval",

  props: {
    isEvaluative: {
      type: Boolean,
      default: () => false
    },
  },

  computed: {
    ...mapGetters("main", ["getEvaluative"]),
    ...mapGetters("style", ["isSMsmaller"])
  },

  methods:{
    ...mapMutations("main", ["changeEvaluativeTypeById"])
  },

}
</script>


<style scoped></style>