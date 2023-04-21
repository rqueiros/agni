import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import router from "../router";
import newElements from "../assets/data/newElements.json";

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
    maxId: 0
  },
  getters: {
    //------------------------Authentication----------------------------------
    isLogged: state => state.login,
    getJWT: state => state.jwt,
    getRole: state => state.role,

    //--------------------------Student---------------------------------------

    //-------Course
    getCourse: state => state.courses,

    //-------Module
    getModuleByLesson: state => id => {
      return state.modules.find(m =>
        m.children.map(l => l.strapiId).includes(id)
      );
    },
    getModuleByEvaluative: state => id => {
      return state.modules.find(m =>
        m.children.flatMap(l => l.evaluatives.map(e => e.strapiId)).includes(id)
      );
    },
    getModuleByExpositive: state => id => {
      return state.modules.find(m =>
        m.children.flatMap(l => l.expositives.map(e => e.strapiId)).includes(id)
      );
    },
    getModuleByResourceId: (state, getters) => {
      return function(id, type) {
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
          l.expositives.map(e => e.strapiId).includes(id) ||
          l.evaluatives.map(e => e.strapiId).includes(id)
        ) {
          return l;
        }
      });
    },
    getLessonsByCourse: state => id => {
      const c = state.courses.find(c => c.strapiId == id);
      return c.children.flatMap(m => m.children);
    },
    getLessonsByModule: state => id => {
      return state.modules.find(m => m.strapiId == id).children;
    },

    //-------Resource
    getResourceById: state => {
      return function(id, type) {
        if (type != "course" && type != "module") {
          return state[type + "s"].find(r => r.strapiId == id);
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
      const lesson = state.lessons.find(l => l.strapiId == id);
      let status =
        "evaluatives" in lesson
          ? lesson.evaluatives.map(e => e.status.grade)
          : [];
      return status.length > 0
        ? status.reduce((a, b) => a + b, 0) / status.length
        : null;
    },

    //-------Evaluative
    getEvaluativeByStatus: state => payload => {
      return state.evaluatives.find(e => e.strapiId == payload.id);
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

    //-----------------------Teacher------------------------------------------

    //-------Course
    createEditableCourse(state) {
      const c = state.courses;
      c.forEach(course => {
        course.children.forEach(module => {
          module.children.push({
            strapiId: 0,
            id: state.maxId,
            type: "add",
            contentType: "lesson",
            name: "add Lesson",
            evaluatives: [],
            expositives: [],
            locked: true,
            parentId: module.strapiId
          });
          state.maxId += 1 
        });
        course.children.push({
          strapiId: 0,
          id: state.maxId,
          type: "add",
          contentType: "module",
          name: "add Module",
          children: [],
          locked: true,
          parentId: course.strapiId
        });
        state.maxId += 1 
      });
      this.commit("updateStructure");
    },
    setCourseField(state, [id, field, value]) {
      const course = state.courses.find(c => c.strapiId == id);
      course[field] = value;
    },

    //-------Goal
    setGoalField(state, [id, field, value]) {
      const goal = state.courses.filter(c => "goals" in c).flatMap(c => c.goals).find(g => g.strapiId == id);
      goal[field] = value;
    },
    addGoalByCourseId(state, id){
      const course = state.courses.find(c => c.strapiId == id)
      const n = Math.max(...state.courses.filter(c => "goals" in c).flatMap(c => c.goals).map(g => g.strapiId))
      let goal = newElements.newGoal
      goal.strapiId = n+1
      course.goals.push(goal)
    },
    deleteGoal(state, id){
      const course = state.courses.filter(c => "goals" in c).find(c => c.goals.map(g => g.strapiId).includes(id));
      const index = course.goals.findIndex(g => g.strapiId == id)
      course.goals.splice(index, 1)
      this.commit("updateStructure")
    },

    //-------Module
    addModuleByCourseId(state, id) {
      const course = state.courses.find(c => c.strapiId == id);
      const n = Math.max(...state.modules.map(m => m.strapiId));
      let module = {
        "strapiId" : n + 1,
        "id" : state.maxId,
        "new": true,
        "contentType": "module",
        "name": "",
        "children": [
          {
            "strapiId": 0,
            "id" : state.maxId + 1,
            "parentId" : n + 1,
            "type": "add",
            "contentType": "lesson",
            "name": "add Lesson",
            "evaluatives": [],
            "expositives": [],
            "locked": true
          }
        ]
      }
      course.children.splice(course.children.length - 1, 0, module);
      state.maxId += 2;
      this.commit("updateStructure");
    },
    deleteModule(state, id) {
      const course = state.courses.find(c =>
        c.children.map(m => m.strapiId).includes(id)
      );
      const index = course.children.findIndex(obj => obj.strapiId == id);
      course.children.splice(index, 1);
      this.commit("updateStructure");
    },
    moveModule(state, [id, direction]){
      const course = state.courses.find(c =>
        c.children.map(m => m.strapiId).includes(id)
      );
      const index = course.children.findIndex(obj => obj.strapiId == id);
      const module = course.children[index];
      if (index > 0 && direction=='up') {
        course.children.splice(index, 1);
        course.children.splice(index - 1, 0, module);
      } else if (index < course.children.length - 2 && direction=='down') {
        course.children.splice(index, 1);
        course.children.splice(index + 1, 0, module);
      }
      this.commit("updateStructure");
    },
    setModuleField(state, [id, field, value]) {
      const module = state.courses
        .flatMap(c => c.children)
        .find(m => m.strapiId == id);
      module[field] = value;
      this.commit("updateStructure");
    },

    //-------Lesson
    addLessonByModuleId(state, id) {
      const module = state.courses
        .flatMap(c => c.children)
        .find(m => m.strapiId == id);
      const n = Math.max(...state.lessons.map(l => l.strapiId));
      let lesson = {
        "strapiId" : n + 1,
        "id" : state.maxId,
        "new": true,
        "contentType": "lesson",
        "name": "",
        "description": "",
        "evaluatives": [],
        "expositives": []
      }
      module.children.splice(module.children.length - 1, 0, lesson);
      state.maxId = state.maxId + 1;
      this.commit("updateStructure");
    },
    deleteLesson(state, id) {
      const module = state.courses
        .flatMap(c => c.children)
        .find(m => m.children.map(l => l.strapiId).includes(id));
      let index = module.children.findIndex(obj => obj.strapiId == id);
      module.children.splice(index, 1);
      this.commit("updateStructure");
    },
    moveLesson(state, [id, direction]){
      const course = state.courses[0];
      const module = state.courses
        .flatMap(c => c.children)
        .find(m => m.children.map(l => l.strapiId).includes(id));
      const indexLesson = module.children.findIndex(
        obj => obj.strapiId == id
      );
      const lesson = module.children[indexLesson];
      const indexModule = state.courses.flatMap(c => c.children).findIndex(
        obj => obj.strapiId == module.strapiId
      );
      if (indexLesson > 0 && direction=='up') {
        module.children.splice(indexLesson, 1);
        module.children.splice(indexLesson - 1, 0, lesson);
      } else if (indexModule > 0 && direction=='up') {
        module.children.splice(indexLesson, 1);
        const newModule = course.children[indexModule - 1];
        newModule.children.splice(newModule.children.length - 1, 0, lesson);
      } else if (indexLesson < module.children.length - 2 && direction == 'down') {
        module.children.splice(indexLesson, 1);
        module.children.splice(indexLesson + 1, 0, lesson);
      } else if (indexModule < course.children.length - 2 && direction == 'down') {
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
        .find(l => l.strapiId == id);
      lesson[field] = value;
      this.commit("updateStructure");
    },

    //-------Condition
    setConditionField(state, [id, field, value]){
      const condition = [...state.courses.flatMap(c => c.children).filter(m => "condition" in m).map(m => m.condition),...state.courses.flatMap(c => c.children).flatMap(m => m.children).filter(l => "condition" in l).map(l => l.condition)].findIndex(c => c.strapiId==id)
      condition[field] = value;
      this.commit("updateStructure");
    },
    addCondition(state, [id, type]){
      let element;
      if (type=="lesson"){
        element = state.courses.flatMap(c => c.children).flatMap(m => m.children).findIndex(l => l.strapiId==id)
      } else if (type=="module"){
        element = state.courses.flatMap(c => c.children).findIndex(m => m.strapiId==id)
      }
      const n = Math.max([...state.courses.flatMap(c => c.children).filter(m => "condition" in m).map(m => m.condition),...state.courses.flatMap(c => c.children).flatMap(m => m.children).filter(l => "condition" in l).map(l => l.condition)])
      let condition = newElements.newCondition
      condition.strapiId = n + 1
      element.condition = condition
      this.commit("updateStructure")
    },

    //-------Expositive
    addExpositiveByLessonId(state, id) {
      const lesson = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .find(l => l.strapiId == id);
      let n = Math.max(...state.expositives.map(l => l.strapiId));
      if (n < 0) {
        n = 0;
      }
      let expositive = {
        "new": true,
        "strapiId" : n + 1,
        "name": "",
        "type" : "newExpo",
        "milestones":[]
      }
      lesson.expositives.push(expositive);
      this.commit("updateStructure");
    },
    setExpositiveField(state, [id, field, value]) {
      const expositive = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.expositives)
        .find(e => e.strapiId == id);
      expositive[field] = value;
      this.commit("updateStructure");
    },
    deleteExpositive(state, id){
      let lesson = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .find(l => l.expositives.map(e => e.strapiId).includes(id));
      let index = lesson.expositives.findIndex(obj => obj.strapiId == id);
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
        .find(e => e.strapiId == id);
      expositive.file=file;
      if(file.type.includes("pdf")){
        expositive.contentType = "pdf";
        expositive.type = "pdf";
      } else if(file.type.includes("video")){
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
        .find(l => l.strapiId == id);
      let n = Math.max(...state.evaluatives.map(l => l.strapiId));
      if (n < 0) {
        n = 0;
      }
      let evaluative = {
        "strapiId" : n + 1,
        "new": true,
        "type": "new",
        "name": "",
        "questions": [],
        "tests":[]
      }
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
        .find(e => e.strapiId == id);
      if (type == "quiz") {
        const questions = state.courses
          .flatMap(c => c.children)
          .flatMap(m => m.children)
          .flatMap(l => l.evaluatives)
          .filter(e => e.contentType == "quiz")
          .flatMap(e => e.questions.map(q => q.strapiId));
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
          .flatMap(q => q.answers.map(a => a.strapiId));
        let i2 = Math.max(...answers);
        if (i2 < 0) {
          i2 = 0;
        }
        evaluative.questions.push({
          question: "",
          strapiId: i + 1,
          correctAnswer:[],
          answers: [
            { answer: "", strapiId: i2 + 1 },
            { answer: "", strapiId: i2 + 2 }
          ]
        });
      } else if(type=="code"){
        evaluative.statement = ""
      }
      evaluative.contentType = type;
      evaluative.type = type;
      this.commit("updateStructure");
    },
    deleteEvaluative(state, id) {
      let lesson = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .find(l => l.evaluatives.map(e => e.strapiId).includes(id));
      let index = lesson.evaluatives.findIndex(obj => obj.strapiId == id);
      lesson.evaluatives.splice(index, 1);
      this.commit("updateStructure");
    },
    setEvaluativeField(state, [id, field, value]) {
      const evaluative = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .find(e => e.strapiId == id);
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
        .find(e => e.questions.map(q => q.strapiId).includes(id));
      const index = evaluative.questions.findIndex(q => q.strapiId == id);
      const questions = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .filter(e => e.contentType == "quiz")
        .flatMap(e => e.questions.map(q => q.strapiId));
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
        .flatMap(q => q.answers.map(a => a.strapiId));
      let i2 = Math.max(...answers);
      if (i2 < 0) {
        i2 = 0;
      }
      evaluative.questions.splice(index + 1, 0, {
        question: "",
        strapiId: i + 1,
        correctAnswer: [],
        answers: [
          { answer: "", strapiId: i2 + 1 },
          { answer: "", strapiId: i2 + 2 }
        ]
      });
      this.commit("updateStructure");
    },
    addQuestionByResourceId(state, id) {
      const evaluative = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .find(e => e.strapiId == id);
      const questions = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .filter(e => e.contentType == "quiz")
        .flatMap(e => e.questions.map(q => q.strapiId));
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
        .flatMap(q => q.answers.map(a => a.strapiId));
      let i2 = Math.max(...answers);
      if (i2 < 0) {
        i2 = 0;
      }
      evaluative.questions.push({
        question: "",
        strapiId: i + 1,
        correctAnswer: [],
        answers: [
          { answer: "", strapiId: i2 + 1 },
          { answer: "", strapiId: i2 + 2 }
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
        .find(e => e.questions.map(q => q.strapiId).includes(id));
      const index = evaluative.questions.findIndex(q => q.strapiId == id);
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
        .find(q => q.strapiId == id);
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
        .find(q => q.strapiId == id);
      const answers = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .filter(e => e.contentType == "quiz")
        .flatMap(e => e.questions)
        .flatMap(q => q.answers.map(a => a.strapiId));
      let i2 = Math.max(...answers);
      if (i2 < 0) {
        i2 = 0;
      }
      question.answers.push({
        answer: "",
        strapiId: i2 + 1
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
        .find(a => a.strapiId == id);
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
        .find(q => q.answers.map(a => a.strapiId).includes(id));
      const index = question.answers.findIndex(a => a.strapiId == id);
      if (index in question.correctAnswer){
        const ind2 = question.correctAnswer.findIndex(c => c==index)
        question.correctAnswer = question.correctAnswer.map(c => {if (c > index){return c-1}else{return c}})
        question.correctAnswer.splice(ind2, 1)
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
        .find(e => e.strapiId == id);
      const tests = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .filter(e => e.contentType == "code")
        .flatMap(e => e.tests.map(t => t.strapiId));
      const i = Math.max(tests);
      evaluative.tests.push({
        strapiId: i+1,
        input:"",
        expected:"",
        show:false
      });
      this.commit("updateStructure");
    },
    deleteTest(state, id) {
      const evaluative = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.evaluatives)
        .filter(e => e.contentType == "code")
        .find(e => e.tests.map(t => t.strapiId).includes(id));
      const index = evaluative.tests.findIndex(t => t.strapiId == id);
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
        .find(t => t.strapiId == id);
      test[field] = value;
      this.commit("updateStructure");
    },

    //-------Milestone
    addMilestoneByExpositiveId(state, id) {
      const evaluative = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.expositives)
        .find(e => e.strapiId == id);
      const milestones = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.expositives)
        .flatMap(e => e.milestones.map(t => t.strapiId));
      let i = Math.max(...milestones);
      if (i < 0) {
        i = 0;
      }
      evaluative.milestones.push({
        strapiId: i+1,
        frame:"",
        label:""
      });
      this.commit("updateStructure");
    },
    deleteMilestone(state, id) {
      const evaluative = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.expositives)
        .find(e => e.milestones.map(t => t.strapiId).includes(id));
      const index = evaluative.milestones.findIndex(t => t.strapiId == id);
      evaluative.milestones.splice(index, 1);
      this.commit("updateStructure");
    },
    setMilestoneField(state, [id, field, value]) {
      const milestone = state.courses
        .flatMap(c => c.children)
        .flatMap(m => m.children)
        .flatMap(l => l.expositives)
        .flatMap(e => e.milestones)
        .find(t => t.strapiId == id);
      milestone[field] = value;
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
      }
    },
    deleteStructure(state){
      state.courses=[]
      state.modules= []
      state.lessons= []
      state.expositives= []
      state.evaluatives= []
    },
    updateStructure(state) {
      state.modules = state.courses.flatMap(c => c.children);
      state.lessons = state.modules.flatMap(c => c.children);
      state.evaluatives = []
      state.lessons.forEach(l => {
         if ("evaluatives" in l && l.evaluatives.length != undefined && l.evaluatives.length > 0){
            l.evaluatives.forEach(e => {
               state.evaluatives.push(e)
            })
         }
      })
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
      const allCourses = [];
      const allModules = [];
      const allLessons = [];
      const allExpositives = [];
      const allEvaluatives = [];

      let moduleCount = 1;
      let lessonCount = 1;
      let count = 1;

      resp.forEach(course => {
        course.strapiId = course.id;
        course.id = count;
        count++;
        course.attributes.modules.forEach(module => {
          module.strapiId = module.id;
          module.id = count;
          count++;
          module.lessons.forEach(lesson => {
            lesson.strapiId = lesson.id;
            lesson.id = count;
            count++;
            lesson.expositives = lesson.expositives.data;
            lesson.expositives.forEach(expositive => {
              Object.keys(expositive.attributes).forEach(key => {
                expositive[key] = expositive.attributes[key];
              });
              expositive.strapiId = expositive.id;
              expositive.contentType = expositive.type;
              delete expositive.id;
              delete expositive.attributes;
              allExpositives.push(expositive);
            });
            lesson.evaluatives = lesson.evaluatives.data;
            lesson.evaluatives.forEach(evaluative => {
              Object.keys(evaluative.attributes).forEach(key => {
                evaluative[key] = evaluative.attributes[key];
              });
              Object.keys(evaluative.content[0]).forEach(key => {
                if (key == "__component") {
                  if (evaluative.content[0]["__component"] == "base.quiz") {
                    evaluative.type = "quiz";
                    evaluative.contentType = "quiz";
                  } else {
                    evaluative.contentType = "code";
                  }
                } else if (key == "questions") {
                  evaluative.questions =
                    evaluative.content[0]["questions"].data;
                  evaluative.questions.forEach(question => {
                    Object.keys(question.attributes).forEach(key2 => {
                      question[key2] = question.attributes[key2];
                    });
                    delete question.attributes;
                  });
                } else if (key != "id") {
                  evaluative[key] = evaluative.content[0][key];
                }
              });
              evaluative.strapiId = evaluative.id;
              delete evaluative.content;
              delete evaluative.id;
              delete evaluative.attributes;
              allEvaluatives.push(evaluative);
            });
            lesson.contentType = "lesson";
            lesson.internalId = "L" + lessonCount;
            lessonCount++;
            allLessons.push(lesson);
          });
          module.children = module.lessons;
          module.contentType = "module";
          module.internalId = "M" + moduleCount;
          moduleCount++;
          delete module.lessons;
          allModules.push(module);
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
        allCourses.push(course);
      });
      data.state.courses = [...allCourses];
      data.state.lessons = [...allLessons];
      data.state.expositives = [...allExpositives];
      data.state.evaluatives = [...allEvaluatives];
      data.state.modules = [...allModules];
      data.state.maxId = count;
    },

    //--------------------------Teacher---------------------------------------
    async fetchEmptyCourse(state) {
      state.commit("deleteStructure")
      data.state.courses = newElements.emptyCourse;
      data.state.maxId = 4;
      state.commit("createEditableCourse")
    }
  },
  modules: {}
};

const serverData = {
  domain: "https://agni.dcc.fc.up.pt/strapi",
  //domain: "http://localhost:1337",
  authentication: "/api/auth/local",
  register: "/api/auth/local/register",
  me: "/api/users/me?populate=*",
  courses: "/api/courses",
  statuses: "/api/statuses"
};

export default new Vuex.Store(data);
