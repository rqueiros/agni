<template>
  <v-app id="questionnaire">
    <v-dialog v-model="dialog" persistent max-width="750px" min-width="360px">
      <v-sheet class="text-center text-h4 py-4" color="pink accent-4" dark>
        JavaScript and Python no Agni
      </v-sheet>

      <v-sheet class="px-7 py-5">
        <v-sheet class="pa-1 px-2 mb-1" color="grey lighten-3">
          First and foremost, thank you very much for participating!
        </v-sheet>
        <v-sheet class="pa-1 px-2 mb-5" color="grey lighten-3">
          <div>
            - Complete all the exercises in the Agni Playground without any outside help.
          </div>
          <div>
            - After that answer some questions about your experience.
          </div>
          <div>
            - And most importantly, have fun! 😊 💻
          </div>
        </v-sheet>
        <v-btn v-if="!loading" @click="startEvaluation" class="w-full" color="pink accent-4" dark>Lets Get Started!</v-btn>
        <v-btn v-else class="w-full">Loading...</v-btn>
      </v-sheet>
    </v-dialog>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "Evaluation",

  data() {
    return {
      classId: 12,
      dialog: true,
      jwt: "",
      loading: true,
      studentId: "",
      serverData: {
        domain: "https://agni.dcc.fc.up.pt/strapi",
        //domain: "http://localhost:1337",
        authentication: "/api/auth/local",
        register: "/api/auth/local/register",
        me: "/api/users/me?populate=*",
        users: "/api/users",
        changePW: "/api/auth/change-password",
        sendEmail: "/api/sendEmail",
        upload: "/api/upload",
        courses: "/api/courses",
        expositives: "/api/expositives",
        evaluatives: "/api/evaluatives",
        questions: "/api/questions",
        statuses: "/api/statuses",
        occurrences: "/api/occurrences",
        classes: "/api/classes",
        students: "/api/students",
        content: "/api/content",
        gpt: "/api/gpt",
      },
    };
  },

  async mounted() {
    this.loading = true;
    await this.login(["teachertest@gmail.com", "1234567"]);
    let studentsLength = await this.getStudentsLength();
    const studentId = `0${studentsLength + 1}`;
    this.studentId = studentId;
    await this.createStudentUser({
      name: `Student${studentId}`,
      email: `studentEvaluation${studentId}@gmail.com`,
      password: `studentEvaluation${studentId}`,
    });
    this.loading = false;
  },

  methods: {
    async login(loginData) {
      const requestData = { identifier: loginData[0], password: loginData[1] };
      let url = this.serverData.domain + this.serverData.authentication;
      let jwt;
      await axios.post(url, requestData).then((resp) => {
        jwt = resp.data.jwt;
      });
      this.jwt = jwt;
    },
    async getStudentsLength() {
      let resp;
      let url = this.serverData.domain + this.serverData.students;
      await axios
        .get(url, {
          headers: {
            Authorization: "Bearer " + this.jwt,
          },
        })
        .then((response) => {
          resp = response.data.data;
        });
      return resp.length;
    },
    async createStudentUser(data) {
      let obj = {
        username: data.name,
        email: data.email,
        password: data.password,
      };
      const auth = "Bearer " + this.jwt;
      let url = this.serverData.domain + this.serverData.register;
      let id;
      let studentJWT;
      await axios
        .post(
          url,
          obj
        )
        .then((response) => {
          id = response.data.user.id;
          studentJWT = response.data.jwt;
        });
      let newUrl = this.serverData.domain + this.serverData.users + "/" + id;
      await axios.put(
        newUrl,
        { role: 6 },
        {
          headers: {
            Authorization: "Bearer " + studentJWT,
          },
        }
      );
      url = this.serverData.domain + this.serverData.students;
      await axios
        .post(
          url,
          {
            data: JSON.stringify({
              name: data.name,
              user: id,
              class: this.classId,
            }),
          },
          {
            headers: {
              Authorization: auth,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log(response.data);
        });
      return id;
    },
    async startEvaluation() {
      window.open(`https://agni.dcc.fc.up.pt/login?id=Student${this.studentId}&pw=studentEvaluation${this.studentId}`, '_blank');
      window.open(`https://docs.google.com/forms/d/e/1FAIpQLScPeO_oTJj7ETTJioVZidOrPj41uhTg_wjom69DR_4HIcSoKg/viewform?usp=pp_url&entry.596798923=Student${this.studentId}`, '_self');
    },
  },
};
</script>

<style></style>
