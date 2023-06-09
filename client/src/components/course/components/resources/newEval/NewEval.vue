<template>
  <div id="newEval">
    <v-container fluid>
      <v-row>
        <v-col :cols="isSMsmaller ? 12 : 7">
          <v-card max-width="100%" outlined>
            <v-btn outlined @click="changeEvaluativeTypeById([getEvaluative.id, 'quiz'])">
              Quiz
            </v-btn>
            <v-btn outlined @click="changeEvaluativeTypeById([getEvaluative.id, 'code'])">
              ProgrammingEx
            </v-btn>
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