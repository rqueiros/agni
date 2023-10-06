import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import router from "../router";

import convert from "./convert";
import style from "./style";

const FormData = require("form-data");
//const fs = require("fs")

Vue.use(Vuex);

const main = {
  namespaced: true,
  state: {
    login: false,
    user: {},
    role: "",
    jwt: "",
    courses: [],
    expositives: [],
    evaluatives: [],
    questions: [],
    statuses: [],
    occurrences: [],
    classes: [],
    students: [],
    maxId: 0,
    changed: false,
    accountEditable:false,
  },
  getters: {
    //------------------------Authentication----------------------------------
    isLogged: state => state.login,
    getJWT: state => state.jwt,
    getRole: state => state.role,
    getUser: state => state.user,
    getUsername: state => state.user.username,
    getUserEmail: state => state.user.email,

    isStudent: state => state.role == "student",
    isTeacher: state => state.role == "author" || state.role == "viewer",
    isAuthor: state => state.role == "author",
    isViewer: state => state.role == "viewer",

    getDomain: () => serverData.domain,

    getAccountEditable: state => state.accountEditable,

    //--------------------------Student---------------------------------------

    //-------Course
    getCourses: state => state.courses,
    getCourse: state => state.courses[0],


    getPublishedAt: state => type => {
      if (state[type].length > 0) return state[type][0].publishedAt;
      return null;
    },

    //-------Module
    getModuleByLesson: state => id => {
      return state.courses.flatMap(c => c.children).find(m =>
        m.children.map(l => l.id).includes(id)
      );
    },
    getModuleByEvaluative: state => id => {
      return state.courses.flatMap(c => c.children).find(m =>
        m.children.filter(l => "evaluatives" in l).flatMap(l => l.evaluatives.map(e => e.id)).includes(id)
      );
    },
    getModuleByExpositive: state => id => {
      return state.courses.flatMap(c => c.children).find(m =>
        m.children.flatMap(l => l.expositives.map(e => e.id)).includes(id)
      );
    },
    getModuleByResourceId: (state, getters) => {
      return function (id, type) {
        if (type == "lesson") {
          return getters.getModuleByLesson(id);
        } else if (type == "code" || type == "quiz") {
          return getters.getModuleByEvaluative(id);
        } else {
          return getters.getModuleByExpositive(id);
        }
      };
    },

    //-------Lesson
    getLessonByResourceId: state => id => {
      return state.courses.flatMap(c => c.children).flatMap(m => m.children).find(l => {
        if (
          l.expositives.map(e => e.id).includes(id) ||
          l.evaluatives.map(e => e.id).includes(id)
        ) {
          return l;
        }
      });
    },
    getLessonsByCourse: state => id => {
      const c = state.courses.find(c => c.id == id);
      return c.children.flatMap(m => m.children);
    },
    getLessonsByModule: state => id => {
      return state.courses.flatMap(c => c.children).find(m => m.id == id).children;
    },

    //-------Resource
    getResourceById: state => {
      return function (id, type) {
        if (type != "course" && type != "module") {
          if (type == "lesson") {
            return state.courses.flatMap(c => c.children).flatMap(m => m.children).find(l => l.id == id)
          } else if (type == "evaluative") {
            //return state.courses
            return state.courses.flatMap(c => c.children).flatMap(m => m.children).flatMap(l => l.evaluatives).find(l => l.id == id)
          }
        }
        return undefined;
      };
    },

    //-------Status
    getStatusByResourceId: state => id => {
      return state.courses[0].children.flatMap(m => m.children).flatMap(l => l.evaluatives)
        .find(evaluative => evaluative.id == id).status;
    },
    getCompletationStatusByLesson: state => id => {
      if (id == "0") {
        return null;
      }
      const lesson = state.courses.flatMap(c => c.children).flatMap(m => m.children).find(l => l.id == id);
      let status =
        "evaluatives" in lesson
          ? lesson.evaluatives.map(e => e.status.grade)
          : [];
      return status.length > 0
        ? status.reduce((a, b) => a + b, 0) / status.length
        : null;
    },
    getStatusTeacher: state => id => {
      return state.statuses.filter(s => s.id == id);
    },

    //-------Evaluative
    getEvaluativeByStatus: state => payload => {
      return state.courses.flatMap(c => c.children).flatMap(m => m.children).flatMap(l => l.evaluatives).find(e => e.id == payload.id);
    },

    //--------------------------Teacher---------------------------------------
    getOccurrences: state => state.occurrences,
    getOccurrence: state => state.occurrences[0],

    getStudent: state => state.students[0],

    getExpositive: state => state.expositives[0],

    getEvaluative: state => state.evaluatives[0],

    getQuestion: state => state.questions[0],

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
      state.login = false
      state.user = {}
      state.role = ""
      state.jwt = ""
      state.changed = false
      this.commit("main/deleteStructure");
    },
    setAccountEditable(state, value){
      state.accountEditable = value
    },

    //-----------------------Teacher------------------------------------------

    //-------Course
    setCourses(state, courses) {
      state.courses = courses
    },
    setMaxId(state, maxId) {
      state.maxId = maxId
    },
    createEditableCourse(state) {
      const c = state.courses;
      c.forEach(course => {
        course.children.forEach(module => {
          module.children.push({
            idMenu: 0,
            id: state.maxId,
            type: "add",
            contentType: "lesson",
            name: "add Lesson",
            evaluatives: [],
            expositives: [],
            locked: true,
            parentId: module.id
          });
          state.maxId += 1;
        });
        course.children.push({
          idMenu: 0,
          id: state.maxId,
          type: "add",
          contentType: "module",
          name: "add Module",
          children: [],
          locked: true,
          parentId: course.id
        });
        state.maxId += 1;
      });
    },
    setCourseField(state, [id, field, value]) {
      const course = state.courses.find(c => c.id == id);
      if (course[field] != value) {
        this.commit("main/setChanged", true);
      }
      course[field] = value;
    },
    setCoursePublishedAt(state, [id, publishedAt]) {
      const course = state.courses.find(c => c.id == id);
      course.publishedAt = publishedAt
    },

    //-------Goal
    setGoalField(state, [id, field, value]) {
      const goal = state.courses
        .filter(c => "goals" in c)
        .flatMap(c => c.goals)
        .find(g => g.id == id);
      if (goal[field] != value) {
        this.commit("main/setChanged", true);
      }
      goal[field] = value;
    },
    addGoalByCourseId(state, id) {
      const course = state.courses.find(c => c.id == id);
      let n = Math.min(
        ...state.courses
          .filter(c => "goals" in c)
          .flatMap(c => c.goals)
          .map(g => g.id)
      );
      if (n > 0 || !isFinite(n)) {
        n = 0;
      }
      let goal = {
        id: n - 1,
        new: true,
        goal: ""
      };
      course.goals.push(goal);
      this.commit("main/setChanged", true);
    },
    deleteGoal(state, id) {
      const course = state.courses
        .filter(c => "goals" in c)
        .find(c => c.goals.map(g => g.id).includes(id));
      const index = course.goals.findIndex(g => g.id == id);
      course.goals.splice(index, 1);
      this.commit("main/setChanged", true);
    },

    //-------Module
    addModuleByCourseId(state, id) {
      const course = state.courses.find(c => c.id == id);
      let n = Math.min(...course.children.map(m => m.id));
      if (n > 0 || !isFinite(n)) {
        n = 0;
      }
      let module = {
        id: n - 1,
        idMenu: state.maxId,
        new: true,
        contentType: "module",
        name: "",
        parentId: course.id,
        children: [
          {
            id: 0,
            idMenu: state.maxId + 1,
            parentId: n - 1,
            type: "add",
            contentType: "lesson",
            name: "add Lesson",
            evaluatives: [],
            expositives: [],
            locked: true
          }
        ]
      };
      course.children.splice(course.children.length - 1, 0, module);
      state.maxId += 2;
      this.commit("main/setChanged", true);
    },
    deleteModule(state, id) {
      const course = state.courses.find(c =>
        c.children.map(m => m.id).includes(id)
      );
      const index = course.children.findIndex(obj => obj.id == id);
      course.children.splice(index, 1);
      this.commit("main/setChanged", true);
    },
    moveModule(state, [id, direction]) {
      const course = state.courses.find(c =>
        c.children.map(m => m.id).includes(id)
      );
      const index = course.children.findIndex(obj => obj.id == id);
      const module = course.children[index];
      if (index > 0 && direction == "up") {
        course.children.splice(index, 1);
        course.children.splice(index - 1, 0, module);
      } else if (index < course.children.length - 2 && direction == "down") {
        course.children.splice(index, 1);
        course.children.splice(index + 1, 0, module);
      }
      this.commit("main/setChanged", true);
    },
    setModuleField(state, [id, field, value]) {
      const module = state.courses
        .flatMap(c => c.children)
        .find(m => m.id == id);
      if (module[field] != value) {
        this.commit("main/setChanged", true);
      }
      module[field] = value;
    },

    //-------Lesson
    addLessonByModuleId(state, id) {
      const module = state.courses[0].children.find(m => m.id == id);
      let n = Math.min(...state.courses.flatMap(c => c.children).flatMap(m => m.children).map(l => l.id));
      if (n > 0 || !isFinite(n)) {
        n = 0;
      }
      let lesson = {
        id: n - 1,
        idMenu: state.maxId,
        new: true,
        contentType: "lesson",
        name: "",
        description: "",
        evaluatives: [],
        expositives: []
      };
      module.children.splice(module.children.length - 1, 0, lesson);
      state.maxId = state.maxId + 1;
      this.commit("main/setChanged", true);
    },
    deleteLesson(state, id) {
      const module = state.courses
        .flatMap(c => c.children)
        .find(m => m.children.map(l => l.id).includes(id));
      let index = module.children.findIndex(obj => obj.id == id);
      module.children.splice(index, 1);
      this.commit("main/setChanged", true);
    },
    moveLesson(state, [id, direction]) {
      const course = state.courses[0];
      const module = state.courses
        .flatMap(c => c.children)
        .find(m => m.children.map(l => l.id).includes(id));
      const indexLesson = module.children.findIndex(obj => obj.id == id);
      const lesson = module.children[indexLesson];
      const indexModule = state.courses
        .flatMap(c => c.children)
        .findIndex(obj => obj.id == module.id);
      if (indexLesson > 0 && direction == "up") {
        module.children.splice(indexLesson, 1);
        module.children.splice(indexLesson - 1, 0, lesson);
      } else if (indexModule > 0 && direction == "up") {
        module.children.splice(indexLesson, 1);
        const newModule = course.children[indexModule - 1];
        newModule.children.splice(newModule.children.length - 1, 0, lesson);
      } else if (
        indexLesson < module.children.length - 2 &&
        direction == "down"
      ) {
        module.children.splice(indexLesson, 1);
        module.children.splice(indexLesson + 1, 0, lesson);
      } else if (
        indexModule < course.children.length - 2 &&
        direction == "down"
      ) {
        module.children.splice(indexLesson, 1);
        const newModule = course.children[indexModule + 1];
        newModule.children.splice(0, 0, lesson);
      }
      this.commit("main/setChanged", true);
    },
    setLessonField(state, [id, field, value]) {
      const lesson = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .find(l => l.id == id);
      if (lesson[field] != value) {
        this.commit("main/setChanged", true);
      }
      lesson[field] = value;
    },

    //-------Condition
    setConditionField(state, [id, field, value]) {
      let condition;
      try {
        //TODO find better solution
        condition = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .filter(l => "condition" in l)
          .map(l => l.condition)
          .find(c => c.id == id);
      } catch (err) {
        condition = state.courses
          .flatMap(c => c.children)
          .filter(m => "condition" in m)
          .map(m => m.condition)
          .find(c => c.id == id);
      }
      if (condition[field] != value) {
        this.commit("main/setChanged", true);
      }
      condition[field] = value;
    },
    addConditionByLMId(state, [id, type]) {
      let element;
      if (type == "lesson") {
        element = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .find(l => l.id == id);
      } else if (type == "module") {
        element = state.courses
          .flatMap(c => c.children)
          .find(m => m.id == id);
      }
      let n = Math.min(
        ...[
          ...state.courses
            .flatMap(c => c.children)
            .filter(m => "condition" in m && m.condition != null)
            .map(m => m.condition.id),
          ...state.courses
            .flatMap(c => c.children)
            .flatMap(m => m.children)
            .filter(l => "condition" in l && l.condition != null)
            .map(l => l.condition.id)
        ]
      );
      if (n > 0 || !isFinite(n)) {
        n = 0;
      }
      let condition = {
        new: true,
        afterPercDone: "",
        afterWeek: "",
        type: null
      };
      condition.id = n - 1;
      element.condition = condition;
      this.commit("main/setChanged", true);
    },

    //-------Expositive
    setExpositives(state, expositives) {
      state.expositives = expositives
    },
    addExpositiveByLessonId(state, id) {
      const lesson = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .find(l => l.id == id);
      let n = Math.min(...state.expositives.map(l => l.id));
      if (n > 0 || !isFinite(n)) {
        n = 0;
      }
      let expositive = {
        new: true,
        id: n - 1,
        name: "",
        milestones: [],
        file:{data:null},
        type:null
      };
      lesson.expositives.push(expositive);
      this.commit("main/setChanged", true);
    },
    setExpositiveField(state, [id, field, value]) {
      let expositive;
      if (state.courses.length > 0) {
        expositive = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.expositives)
          .find(e => e.id == id);
      } else {
        expositive = state.expositives[0]
      }
      if (expositive[field] != value) {
        this.commit("main/setChanged", true);
      }
      expositive[field] = value;
    },
    deleteExpositive(state, id) {
      let lesson = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .find(l => l.expositives.map(e => e.id).includes(id));
      let index = lesson.expositives.findIndex(obj => obj.id == id);
      lesson.expositives.splice(index, 1);
      this.commit("main/setChanged", true);
    },
    changeExpositiveTypeById(state, list) {
      const id = list[0];
      const file = list[1];
      let expositive;
      if (state.courses.length > 0) {
        expositive = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.expositives)
          .find(e => e.id == id);
      } else {
        expositive = state.expositives[0]
      }
      expositive.file = file;
      if (file.type.includes("pdf")) {
        expositive.contentType = "pdf";
        expositive.type = "pdf";
      } else if (file.type.includes("video")) {
        expositive.contentType = "video";
        expositive.type = "video";
      }
      this.commit("main/setChanged", true);
    },
    setExpositivePublishedAt(state, [id, publishedAt]) {
      const expositive = state.expositives.find(c => c.id == id);
      expositive.publishedAt = publishedAt
    },
    createNewExpositive() {
      this.commit("main/deleteStructure");
      this.commit("main/setChanged", true);
      this.commit("main/setRole", "author");
      let expositive = {
        new: true,
        id: -1,
        name: "",
        type: "",
        milestones: [],
      }
      this.commit("main/setExpositives", [expositive])
    },

    //-------Evaluative
    setEvaluatives(state, evaluatives) {
      state.evaluatives = evaluatives
    },
    addEvaluativeByLessonId(state, id) {
      const lesson = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .find(l => l.id == id);
      let n = Math.min(...state.evaluatives.map(l => l.id));
      if (n > 0 || !isFinite(n)) {
        n = 0;
      }
      let evaluative = {
        id: n - 1,
        new: true,
        type: "new",
        contentType: "",
        name: "",
        questions: [],
        tests: [],
        contexts: [],
        skeleton: ""
      };
      lesson.evaluatives.push(evaluative);
      this.commit("main/setChanged", true);
    },
    addQuizByLessonId(state, id) {
      const lesson = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .find(l => l.id == id);
      let n = Math.min(...state.courses[0].children.flatMap(c => c.children).flatMap(l => l.evaluatives).map(l => l.id));
      if (n > 0 || !isFinite(n)) {
        n = 0;
      }
      let evaluative = {
        id: n - 1,
        new: true,
        contentType: "quiz",
        name: "",
        questions: [],
      };
      let questions;
      let answers;
      questions = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .filter(e => e.contentType == "quiz")
        .flatMap(e => e.questions.map(q => q.id));
      answers = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .filter(e => e.contentType == "quiz")
        .flatMap(e => e.questions)
        .flatMap(q => q.answers.map(a => a.id));

      let i = Math.max(...questions);
      if (i < 0) {
        i = 0;
      }
      let i2 = Math.max(...answers);
      if (i2 < 0) {
        i2 = 0;
      }
      if (!("questions" in evaluative)) {
        evaluative.questions = []
      }
      evaluative.questions.push({
        new: true,
        question: "",
        id: i + 1,
        correctAnswer: [],
        answers: [
          { answer: "", id: i2 + 1 },
          { answer: "", id: i2 + 2 }
        ]
      });
      lesson.evaluatives.push(evaluative);
      this.commit("main/setChanged", true);
    },
    addProgExByLessonId(state, id) {
      const lesson = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .find(l => l.id == id);
      let n = Math.min(...state.courses[0].children.flatMap(c => c.children).flatMap(l => l.evaluatives).map(l => l.id));
      if (n > 0 || !isFinite(n)) {
        n = 0;
      }
      let evaluative = {
        id: n - 1,
        new: true,
        contentType: "code",
        name: "",
        type: null,
        contexts: [],
        skeleton: "",
        solution: "",
        tests: [],
      };
      lesson.evaluatives.push(evaluative);
      this.commit("main/setChanged", true);
    },
    addExternalExByLessonId(state, [id, exercises]) {
      const lesson = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .find(l => l.id == id);
      let n = Math.min(...state.courses[0].children.flatMap(c => c.children).flatMap(l => l.evaluatives).map(l => l.id));
      if (n > 0 || !isFinite(n)) {
        n = 0;
      }
      for(let i = 0; i++; i<exercises.length){
        exercises[i].id = n-(i+1)
      }
      exercises.forEach(ex => {
        lesson.evaluatives.push(ex);
      })
      this.commit("main/setChanged", true);
    },
    changeEvaluativeTypeById(state, list) {
      const id = list[0];
      const type = list[1];
      let evaluative
      if (state.courses.length > 0) {
        evaluative = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.evaluatives)
          .find(e => e.id == id);
      } else {
        evaluative = state.evaluatives[0]
      }
      if (type == "quiz") {
        let questions;
        let answers;
        if (state.courses.length > 0) {
          questions = state.courses
            .flatMap(c => c.children)
            .flatMap(m => m.children)
            .flatMap(l => l.evaluatives)
            .filter(e => e.contentType == "quiz")
            .flatMap(e => e.questions.map(q => q.id));
          answers = state.courses
            .flatMap(c => c.children)
            .flatMap(m => m.children)
            .flatMap(l => l.evaluatives)
            .filter(e => e.contentType == "quiz")
            .flatMap(e => e.questions)
            .flatMap(q => q.answers.map(a => a.id));
        } else {
          if ("questions" in state.evaluatives[0]) {
            questions = state.evaluatives[0].questions.map(q => q.id);
            answers = state.evaluatives[0].questions.flatMap(q => q.answers.map(a => a.id));
          } else {
            questions = []
            answers = []
          }
        }
        let i = Math.max(...questions);
        if (i < 0) {
          i = 0;
        }
        let i2 = Math.max(...answers);
        if (i2 < 0) {
          i2 = 0;
        }
        if (!("questions" in evaluative)) {
          evaluative.questions = []
        }
        evaluative.questions.push({
          new: true,
          question: "",
          id: i + 1,
          correctAnswer: [],
          answers: [
            { answer: "", id: i2 + 1 },
            { answer: "", id: i2 + 2 }
          ]
        });
      } else if (type == "code") {
        evaluative.statement = "";
        evaluative.solution = "";
        evaluative.skeleton = "";
        evaluative.contexts = [];
      }
      evaluative.type = "";
      evaluative.contentType = type;
      this.commit("main/setChanged", true);
    },
    deleteEvaluative(state, id) {
      let lesson = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .find(l => l.evaluatives.map(e => e.id).includes(id));
      let index = lesson.evaluatives.findIndex(obj => obj.id == id);
      lesson.evaluatives.splice(index, 1);
      this.commit("main/setChanged", true);
    },
    setEvaluativeField(state, [id, field, value]) {
      
      let evaluative
      if (state.courses.length > 0) {
        evaluative = state.courses[0].children
          .flatMap(m => m.children)
          .flatMap(l => l.evaluatives)
          .find(e => e.id == id);
      } else {
        evaluative = state.evaluatives[0]
      }
      if (evaluative && evaluative[field] != value || field == "statement") {
        this.commit("main/setChanged", true);
      }
      if (evaluative){
        evaluative[field] = value;
      }
    },
    setEvaluativePublishedAt(state, [id, publishedAt]) {
      const evaluative = state.evaluatives.find(c => c.id == id);
      evaluative.publishedAt = publishedAt
    },
    createNewEvaluative() {
      this.commit("main/deleteStructure");
      this.commit("main/setChanged", true);
      this.commit("main/setRole", "author");
      let evaluative = {
        new: true,
        id: -1,
        name: "",
        type: "new",
        contentType: "",
        tests:[],
        contexts:[],
        skeleton:"",
        questions:[],
      }
      this.commit("main/setEvaluatives", [evaluative])
    },


    //-------Question
    setQuestions(state, questions) {
      state.questions = questions
    },
    addQuestionByQuestionId(state, id) {
      let evaluative;
      let questions;
      let answers
      if (state.courses.length > 0) {
        evaluative = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.evaluatives)
          .filter(e => e.contentType == "quiz")
          .find(e => e.questions.map(q => q.id).includes(id));
        questions = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.evaluatives)
          .filter(e => e.contentType == "quiz")
          .flatMap(e => e.questions.map(q => q.id));
        answers = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.evaluatives)
          .filter(e => e.contentType == "quiz")
          .flatMap(e => e.questions)
          .flatMap(q => q.answers.map(a => a.id));
      } else {
        evaluative = state.evaluatives[0];
        questions = state.evaluatives
          .filter(e => e.contentType == "quiz")
          .flatMap(e => e.questions.map(q => q.id));
        answers = state.evaluatives
          .filter(e => e.contentType == "quiz")
          .flatMap(e => e.questions)
          .flatMap(q => q.answers.map(a => a.id));
      }
      let index = evaluative.questions.findIndex(q => q.id == id);
      let i = Math.min(...questions);
      if (i > 0 || !isFinite(i)) {
        i = 0;
      }
      let i2 = Math.min(...answers);
      if (i2 > 0 || !isFinite(i2)) {
        i2 = 0;
      }
      evaluative.questions.splice(index + 1, 0, {
        new: true,
        question: "",
        id: i - 1,
        correctAnswer: [],
        image: { data: null },
        answers: [
          { answer: "", id: i2 - 1 },
          { answer: "", id: i2 - 2 }
        ]
      });
      this.commit("main/setChanged", true);
    },
    addQuestionByResourceId(state, id) {
      let evaluative;
      let questions;
      let answers
      if (state.courses.length > 0) {
        evaluative = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.evaluatives)
          .find(e => e.id == id);
        questions = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.evaluatives)
          .filter(e => e.contentType == "quiz")
          .flatMap(e => e.questions.map(q => q.id));
        answers = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.evaluatives)
          .filter(e => e.contentType == "quiz")
          .flatMap(e => e.questions)
          .flatMap(q => q.answers.map(a => a.id));
      } else {
        evaluative = state.evaluatives[0];
        questions = state.evaluatives
          .filter(e => e.contentType == "quiz")
          .flatMap(e => e.questions.map(q => q.id));
        answers = state.evaluatives
          .filter(e => e.contentType == "quiz")
          .flatMap(e => e.questions)
          .flatMap(q => q.answers.map(a => a.id));
      }
      let i = Math.min(...questions);
      if (i > 0 || !isFinite(i)) {
        i = 0;
      }
      let i2 = Math.min(...answers);
      if (i2 > 0 || !isFinite(i2)) {
        i2 = 0;
      }
      evaluative.questions.push({
        new: true,
        question: "",
        id: i - 1,
        correctAnswer: [],
        image: { data: null },
        answers: [
          { answer: "", id: i2 - 1 },
          { answer: "", id: i2 - 2 }
        ]
      });
      this.commit("main/setChanged", true);
    },
    deleteQuestion(state, id) {
      let evaluative;
      if (state.courses.length > 0) {
        evaluative = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.evaluatives)
          .filter(e => e.contentType == "quiz")
          .find(e => e.questions.map(q => q.id).includes(id));
      } else {
        evaluative = state.evaluatives[0]
      }
      const index = evaluative.questions.findIndex(q => q.id == id);
      evaluative.questions.splice(index, 1);
      this.commit("main/setChanged", true);
    },
    setQuestionField(state, [id, field, value]) {
      let question;
      if (state.courses.length > 0) {
        question = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.evaluatives)
          .filter(e => e.contentType == "quiz")
          .flatMap(e => e.questions)
          .find(q => q.id == id);
      } else if (state.evaluatives.length > 0) {
        question = state.evaluatives
          .filter(e => e.contentType == "quiz")
          .flatMap(e => e.questions)
          .find(q => q.id == id);
      } else {
        question = state.questions[0]
      }
      question[field] = value;
      this.commit("main/setChanged", true);
    },
    setQuestionPublishedAt(state, [id, publishedAt]) {
      const question = state.questions.find(c => c.id == id);
      question.publishedAt = publishedAt
    },
    createNewQuestion() {
      this.commit("main/deleteStructure");
      this.commit("main/setChanged", true);
      this.commit("main/setRole", "author");
      let question = {
        new: true,
        question: "",
        id: -1,
        correctAnswer: [],
        answers: [
          { answer: "", id: -1, new: true },
          { answer: "", id: -2, new: true }
        ]
      }
      this.commit("main/setQuestions", [question])
    },

    //-------Answer
    addAnswerByQuestionId(state, id) {
      let question;
      let answers;
      if (state.courses.length > 0) {
        question = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.evaluatives)
          .filter(e => e.contentType == "quiz")
          .flatMap(e => e.questions)
          .find(q => q.id == id);
        answers = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.evaluatives)
          .filter(e => e.contentType == "quiz")
          .flatMap(e => e.questions)
          .flatMap(q => q.answers.map(a => a.id));
      } else if (state.evaluatives.length > 0) {
        question = state.evaluatives[0].questions
          .find(q => q.id == id);
        answers = state.evaluatives[0].questions
          .flatMap(q => q.answers.map(a => a.id));
      } else {
        question = state.questions[0]
        answers = state.questions[0].answers.map(a => a.id)
      }
      let n = Math.min(...answers);
      if (n > 0 || !isFinite(n)) {
        n = 0;
      }
      let answer = {
        new: true,
        answer: "",
        id: n - 1
      }
      question.answers.push(answer);
      this.commit("main/setChanged", true);
    },
    setAnswerField(state, [id, field, value]) {
      let a;
      if (state.courses.length > 0) {
        a = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.evaluatives)
          .filter(e => e.contentType == "quiz")
          .flatMap(e => e.questions)
          .flatMap(q => q.answers)
          .find(a => a.id == id)
      } else if (state.evaluatives.length > 0) {
        a = state.evaluatives[0].questions
          .flatMap(q => q.answers)
          .find(a => a.id == id);
      } else {
        a = state.questions[0].answers.find(a => a.id == id)
      }
      if (a[field] != value) {
        this.commit("main/setChanged", true);
      }
      a[field] = value;
    },
    deleteAnswer(state, id) {
      let question;
      if (state.courses.length > 0) {
        question = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.evaluatives)
          .filter(e => e.contentType == "quiz")
          .flatMap(e => e.questions)
          .find(q => q.answers.map(a => a.id).includes(id));
      } else if (state.evaluatives.length > 0) {
        question = state.evaluatives[0].questions
          .find(q => q.answers.map(a => a.id).includes(id));
      } else {
        question = state.questions[0]
      }
      const index = question.answers.findIndex(a => a.id == id);
      if (question.correctAnswer.includes(index + 1)) {
        const ind2 = question.correctAnswer.findIndex(c => c == index + 1);
        question.correctAnswer.splice(ind2, 1);
      }
      question.correctAnswer = question.correctAnswer.map(c => {
        if (c > index + 1) {
          return c - 1;
        } else {
          return c;
        }
      });
      question.answers.splice(index, 1);
      this.commit("main/setChanged", true);
    },

    //-------Test
    addTestByEvaluativeId(state, id) {
      let evaluative;
      let tests;
      if (state.courses.length > 0) {
        evaluative = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.evaluatives)
          .find(e => e.id == id);
        tests = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.evaluatives)
          .filter(e => e.contentType == "code")
          .flatMap(e => e.tests.map(t => t.id));
      } else {
        evaluative = state.evaluatives[0]
        tests = state.evaluatives[0].tests.map(t => t.id)
      }
      let n = Math.min(...tests);
      if (n > 0 || !isFinite(n)) {
        n = 0;
      }
      evaluative.tests.push({
        new: true,
        id: n - 1,
        input: "",
        expected: "",
        type: null,
        subtype: null,
        output: "",
        show: false
      });
      this.commit("main/setChanged", true);
    },
    deleteTest(state, id) {
      let evaluative;
      if (state.courses.length > 0) {
        evaluative = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.evaluatives)
          .filter(e => e.contentType == "code")
          .find(e => e.tests.map(t => t.id).includes(id));
      } else {
        evaluative = state.evaluatives[0]
      }
      const index = evaluative.tests.findIndex(t => t.id == id);
      evaluative.tests.splice(index, 1);
      this.commit("main/setChanged", true);
    },
    setTestField(state, [id, field, value]) {
      let test;
      if (state.courses.length > 0) {
        test = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.evaluatives)
          .filter(e => e.contentType == "code")
          .flatMap(e => e.tests)
          .find(t => t.id == id);
      } else {
        test = state.evaluatives[0].tests.find(t => t.id == id)
      }
      if (test[field] != value) {
        this.commit("main/setChanged", true);
      }
      test[field] = value;
    },

    //-------Milestone
    addMilestoneByExpositiveId(state, id) {
      let expositive;
      let milestones;
      if (state.courses.length > 0) {
        expositive = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.expositives)
          .find(e => e.id == id);
        milestones = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.expositives)
          .flatMap(e => e.milestones.map(t => t.id));
      } else {
        expositive = state.expositives[0]
        milestones = state.expositives[0].milestones.map(m => m.id)
      }
      let i = Math.min(...milestones);
      if (i > 0 || !isFinite(i)) {
        i = 0;
      }
      expositive.milestones.push({
        id: i - 1,
        new: true,
        frame: 0,
        label: ""
      });
      this.commit("main/setChanged", true);
    },
    deleteMilestone(state, id) {
      let expositive;
      if (state.courses.length > 0) {
        expositive = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.expositives)
          .find(e => e.milestones.map(t => t.id).includes(id));
      } else {
        expositive = state.expositives[0]
      }
      const index = expositive.milestones.findIndex(t => t.id == id);
      expositive.milestones.splice(index, 1);
      this.commit("main/setChanged", true);
    },
    setMilestoneField(state, [id, field, value]) {
      let milestone;
      if (state.courses.length > 0) {
        milestone = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.expositives)
          .flatMap(e => e.milestones)
          .find(t => t.id == id);
      } else {
        milestone = state.expositives[0].milestones.find(m => m.id == id)
      }
      if (field == "frame" && typeof (value) == "string") {
        try {
          let newV = parseInt(value)
          if (milestone[field] != newV) {
            this.commit("main/setChanged", true);
          }
          if (isNaN(newV)){
            milestone[field] = 0
          } else {
            milestone[field] = newV
          }
        } catch(err){
          console.log(err) //TODO not allow numbers to input
        }
      } else {
        if (milestone[field] != value) {
          this.commit("main/setChanged", true);
        }
        milestone[field] = value;
      }
    },

    //-------Context
    addContextByEvaluativeId(state, id) {
      let evaluative;
      let contexts;
      if (state.courses.length > 0) {
        evaluative = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.evaluatives)
          .find(e => e.id == id);
        contexts = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.evaluatives)
          .filter(e => e.contentType == "code")
          .flatMap(e => e.contexts.map(t => t.id));
      } else {
        evaluative = state.evaluatives[0]
        contexts = state.evaluatives[0].contexts.map(c => c.id)
      }
      let i = Math.min(...contexts);
      if (i > 0 || !isFinite(i)) {
        i = 0;
      }
      evaluative.contexts.push({
        new: true,
        id: i - 1,
        format: "",
        name: "",
        text: "",
        show: false
      });
      this.commit("main/setChanged", true);
    },
    deleteContext(state, id) {
      let evaluative;
      if (state.courses.length > 0) {
        evaluative = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.evaluatives)
          .filter(e => e.contentType == "code")
          .find(e => e.contexts.map(t => t.id).includes(id));
      } else {
        evaluative = state.evaluatives[0]
      }
      const index = evaluative.contexts.findIndex(t => t.id == id);
      evaluative.contexts.splice(index, 1);
      this.commit("main/setChanged", true);
    },
    setContextField(state, [id, field, value]) {
      let context;
      if (state.courses.length > 0) {
        context = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.evaluatives)
          .filter(e => e.contentType == "code")
          .flatMap(e => e.contexts)
          .find(t => t.id == id);
      } else if (state.evaluatives.length>0){
        context = state.evaluatives[0].contexts.find(c => c.id == id)
      }
      if (context && context[field] != value) {
        this.commit("main/setChanged", true);
      }
      if (context){
        context[field] = value;
      }
    },

    //-------Occurrence
    setOccurrences(state, occurrences) {
      state.occurrences = occurrences
    },
    setOccurrenceField(state, [id, field, value]) {
      const occ = state.occurrences.find(c => c.id == id);
      if (occ[field] != value) {
        this.commit("main/setChanged", true);
      }
      occ[field] = value;
    },
    setOccurrencePublishedAt(state, [id, publishedAt]) {
      const occ = state.occurrences.find(c => c.id == id);
      occ.publishedAt = publishedAt
    },

    //-------Class
    setClasses(state, classes) {
      state.classes = classes
    },
    addClassByOccurrenceId(state, id) {
      const occ = state.occurrences.find(o => o.id == id)
      const classes = state.occurrences.flatMap(o => o.classes).map(c => c.id)
      let n = Math.min(...classes);
      if (n > 0 || !isFinite(n)) {
        n = 0;
      }
      occ.classes.push({
        new: true,
        name: "",
        id: n - 1,
        students: [],
      });
      this.commit("main/setChanged", true);
    },
    addClassByOccurrenceId2(state, [id, classe]) {
      const occ = state.occurrences.find(o => o.id == id)
      const classes = state.occurrences.flatMap(o => o.classes).map(c => c.id)
      let n = Math.min(...classes);
      if (n > 0 || !isFinite(n)) {
        n = 0;
      }
      const students = state.occurrences.flatMap(o => o.classes).flatMap(c => c.students).map(c => c.id)
      let n2 = Math.min(...students);
      if (n2 > 0 || !isFinite(n2)) {
        n2 = 0;
      }

      let c2 = 1
      classe.new = true
      classe.id = n - 1
      classe.students.forEach(student => {
        student.new = true,
        student.id = n2 - c2
        c2++
      })
    
      occ.classes.push(classe);
      this.commit("main/setChanged", true);
    },
    setClassField(state, [id, field, value]) {
      const classe = state.occurrences.flatMap(o => o.classes).find(c => c.id == id)
      if (classe[field] != value) {
        this.commit("main/setChanged", true);
      }
      classe[field] = value;
    },
    deleteClass(state, id) {
      const occ = state.occurrences.find(o => o.classes.map(o => o.id).includes(id))
      const index = occ.classes.findIndex(c => c.id == id);
      occ.classes.splice(index, 1);
      this.commit("main/setChanged", true);
    },

    //-------Student
    setStudents(state, students) {
      state.students = students
    },
    addStudentByClassId(state, id) {
      const classe = state.occurrences.flatMap(o => o.classes).find(c => c.id == id)
      const students = state.occurrences.flatMap(o => o.classes).flatMap(c => c.students).map(c => c.id)
      let n = Math.min(...students);
      if (n > 0 || !isFinite(n)) {
        n = 0;
      }
      classe.students.push({
        new: true,
        name: "",
        id: n - 1,
      });
      this.commit("main/setChanged", true);
    },
    addStudentByClassName(state, [name,students]) {
      const classe = state.occurrences.flatMap(o => o.classes).find(c => c.name == name)
      const allStudents = state.occurrences.flatMap(o => o.classes).flatMap(c => c.students).map(c => c.id)
      let n = Math.min(...allStudents);
      if (n > 0 || !isFinite(n)) {
        n = 0;
      }
      
      let c = 1
      students.forEach(student => {
        student.new = true
        student.id = n-c
        c++
      })
      classe.students.push(...students)
      this.commit("main/setChanged", true);
    },
    setStudentField(state, [id, field, value]) {
      const student = state.occurrences.flatMap(o => o.classes).flatMap(c => c.students).find(s => s.id == id)
      if (student[field] != value) {
        this.commit("main/setChanged", true);
      }
      student[field] = value;
    },
    deleteStudent(state, id) {
      const classe = state.occurrences.flatMap(o => o.classes).find(c => c.students.map(s => s.id).includes(id))
      const index = classe.students.findIndex(c => c.id == id);
      classe.students.splice(index, 1);
      this.commit("main/setChanged", true);
    },

    //-------Status
    setStatuses(state, statuses) {
      state.statuses = statuses
    },

    setUserField(state, [field, value]) {
      const us = state.user
      if (us[field] != value) {
        this.commit("main/setChanged", true);
      }
      us[field] = value;
    },

    //-------Etc
    editableInput(state, obj) {
      const value = obj.value;
      const type = obj.type;
      const field = obj.field;
      const id = obj.id;
      if (type == "course") {
        this.commit("main/setCourseField", [id, field, value]);
      } else if (type == "module") {
        this.commit("main/setModuleField", [id, field, value]);
      } else if (type == "lesson") {
        this.commit("main/setLessonField", [id, field, value]);
      } else if (type == "condition") {
        this.commit("main/setConditionField", [id, field, value]);
      } else if (type == "expositive") {
        this.commit("main/setExpositiveField", [id, field, value]);
      } else if (type == "evaluative") {
        this.commit("main/setEvaluativeField", [id, field, value]);
      } else if (type == "question") {
        this.commit("main/setQuestionField", [id, field, value]);
      } else if (type == "answer") {
        this.commit("main/setAnswerField", [id, field, value]);
      } else if (type == "test") {
        this.commit("main/setTestField", [id, field, value]);
      } else if (type == "milestone") {
        this.commit("main/setMilestoneField", [id, field, value]);
      } else if (type == "context") {
        this.commit("main/setContextField", [id, field, value]);
      } else if (type == "goal") {
        this.commit("main/setGoalField", [id, field, value]);
      } else if (type == "occurrence") {
        this.commit("main/setOccurrenceField", [id, field, value]);
      } else if (type == "class") {
        this.commit("main/setClassField", [id, field, value]);
      } else if (type == "student") {
        this.commit("main/setStudentField", [id, field, value]);
      } else if (type == "user") {
        this.commit("main/setUserField", [field, value]);
      }
    },
    deleteStructure(state) {
      this.commit("main/setChanged", false);
      //state.BUTTONSTYLE=false
      state.courses = [];
      state.expositives = [];
      //state.evaluatives.splice(0, state.evaluatives.length);
      state.evaluatives = [];
      state.questions = [];
      state.occurrences = [];
      state.statuses = [];
      state.classes = [];
      state.students = [];
    },
    setChanged(state, changed) {
      state.changed = changed;
    }

  },
  actions: {
    //--------------------------Authentication--------------------------------
    async login(state, loginData) {
      const requestData = { identifier: loginData[0], password: loginData[1] };
      let url = serverData.domain + serverData.authentication;
      await axios.post(url, requestData).then(resp => {
        this.commit("main/setJWT", resp.data.jwt);
        this.commit("main/setUser", resp.data.user);
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
          this.commit("main/setUser", resp.data);
        });
      this.commit("main/setRole", role);
      role = role.charAt(0).toUpperCase() + role.slice(1);
      this.commit("main/setLogin", true);
      if (role == "Student") {
        state.dispatch("fetchCourse");
      }
      router.push({ name: role });
    },

    async updateUser(state){
      const auth = "Bearer " + state.getters.getJWT;
      let url = serverData.domain + serverData.users;
      let data = state.getters.getUser
      url += "/" + data.id;
      await axios
        .put(
          url,
          data,
          {
            headers: {
              Authorization: auth,
            }
          }
        )
    },
    async changePW(state){
      const auth = "Bearer " + state.getters.getJWT;
      let url = serverData.domain + serverData.changePW;
      let data2 = state.getters.getUser
      let data = {
        currentPassword:data2.currentPW,
        password:data2.newPW,
        passwordConfirmation:data2.newPW2
      }
      await axios
        .post(
          url,
          data,
          {
            headers: {
              Authorization: auth,
            }
          }
        )
    },
    async sendEmail(state,message){
      const auth = "Bearer " + state.getters.getJWT;
      let url = serverData.domain + serverData.sendEmail;
      await axios
        .post(
          url,
          {data : message},
          {
            headers: {
              Authorization: auth,
            }
          }
        ).then(resp => {
          console.log(resp.data)
        })
    },
    async getTeachersContent(state){
      const auth = "Bearer " + state.getters.getJWT;
      let url = serverData.domain + serverData.me;
      let resp
      await axios
        .get(url, {
          headers: {
            Authorization: auth
          }
        })
        .then(response => {
          resp = response.data;
        });
      return resp
    },
    async updateUserImage(state, image){
      const auth = "Bearer " + state.getters.getJWT;
      let url = serverData.domain + serverData.users;
      let data = state.getters.getUser
      url += "/" + data.id;

      let data2 = {}
      if (image == null || ("data" in image && image.data == null)){
        data2.image = null
      } else {
        let url2 = serverData.domain + serverData.upload;
        let id
        const formData = new FormData();
        formData.append("files", image)
        await axios
          .post(
            url2,
            formData,
            {
              headers: {
                Authorization: auth,
                'Content-Type': 'multipart/form-data'
              }
            }
          ).then(resp => {
            id = resp.data[0].id
            data2.image = id
          })
      }
      await axios
        .put(
          url,
          data2,
          {
            headers: {
              Authorization: auth,
            }
          }
        )
    },

    //--------------------------Student---------------------------------------
    async setProgress(state, payload) {
      const auth = "Bearer " + state.getters.getJWT;
      const evaluative = state.getters.getEvaluativeByStatus(payload);
      const url =
        serverData.domain + serverData.statuses + "/" + evaluative.status.id;
      axios.put(
        url,
        { data: payload.data },
        {
          headers: {
            Authorization: auth
          }
        }
      );
      await state.dispatch("fetchCourse");
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
      const course = await this.dispatch("convert/prepareCourse", [resp, false])
      this.commit("main/setCourses", [course])
    },

    //--------------------------Teacher---------------------------------------
    async fetchEmptyCourse() {
      this.commit("main/deleteStructure");
      this.commit("main/setChanged", true);
      this.commit("main/setCourses", [
        {
          new: true,
          id: -1,
          idMenu: 1,
          contentType: "course",
          name: "",
          type: null,
          goals: [],
          children: [
            {
              new: true,
              id: -1,
              idMenu: 2,
              contentType: "module",
              name: "",
              condition: { id: -1 },
              children: [
                {
                  new: true,
                  id: -1,
                  idMenu: 3,
                  contentType: "lesson",
                  name: "",
                  description: "",
                  evaluatives: [],
                  expositives: [],
                  condition: { id: -2 }
                }
              ]
            }
          ]
        }
      ]);
      this.commit("main/setMaxId", 4)
      this.commit("main/createEditableCourse");
      this.commit("main/setRole", "author");
    },
    async fetchEmptyOccurrence() {
      this.commit("main/deleteStructure");
      this.commit("main/setChanged", true);
      this.commit("main/setOccurrences", [
        {
          new: true,
          id: -1,
          year: 0,
          classes: []
        }
      ]);
    },

    async fetchContents(state, parameters){
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
      return resp
    },

    async fetchNewContents(state){
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
      return resp
    },

    async fetchCollectionTypes(state, parameters) {
      const auth = "Bearer " + state.getters.getJWT;
      let resp;
      let url = serverData.domain + serverData[parameters.collectionType];
      let params = {};
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
          resp = await this.dispatch("convert/cleanCourseData", resp)
          break;
        case "expositives":
          resp = await this.dispatch("convert/cleanExpositiveData", resp)
          break;
        case "evaluatives":
          resp = await this.dispatch("convert/cleanEvaluativeData", resp)
          break;
        case "questions":
          resp = await this.dispatch("convert/cleanQuestionData", resp)
          break;
        case "occurrences":
          resp = await this.dispatch("convert/cleanOccurrenceData", resp)
          break;
      }
      return resp;
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
      return resp
    },

    async fetchStudentStat(state, id){
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
      return resp
    },
    async fetchClassStat(state, id){
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
      return resp
    },
    async fetchOccStat(state, id){
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
      return resp
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
      let resp = await state.dispatch("fetchCollectionType", [id, collectionType])
      resp.attributes.new = true
      this.commit("main/setRole", "author");
      if (collectionType == "expositives") {
        state.dispatch("prepareExpositive", [resp, true])
      } else if (collectionType == "evaluatives") {
        state.dispatch("prepareEvaluative", [resp, true])
      } else if (collectionType == "questions") {
        state.dispatch("prepareQuestion", [resp, true])
      } else if (collectionType == "occurrences") {
        state.dispatch("prepareOccurrence", [resp, true])
      } else if (collectionType == "classes") {
        state.dispatch("prepareClass", resp)
      } else if (collectionType == "students") {
        state.dispatch("prepareStudent", resp)
      } else if (collectionType == "statuses") {
        state.dispatch("prepareStatus", resp)
      }
    },

    async fetchPrepareCollectionType(state, [id, collectionType]) {
      this.commit("main/deleteStructure");

      let resp = await state.dispatch("fetchCollectionType", [id, collectionType])

      if (
        resp.attributes.author.data != null &&
        resp.attributes.author.data.id == state.getters.getUser.id
      ) {
        this.commit("main/setRole", "author");
      } else {
        this.commit("main/setRole", "viewer");
      }

      if (collectionType == "courses") {
        state.dispatch("prepareCourse", [resp, false])
      } else if (collectionType == "expositives") {
        state.dispatch("prepareExpositive", [resp, false])
      } else if (collectionType == "evaluatives") {
        state.dispatch("prepareEvaluative", [resp, false])
      } else if (collectionType == "questions") {
        state.dispatch("prepareQuestion", [resp, false])
      } else if (collectionType == "occurrences") {
        state.dispatch("prepareOccurrence", [resp, false])
      } else if (collectionType == "classes") {
        state.dispatch("prepareClass", resp)
      } else if (collectionType == "students") {
        state.dispatch("prepareStudent", resp)
      } else if (collectionType == "statuses") {
        state.dispatch("prepareStatus", resp)
      }
    },
    async prepareCourse(state, [resp, isCopy]) {
      const course = await this.dispatch("convert/prepareCourse", [resp, isCopy])
      this.commit("main/setCourses", [course])
      if (state.getters.getRole == "author") {
        this.commit("main/createEditableCourse");
      }
    },
    async prepareExpositive(state, [resp, isCopy]) {
      const expositive = await this.dispatch("convert/prepareExpositive", [resp, isCopy])
      this.commit("main/setExpositives", [expositive])
    },
    async prepareEvaluative(state, [resp, isCopy]) {
      const evaluative = await this.dispatch("convert/prepareEvaluative", [resp, isCopy])
      this.commit("main/setEvaluatives", [evaluative])
    },
    async prepareQuestion(state, [resp, isCopy]) {
      const question = await this.dispatch("convert/prepareQuestion", [resp, isCopy])
      this.commit("main/setQuestions", [question])
    },
    async prepareOccurrence(state, [resp, isCopy]) {
      const occurrence = await this.dispatch("convert/prepareOccurrence", [resp, isCopy])
      this.commit("main/setOccurrences", [occurrence])
    },
    async prepareClass(state, resp) {
      const classe = await this.dispatch("convert/prepareClass", resp)
      this.commit("main/setClasses", [classe])
    },
    async prepareStudent(state, resp) {
      const student = await this.dispatch("convert/prepareStudent", resp)
      this.commit("main/setStudents", [student])
    },
    async prepareStatus(state, resp) {
      const status = await this.dispatch("convert/prepareStatus", resp)
      this.commit("main/setStatuses", [status])
    },

    async publishCollectionType(state, collectionType) {
      const func = "get" + collectionType.charAt(0).toUpperCase() + collectionType.slice(1, -1)
      let data = state.getters[func]
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

      await axios.put(
        url,
        formData,
        {
          headers: {
            Authorization: auth,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (collectionType == "courses") {
        this.commit("main/setCoursePublishedAt", [id, publishedAt])
      } else if (collectionType == "expositives") {
        this.commit("main/setExpositivePublishedAt", [id, publishedAt])
      } else if (collectionType == "evaluatives") {
        this.commit("main/setEvaluativePublishedAt", [id, publishedAt])
      } else if (collectionType == "questions") {
        this.commit("main/setQuestionPublishedAt", [id, publishedAt])
      } else if (collectionType == "occurrences") {
        this.commit("main/setOccurrencePublishedAt", [id, publishedAt])
      }

      if (publishedAt == null) {
        return "unpublished"
      } else {
        return "published"
      }
    },

    async saveCollectionType(state, collectionType) {
      const func = "get" + collectionType.charAt(0).toUpperCase() + collectionType.slice(1, -1)
      let data = state.getters[func]
      let files;
      const isNew = data.new ? true : false;
      if (collectionType == "courses") {
        [data, files] = await this.dispatch("convert/prepareCourseForServer", data)
      } else if (collectionType == "occurrences") {
        [data, files] = await this.dispatch("convert/prepareOccForServer", data)
      } else if (collectionType == "expositives") {
        [data, files] = await this.dispatch("convert/prepareExpositiveForServer", data)
      } else if (collectionType == "evaluatives") {
        [data, files] = await this.dispatch("convert/prepareEvaluativeForServer", data)
      } else if (collectionType == "questions") {
        [data, files] = await this.dispatch("convert/prepareQuestionForServer", data)
      }

      const auth = "Bearer " + state.getters.getJWT;
      let url = serverData.domain + serverData[collectionType];
      let resp;
      let id;
      if (isNew) {
        delete data.new
        delete data.id
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
          })
      } else {
        id = data.id;
      }
      url += "/" + id;

      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      files.forEach(file => {
        if (file.type == "image") {
          formData.append("files.image", file.file)
        } else if (file.type == "file") {
          formData.append("files.file", file.file)
        }
      })

      await axios
        .put(
          url,
          formData,//{ data: data },
          {
            headers: {
              Authorization: auth,
              'Content-Type': 'multipart/form-data'
            }
          }
        )
      await this.dispatch("main/fetchPrepareCollectionType", [id, collectionType]);
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
      return this.dispatch("convert/prepareCloneCourse", resp)
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
      this.commit("main/setRole", "author");
      this.commit("main/setChanged", true);
      this.dispatch("main/prepareCourse", [resp, true])
    },

    async addExistingExpositives(state, [lessonId, expositveIds]) {
      this.commit("main/setChanged", true);
      for (let expositveId of expositveIds) {
        let expositive = await this.dispatch("main/fetchCollectionType", [expositveId, "expositives"]);
        expositive = await this.dispatch("convert/prepareExpositive", [expositive,false])
        let lesson = state.getters.getCourse.children.flatMap(m => m.children).find(l => l.id == lessonId)
        lesson.expositives.push((expositive))
      }
      //this.commit("main/setChanged", false);
    },
    async addExistingEvaluatives(state, [lessonId, evalutaiveIds]) {
      this.commit("main/setChanged", true);
      for (let evaluativeId of evalutaiveIds) {
        let evaluative = await this.dispatch("main/fetchCollectionType", [evaluativeId, "evaluatives"]);
        evaluative = await this.dispatch("convert/prepareEvaluative", [evaluative, false])
        let lesson = state.getters.getCourse.children.flatMap(m => m.children).find(l => l.id == lessonId)
        lesson.evaluatives.push((evaluative))
      }
      //this.commit("main/setChanged", false);
    },
    async addExistingQuestions(state, [evaluativeId, questionIds]) {
      this.commit("main/setChanged", true);
      for (let questionId of questionIds) {
        let question = await this.dispatch("main/fetchCollectionType", [questionId, "questions"]);
        question = await this.dispatch("convert/prepareQuestion", [question, false])
        let evaluative
        if (state.getters.getCourses.length>0){
          evaluative = state.getters.getCourse.children.flatMap(m => m.children).flatMap(l => l.evaluatives).find(e => e.id == evaluativeId)
        } else {
          evaluative = state.getters.getEvaluative
        }
        evaluative.questions.push((question))
      }
      //this.commit("main/setChanged", false);
    },

    async generateProgrammingEx(state, [description, id]) {
      const auth = "Bearer " + state.getters.getJWT;
      const url = serverData.domain + serverData.gpt;
      
      try {
        const response = await axios.post(
          url,
          { data: {"description":description} },
          { headers: { Authorization: auth } }
        );
        
        let data = response.data.function_call.arguments
        let json = JSON.parse(data)
        console.log(json)
        
        if (state.getters.getCourses.length>0){
          let evaluative = state.getters.getCourse.children.flatMap(c => c.children).flatMap(l => l.evaluatives).find(e => e.id == id)
          evaluative.statement = json.statement
          evaluative.solution = json.solution
          let tests = []
          for (let test of json.tests){
            test.new = true
            test.output = ""
            if (test.input.endsWith(")") && !test.input.startsWith("(")){
              const firstIndex = test.input.indexOf("(");
              const lastIndex = test.input.lastIndexOf(")");
              test.input = test.input.substring(firstIndex + 1, lastIndex).replace(',', "");
            }
            if (json.solution.includes("console.log")){
              test.type = "log"
              test.subtype = null
              test.input = "log"
            } else if (json.solution.includes("function")) {
              test.type = "function"
              test.subtype = null
            } else {
              test.type = null
              test.subtype = null
            }
            tests.push(test)
          }
          evaluative.tests = tests
        } else {
          let evaluative = state.getters.getEvaluative
          evaluative.name = json.name
          evaluative.statement = json.statement
          evaluative.solution = json.solution
          let tests = []
          for (let test of json.tests){
            test.new = true
            if (test.input.endsWith(")") && !test.input.startsWith("(")){
              const firstIndex = test.input.indexOf("(");
              const lastIndex = test.input.lastIndexOf(")");
              test.input = test.input.str.substring(firstIndex + 1, lastIndex).replace(',', "");
            }
            if (json.solution.includes("console.log")){
              test.type = "log"
              test.subtype = null
              test.input = "log"
            } else if (json.solution.includes("function")) {
              test.type = "function"
              test.subtype = null
            } else {
              test.type = null
              test.subtype = null
            }
            
            tests.push(test)
          }
          evaluative.tests = tests
        }
                
      } catch (error) {
        console.error("Error in generateProgrammingEx: ", error);
        throw error;  // You might want to re-throw the error if it should be handled by the calling function
      }
    }
    

    /*
    async generateProgrammingEx(state, [description, id]){
      const auth = "Bearer " + state.getters.getJWT;
      const url = serverData.domain + serverData.gpt;
      axios.post(
        url,
        { data: {"description":description} },
        {
          headers: {
            Authorization: auth
          }
        })
        .then(response => {
          let data = response.data.function_call.arguments
          let json = JSON.parse(data)
          console.log(json)

          if (state.getters.getCourses.length>0){
            let evaluative = state.getters.getCourse.children.flatMap(c => c.children).flatMap(l => l.evaluatives).find(e => e.id == id)
            evaluative.statement = json.statement
            evaluative.solution = json.solution
            let tests = []
            for (let test of json.tests){
              test.new = true
              if (test.input.endsWith(")") && !test.input.startsWith("(")){
                const firstIndex = test.input.indexOf("(");
                const lastIndex = test.input.lastIndexOf(")");
                test.input = test.input.substring(firstIndex + 1, lastIndex).replace(',', "");
              }
              if (json.solution.includes("console.log")){
                test.type = "log"
                test.subtype = null
                test.input = "log"
              } else if (json.solution.includes("function")) {
                test.type = "function"
                test.subtype = null
              } else {
                test.type = null
                test.subtype = null
              }
              tests.push(test)
            }
            evaluative.tests = tests
          } else {
            let evaluative = state.getters.getEvaluative
            evaluative.name = json.name
            evaluative.statement = json.statement
            evaluative.solution = json.solution
            let tests = []
            for (let test of json.tests){
              test.new = true
              if (test.input.endsWith(")") && !test.input.startsWith("(")){
                const firstIndex = test.input.indexOf("(");
                const lastIndex = test.input.lastIndexOf(")");
                test.input = test.input.str.substring(firstIndex + 1, lastIndex).replace(',', "");
              }
              if (json.solution.includes("console.log")){
                test.type = "log"
                test.subtype = null
                test.input = "log"
              } else if (json.solution.includes("function")) {
                test.type = "function"
                test.subtype = null
              } else {
                test.type = null
                test.subtype = null
              }
              
              tests.push(test)
            }
            evaluative.tests = tests
          }
        });
    },*/


  },
  modules: {}
};

const serverData = {
  domain: "https://agni.dcc.fc.up.pt/strapi",
  //domain: "http://localhost:1337",
  authentication: "/api/auth/local",
  register: "/api/auth/local/register",
  me: "/api/users/me?populate=*",
  users: "/api/users",
  changePW : "/api/auth/change-password",
  sendEmail : "/api/sendEmail",
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
};

export default new Vuex.Store({
  modules: {
    main,
    convert,
    style
  }
});
