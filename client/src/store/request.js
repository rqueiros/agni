import axios from "axios";
import router from "../router";

const FormData = require("form-data");

const request = {
  namespaced: true,
  state: {
    login: false,
    user: {},
    role: "",
    jwt: "",
    accountEditable: false,
  },
  getters:{
    //------------------------Authentication----------------------------------
    isLogged: state => state.login,
    getRole: state => state.role,
    getUser: state => state.user,
    getUsername: state => state.user.username,
    getUserEmail: state => state.user.email,
    getAccountEditable: state => state.accountEditable,

    isStudent: state => state.role == "student",
    isTeacher: state => state.role == "author" || state.role == "viewer",
    isAuthor: state => state.role == "author",
    isViewer: state => state.role == "viewer",

    getDomain: () => serverData.domain,
    getJWT: state => state.jwt,
  },
  mutations: {
    //-----------------------Authentication-----------------------------------
    setLogin(state, login) {
      state.login = login;
    },
    setJWT(state, jwt) {
      state.jwt = jwt;
    },
    setUser(state, user) {
      state.user = user;
    },
    setRole(state, role) {
      state.role = role;
    },
    logout(state) {
      state.login = false;
      state.user = {};
      state.role = "";
      state.jwt = "";
      state.changed = false;
      this.commit("main/deleteStructure");
    },
    setAccountEditable(state, value) {
      state.accountEditable = value;
    },
    setUserField(state, [field, value]) {
      const us = state.user;
      if (us[field] != value) this.commit("main/setChanged", true);
      us[field] = value;
    },
  },
  actions: {
    //--------Authentication
    async login(state, loginData) {
      const requestData = { identifier: loginData[0], password: loginData[1] };
      let url = serverData.domain + serverData.authentication;
      await axios.post(url, requestData).then(resp => {
        this.commit("request/setJWT", resp.data.jwt);
        this.commit("request/setUser", resp.data.user);
      });
      let role;
      const auth = "Bearer " + state.getters.getJWT;
      url = serverData.domain + serverData.me;
      await axios
        .get(url, {
          headers: {
            Authorization: auth
          }
        })
        .then(resp => {
          role = resp.data.role.type;
          this.commit("request/setUser", resp.data);
        });
      this.commit("request/setRole", role);
      this.commit("request/setLogin", true);
      role = role.charAt(0).toUpperCase() + role.slice(1);
      if (role == "Student") await this.dispatch("request/fetchCourse");
      router.push({ name: role });
    },

    //--------Student
    async setProgress(state, payload) {
      const auth = "Bearer " + state.getters.getJWT;
      const evaluative = state.rootGetters["main/getEvaluativeByStatus"](payload);
      const url =
        serverData.domain + serverData.statuses + "/" + evaluative.status.id;
      await axios.put(
        url,
        { data: payload.data },
        {
          headers: {
            Authorization: auth
          }
        }
      );
      if ("grade" in payload.data) {
        //await this.dispatch("request/fetchCourse");
      }
    },
    async fetchCourse(state) {
      const auth = "Bearer " + state.getters.getJWT;
      let resp;
      const url = serverData.domain + serverData.courses;
      await axios
        .get(url, {
          headers: {
            Authorization: auth
          }
        })
        .then(response => {
          resp = response.data.data[0]; //TODO resp is list [idMenu:0, {}]
        });
      const course = await this.dispatch("convert/prepareCourses", [
        resp,
        false
      ]);
      await this.commit("main/setCourses", [course]);
    },

    //--------Home
    async fetchContents(state, parameters) {
      const auth = "Bearer " + state.getters.getJWT;
      let resp;
      let url = serverData.domain + serverData.content;
      await axios
        .get(url, {
          headers: {
            Authorization: auth
          },
          params: parameters
        })
        .then(response => {
          resp = response.data;
        });
      return resp;
    },
    async fetchNewContents(state) {
      const auth = "Bearer " + state.getters.getJWT;
      let resp;
      let url = serverData.domain + serverData.content;
      let params = { populate: "newContents" };
      await axios
        .get(url, {
          headers: {
            Authorization: auth
          },
          params: params
        })
        .then(response => {
          resp = response.data;
        });
      return resp;
    },

    //--------Account
    async updateUser(state) {
      const auth = "Bearer " + state.getters.getJWT;
      let url = serverData.domain + serverData.users;
      let data = state.getters.getUser;
      url += "/" + data.id;
      await axios.put(url, data, {
        headers: {
          Authorization: auth
        }
      });
    },
    async changePW(state) {
      const auth = "Bearer " + state.getters.getJWT;
      let url = serverData.domain + serverData.changePW;
      let data2 = state.getters.getUser;
      let data = {
        currentPassword: data2.currentPW,
        password: data2.newPW,
        passwordConfirmation: data2.newPW2
      };
      await axios.post(url, data, {
        headers: {
          Authorization: auth
        }
      });
    },
    async getTeachersContent(state) {
      const auth = "Bearer " + state.getters.getJWT;
      let url = serverData.domain + serverData.me;
      let resp;
      await axios
        .get(url, {
          headers: {
            Authorization: auth
          }
        })
        .then(response => {
          resp = response.data;
        });
      return resp;
    },
    async updateUserImage(state, image) {
      const auth = "Bearer " + state.getters.getJWT;
      let url = serverData.domain + serverData.users;
      let data = state.getters.getUser;
      url += "/" + data.id;

      let data2 = {};
      if (image == null || ("data" in image && image.data == null)) {
        data2.image = null;
      } else {
        let url2 = serverData.domain + serverData.upload;
        let id;
        const formData = new FormData();
        formData.append("files", image);
        await axios
          .post(url2, formData, {
            headers: {
              Authorization: auth,
              "Content-Type": "multipart/form-data"
            }
          })
          .then(resp => {
            id = resp.data[0].id;
            data2.image = id;
          });
      }
      await axios.put(url, data2, {
        headers: {
          Authorization: auth
        }
      });
    },

    //--------Multiple Collection Types
    async fetchCollectionTypes(state, parameters) {
      const auth = "Bearer " + state.getters.getJWT;
      let resp;
      let url = serverData.domain + serverData[parameters.collectionType];
      let params = {
        "sort": "updatedAt:desc"
      };
      if (parameters.my) {
        params["filters[author][id][$eq]"] = state.getters.getUser.id;
      }
      if (parameters.draft) {
        params["filters[publishedAt][$notNull]"] = "";
      }
      await axios
        .get(url, {
          headers: {
            Authorization: auth
          },
          params: params
        })
        .then(response => {
          resp = response.data.data;
        });
      switch (parameters.collectionType) {
        case "courses":
          resp = await this.dispatch("convert/cleanCourseData", resp);
          break;
        case "expositives":
          resp = await this.dispatch("convert/cleanExpositiveData", resp);
          break;
        case "evaluatives":
          resp = await this.dispatch("convert/cleanEvaluativeData", resp);
          break;
        case "questions":
          resp = await this.dispatch("convert/cleanQuestionData", resp);
          break;
        case "occurrences":
          resp = await this.dispatch("convert/cleanOccurrenceData", resp);
          break;
      }
      return resp;
    },

    //--------One Instance of Collection Type
    async fetchPrepareCollectionType(state, [id, collectionType]) {
      this.commit("main/deleteStructure");

      let resp = await this.dispatch("request/fetchCollectionType", [
        id,
        collectionType
      ]);

      if (
        resp.attributes.author.data != null &&
        resp.attributes.author.data.id == state.getters.getUser.id
      ) {
        this.commit("request/setRole", "author");
      } else {
        this.commit("request/setRole", "viewer");
      }

      let collectionTypeName = collectionType.charAt(0).toUpperCase() + collectionType.slice(1);
      let instance = await this.dispatch(`convert/prepare${collectionTypeName}`, [
        resp,
        false
      ]);
      if (collectionType == "courses" && state.getters.getRole == "author"){
        instance = await this.dispatch("main/makeCourseEditable", instance);
      }
      this.commit(`main/set${collectionTypeName}`, [instance]);
    },
    async fetchCollectionType(state, [id, collectionType]) {
      const auth = "Bearer " + state.getters.getJWT;
      let resp;
      const url = serverData.domain + serverData[collectionType] + "/" + id;
      await axios
        .get(url, {
          headers: {
            Authorization: auth
          }
        })
        .then(response => {
          resp = response.data.data;
        });
      return resp;
    },
    async deleteCollectionType(state, [id, collectionType]) {
      const auth = "Bearer " + state.getters.getJWT;
      let url = serverData.domain + serverData[collectionType] + "/" + id;
      await axios.delete(url, {
        headers: {
          Authorization: auth
        }
      });
      this.commit("main/deleteStructure");
    },
    async copyCollectionType(state, [id, collectionType]) {
      this.commit("main/deleteStructure");
      this.commit("main/setChanged", true);
      let resp = await this.dispatch("request/fetchCollectionType", [
        id,
        collectionType
      ]);
      resp.attributes.new = true;
      this.commit("request/setRole", "author");
      if (collectionType == "expositives") {
        this.dispatch("request/prepareExpositive", [resp, true]);
      } else if (collectionType == "evaluatives") {
        this.dispatch("request/prepareEvaluative", [resp, true]);
      } else if (collectionType == "questions") {
        this.dispatch("request/prepareQuestion", [resp, true]);
      } else if (collectionType == "occurrences") {
        this.dispatch("request/prepareOccurrence", [resp, true]);
      } else if (collectionType == "classes") {
        this.dispatch("request/prepareClass", resp);
      } else if (collectionType == "students") {
        this.dispatch("request/prepareStudent", resp);
      } else if (collectionType == "statuses") {
        this.dispatch("request/prepareStatus", resp);
      }
    },
    async publishCollectionType(state, collectionType) {
      const func = collectionType.charAt(0).toUpperCase() + collectionType.slice(1, -1);
      let data = state.rootGetters[`main/get${func}`];
      let publishedAt = data.publishedAt;
      let id = data.id;
      if (publishedAt == null) {
        const now = new Date();
        publishedAt = now.toISOString();
      } else {
        publishedAt = null;
      }
      const auth = "Bearer " + state.getters.getJWT;
      let url = serverData.domain + serverData[collectionType] + "/" + id;

      const formData = new FormData();
      formData.append("data", JSON.stringify({ publishedAt: publishedAt }));

      await axios.put(url, formData, {
        headers: {
          Authorization: auth,
          "Content-Type": "multipart/form-data"
        }
      });

      if (collectionType == "courses") {
        this.commit("main/setCoursePublishedAt", [id, publishedAt]);
      } else if (collectionType == "expositives") {
        this.commit("main/setExpositivePublishedAt", [id, publishedAt]);
      } else if (collectionType == "evaluatives") {
        this.commit("main/setEvaluativePublishedAt", [id, publishedAt]);
      } else if (collectionType == "questions") {
        this.commit("main/setQuestionPublishedAt", [id, publishedAt]);
      } else if (collectionType == "occurrences") {
        this.commit("main/setOccurrencePublishedAt", [id, publishedAt]);
      }

      if (publishedAt == null) {
        return "unpublish";
      } else {
        return "publish";
      }
    },
    async saveCollectionType(state, collectionType) {
      const func = collectionType.charAt(0).toUpperCase() + collectionType.slice(1, -1);
      let data = state.rootGetters[`main/get${func}`];
      if (func == "Course" || func == "Evaluative"){
        const valid = await this.dispatch("request/validate")
        if (!valid) {
          throw "Missing Evaluative Type or Test Type"
        }
      }
      this.commit("main/setValidated", false)
      let files;
      const isNew = data.new ? true : false;
      [data, files] = await this.dispatch(`convert/prepare${func}ForServer`,data);
      const auth = "Bearer " + state.getters.getJWT;
      let url = serverData.domain + serverData[collectionType];
      let resp;
      let id;
      if (isNew) {
        delete data.new;
        delete data.id;
        data.publishedAt = null;
        await axios
          .post(
            url,
            { data: { publishedAt: null } },
            {
              headers: {
                Authorization: auth
              }
            }
          )
          .then(response => {
            resp = response.data;
            id = resp.id;
          });
      } else {
        id = data.id;
      }
      url += "/" + id;

      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      files.forEach(file => {
        if (file.type == "image") {
          formData.append("files.image", file.file);
        } else if (file.type == "file") {
          formData.append("files.file", file.file);
        }
      });

      await axios.put(
        url,
        formData, //{ data: data },
        {
          headers: {
            Authorization: auth,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      await this.dispatch("request/fetchPrepareCollectionType", [
        id,
        collectionType
      ]);
    },
    validate(state){
      this.commit("main/setValidated", true)
      const evaluatives = state.rootGetters[`main/getEvaluatives`];
      let valid = true
      evaluatives.forEach(evaluative => {
        if (evaluative.contentType == "code"){
          if (evaluative.type == null){
            valid = false
            evaluative.valid = false
          }
          evaluative.tests.forEach(test => {
            if (test.type == null){
              valid = false
              evaluative.valid = false
            }
          })
        }
      })
      return valid
    },
    async fetchCloneBody(state, id) {
      const auth = "Bearer " + state.getters.getJWT;
      let resp;
      let params = { populate: "cloneBody" };
      const url = serverData.domain + serverData.courses + "/" + id;
      await axios
        .get(url, {
          headers: {
            Authorization: auth
          },
          params: params
        })
        .then(response => {
          resp = response.data.data;
        });
      return this.dispatch("convert/prepareCloneCourse", resp);
    },
    async fetchClone(state, bodyData) {
      const auth = "Bearer " + state.getters.getJWT;
      let resp;
      let params = { populate: "cloneData" + JSON.stringify(bodyData) };
      const url = serverData.domain + serverData.courses + "/" + bodyData.id;
      await axios
        .get(url, {
          headers: {
            Authorization: auth
          },
          params: params
        })
        .then(response => {
          resp = response.data.data;
        });
      resp.new = true;
      this.commit("main/deleteStructure");
      this.commit("request/setRole", "author");
      this.commit("main/setChanged", true);
      this.dispatch("request/prepareCourse", [resp, true]);
    },

    //--------Add Existing Collcetiuon Types
    async addExistingExpositives(state, [lessonId, expositveIds]) {
      this.commit("main/setChanged", true);
      for (let expositveId of expositveIds) {
        let expositive = await this.dispatch("request/fetchCollectionType", [
          expositveId,
          "expositives"
        ]);
        expositive = await this.dispatch("convert/prepareExpositives", [
          expositive,
          false
        ]);
        let lesson = state.rootGetters["main/getLessonByID"](lessonId)
        lesson.expositives.push(expositive);
      }
      //this.commit("main/setChanged", false);
    },
    async addExistingEvaluatives(state, [lessonId, evalutaiveIds]) {
      this.commit("main/setChanged", true);
      for (let evaluativeId of evalutaiveIds) {
        let evaluative = await this.dispatch("request/fetchCollectionType", [
          evaluativeId,
          "evaluatives"
        ]);
        evaluative = await this.dispatch("convert/prepareEvaluatives", [
          evaluative,
          false
        ]);
        let lesson = state.rootGetters["main/getLessonByID"](lessonId)
        lesson.evaluatives.push(evaluative);
      }
      //this.commit("main/setChanged", false);
    },
    async addExistingQuestions(state, [evaluativeId, questionIds]) {
      this.commit("main/setChanged", true);
      for (let questionId of questionIds) {
        let question = await this.dispatch("request/fetchCollectionType", [
          questionId,
          "questions"
        ]);
        question = await this.dispatch("convert/prepareQuestions", [
          question,
          false
        ]);
        let evaluative = state.rootGetters["main/getEvaluativeByID"](evaluativeId)
        evaluative.questions.push(question);
      }
      //this.commit("main/setChanged", false);
    },

    //--------Statistics
    async fetchStudentStat(state, id) {
      const auth = "Bearer " + state.getters.getJWT;
      let resp;
      let url = serverData.domain + serverData.students + "/" + id;
      let params = { populate: "stat" };
      await axios
        .get(url, {
          headers: {
            Authorization: auth
          },
          params: params
        })
        .then(response => {
          resp = response.data;
        });
      return resp;
    },
    async fetchClassStat(state, id) {
      const auth = "Bearer " + state.getters.getJWT;
      let resp;
      let url = serverData.domain + serverData.classes + "/" + id;
      let params = { populate: "stat" };
      await axios
        .get(url, {
          headers: {
            Authorization: auth
          },
          params: params
        })
        .then(response => {
          resp = response.data;
        });
      return resp;
    },
    async fetchOccStat(state, id) {
      const auth = "Bearer " + state.getters.getJWT;
      let resp;
      let url = serverData.domain + serverData.occurrences + "/" + id;
      let params = { populate: "stat" };
      await axios
        .get(url, {
          headers: {
            Authorization: auth
          },
          params: params
        })
        .then(response => {
          resp = response.data;
        });
      return resp;
    },

    //--------Etc
    async createStudentUser(state, data) {
      let obj = {
        username: data.name.replace(" ", ""),
        email: data.email,
        password: data.name.replace(" ", "") + data.email.substring(0, 5),
      }
      const auth = "Bearer " + state.getters.getJWT;
      let url = serverData.domain + serverData.register;
      let id;
      await axios
        .post(
          url,
          obj,
          {
            headers: {
              Authorization: auth
            }
          }
        )
        .then(response => {
          id = response.data.user.id
        });
      let newUrl = serverData.domain + serverData.users + "/" + id
      await axios.put(
        newUrl,
        { role: 4 },
        {
          headers: {
            Authorization: auth,
          }
        }
      );
      return id
    },
    async sendEmail(state, message) {
      const auth = "Bearer " + state.getters.getJWT;
      let url = serverData.domain + serverData.sendEmail;
      await axios
        .post(
          url,
          { data: message },
          {
            headers: {
              Authorization: auth
            }
          }
        )
        .then(resp => {
          console.log(resp.data);
        });
    },
    async generateProgrammingEx(state, [messageResp, ]) {
      const auth = "Bearer " + state.getters.getJWT;
      const url = serverData.domain + serverData.gpt;
      try {
        const response = await axios.post(
          url,
          { data: messageResp },
          { headers: { Authorization: auth } }
        );
        let data = response.data.function_call.arguments;
        let json = JSON.parse(data);
        return json
      } catch (error) {
        console.error("Error in generateProgrammingEx: ", error);
        throw error;
      }
    },
  }
}

const serverData = {
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
  gpt: "/api/gpt"
};

export default request