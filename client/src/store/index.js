import Vue from "vue";
import Vuex from "vuex";

import convert from "./convert";
import style from "./style";
import request from "./request";

import jsonData from "./data.json";

Vue.use(Vuex);

const main = {
  namespaced: true,
  state: {
    courses: [],
    expositives: [],
    evaluatives: [],
    questions: [],
    statuses: [],
    occurrences: [],
    classes: [],
    students: [],
    maxID: 0,
    changed: false,

    validated: false,

    gpt: true,
    selectedLanguages: {},
  },
  getters: {
    //-------Course
    getCoursesState: (state) => state.courses,
    getCourse: (state) => state.courses[0],
    getCourseByID: (state) => (id) => state.courses.find((c) => c.id == id),
    getCourseByModuleID: (state) => (id) => {
      return state.courses.find((c) =>
        c.children.map((m) => m.id).includes(id)
      );
    },
    getCourseByGoalID: (state) => (id) => {
      return state.courses
        .filter((c) => "goals" in c)
        .find((c) => c.goals.map((g) => g.id).includes(id));
    },

    //-------Goals
    getGoals: (state) => {
      return state.courses.flatMap((c) => c.goals);
    },
    getGoalByID: (state) => (id) => {
      return state.courses
        .filter((c) => "goals" in c)
        .flatMap((c) => c.goals)
        .find((g) => g.id == id);
    },

    //-------Module
    getModuleByLessonID: (state, getters) => (id) => {
      return getters.getModules.find((m) =>
        m.children.map((l) => l.id).includes(id)
      );
    },
    getModuleByEvaluative: (state, getters) => (id) => {
      return getters.getModules.find((m) =>
        m.children
          .filter((l) => "evaluatives" in l)
          .flatMap((l) => l.evaluatives.map((e) => e.id))
          .includes(id)
      );
    },
    getModuleByExpositive: (state, getters) => (id) => {
      return getters.getModules.find((m) =>
        m.children.flatMap((l) => l.expositives.map((e) => e.id)).includes(id)
      );
    },
    getModuleByResourceID: (state, getters) => {
      return function(id, type) {
        if (type == "lesson") {
          return getters.getModuleByLessonID(id);
        } else if (type == "code" || type == "quiz") {
          return getters.getModuleByEvaluative(id);
        } else {
          return getters.getModuleByExpositive(id);
        }
      };
    },
    getModuleByID: (state, getters) => (id) => {
      return getters.getModules.find((m) => m.id == id);
    },
    getModules: (state) => {
      return state.courses.flatMap((c) => c.children);
    },

    //-------Lesson
    getLessonByResourceID: (state, getters) => (id) => {
      return getters.getLessons.find((l) => {
        if (
          l.expositives.map((e) => e.id).includes(id) ||
          l.evaluatives.map((e) => e.id).includes(id)
        ) {
          return l;
        }
      });
    },
    getLessonsByCourseID: (state) => (id) => {
      const c = state.courses.find((c) => c.id == id);
      return c.children.flatMap((m) => m.children);
    },
    getLessonsByModuleID: (state) => (id) => {
      return state.courses.flatMap((c) => c.children).find((m) => m.id == id)
        .children;
    },
    getLessons: (state, getters) => {
      return getters.getModules.flatMap((m) => m.children);
    },
    getLessonByID: (state, getters) => (id) => {
      return getters.getLessons.find((l) => l.id == id);
    },
    getLessonByExpositiveID: (state, getters) => (id) => {
      return getters.getLessons.find((l) =>
        l.expositives.map((e) => e.id).includes(id)
      );
    },
    getLessonByEvaluativeID: (state, getters) => (id) => {
      return getters.getLessons.find((l) =>
        l.evaluatives.map((e) => e.id).includes(id)
      );
    },

    //-------Condition
    getConditions: (state) => {
      return [
        ...state.courses
          .flatMap((c) => c.children)
          .filter((m) => "condition" in m && m.condition != null)
          .map((m) => m.condition),
        ...state.courses
          .flatMap((c) => c.children)
          .flatMap((m) => m.children)
          .filter((l) => "condition" in l && l.condition != null)
          .map((l) => l.condition),
      ];
    },

    //-------Expositive
    getExpositive: (state) => state.expositives[0],
    getExpositives: (state, getters) => {
      if (state.courses.length > 0) {
        return getters.getLessons.flatMap((l) => l.expositives);
      } else if (state.expositives.length > 0) {
        return state.expositives;
      }
      return [];
    },
    getExpositivesState: (state) => {
      return state.expositives;
    },
    getExpositiveByID: (state, getters) => (id) => {
      return getters.getExpositives.find((e) => e.id == id);
    },
    getExpositiveByMilestoneID: (state, getters) => (id) => {
      return getters.getExpositives.find((e) =>
        e.milestones.map((t) => t.id).includes(id)
      );
    },

    //-------Evaluative
    getEvaluative: (state) => state.evaluatives[0],
    getEvaluatives: (state, getters) => {
      if (state.courses.length > 0) {
        return getters.getLessons.flatMap((l) => l.evaluatives);
      } else if (state.evaluatives.length > 0) {
        return state.evaluatives;
      }
      return [];
    },
    getEvaluativesState: (state) => {
      return state.evaluatives;
    },
    getEvaluativeByID: (state, getters) => (id) => {
      return getters.getEvaluatives.find((e) => e.id == id);
    },
    getEvaluativeByStatus: (state, getters) => (payload) => {
      return getters.getEvaluatives.find((e) => e.id == payload.id);
    },
    getEvaluativeByQuestionID: (state, getters) => (id) => {
      return getters.getEvaluatives
        .filter((e) => e.contentType == "quiz")
        .find((e) => e.questions.map((q) => q.id).includes(id));
    },
    getEvaluativeByTestID: (state, getters) => (id) => {
      return getters.getEvaluatives
        .filter((e) => e.contentType == "code")
        .find((e) => e.tests.map((q) => q.id).includes(id));
    },
    getEvaluativeByContextID: (state, getters) => (id) => {
      return getters.getEvaluatives
        .filter((e) => e.contentType == "code")
        .find((e) => e.contexts.map((q) => q.id).includes(id));
    },

    //-------Resource
    getResourceByID: (state) => {
      return function(id, type) {
        if (type != "course" && type != "module") {
          if (type == "lesson") {
            return state.courses
              .flatMap((c) => c.children)
              .flatMap((m) => m.children)
              .find((l) => l.id == id);
          } else if (type == "evaluative") {
            //return state.courses
            return state.courses
              .flatMap((c) => c.children)
              .flatMap((m) => m.children)
              .flatMap((l) => l.evaluatives)
              .find((l) => l.id == id);
          }
        }
        return undefined;
      };
    },

    //-------Question
    getQuestion: (state) => state.questions[0],
    getQuestions: (state, getters) => {
      if (state.courses.length > 0 || state.evaluative > 0) {
        return getters.getEvaluatives
          .filter((e) => e.contentType == "quiz")
          .flatMap((e) => e.questions);
      } else if (state.questions.length > 0) {
        return state.questions;
      }
      return [];
    },
    getQuestionsState: (state) => {
      return state.questions;
    },
    getQuestionByID: (state, getters) => (id) => {
      return getters.getQuestions.find((q) => q.id == id);
    },
    getQuestionByAnswerID: (state, getters) => (id) => {
      return getters.getQuestions.find((q) =>
        q.answers.map((a) => a.id).includes(id)
      );
    },

    //-------Answer
    getAnswers: (state, getters) => {
      return getters.getQuestions.flatMap((q) => q.answers);
    },
    getAnswerByID: (state, getters) => (id) => {
      return getters.getAnswers.find((answer) => answer.id == id);
    },

    //-------Test
    getTests: (state, getters) => {
      return getters.getEvaluatives
        .filter((e) => e.contentType == "code")
        .flatMap((e) => e.tests);
    },
    getTestByID: (state, getters) => (id) => {
      return getters.getTests.find((t) => t.id == id);
    },

    //-------Context
    getContexts: (state, getters) => {
      return getters.getEvaluatives
        .filter((e) => e.contentType == "code")
        .flatMap((e) => e.contexts);
    },
    getContextByID: (state, getters) => (id) => {
      return getters.getContexts.find((t) => t.id == id);
    },

    //-------Milestones
    getMilestones: (state, getters) => {
      return getters.getExpositives.flatMap((e) => e.milestones);
    },
    getMilestoneByID: (state, getters) => (id) => {
      return getters.getMilestones.find((m) => m.id == id);
    },

    //-------Status
    getStatusByResourceID: (state, getters) => (id) => {
      return getters.getEvaluatives.find((evaluative) => evaluative.id == id)
        .status;
    },
    getCompletationStatusByLessonID: (state, getters) => (id) => {
      if (id == "0") {
        return null;
      }
      const lesson = getters.getLessonByID(id);
      let status =
        "evaluatives" in lesson
          ? lesson.evaluatives.map((e) => e.status.grade)
          : [];
      return status.length > 0
        ? status.reduce((a, b) => a + b, 0) / status.length
        : null;
    },
    getStatusTeacher: (state) => (id) => {
      return state.statuses.filter((s) => s.id == id);
    },

    //-------Occurrence
    getOccurrencesState: (state) => state.occurrences,
    getOccurrence: (state) => state.occurrences[0],
    getOccurrenceByID: (state) => (id) => {
      return state.occurrences.find((occ) => occ.id == id);
    },
    getOccurrenceByClassID: (state) => (id) => {
      return state.occurrences.find((occ) =>
        occ.classes.map((c) => c.id).includes(id)
      );
    },

    //-------Classes
    getClass: (state) => state.classes[0],
    getClasses: (state) => state.occurrences.flatMap((occ) => occ.classes),
    getClassByID: (state, getters) => (id) => {
      return getters.getClasses.find((c) => c.id == id);
    },
    getClassByStudentID: (state, getters) => (id) => {
      return getters.getClasses.find((c) =>
        c.students.map((s) => s.id).includes(id)
      );
    },

    //-------Student
    getStudent: (state) => state.students[0],
    getStudents: (state, getters) => {
      return getters.getClasses.flatMap((c) => c.students);
    },
    getStudentByID: (state, getters) => (id) => {
      return getters.getStudents.find((s) => s.id == id);
    },

    //-------Status
    getStatusByEvaluativeID: (state, getters) => (id) => {
      return getters.getEvaluatives.find((e) => e.id == id).status;
    },

    //-------Etc
    getMinimumID: () => (list) => {
      if (list.length == 0) return -1;
      list = list.map((l) => l.id);
      let n = Math.min(...list);
      if (n > 0 || !isFinite(n)) {
        n = 0;
      }
      return n - 1;
    },
    getMaxID: (state) => {
      return state.maxID;
    },
    getPublishedAt: (state) => (type) => {
      if (state[type].length > 0) return state[type][0].publishedAt;
      return null;
    },

    getValidated: (state) => state.validated,
    getSelectedLanguage: (state) => (resourceId) => {
      return state.selectedLanguages[resourceId] || "JavaScript";
    },
  },
  mutations: {
    //-------CollectionTypes
    setCourses(state, courses) {
      state.courses = courses;
    },
    setExpositives(state, expositives) {
      state.expositives = expositives;
    },
    setEvaluatives(state, evaluatives) {
      state.evaluatives = evaluatives;
    },
    setQuestions(state, questions) {
      state.questions = questions;
    },
    setOccurrences(state, occurrences) {
      state.occurrences = occurrences;
    },
    setClasses(state, classes) {
      state.classes = classes;
    },
    setStudents(state, students) {
      state.students = students;
    },
    setStatuses(state, statuses) {
      state.statuses = statuses;
    },

    //-------PublishedAt
    setCoursePublishedAt(state, [id, publishedAt]) {
      const course = state.courses.find((c) => c.id == id);
      course.publishedAt = publishedAt;
    },
    setExpositivePublishedAt(state, [id, publishedAt]) {
      const expositive = state.expositives.find((c) => c.id == id);
      expositive.publishedAt = publishedAt;
    },
    setEvaluativePublishedAt(state, [id, publishedAt]) {
      const evaluative = state.evaluatives.find((c) => c.id == id);
      evaluative.publishedAt = publishedAt;
    },
    setQuestionPublishedAt(state, [id, publishedAt]) {
      const question = state.questions.find((c) => c.id == id);
      question.publishedAt = publishedAt;
    },
    setOccurrencePublishedAt(state, [id, publishedAt]) {
      const occ = state.occurrences.find((c) => c.id == id);
      occ.publishedAt = publishedAt;
    },

    //--------Etc
    deleteStructure(state) {
      this.commit("main/setChanged", false);
      state.courses = [];
      state.expositives = [];
      state.evaluatives = [];
      state.questions = [];
      state.occurrences = [];
      state.statuses = [];
      state.classes = [];
      state.students = [];
    },
    setChanged(state, changed) {
      state.changed = changed;
    },
    setMaxID(state, maxID) {
      state.maxID = maxID;
    },
    incrMaxID(state, n) {
      state.maxID = state.maxID + n;
    },

    setGpt(state, gpt) {
      state.gpt = gpt;
    },
    setValidated(state, validated) {
      state.validated = validated;
    },
    setSelectedLanguage(state, { resourceId, language }) {
      state.selectedLanguages[resourceId] = language;
    },
  },
  actions: {
    //-------Overalls
    createNewCollectionType(state, type) {
      this.commit("main/deleteStructure");
      this.commit("main/setMaxID", 0);
      this.commit("request/setRole", "author");
      switch (type) {
        case "course":
          this.dispatch("main/addCourse");
          break;
        case "expositive":
          this.dispatch("main/addExpositive");
          break;
        case "evaluative":
          this.dispatch("main/addEvaluative");
          break;
        case "question":
          this.dispatch("main/addQuestion");
          break;
        case "occurrence":
          this.dispatch("main/addOccurrence");
          break;
      }
    },
    editableInput(state, { value, type, field, id }) {
      if (type == "user") {
        this.dispatch("request/setUserField", [field, value]);
      } else {
        let typeName = type.charAt(0).toUpperCase() + type.slice(1);
        this.dispatch(`main/set${typeName}Field`, [id, field, value]);
      }
    },

    //-------Course
    async addCourse(state) {
      const courses = state.getters.getCoursesState;
      let nCourse = state.getters.getMinimumID(courses);
      let nModule = state.getters.getMinimumID(state.getters.getModules);
      let nLesson = state.getters.getMinimumID(state.getters.getLessons);
      let course = { ...jsonData.course };
      course.id = nCourse;
      course.idMenu = state.getters.getMaxID;
      course.children[0].id = nModule;
      course.children[0].idMenu = state.getters.getMaxID + 1;
      course.children[0].children[0].id = nLesson;
      course.children[0].children[0].idMenu = state.getters.getMaxID + 2;
      course = await this.dispatch("main/makeCourseEditable", course);
      courses.push(course);
      this.commit("main/incrMaxID", 3);
      this.commit("main/setChanged", true);
    },
    makeCourseEditable(state, course) {
      course.children.forEach((module) => {
        module.children.push({
          idMenu: -1,
          id: 0,
          type: "add",
          contentType: "lesson",
          name: "add Lesson",
          evaluatives: [],
          expositives: [],
          locked: true,
          parentId: module.id,
        });
      });
      course.children.push({
        idMenu: -1,
        id: 0,
        type: "add",
        contentType: "module",
        name: "add Module",
        children: [],
        locked: true,
        parentId: course.id,
      });
      return course;
    },
    setCourseField(state, [id, field, value]) {
      const course = state.getters.getCourseByID(id);
      if (course[field] != value) this.commit("main/setChanged", true);
      course[field] = value;
    },

    //-------Goal
    addGoalByCourseID(state, id) {
      const course = state.getters.getCourseByID(id);
      let n = state.getters.getMinimumID(state.getters.getGoals);
      let goal = { ...jsonData.goal };
      goal.id = n;
      course.goals.push(goal);
      this.commit("main/setChanged", true);
    },
    deleteGoalByID(state, id) {
      const course = state.getters.getCourseByGoalID(id);
      const index = course.goals.findIndex((g) => g.id == id);
      course.goals.splice(index, 1);
      this.commit("main/setChanged", true);
    },
    setGoalField(state, [id, field, value]) {
      const goal = state.getters.getGoalByID(id);
      if (goal[field] != value) this.commit("main/setChanged", true);
      goal[field] = value;
    },

    //-------Module
    addModuleByCourseID(state, id) {
      const course = state.getters.getCourseByID(id);
      let n = state.getters.getMinimumID(state.getters.getModules);
      let module = { ...jsonData.module };
      module.id = n;
      module.idMenu = state.getters.getMaxID;
      module.parentId = course.id;
      module.children[0].parentId = n;
      course.children.splice(course.children.length - 1, 0, module);
      this.commit("main/incrMaxID", 1);
      this.commit("main/setChanged", true);
    },
    deleteModuleByID(state, id) {
      const course = state.getters.getCourseByModuleID(id);
      const index = course.children.findIndex((obj) => obj.id == id);
      course.children.splice(index, 1);
      this.commit("main/setChanged", true);
    },
    setModuleField(state, [id, field, value]) {
      const module = state.getters.getModuleByID(id);
      if (module[field] != value) this.commit("main/setChanged", true);
      module[field] = value;
    },
    moveModule(state, [id, direction]) {
      const course = state.getters.getCourseByModuleID(id);
      const index = course.children.findIndex((obj) => obj.id == id);
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

    //-------Lesson
    addLessonByModuleID(state, id) {
      const module = state.getters.getModuleByID(id);
      let n = state.getters.getMinimumID(state.getters.getLessons);
      let lesson = { ...jsonData.lesson };
      lesson.id = n;
      lesson.idMenu = state.getters.getMaxID;
      module.children.splice(module.children.length - 1, 0, lesson);
      this.commit("main/incrMaxID", 1);
      this.commit("main/setChanged", true);
    },
    deleteLessonByModuleID(state, id) {
      const module = state.getters.getModuleByLessonID(id);
      let index = module.children.findIndex((obj) => obj.id == id);
      module.children.splice(index, 1);
      this.commit("main/setChanged", true);
    },
    setLessonField(state, [id, field, value]) {
      const lesson = state.getters.getLessonByID(id);
      if (lesson[field] != value) this.commit("main/setChanged", true);
      lesson[field] = value;
    },
    moveLesson(state, [id, direction]) {
      const module = state.getters.getModuleByLessonID(id);
      const course = state.getters.getCourseByModuleID(module.id);
      const indexLesson = module.children.findIndex((obj) => obj.id == id);
      const lesson = module.children[indexLesson];
      const indexModule = course.children.findIndex(
        (obj) => obj.id == module.id
      );
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

    //-------Condition
    addConditionByLMID(state, [id, type]) {
      let element;
      if (type == "lesson") {
        element = state.getters.getLessonByID(id);
      } else if (type == "module") {
        element = state.getters.getModuleByID(id);
      }
      let n = state.getters.getMinimumID(state.getters.getConditions);
      let condition = { ...jsonData.condition };
      condition.id = n;
      element.condition = condition;
      this.commit("main/setChanged", true);
    },
    setConditionField(state, [id, field, value]) {
      let condition = state.getters.getConditions.find((c) => c.id == id);
      if (condition[field] != value) this.commit("main/setChanged", true);
      condition[field] = value;
    },

    //-------Evaluative
    addEvaluativeByLessonID(state, id) {
      const lesson = state.getters.getLessonByID(id);
      let n = state.getters.getMinimumID(state.getters.getEvaluatives);
      let evaluative = { ...jsonData.evaluative };
      evaluative.id = n;
      lesson.evaluatives.push(evaluative);
      this.commit("main/setChanged", true);
    },
    addEvaluativeByLessonID2(state, [id, newExercise]) {
      const lesson = state.getters.getLessonByID(id);
      let nEvaluatives = state.getters.getMinimumID(
        state.getters.getEvaluatives
      );
      let nTests = state.getters.getMinimumID(state.getters.getTests);
      const exercise = { ...jsonData.evaluative };
      exercise.contentType = "code";
      exercise.id = nEvaluatives;
      exercise.type = "blank";
      for (let key in newExercise) {
        if (key == "tests") {
          let countTests = 0;
          let newTests = [];
          newExercise.tests.forEach((t) => {
            let test = { ...jsonData.test };
            test.input = t.input;
            test.expected = t.expected;
            test.id = nTests - countTests;
            if (newExercise.solution.includes("console.log")) {
              test.type = "log";
              test.input = "log";
              test.subtype = null;
            } else if (
              newExercise.solution.includes("function") &&
              newExercise.solution.includes("return")
            ) {
              test.type = "function";
              test.subtype = null;
            }
            newTests.push(test);
            countTests++;
          });
          exercise.tests = newTests;
        } else {
          exercise[key] = newExercise[key];
        }
      }
      lesson.evaluatives.push(exercise);
      this.commit("main/setChanged", true);
    },
    addEvaluative(state) {
      const evaluatives = state.getters.getEvaluativesState;
      let n = state.getters.getMinimumID(evaluatives);
      let evaluative = { ...jsonData.evaluative };
      evaluative.id = n;
      evaluatives.push(evaluative);
      this.commit("main/setChanged", true);
    },
    changeEvaluativeTypeByID(state, [id, type]) {
      let evaluative = state.getters.getEvaluativeByID(id);
      if (type == "quiz") {
        this.dispatch("main/addQuestionByEvaluativeID", id);
        this.dispatch("main/addQuestionByEvaluativeID", id);
      }
      evaluative.type = "";
      evaluative.contentType = type;
      this.commit("main/setChanged", true);
    },
    addEvaluative2(state, ) {
      const evaluatives = state.getters.getEvaluativesState;
      let n = state.getters.getMinimumID(evaluatives);
      let evaluative = { ...jsonData.evaluative };
      evaluative.id = n;
      evaluatives.push(evaluative);
      this.commit("main/setChanged", true);
    },
    addQuizByLessonID(state, id) {
      const lesson = state.getters.getLessonByID(id);
      let n = state.getters.getMinimumID(state.getters.getEvaluatives);
      let evaluative = { ...jsonData.evaluative };
      evaluative.id = n;
      evaluative.contentType = "quiz";
      evaluative.type = null;
      lesson.evaluatives.push(evaluative);
      this.dispatch("main/addQuestionByEvaluativeID", n);
      this.dispatch("main/addQuestionByEvaluativeID", n);
      this.commit("main/setChanged", true);
    },
    addProgExByLessonID(state, id) {
      const lesson = state.getters.getLessonByID(id);
      let n = state.getters.getMinimumID(state.getters.getEvaluatives);
      let evaluative = { ...jsonData.evaluative };
      evaluative.id = n;
      evaluative.contentType = "code";
      evaluative.type = null;
      lesson.evaluatives.push(evaluative);
      this.commit("main/setChanged", true);
    },
    deleteEvaluativeByID(state, id) {
      let lesson = state.getters.getLessonByEvaluativeID(id);
      let index = lesson.evaluatives.findIndex((obj) => obj.id == id);
      lesson.evaluatives.splice(index, 1);
      this.commit("main/setChanged", true);
    },
    setEvaluativeField(state, [id, field, value]) {
      let evaluative = state.getters.getEvaluativeByID(id);
      if (evaluative) {
        if (evaluative[field] != value || field == "statement")
          this.commit("main/setChanged", true);
        evaluative[field] = value;
        if (field == "type") {
          const valid = this.dispatch("main/checkValidity", evaluative);
          if (valid) {
            evaluative.valid = true;
          }
        }
      }
    },
    checkValidity(evaluatve) {
      if (evaluatve.type == null) {
        return false;
      }
      for (let test of evaluatve.tests) {
        if (test.type == null) {
          return false;
        }
      }
      return true;
    },

    //-------Expositive
    addExpositiveByLessonID(state, id) {
      const lesson = state.getters.getLessonByID(id);
      let n = state.getters.getMinimumID(state.getters.getExpositives);
      let expositive = { ...jsonData.expositive };
      expositive.id = n;
      lesson.expositives.push(expositive);
      this.commit("main/setChanged", true);
    },
    addExpositive(state) {
      const expositives = state.getters.getExpositivesState;
      let n = state.getters.getMinimumID(expositives);
      let expositive = { ...jsonData.expositive };
      expositive.id = n;
      expositives.push(expositive);
      this.commit("main/setChanged", true);
    },
    deleteExpositiveByID(state, id) {
      let lesson = state.getters.getLessonByExpositiveID(id);
      let index = lesson.expositives.findIndex((obj) => obj.id == id);
      lesson.expositives.splice(index, 1);
      this.commit("main/setChanged", true);
    },
    setExpositiveField(state, [id, field, value]) {
      let expositive = state.getters.getExpositiveByID(id);
      if (expositive[field] != value) this.commit("main/setChanged", true);
      expositive[field] = value;
    },
    changeExpositiveTypeByID(state, [id, file]) {
      let expositive = state.getters.getExpositiveByID(id);
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

    //-------Answer
    addAnswerByQuestionID(state, id) {
      let question = state.getters.getQuestionByID(id);
      let n = state.getters.getMinimumID(state.getters.getAnswers);
      let answer = { ...jsonData.answer };
      answer.id = n;
      question.answers.push(answer);
      this.commit("main/setChanged", true);
    },
    setAnswerField(state, [id, field, value]) {
      let answer = state.getters.getAnswerByID(id);
      if (answer[field] != value) this.commit("main/setChanged", true);
      answer[field] = value;
    },
    deleteAnswerByID(state, id) {
      let question = state.getters.getQuestionByAnswerID(id);
      const index = question.answers.findIndex((a) => a.id == id);
      if (question.correctAnswer.includes(index + 1)) {
        const ind2 = question.correctAnswer.findIndex((c) => c == index + 1);
        question.correctAnswer.splice(ind2, 1);
      }
      question.correctAnswer = question.correctAnswer.map((c) => {
        if (c > index + 1) {
          return c - 1;
        } else {
          return c;
        }
      });
      question.answers.splice(index, 1);
      this.commit("main/setChanged", true);
    },

    //-------Milestone
    addMilestoneByExpositiveID(state, id) {
      let expositive = state.getters.getExpositiveByID(id);
      let n = state.getters.getMinimumID(state.getters.getMilestones);
      let milestone = { ...jsonData.milestone };
      milestone.id = n;
      expositive.milestones.push(milestone);
      this.commit("main/setChanged", true);
    },
    deleteMilestoneByID(state, id) {
      let expositive = state.getters.getExpositiveByMilestoneID(id);
      const index = expositive.milestones.findIndex((t) => t.id == id);
      expositive.milestones.splice(index, 1);
      this.commit("main/setChanged", true);
    },
    setMilestoneField(state, [id, field, value]) {
      let milestone = state.getters.getMilestoneByID(id);
      if (field == "frame" && typeof value == "string") {
        try {
          let newV = parseInt(value);
          if (milestone[field] != newV) {
            this.commit("main/setChanged", true);
          }
          if (isNaN(newV)) {
            milestone[field] = 0;
          } else {
            milestone[field] = newV;
          }
        } catch (err) {
          console.log(err); //TODO not allow numbers to input
        }
      } else {
        if (milestone[field] != value) {
          this.commit("main/setChanged", true);
        }
        milestone[field] = value;
      }
    },

    //-------Test
    addTestByEvaluativeID(state, id) {
      let evaluative = state.getters.getEvaluativeByID(id);
      let n = state.getters.getMinimumID(state.getters.getTests);
      let test = { ...jsonData.test };
      // take out afterwards
      test.type = "function";
      test.id = n;
      evaluative.tests.push(test);
      this.commit("main/setChanged", true);
    },
    deleteTestByID(state, id) {
      let evaluative = state.getters.getEvaluativeByTestID(id);
      const index = evaluative.tests.findIndex((t) => t.id == id);
      evaluative.tests.splice(index, 1);
      this.commit("main/setChanged", true);
    },
    setTestField(state, [id, field, value]) {
      let test = state.getters.getTestByID(id);
      if (test[field] != value) this.commit("main/setChanged", true);
      test[field] = value;
      if (field == "type") {
        let evaluative = state.getters.getEvaluativeByTestID(id);
        const valid = this.dispatch("main/checkValidity", evaluative);
        if (valid) {
          evaluative.valid = true;
        }
      }
    },

    //-------Context
    addContextByEvaluativeID(state, id) {
      let evaluative = state.getters.getEvaluativeByID(id);
      let n = state.getters.getMinimumID(state.getters.getContexts);
      let context = { ...jsonData.context };
      context.id = n;
      evaluative.contexts.push(context);
      this.commit("main/setChanged", true);
    },
    deleteContextByID(state, id) {
      let evaluative = state.getters.getEvaluativeByContextID(id);
      const index = evaluative.contexts.findIndex((t) => t.id == id);
      evaluative.contexts.splice(index, 1);
      this.commit("main/setChanged", true);
    },
    setContextField(state, [id, field, value]) {
      let context = state.getters.getContextByID(id);
      if (context && context[field] != value) {
        this.commit("main/setChanged", true);
      }
      if (context) {
        context[field] = value;
      }
    },

    //-------Question
    deleteQuestionByID(state, id) {
      let evaluative = state.getters.getEvaluativeByQuestionID(id);
      const index = evaluative.questions.findIndex((q) => q.id == id);
      evaluative.questions.splice(index, 1);
      this.commit("main/setChanged", true);
    },
    setQuestionField(state, [id, field, value]) {
      let question = state.getters.getQuestionByID(id);
      if (question[field] != value) this.commit("main/setChanged", true);
      question[field] = value;
    },
    addQuestionByEvaluativeID(state, id) {
      let evaluative = state.getters.getEvaluativeByID(id);
      let nQuestions = state.getters.getMinimumID(state.getters.getQuestions);
      let nAnswers = state.getters.getMinimumID(state.getters.getAnswers);
      let question = { ...jsonData.question };
      question.id = nQuestions;
      question.answers[0].id = nAnswers;
      question.answers[1].id = nAnswers - 1;
      evaluative.questions.push(question);
      this.commit("main/setChanged", true);
    },
    addQuestion(state) {
      const questions = state.getters.getQuestionsState;
      let nQuestions = state.getters.getMinimumID(questions);
      let nAnswers = state.getters.getMinimumID(state.getters.getAnswers);
      let question = { ...jsonData.question };
      question.id = nQuestions;
      question.answers[0].id = nAnswers;
      question.answers[1].id = nAnswers - 1;
      questions.push(question);
      this.commit("main/setChanged", true);
    },

    //-------Occurrence
    addOccurrence(state) {
      const occurrences = state.getters.getOccurrencesState;
      let n = state.getters.getMinimumID(occurrences);
      let occurrence = { ...jsonData.occurrence };
      occurrences.id = n;
      occurrences.push(occurrence);
      this.commit("main/setChanged", true);
    },
    setOccurrenceField(state, [id, field, value]) {
      const occ = state.getters.getOccurrenceByID(id);
      if (occ[field] != value) this.commit("main/setChanged", true);
      occ[field] = value;
      if (field == "startDate") occ.year = Number(value.substring(0, 4));
    },

    //-------Class
    addClassByOccurrenceID(state, id) {
      const occ = state.getters.getOccurrenceByID(id);
      const n = state.getters.getMinimumID(state.getters.getClasses);
      let classe = { ...jsonData.class };
      classe.id = n;
      occ.classes.push(classe);
      this.commit("main/setChanged", true);
    },
    addClassByOccurrenceID2(state, [id, classe]) {
      const occ = state.getters.getOccurrenceByClassID(id);
      const nOccurrences = state.getters.getMinimumID(state.getters.getClasses);
      const nStudents = state.getters.getMinimumID(state.getters.getStudents);
      classe.new = true;
      classe.id = nOccurrences;
      let count = 0;
      classe.students.forEach((student) => {
        student.new = true;
        student.id = nStudents - count;
        count++;
      });
      occ.classes.push(classe);
      this.commit("main/setChanged", true);
    },
    setClassField(state, [id, field, value]) {
      const classe = state.getters.getClassByID(id);
      if (classe[field] != value) this.commit("main/setChanged", true);
      classe[field] = value;
    },
    deleteClassByID(state, id) {
      const occ = state.getters.getOccurrenceByClassID(id);
      const index = occ.classes.findIndex((c) => c.id == id);
      occ.classes.splice(index, 1);
      this.commit("main/setChanged", true);
    },

    //-------Student
    addStudentByClassID(state, [id, obj]) {
      const classe = state.getters.getClassByID(id);
      let n = state.getters.getMinimumID(state.getters.getStudents);
      classe.students.push({
        new: true,
        name: obj.name,
        id: n,
        email: obj.email,
      });
      this.commit("main/setChanged", true);
    },
    addStudentsByClassName(state, [name, students]) {
      const classe = state.occurrences
        .flatMap((o) => o.classes)
        .find((c) => c.name == name);
      let n = state.getters.getMinimumID(state.getters.getStudents);
      let count = 0;
      students.forEach((student) => {
        student.new = true;
        student.id = n - count;
        count++;
      });
      classe.students.push(...students);
      this.commit("main/setChanged", true);
    },
    setStudentField(state, [id, field, value]) {
      const student = state.getters.getStudentByID(id);
      if (student[field] != value) this.commit("main/setChanged", true);
      student[field] = value;
    },
    deleteStudentByID(state, id) {
      const classe = state.getters.getClassByStudentID(id);
      const index = classe.students.findIndex((c) => c.id == id);
      classe.students.splice(index, 1);
      this.commit("main/setChanged", true);
    },

    //-------Status
    setStatusField(state, [id, field, value]) {
      const status = state.getters.getStatusByEvaluativeID(id);
      status[field] = value;
    },
  },
};

export default new Vuex.Store({
  modules: {
    main,
    convert,
    style,
    request,
  },
});
