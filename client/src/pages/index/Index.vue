<template>
  <v-app>
    <v-main class="parent">
      <v-container fluid>
        <v-img :src="require('../../assets/learnJS.png')"></v-img>
        <v-btn class="ma-2" outlined color="black" @click="login">
          LOGIN
          <v-icon dark right>
            mdi-login-variant
          </v-icon>
        </v-btn>
        <v-btn class="ma-2" outlined color="black" @click="go">
          GITHUB
          <v-icon dark right>
            mdi-github
          </v-icon>
        </v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
export default {
  name: "App",
  methods: {
    login() {
      this.$router.push({ name: "Login" });
    },
    go() {
      location.href = "https://github.com/rqueiros/learnjs";
    }
  }
};
</script>

<style scoped>
.parent {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 412px;
  height: 131px;
  margin-top: -65px; /* Half the height */
  margin-left: -206px; /* Half the width */
}
</style>
