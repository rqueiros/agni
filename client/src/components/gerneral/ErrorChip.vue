<template>
  <div id="errorChip">
    <v-chip
      color="error"
      class="pa-1"
      outlined
      label
      style="height:fit-content;"
    >
      <div class="error--text text-center">Error!</div>
      <div class="error--text text-center" style="white-space:break-spaces">
        Reload the Page or check your Internet connection
      </div>
    </v-chip>
  </div>
</template>

<script>
export default {
  name: "errorChip"
}
</script>

<style scoped>
#errorChip>>>.v-chip .v-chip__content{
  flex-direction: column;
  display: flex;
}
</style>