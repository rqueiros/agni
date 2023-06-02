import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import router from "../router";

Vue.use(Vuex);

const data = {
  state: {
    login: false,
    user: {},
    role: "",
    jwt: "",
    courses: [],
    modules: [],
    lessons: [],
    expositives: [],
    evaluatives: [],
    statuses: [],
    occurrences: [],
    classes: [],
    students: [],
    maxId: 0,
    changed: false,
    screenSize: ""
  },
  getters: {
    //------------------------Authentication----------------------------------
    isLogged: state => state.login,
    getJWT: state => state.jwt,
    getRole: state => state.role,
    getUsername: state => state.user.username,

    isStudent: state => state.role == "student",
    isTeacher: state => state.role == "author" || state.role == "viewer",
    isAuthor: state => state.role == "author",
    isViewer: state => state.role == "viewer",

    //--------------------------Student---------------------------------------

    //-------Course
    getCourse: state => state.courses,
    getPublishedAt: state => {
      if (state.courses.length > 0) {
        return state.courses[0].publishedAt;
      }
      return null;
    },

    //-------Module
    getModuleByLesson: state => id => {
      return state.modules.find(m =>
        m.children.map(l => l.id).includes(id)
      );
    },
    getModuleByEvaluative: state => id => {
      return state.modules.find(m =>
        m.children.flatMap(l => l.evaluatives.map(e => e.id)).includes(id)
      );
    },
    getModuleByExpositive: state => id => {
      return state.modules.find(m =>
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
      return state.lessons.find(l => {
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
      return state.modules.find(m => m.id == id).children;
    },

    //-------Resource
    getResourceById: state => {
      return function (id, type) {
        if (type != "course" && type != "module") {
          return state[type + "s"].find(r => r.id == id);
        }
        return undefined;
      };
    },

    //-------Status
    getStatusByResourceId: state => id => {
      return state.evaluatives.find(evaluative => evaluative.status.id == id)
        .status;
    },
    getCompletationStatusByLesson: state => id => {
      if (id == "0") {
        return null;
      }
      const lesson = state.lessons.find(l => l.id == id);
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
      return state.evaluatives.find(e => e.id == payload.id);
    },

    //--------------------------Teacher---------------------------------------
    getOccurrence: state => state.occurrences,

    //--------------------------Sizes---------------------------------------
    getScreenSize: state => state.screenSize,
    isSmallScreen: state =>
      state.screenSize == "xs" || state.screenSize == "sm",
    isXS: state => state.screenSize == "xs",
    isSM: state => state.screenSize == "sm",
    isMD: state => state.screenSize == "md",
    isLG: state => state.screenSize == "lg",
    isXL: state => state.screenSize == "xl",
    isXSsmaler: state => state.screenSize == "xs",
    isSMsmaler: state => state.screenSize == "sm" || state.screenSize == "sm",
    isMDsmaler: state => state.screenSize == "md" || state.screenSize == "sm" || state.screenSize == "xs",
    isLGsmaler: state => state.screenSize == "lg" || state.screenSize == "md" || state.screenSize == "sm" || state.screenSize == "xs",
    isXLsmaler: state => state.screenSize == "xl" || state.screenSize == "lg" || state.screenSize == "md" || state.screenSize == "sm" || state.screenSize == "xs",
    getIconSmallSize: state => {
      if (state.screenSize == "xs" || state.screenSize == "sm")
        return "x-large";
      else if (state.screenSize == "md") return "medium";
      else return "x-large";
    },
    getIconMediumSize: state => {
      if (state.screenSize == "xs" || state.screenSize == "sm")
        return "xx-large";
      else if (state.screenSize == "md") return "x-large";
      else return "xx-large";
    },
    getIconBigSize: state => {
      if (state.screenSize == "xs" || state.screenSize == "sm")
        return "xx-large";
      else if (state.screenSize == "md") return "x-large";
      else return "xx-large";
    },
    getAvatarSmallSize: state => {
      if (state.screenSize == "xs" || state.screenSize == "sm") return "50";
      else if (state.screenSize == "md") return "40";
      else return "50";
    },
    getAvatarMediumSize: state => {
      if (state.screenSize == "xs" || state.screenSize == "sm") return "65";
      else if (state.screenSize == "md") return "55";
      else return "65";
    },
    getSmallTextClass: state => {
      if (state.screenSize == "xs" || state.screenSize == "sm")
        return "text-body-2";
      else if (state.screenSize == "md") return "text-caption";
      else return "text-body-2";
    },
    getTextClass: state => {
      if (state.screenSize == "xs" || state.screenSize == "sm")
        return "text-body-1";
      else if (state.screenSize == "md") return "text-body-2";
      else return "text-body-1";
    },
    getTitleClass: state => {
      if (state.screenSize == "xs" || state.screenSize == "sm")
        return "text-h5";
      else if (state.screenSize == "md") return "text-h5";
      else return "text-h4";
    },
    getSubtitleClass: state => {
      if (state.screenSize == "xs" || state.screenSize == "sm")
        return "text-h6";
      else if (state.screenSize == "md") return "text-subtitle-1";
      else return "text-h6";
    },
    getButtonSize: state => {
      if (state.screenSize == "xs" || state.screenSize == "sm") return "";
      else if (state.screenSize == "md") return "small";
      else return "";
    }
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

    //-----------------------Sizes---------------------------------------------
    setScreenSize(state, size) {
      if (size <= 480) state.screenSize = "xs";
      else if (size <= 768) state.screenSize = "sm";
      else if (size <= 1024) state.screenSize = "md";
      else if (size <= 1280) state.screenSize = "lg";
      else state.screenSize = "xl";
    },

    //-----------------------Teacher------------------------------------------

    //-------Course
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
      this.commit("updateStructure");
      this.commit("setChanged", true);
    },
    setCourseField(state, [id, field, value]) {
      const course = state.courses.find(c => c.id == id);
      course[field] = value;
      this.commit("updateStructure");
    },

    //-------Goal
    setGoalField(state, [id, field, value]) {
      const goal = state.courses
        .filter(c => "goals" in c)
        .flatMap(c => c.goals)
        .find(g => g.id == id);
      goal[field] = value;
      this.commit("updateStructure");
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
      this.commit("updateStructure");
    },
    deleteGoal(state, id) {
      const course = state.courses
        .filter(c => "goals" in c)
        .find(c => c.goals.map(g => g.id).includes(id));
      const index = course.goals.findIndex(g => g.id == id);
      course.goals.splice(index, 1);
      this.commit("updateStructure");
    },

    //-------Module
    addModuleByCourseId(state, id) {
      const course = state.courses.find(c => c.id == id);
      let n = Math.min(...state.modules.map(m => m.id));
      if (n > 0 || !isFinite(n)) {
        n = 0;
      }
      let module = {
        id: n - 1,
        idMenu: state.maxId,
        new: true,
        contentType: "module",
        name: "",
        children: [
          {
            id: 0,
            idMenu: state.maxId + 1,
            parentId: n + 1,
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
      this.commit("updateStructure");
    },
    deleteModule(state, id) {
      const course = state.courses.find(c =>
        c.children.map(m => m.id).includes(id)
      );
      const index = course.children.findIndex(obj => obj.id == id);
      course.children.splice(index, 1);
      this.commit("updateStructure");
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
      this.commit("updateStructure");
    },
    setModuleField(state, [id, field, value]) {
      const module = state.courses
        .flatMap(c => c.children)
        .find(m => m.id == id);
      module[field] = value;
      this.commit("updateStructure");
    },

    //-------Lesson
    addLessonByModuleId(state, id) {
      const module = state.courses
        .flatMap(c => c.children)
        .find(m => m.id == id);
      let n = Math.min(...state.lessons.map(l => l.id));
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
      this.commit("updateStructure");
    },
    deleteLesson(state, id) {
      const module = state.courses
        .flatMap(c => c.children)
        .find(m => m.children.map(l => l.id).includes(id));
      let index = module.children.findIndex(obj => obj.id == id);
      module.children.splice(index, 1);
      this.commit("updateStructure");
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
      this.commit("updateStructure");
    },
    setLessonField(state, [id, field, value]) {
      const lesson = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .find(l => l.id == id);
      lesson[field] = value;
      this.commit("updateStructure");
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
      condition[field] = value;
      this.commit("updateStructure");
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
        type: ""
      };
      condition.id = n - 1;
      element.condition = condition;
      this.commit("updateStructure");
    },

    //-------Expositive
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
        type: "newExpo",
        milestones: []
      };
      lesson.expositives.push(expositive);
      this.commit("updateStructure");
    },
    setExpositiveField(state, [id, field, value]) {
      const expositive = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.expositives)
        .find(e => e.id == id);
      expositive[field] = value;
      this.commit("updateStructure");
    },
    deleteExpositive(state, id) {
      let lesson = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .find(l => l.expositives.map(e => e.id).includes(id));
      let index = lesson.expositives.findIndex(obj => obj.id == id);
      lesson.expositives.splice(index, 1);
      this.commit("updateStructure");
    },
    changeExpositiveTypeById(state, list) {
      const id = list[0];
      const file = list[1];
      const expositive = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.expositives)
        .find(e => e.id == id);
      expositive.file = file;
      if (file.type.includes("pdf")) {
        expositive.contentType = "pdf";
        expositive.type = "pdf";
      } else if (file.type.includes("video")) {
        expositive.contentType = "video";
        expositive.type = "video";
      }

      this.commit("updateStructure");
    },

    //-------Evaluative
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
      this.commit("updateStructure");
    },
    changeEvaluativeTypeById(state, list) {
      const id = list[0];
      const type = list[1];
      const evaluative = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .find(e => e.id == id);
      if (type == "quiz") {
        const questions = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.evaluatives)
          .filter(e => e.contentType == "quiz")
          .flatMap(e => e.questions.map(q => q.id));
        let i = Math.max(...questions);
        if (i < 0) {
          i = 0;
        }
        const answers = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.evaluatives)
          .filter(e => e.contentType == "quiz")
          .flatMap(e => e.questions)
          .flatMap(q => q.answers.map(a => a.id));
        let i2 = Math.max(...answers);
        if (i2 < 0) {
          i2 = 0;
        }
        evaluative.questions.push({
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
      }
      evaluative.type = "";
      evaluative.contentType = type;
      this.commit("updateStructure");
    },
    deleteEvaluative(state, id) {
      let lesson = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .find(l => l.evaluatives.map(e => e.id).includes(id));
      let index = lesson.evaluatives.findIndex(obj => obj.id == id);
      lesson.evaluatives.splice(index, 1);
      this.commit("updateStructure");
    },
    setEvaluativeField(state, [id, field, value]) {
      const evaluative = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .find(e => e.id == id);
      evaluative[field] = value;
      this.commit("updateStructure");
    },

    //-------Question
    addQuestionByQuestionId(state, id) {
      const evaluative = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .filter(e => e.contentType == "quiz")
        .find(e => e.questions.map(q => q.id).includes(id));
      const index = evaluative.questions.findIndex(q => q.id == id);
      const questions = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .filter(e => e.contentType == "quiz")
        .flatMap(e => e.questions.map(q => q.id));
      let i = Math.min(...questions);
      if (i > 0 || !isFinite(i)) {
        i = 0;
      }
      const answers = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .filter(e => e.contentType == "quiz")
        .flatMap(e => e.questions)
        .flatMap(q => q.answers.map(a => a.id));
      let i2 = Math.min(...answers);
      if (i2 > 0 || !isFinite(i2)) {
        i2 = 0;
      }
      evaluative.questions.splice(index + 1, 0, {
        new:true,
        question: "",
        id: i - 1,
        correctAnswer: [],
        answers: [
          { answer: "", id: i2 - 1 },
          { answer: "", id: i2 - 2 }
        ]
      });
      this.commit("updateStructure");
    },
    addQuestionByResourceId(state, id) {
      const evaluative = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .find(e => e.id == id);
      const questions = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .filter(e => e.contentType == "quiz")
        .flatMap(e => e.questions.map(q => q.id));
      let i = Math.min(...questions);
      if (i > 0 || !isFinite(i)) {
        i = 0;
      }
      const answers = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .filter(e => e.contentType == "quiz")
        .flatMap(e => e.questions)
        .flatMap(q => q.answers.map(a => a.id));
      let i2 = Math.min(...answers);
      if (i2 > 0 || !isFinite(i2)) {
        i2 = 0;
      }
      evaluative.questions.push({
        new:true,
        question: "",
        id: i - 1,
        correctAnswer: [],
        answers: [
          { answer: "", id: i2 - 1 },
          { answer: "", id: i2 - 2 }
        ]
      });
      this.commit("updateStructure");
    },
    deleteQuestion(state, id) {
      const evaluative = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .filter(e => e.contentType == "quiz")
        .find(e => e.questions.map(q => q.id).includes(id));
      const index = evaluative.questions.findIndex(q => q.id == id);
      evaluative.questions.splice(index, 1);
      this.commit("updateStructure");
    },
    setQuestionField(state, [id, field, value]) {
      const question = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .filter(e => e.contentType == "quiz")
        .flatMap(e => e.questions)
        .find(q => q.id == id);
      question[field] = value;
      this.commit("updateStructure");
    },

    //-------Answer
    addAnswerByQuestionId(state, id) {
      const question = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .filter(e => e.contentType == "quiz")
        .flatMap(e => e.questions)
        .find(q => q.id == id);
      const answers = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .filter(e => e.contentType == "quiz")
        .flatMap(e => e.questions)
        .flatMap(q => q.answers.map(a => a.id));
      let n = Math.min(...answers);
      if (n > 0 || !isFinite(n)) {
        n = 0;
      }
      question.answers.push({
        new:true,
        answer: "",
        id: n - 1
      });
      this.commit("updateStructure");
    },
    setAnswerField(state, [id, field, value]) {
      const a = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .filter(e => e.contentType == "quiz")
        .flatMap(e => e.questions)
        .flatMap(q => q.answers)
        .find(a => a.id == id);
      a[field] = value;
      this.commit("updateStructure");
    },
    deleteAnswer(state, id) {
      const question = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .filter(e => e.contentType == "quiz")
        .flatMap(e => e.questions)
        .find(q => q.answers.map(a => a.id).includes(id));
      const index = question.answers.findIndex(a => a.id == id);
      if (index in question.correctAnswer) {
        const ind2 = question.correctAnswer.findIndex(c => c == index);
        question.correctAnswer = question.correctAnswer.map(c => {
          if (c > index) {
            return c - 1;
          } else {
            return c;
          }
        });
        question.correctAnswer.splice(ind2, 1);
      }
      question.answers.splice(index, 1);
      this.commit("updateStructure");
    },

    //-------Test
    addTestByEvaluativeId(state, id) {
      const evaluative = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .find(e => e.id == id);
      const tests = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .filter(e => e.contentType == "code")
        .flatMap(e => e.tests.map(t => t.id));
      let n = Math.min(...tests);
      if (n > 0 || !isFinite(n)) {
        n = 0;
      }
      evaluative.tests.push({
        new:true,
        id: n - 1,
        input: "",
        expected: "",
        type: "",
        subtype: "",
        output: "",
        show: false
      });
      this.commit("updateStructure");
    },
    deleteTest(state, id) {
      const evaluative = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .filter(e => e.contentType == "code")
        .find(e => e.tests.map(t => t.id).includes(id));
      const index = evaluative.tests.findIndex(t => t.id == id);
      evaluative.tests.splice(index, 1);
      this.commit("updateStructure");
    },
    setTestField(state, [id, field, value]) {
      const test = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .filter(e => e.contentType == "code")
        .flatMap(e => e.tests)
        .find(t => t.id == id);
      test[field] = value;
      this.commit("updateStructure");
    },

    //-------Milestone
    addMilestoneByExpositiveId(state, id) {
      const evaluative = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.expositives)
        .find(e => e.id == id);
      const milestones = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.expositives)
        .flatMap(e => e.milestones.map(t => t.id));
      let i = Math.min(...milestones);
      if (i > 0 || !isFinite(i)) {
        i = 0;
      }
      evaluative.milestones.push({
        id: i - 1,
        new:true,
        frame: "",
        label: ""
      });
      this.commit("updateStructure");
    },
    deleteMilestone(state, id) {
      const evaluative = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.expositives)
        .find(e => e.milestones.map(t => t.id).includes(id));
      const index = evaluative.milestones.findIndex(t => t.id == id);
      evaluative.milestones.splice(index, 1);
      this.commit("updateStructure");
    },
    setMilestoneField(state, [id, field, value]) {
      const milestone = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.expositives)
        .flatMap(e => e.milestones)
        .find(t => t.id == id);
      if (field == "frame" && typeof(value)=="string"){
        milestone[field] = JSON.parse(value)
      } else {
        milestone[field] = value;
      }
      this.commit("updateStructure");
    },

    //-------Context
    addContextByEvaluativeId(state, id) {
      const evaluative = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .find(e => e.id == id);
      const contexts = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .filter(e => e.contentType == "code")
        .flatMap(e => e.contexts.map(t => t.id));
      let i = Math.min(...contexts);
      if (i > 0 || !isFinite(i)) {
        i = 0;
      }
      evaluative.contexts.push({
        new:true,
        id: i - 1,
        format: "",
        name: "",
        text: "",
        contentType: "new",
        show: false
      });
      this.commit("updateStructure");
    },
    deleteContext(state, id) {
      const evaluative = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .filter(e => e.contentType == "code")
        .find(e => e.contexts.map(t => t.id).includes(id));
      const index = evaluative.contexts.findIndex(t => t.id == id);
      evaluative.contexts.splice(index, 1);
      this.commit("updateStructure");
    },
    setContextField(state, [id, field, value]) {
      const context = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .filter(e => e.contentType == "code")
        .flatMap(e => e.contexts)
        .find(t => t.id == id);
      context[field] = value;
      this.commit("updateStructure");
    },

    //-------Etc
    editableInput(state, obj) {
      const value = obj.value;
      const type = obj.type;
      const field = obj.field;
      const id = obj.id;
      if (type == "course") {
        this.commit("setCourseField", [id, field, value]);
      } else if (type == "module") {
        this.commit("setModuleField", [id, field, value]);
      } else if (type == "lesson") {
        this.commit("setLessonField", [id, field, value]);
      } else if (type == "condition") {
        this.commit("setConditionField", [id, field, value]);
      } else if (type == "expositive") {
        this.commit("setExpositiveField", [id, field, value]);
      } else if (type == "evaluative") {
        this.commit("setEvaluativeField", [id, field, value]);
      } else if (type == "question") {
        this.commit("setQuestionField", [id, field, value]);
      } else if (type == "answer") {
        this.commit("setAnswerField", [id, field, value]);
      } else if (type == "test") {
        this.commit("setTestField", [id, field, value]);
      } else if (type == "milestone") {
        this.commit("setMilestoneField", [id, field, value]);
      } else if (type == "context") {
        this.commit("setContextField", [id, field, value]);
      } else if (type == "goal") {
        this.commit("setGoalField", [id, field, value]);
      }
    },
    deleteStructure(state) {
      this.commit("setChanged", true);
      state.courses = [];
      state.modules = [];
      state.lessons = [];
      state.expositives = [];
      state.evaluatives = [];
      state.occurrences = [];
      state.statuses = [];
      state.classes = [];
      state.students = [];
    },
    updateStructure(state) {
      this.commit("setChanged", false);
      state.modules = state.courses.flatMap(c => c.children);
      state.lessons = state.modules.flatMap(c => c.children);
      state.evaluatives = [];
      state.lessons.forEach(l => {
        if (
          "evaluatives" in l &&
          l.evaluatives.length != undefined &&
          l.evaluatives.length > 0
        ) {
          l.evaluatives.forEach(e => {
            state.evaluatives.push(e);
          });
        }
      });
      //state.evaluatives = state.lessons.flatMap(c => c.evaluatives);
      state.expositives = state.lessons.flatMap(c => c.expositives);
      /*let count = 1
      state.courses.forEach(course => {
         course.id = count
         count = count + 1
         course.children.forEach(module => {
            module.id = count
            count = count + 1
            module.children.forEach(lesson => {
               lesson.id = count
               count = count + 1
            })
         })
      })*/
    },
    setChanged(state, changed) {
      state.changed = changed;
    }

    //-------Statuses
    /*
    setTeacherProgress(state, obj){
      const code = obj.code
      const id = obj.id
      if (state.statuses.map(s => s.id).includes(id)){
        const status = state.statuses.filter(s => s.id = id)
        status.code = code
      } else {
        state.statuses.push({id:id, code:code})
      }
    }*/
  },
  actions: {
    //--------------------------Authentication--------------------------------
    async login(state, loginData) {
      const requestData = { identifier: loginData[0], password: loginData[1] };
      let url = serverData.domain + serverData.authentication;
      await axios.post(url, requestData).then(resp => {
        state.commit("setJWT", resp.data.jwt);
        state.commit("setUser", resp.data.user);
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
        });
      this.commit("setRole", role);
      role = role.charAt(0).toUpperCase() + role.slice(1);
      this.commit("setLogin", true);
      if (role == "Student") {
        this.dispatch("fetchCourse");
        //this.commit("loadStudentFunctions")
      } else if (role == "Teacher") {
        //.commit("loadTeacherFunctions")
        console.log("teacher");
      }
      router.push({ name: role });
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
          resp = response.data.data;
        });
      const course = externalFunctions.prepareCourse(resp);

      data.state.courses = [course];
      data.state.modules = [...data.state.courses.flatMap(c => c.children)];
      data.state.lessons = [...data.state.modules.flatMap(m => m.children)];
      data.state.expositives = [
        ...data.state.lessons.flatMap(l => l.expositives)
      ];
      data.state.evaluatives = [
        ...data.state.lessons.flatMap(l => l.evaluatives)
      ];
    },

    //--------------------------Teacher---------------------------------------
    async fetchEmptyCourse(state) {
      state.commit("deleteStructure");
      data.state.courses = [
        {
          new: true,
          id: 1,
          idMenu: 1,
          contentType: "course",
          name: "",
          type: null,
          goals: [],
          children: [
            {
              new: true,
              id: 2,
              idMenu: 2,
              contentType: "module",
              name: "",
              condition: { id: 1 },
              children: [
                {
                  new: true,
                  id: 3,
                  idMenu: 3,
                  contentType: "lesson",
                  name: "",
                  description: "",
                  evaluatives: [],
                  expositives: [],
                  condition: { id: 2 }
                }
              ]
            }
          ]
        }
      ];
      data.state.maxId = 4;
      state.commit("createEditableCourse");
      state.commit("setRole","author");
    },
    async fetchCourseTeacher(state, id) {
      state.commit("deleteStructure");
      const auth = "Bearer " + state.getters.getJWT;
      let resp;
      const url = serverData.domain + serverData.courses + "/" + id;
      await axios
        .get(url, {
          headers: {
            Authorization: auth
          }
        })
        .then(response => {
          resp = response.data.data;
        })

      if (
        resp.attributes.author.data != null &&
        resp.attributes.author.data.id == data.state.user.id
      ) {
        this.commit("setRole", "author");
      } else {
        this.commit("setRole", "viewer");
      }
      const course = externalFunctions.prepareCourse(resp);

      data.state.courses = [course];
      data.state.modules = [...data.state.courses.flatMap(c => c.children)];
      data.state.lessons = [...data.state.modules.flatMap(m => m.children)];
      data.state.expositives = [
        ...data.state.lessons.flatMap(l => l.expositives)
      ];
      data.state.evaluatives = [
        ...data.state.lessons.flatMap(l => l.evaluatives)
      ];

      if (data.state.role == "author") {
        state.commit("createEditableCourse");
      }
    },
    async fetchCollectionTypes(state, parameters) {
      const auth = "Bearer " + state.getters.getJWT;
      let resp;
      let url = serverData.domain;
      switch (parameters.collectionType) {
        case "course":
          url += serverData.courses;
          break;
        case "expositive":
          url += serverData.expositives;
          break;
        case "evaluative":
          url += serverData.evaluatives;
          break;
        case "question":
          url += serverData.questions;
          break;
        case "occurrence":
          url += serverData.occurrences;
          break;
        default:
          return null;
      }
      let params = {};
      if (parameters.my) {
        params["filters[author][id][$eq]"] = data.state.user.id;
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
        case "course":
          resp = externalFunctions.cleanCourseData(resp);
          break;
        case "expositive":
          resp = externalFunctions.cleanExpositiveData(resp);
          break;
        case "evaluative":
          resp = externalFunctions.cleanEvaluativeData(resp);
          break;
        case "question":
          resp = externalFunctions.cleanQuestionData(resp);
          break;
        case "occurrence":
          resp = externalFunctions.cleanOccurrenceData(resp);
          break;
      }
      return resp;
    },
    async publishCourse(state) {
      let publishedAt = data.state.courses[0].publishedAt;
      let id = data.state.courses[0].id;
      if (publishedAt == null) {
        const now = new Date();
        publishedAt = now.toISOString();
      } else {
        publishedAt = null;
      }
      const auth = "Bearer " + state.getters.getJWT;
      let url = serverData.domain + serverData.courses + "/" + id;
      await axios.put(
        url,
        { data: { publishedAt: publishedAt } },
        {
          headers: {
            Authorization: auth
          }
        }
      )
      data.state.courses[0].publishedAt = publishedAt;
      if (publishedAt == null){
        return "unpublished"
      } else {
        return "published"
      }
    },
    async saveCourse(state) {
      const isNew = data.state.courses[0].new ? true : false;
      const course = externalFunctions.prepareCourseForServer(
        data.state.courses[0]
      );
      let resp;
      let id;
      const auth = "Bearer " + state.getters.getJWT;
      let url = serverData.domain + serverData.courses;
      if (isNew) {
        delete course.new
        course.publishedAt = null;
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
        id = course.id;
      }
      url += "/" + id;
      await axios
        .put(
          url,
          { data: course },
          {
            headers: {
              Authorization: auth
            }
          }
        )
      state.commit("deleteStructure");
      await state.dispatch("fetchCourseTeacher", id);
    },
    async deleteCourse(state, id) {
      const auth = "Bearer " + state.getters.getJWT;
      let url = serverData.domain + serverData.courses + "/" + id;
      await axios.delete(url, {
        headers: {
          Authorization: auth
        }
      });
      state.commit("deleteStructure");
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
      return externalFunctions.prepareCloneCourse(resp);
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
      const course = externalFunctions.prepareCourse(resp);

      this.commit("setChanged", true);
      this.commit("setRole", "author");

      data.state.courses = [course];
      data.state.modules = [...data.state.courses.flatMap(c => c.children)];
      data.state.lessons = [...data.state.modules.flatMap(m => m.children)];
      data.state.expositives = [
        ...data.state.lessons.flatMap(l => l.expositives)
      ];
      data.state.evaluatives = [
        ...data.state.lessons.flatMap(l => l.evaluatives)
      ];
      state.commit("createEditableCourse");
    },
    async fetchOccurrence(state, id) {
      state.commit("deleteStructure");
      const auth = "Bearer " + state.getters.getJWT;
      let resp;
      const url = serverData.domain + serverData.occurrences + "/" + id;
      await axios
        .get(url, {
          headers: {
            Authorization: auth
          }
        })
        .then(response => {
          resp = response.data.data;
        });
      const occ = externalFunctions.prepareOccurrence(resp);

      data.state.occurrences = [occ];
      data.state.classes = [...data.state.occurrences.flatMap(o => o.classes)];
      data.state.students = [...data.state.classes.flatMap(c => c.students)];
      data.state.statuses = [...data.state.students.flatMap(s => s.statuses)];
    },
    async fetchExpositive(state, id){
      const auth = "Bearer " + state.getters.getJWT;
      let resp;
      const url = serverData.domain + serverData.expositives + "/" + id;
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
    async addExistingExpositives(state, [lessonId,expositveIds,currentId]){
      this.commit("deleteExpositive", currentId)
      for (let expositveId of expositveIds){
        let expositive = await this.dispatch("fetchExpositive", expositveId);
        expositive = externalFunctions.prepareExpositive(expositive)
        let lesson = data.state.courses[0].children.flatMap(m => m.children).find(l => l.id == lessonId)
        lesson.expositives.push((expositive))
      }
      this.commit("updateStructure");
    },
    async fetchEvaluative(state, id){
      const auth = "Bearer " + state.getters.getJWT;
      let resp;
      const url = serverData.domain + serverData.evaluatives + "/" + id;
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
    async addExistingEvaluatives(state, [lessonId,evalutaiveIds,currentId]){
      this.commit("deleteEvaluative", currentId)
      for (let evaluativeId of evalutaiveIds){
        let evaluative = await this.dispatch("fetchEvaluative", evaluativeId);
        evaluative = externalFunctions.prepareEvaluative(evaluative)
        let lesson = data.state.courses[0].children.flatMap(m => m.children).find(l => l.id == lessonId)
        lesson.evaluatives.push((evaluative))
      }
      this.commit("updateStructure");
    },
    async fetchQuestion(state, id){
      const auth = "Bearer " + state.getters.getJWT;
      let resp;
      const url = serverData.domain + serverData.questions + "/" + id;
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
    async addExistingQuestions(state, [evaluativeId,questionIds]){
      for (let questionId of questionIds){
        let question = await this.dispatch("fetchQuestion", questionId);
        question = externalFunctions.prepareQuestion(question)
        let evaluative = data.state.courses[0].children.flatMap(m => m.children).flatMap(l => l.evaluatives).find(e => e.id == evaluativeId)
        evaluative.questions.push((question))
      }
      this.commit("updateStructure");
    }
  },
  modules: {}
};

const serverData = {
  //domain: "https://agni.dcc.fc.up.pt/strapi",
  domain: "http://localhost:1337",
  authentication: "/api/auth/local",
  register: "/api/auth/local/register",
  me: "/api/users/me?populate=*",
  courses: "/api/courses",
  expositives: "/api/expositives",
  evaluatives: "/api/evaluatives",
  questions: "/api/questions",
  statuses: "/api/statuses",
  occurrences: "/api/occurrences",
  classes: "/api/classes",
  students: "/api/students"
};

const externalFunctions = {
  prepareCourseForServer(course) {
    let newCourse = {};
    if(course.new){
      newCourse.new = course.new
    } else {
      newCourse.id = course.id
    }
    if ("goals" in course) {
      newCourse.goals = [];
      course.goals.forEach(goal => {
        if (goal.new) {
          newCourse.goals.push({ goal: goal.goal });
        } else {
          newCourse.goals.push(goal);
        }
      })
    }
    if ("name" in course) {
      newCourse.name = course.name
    }
    if ("type" in course && course.type != null) {
      newCourse.type = course.type
    }
    if ("children" in course) {
      newCourse.modules = [];
      course.children.forEach(module => {
        if (module.type == "add") {
          return;
        }
        let newModule = {};
        if (!module.new) {
          newModule.id = module.id
        }
        if ("name" in module) {
          newModule.name = module.name
        }
        if ("condition" in module && module.condition != null) {
          newModule.condition = {};
          if (module.condition.new) {
            newModule.condition = module.condition
            delete newModule.condition.id
          } else {
            newModule.condition = module.condition
          }
        }
        if ("children" in module) {
          newModule.lessons = [];
          module.children.forEach(lesson => {
            if (lesson.type == "add") {
              return;
            }
            let newLesson = {};
            if (!lesson.new) {
              newLesson.id = lesson.id
            }
            if ("name" in lesson) {
              newLesson.name = lesson.name
            }
            if ("description" in lesson && lesson.description != null) {
              newLesson.description = lesson.description
            }
            if ("condition" in lesson && lesson.condition != null) {
              newLesson.condition = {};
              if (lesson.condition.new) {
                newLesson.condition = lesson.condition
                delete newLesson.condition.id
              } else {
                newLesson.condition = lesson.condition
              }
            }

            if("expositives" in lesson){
              newLesson.expositives = [];
              lesson.expositives.forEach(expositive => {
                let newExpositive = {};
                if (expositive.new){
                  newExpositive.new = true
                } else{
                  newExpositive.id = expositive.id
                }
                if ("name" in expositive){
                  newExpositive.name = expositive.name
                }
                if ("type" in expositive){
                  newExpositive.type = expositive.type
                }
                if("file" in expositive){
                  //TODO file upload
                }
                if("milestones" in expositive){
                  newExpositive.milestones = [];
                  expositive.milestones.forEach(milestone => {
                    if (milestone.new){
                      delete milestone.id
                      delete milestone.new
                      newExpositive.milestones.push(milestone)
                    } else {
                      newExpositive.milestones.push(milestone)
                    }
                  })
                }

                newLesson.expositives.push(newExpositive)
              })
            }

            if("evaluatives" in lesson){
              newLesson.evaluatives = [];
              lesson.evaluatives.forEach(evaluative => {
                let newEvaluative = {};
                if (evaluative.new){
                  newEvaluative.new = true;
                } else {
                  newEvaluative.id = evaluative.id
                }
                if("name" in evaluative){
                  newEvaluative.name = evaluative.name
                }
                newEvaluative.content=[{}];
                if(evaluative.contentType=="quiz"){
                  newEvaluative.content[0].__component = "base.quiz";
                  if("questions" in evaluative){
                    newEvaluative.content[0].questions = [];
                    evaluative.questions.forEach(question => {
                      let newQuestion = {};
                      if(question.new) {
                        newQuestion.new = true;
                      } else {
                        newQuestion.id = question.id;
                      }
                      if("correctAnswer" in question){
                        newQuestion.correctAnswer = question.correctAnswer;
                      }
                      if("question" in question) {
                        newQuestion.question = question.question;
                      }
                      if("image" in question){
                        //TODO image upload
                      }
                      if("answers" in question){
                        newQuestion.answers = [];
                        question.answers.forEach(answer => {
                          if(answer.new){
                            delete answer.id
                            delete answer.new
                            newQuestion.answers.push(answer)
                          } else {
                            newQuestion.answers.push(answer)
                          }
                        })
                      }

                      newEvaluative.content[0].questions.push(newQuestion)
                    })
                  }
                } else {
                  newEvaluative.content[0].__component = "base.programming-exercise";
                  if("type" in evaluative){
                    newEvaluative.content[0].type = evaluative.type
                  }
                  if("language" in evaluative){
                    newEvaluative.content[0].language = evaluative.language
                  }
                  if("statement" in evaluative){
                    newEvaluative.content[0].statement = evaluative.statement
                  }
                  if("skeleton" in evaluative){
                    newEvaluative.content[0].skeleton = evaluative.skeleton
                  }
                  if("solution" in evaluative){
                    newEvaluative.content[0].solution = evaluative.solution
                  }
                  if("context" in evaluative){
                    newEvaluative.content[0].context = [];
                    evaluative.context.forEach(context => {
                      if(context.new){
                        delete context.new
                        delete context.id
                        newEvaluative.content[0].context.push(context)
                      } else {
                        newEvaluative.content[0].context.push(context)
                      }
                    })
                  }
                  if("tests" in evaluative){
                    newEvaluative.content[0].tests = [];
                    evaluative.tests.forEach(test => {
                      if(test.new){
                        delete test.new
                        delete test.id
                        newEvaluative.content[0].tests.push(test)
                      } else {
                        newEvaluative.content[0].tests.push(test)
                      }
                    })
                  }
                }  

                newLesson.evaluatives.push(newEvaluative)
              })
            }

            newModule.lessons.push(newLesson);
          })
        }

        newCourse.modules.push(newModule);
      });
    }
    return newCourse;
  },
  prepareCloneCourse(resp) {
    let course = resp;
    let count = 1;

    course.idMenu = count;
    count++;
    course.attributes.modules.forEach(module => {
      module.name = "M. " + module.name;
      module.idMenu = count;
      count++;
      module.lessons.forEach(lesson => {
        lesson.name = "L. " + lesson.name;
        lesson.idMenu = count;
        count++;
        lesson.children = [];
        lesson.expositives = lesson.expositives.data;
        for (let i = 0; i < lesson.expositives.length; i++) {
          const le = lesson.expositives[i].attributes;
          le.name = "Exp. " + le.name;
          le.id = lesson.expositives[i].id;
          le.idMenu = count;
          count++;
          lesson.children.push(le);
        }
        lesson.evaluatives = lesson.evaluatives.data;
        for (let i = 0; i < lesson.evaluatives.length; i++) {
          const le = lesson.evaluatives[i].attributes;
          le.name = "Exe. " + le.name;
          le.id = lesson.evaluatives[i].id;
          le.idMenu = count;
          count++;
          lesson.children.push(le);
        }
        delete lesson.expositives;
        delete lesson.evaluatives;
      });
      module.children = module.lessons;
      delete module.lessons;
    });
    Object.keys(course.attributes).forEach(key => {
      if (key == "modules") {
        course.children = course.attributes[key];
      } else {
        course[key] = course.attributes[key];
      }
    });
    delete course.attributes;
    return course;
  },
  prepareCourse(resp) {
    let course = resp;

    let moduleCount = 1;
    let lessonCount = 1;
    let count = 1;

    course.idMenu = count;
    count++;

    course.attributes.modules.forEach(module => {
      module.idMenu = count;
      count++;
      module.lessons.forEach(lesson => {
        lesson.idMenu = count;
        count++;
        lesson.expositives = lesson.expositives.data;
        for (let i = 0; i < lesson.expositives.length; i++) {
          lesson.expositives[i] = externalFunctions.prepareExpositive(
            lesson.expositives[i]
          );
        }
        lesson.evaluatives = lesson.evaluatives.data;
        for (let i = 0; i < lesson.evaluatives.length; i++) {
          lesson.evaluatives[i] = externalFunctions.prepareEvaluative(
            lesson.evaluatives[i]
          );
        }
        lesson.contentType = "lesson";
        lesson.internalId = "L" + lessonCount;
        lessonCount++;
      });
      module.children = module.lessons;
      module.contentType = "module";
      module.internalId = "M" + moduleCount;
      moduleCount++;
      delete module.lessons;
    });
    Object.keys(course.attributes).forEach(key => {
      if (key == "modules") {
        course.children = course.attributes[key];
      } else {
        course[key] = course.attributes[key];
      }
    });
    course.contentType = "course";
    delete course.attributes;
    data.state.maxId = count;
    return course;
  },
  prepareExpositive(resp) {
    const expositive = resp;
    Object.keys(expositive.attributes).forEach(key => {
      expositive[key] = expositive.attributes[key];
    });
    expositive.contentType = expositive.type;
    delete expositive.attributes;
    return expositive;
  },
  prepareEvaluative(resp) {
    const evaluative = resp;
    Object.keys(evaluative.attributes).forEach(key => {
      evaluative[key] = evaluative.attributes[key];
    });
    if (evaluative.content) {
      Object.keys(evaluative.content[0]).forEach(key => {
        if (key == "__component") {
          if (evaluative.content[0]["__component"] == "base.quiz") {
            evaluative.type = "quiz";
            evaluative.contentType = "quiz";
          } else {
            evaluative.contentType = "code";
          }
        } else if (key == "questions") {
          evaluative.questions = evaluative.content[0]["questions"].data;
          for (var i = 0; i < evaluative.questions.length; i++) {
            evaluative.questions[i] = externalFunctions.prepareQuestion(
              evaluative.questions[i]
            );
          }
        } else if (key != "id") {
          evaluative[key] = evaluative.content[0][key];
        }
      });
    }
    delete evaluative.content;
    delete evaluative.attributes;
    return evaluative;
  },
  prepareQuestion(resp) {
    const question = resp;
    Object.keys(question.attributes).forEach(key2 => {
      question[key2] = question.attributes[key2];
    });
    delete question.attributes;
    return question;
  },
  cleanCourseData(resp) {
    let newResp = [];
    resp.forEach(course => {
      let newCourse = {};
      newCourse.id = course.id;
      newCourse.name = course.attributes.name;
      newCourse.type = course.attributes.type;
      newCourse.state =
        course.attributes.publishedAt == null ? "Draft" : "Published";
      if (course.attributes.author.data != null) {
        newCourse.my =
          data.state.user.email ==
          course.attributes.author.data.attributes.email;
      } else {
        newCourse.my = false;
      }
      newResp.push(newCourse);
    });
    return newResp;
  },
  cleanExpositiveData(resp) {
    let newResp = [];
    resp.forEach(expositive => {
      let newExpositive = {};
      newExpositive.id = expositive.id;
      newExpositive.name = expositive.attributes.name;
      newExpositive.type = expositive.attributes.type;
      newExpositive.my =
        data.state.user.email ==
        expositive.attributes.author.data.attributes.email;
      newExpositive.state =
        expositive.attributes.publishedAt == null ? "Draft" : "Published";
      newResp.push(newExpositive);
    });
    return newResp;
  },
  cleanEvaluativeData(resp) {
    let newResp = [];
    resp.forEach(evaluative => {
      let newEvaluative = {};
      newEvaluative.id = evaluative.id;
      newEvaluative.name = evaluative.attributes.name;
      newEvaluative.type = evaluative.attributes.content[0].__component.split(
        "."
      )[1];
      newEvaluative.my =
        data.state.user.email ==
        evaluative.attributes.author.data.attributes.email;
      newEvaluative.state =
        evaluative.attributes.publishedAt == null ? "Draft" : "Published";
      newResp.push(newEvaluative);
    });
    return newResp;
  },
  cleanQuestionData(resp) {
    let newResp = [];
    console.log(resp)
    resp.forEach(question => {
      let newQuestion = {};
      newQuestion.id = question.id;
      newQuestion.question = question.attributes.question;
      newQuestion.my =
        data.state.user.email ==
        question.attributes.author.data.attributes.email;
      newQuestion.state =
        question.attributes.publishedAt == null ? "Draft" : "Published";
      newResp.push(newQuestion);
    });
    return newResp;
  },
  cleanOccurrenceData(resp) {
    let occ = { currentOcc: [], draftOcc: [], pastOcc: [] };
    let date = new Date();
    resp.forEach(occurrence => {
      let newOcc = {};
      newOcc.id = occurrence.id;
      newOcc.year = occurrence.attributes.year;
      newOcc.startDate = occurrence.attributes.startDate;
      newOcc.endDate = occurrence.attributes.endDate;
      newOcc.course = {};
      if (occurrence.attributes.courses.data.length > 0) {
        newOcc.course.name =
          occurrence.attributes.courses.data[0].attributes.name;
        newOcc.course.type =
          occurrence.attributes.courses.data[0].attributes.type;
        newOcc.classes = occurrence.attributes.classes.data.map(
          c => c.attributes
        );
      }
      let startDate =
        newOcc.startDate == null ? null : new Date(newOcc.startDate);
      let endDate = newOcc.endDate == null ? null : new Date(newOcc.endDate);
      if (date > endDate && endDate != null) {
        occ.pastOcc.push(newOcc);
      } else if (
        startDate < date &&
        date < endDate &&
        startDate != null &&
        endDate != null
      ) {
        occ.currentOcc.push(newOcc);
      } else {
        occ.draftOcc.push(newOcc);
      }
    });
    return occ;
  },
  prepareOccurrence(resp) {
    let occ = resp.attributes;
    occ.id = resp.id;
    occ.classes.data.forEach(c => {
      c.attributes.students.data.forEach(student => {
        student.attributes.statuses.data.forEach(status => {
          Object.keys(status.attributes).forEach(key => {
            status[key] = status.attributes[key];
          });
          delete status.attributes;
        });
        Object.keys(student.attributes).forEach(key => {
          student[key] = student.attributes[key];
        });
        student.statuses = student.statuses.data;
        delete student.attributes;
      });
      Object.keys(c.attributes).forEach(key => {
        c[key] = c.attributes[key];
      });
      c.students = c.students.data;
      delete c.attributes;
    });
    occ.classes = occ.classes.data;
    delete occ.attributes;
    occ.courses.data.forEach(course => {
      Object.keys(course.attributes).forEach(key => {
        course[key] = course.attributes[key];
      });
      delete course.attributes;
    });
    occ.courses = occ.courses.data[0];

    return occ;
  } /*
  prepareClass(resp){

  },
  prepareStudent(resp){

  },
  prepareStatuses(resp){

  }*/
};

export default new Vuex.Store(data);
