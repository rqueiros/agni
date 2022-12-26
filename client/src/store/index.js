import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import { course } from "@/store/course.js";
import { resources } from "@/store/resources.js";
import { quizzes } from "@/store/quizzes.js";

export default new Vuex.Store({
  state: {
    login: false,
    resourceId: 0,
    course: [...course],
    resources: [...resources],
    quizzes: [...quizzes],

    progress: localStorage.progress ? JSON.parse(localStorage.progress) : [],
    code: "",
  },
  getters: {
    // Auth
    isLogged: (state) => state.login,

    // Course
    getCourse: (state, getters) => {
      const newCourse = [
        { id: 0, name: "POO course", file: "course", children: [] },
      ];
      state.course.forEach((module) => {
        const obj = { id: module.id, name: module.name, children: [] };
        if (module?.resources) {
          module.resources.forEach((id) => {
            const resource = getters.getResourceById(id);
            obj.children.push({
              id: id,
              name: resource.name,
              file: resource.type,
            });
          });
          newCourse[0].children.push(obj);
        }
      });
      return newCourse;
    },

    // Modules
    getModules: (state) => state.modules,
    getModuleByResourceId: (state) => (id) => {
      let result = state.course.find((module) => module.resources.includes(id));
      if (typeof result === "undefined") {
        const resource = state.resources.find((resource) => {
          if (resource.exercises) {
            return resource.exercises.includes(id);
          }
        });
        result = state.course.find((module) =>
          module.resources.includes(resource.id)
        );
      }
      return result;
    },
    getModuleNameByResourceId: (state) => (id) =>
      state.course.find((module) => module.resources.includes(id)).name,

    // Sheets
    getSheets: (state) =>
      state.resources.filter((resource) => resource.type == "sheet"),

    getSheetByResourceId: (state) => (id) => {
      return state.resources.find((resource) => {
        if (resource.exercises) {
          return resource.exercises.includes(id);
        }
      });
    },
    getCompletationStatusBySheetId: (state, getters) => (id) => {
      let sum = 0;
      const exercises = getters.getResourceById(id).exercises;
      console.log(exercises);
      if (typeof exercises !== "undefined") {
        exercises.forEach((exerciseId) => {
          const score = state.progress.find(
            (resource) => resource.id == exerciseId
          )?.status;
          console.log("xxx" + score);
          if (typeof score !== "undefined") {
            sum += +score;
          }
        });
        console.log(sum + "-" + exercises.length);
        return isNaN(sum) ? 0 : sum / exercises.length;
      }
    },

    // Resources
    getResourceId: (state) => state.resourceId,
    getResourcesByModuleId: (state) => (id) =>
      state.resources.filter((resource) => resource.moduleId == id),
    getResourceById: (state) => (id) =>
      state.resources.find((resource) => resource.id == id),
    getCode: (state) => state.code,
    getQuizByResourceId: (state) => (id) =>
      state.quizzes.find((quiz) => quiz.id == id),

    // Progress
    getProgressFromResourceId: (state) => (id) =>
      state.progress.find((progress) => progress.id == id),
  },
  mutations: {
    setResourceId(state, payload) {
      state.resourceId = payload;
    },
    setCode(state, payload) {
      state.code = payload;
    },

    setProgress(state, payload) {
      if (state.progress.some((progress) => progress.id == payload.id)) {
        state.progress.map((progress) => {
          if (progress.id == payload.id) {
            progress.code = payload.code || progress.code;
            progress.status = payload.status || progress.status;
          }
        });
      } else {
        state.progress.push({ id: payload.id, code: payload.code, status: 0 });
      }
      localStorage.progress = JSON.stringify(state.progress);
    },
    setLogin(state) {
      state.login = true;
    },
  },
  actions: {},
  modules: {},
});
