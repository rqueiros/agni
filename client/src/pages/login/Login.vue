<template>
  <div id="app">
    <v-app>
      <v-dialog v-model="dialog" persistent max-width="600px" min-width="360px">
        <div v-if="loading" class="pa-8 text-center">
          <v-progress-circular
            :size="200"
            indeterminate
            color="pink accent-4"
            :width="7"
          ></v-progress-circular>
        </div>
        <div v-else>
          <v-tabs
            v-model="tab"
            show-arrows
            background-color="pink accent-4"
            icons-and-text
            dark
            grow
          >
            <v-tabs-slider color="purple darken-4"></v-tabs-slider>
            <v-tab v-for="i in tabs" :key="i.id">
              <v-icon large>{{ i.icon }}</v-icon>
              <div class="caption py-1">{{ i.name }}</div>
            </v-tab>
            <v-tab-item>
              <v-card class="px-4">
                <v-card-text>
                  <v-row>
                    <v-col>
                      <v-btn
                        class="ma-2"
                        outlined
                        @click="studentLogin"
                        width="100%"
                      >
                        Student Guest
                        <v-icon right> mdi-login-variant </v-icon>
                      </v-btn>
                    </v-col>
                    <v-col>
                      <v-btn
                        class="ma-2"
                        outlined
                        @click="teacherlogin"
                        width="100%"
                      >
                        Teacher Guest
                        <v-icon right> mdi-login-variant </v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card class="px-4">
                <v-card-text>
                  <v-form ref="loginForm" v-model="valid" lazy-validation>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="loginEmail"
                          :rules="loginEmailRules"
                          label="E-mail"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="loginPassword"
                          :append-icon="show1 ? 'eye' : 'eye-off'"
                          :rules="[rules.required, rules.min]"
                          :type="show1 ? 'text' : 'password'"
                          name="input-10-1"
                          label="Password"
                          hint="At least 8 characters"
                          counter
                          @click:append="show1 = !show1"
                        ></v-text-field>
                      </v-col>
                      <v-spacer></v-spacer>
                      <v-col class="d-flex" cols="12" xsm="12" align-end>
                        <v-btn
                          class="ma-2"
                          outlined
                          :color="loginError ? 'error' : ''"
                          @click="validate"
                        >
                          LOGIN
                          <v-icon right> mdi-login-variant </v-icon>
                        </v-btn>
                        <div
                          class="d-flex align-center ma-2"
                          style="color:red"
                          v-if="loginError"
                        >
                          Invalid login credentials. Please try again.
                        </div>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card class="px-4">
                <v-card-text>
                  <v-form ref="registerForm" v-model="valid" lazy-validation>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="firstName"
                          :rules="[rules.required]"
                          label="First Name"
                          maxlength="20"
                          required
                          disabled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="lastName"
                          :rules="[rules.required]"
                          label="Last Name"
                          maxlength="20"
                          required
                          disabled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="email"
                          :rules="emailRules"
                          label="E-mail"
                          required
                          disabled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="password"
                          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                          :rules="[rules.required, rules.min]"
                          :type="show1 ? 'text' : 'password'"
                          name="input-10-1"
                          label="Password"
                          hint="At least 6 characters"
                          counter
                          @click:append="show1 = !show1"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          block
                          v-model="verify"
                          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                          :rules="[rules.required, passwordMatch]"
                          :type="show1 ? 'text' : 'password'"
                          name="input-10-1"
                          label="Confirm Password"
                          counter
                          @click:append="show1 = !show1"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <v-spacer></v-spacer>
                      <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
                        <v-btn outlined disabled @click="validate">
                          REGISTER
                          <v-icon right> mdi-login-variant </v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </div>
      </v-dialog>
    </v-app>
  </div>
</template>

<script>
import { bus } from "@/main.js";

import { mapActions, mapMutations } from "vuex";

export default {
  computed: {
    passwordMatch() {
      return () => this.password === this.verify || "Password must match";
    }
  },
  methods: {
    ...mapActions("request", ["login", "fetchCollectionTypes", "fetchPrepareCollectionType"]),
    ...mapMutations("request", ["setLogin"]),
    ...mapMutations("main", ["setGpt"]),
    async studentLogin() {
      await this.login(["Student Lastname", "123456"]);
    },
    async teacherlogin() {
      await this.login(["teachertest@gmail.com", "1234567"]);
    },
    async validate() {
      if (this.$refs.loginForm.validate()) {
        try {
          this.loginError = false;
          await this.login([this.loginEmail, this.loginPassword]);
        } catch (err) {
          this.loginError = true;
        }
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  },
  data: () => ({
    loginError: false,
    loading:true,

    dialog: true,
    tab: 0,
    tabs: [
      { name: "Guest", icon: "mdi-account-box-multiple" },
      { name: "Login", icon: "mdi-account" },
      { name: "Register", icon: "mdi-account-outline" }
    ],
    valid: true,

    firstName: "",
    lastName: "",
    email: "",
    password: "",
    verify: "",
    loginPassword: "",
    loginEmail: "",
    loginEmailRules: [
      v => !!v || "Required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    emailRules: [
      v => !!v || "Required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],

    show1: false,
    rules: {
      required: value => !!value || "Required.",
      min: v => (v && v.length >= 6) || "Min 6 characters"
    }
  }),

  async created(){
    // http://localhost:8080/login?id=teachertest@gmail.com&pw=1234567&gpt=false
    const params = this.$route.query
    if ("id" in params && "pw" in params){
      try{
        await this.login([params.id, params.pw]);
        bus.$emit("changePage", "content,Course");

        const parameters = { collectionType: "courses" };
        let items = await this.fetchCollectionTypes(parameters);
        let id = items[0].id
        await this.fetchPrepareCollectionType([id, "courses"]);
        if ("gpt" in params && params.gpt=="false"){
          this.setGpt(false)
          bus.$emit("openCourse", "no");
        } else {
          bus.$emit("openCourse", "gpt");
        }
        console.log("here")
      } catch(error){
        console.log(error)
      }
    }
    this.loading = false
  }
};
</script>
