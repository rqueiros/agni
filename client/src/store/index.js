import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios'
import router from "../router"
import emptyCourse from "../assets/data/emptyCourse.json"

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
      maxId: 0,
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
         return state.modules.find(m => m.children.map(l => l.strapiId).includes(id))
      },
      getModuleByEvaluative: state => id => {
         return state.modules.find(m => m.children.flatMap(l => l.evaluatives.map(e => e.strapiId)).includes(id))
      },
      getModuleByExpositive: state => id => {
         return state.modules.find(m => m.children.flatMap(l => l.expositives.map(e => e.strapiId)).includes(id))
      },
      getModuleByResourceId: (state, getters) => {
         return function (id, type) {
            if (type == "lesson") {
               return getters.getModuleByLesson(id)
            } else if (type == "code" || type == "quiz") {
               return getters.getModuleByEvaluative(id)
            } else {
               return getters.getModuleByExpositive(id)
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
         const c = state.courses.find(c => c.strapiId == id)
         return c.children.flatMap(m => m.children)
      },
      getLessonsByModule: state => id => {
         return state.modules.find(m => m.strapiId == id).children
      },


      //-------Resource
      getResourceById: state => {
         return function (id, type) {
            if (type != "course" && type != "module") {
               return state[type + "s"].find(r => r.strapiId == id);
            }
            return undefined;
         };
      },


      //-------Status
      getStatusByResourceId: state => id => {
         return state.evaluatives.find(evaluative => evaluative.status.id == id).status
      },
      getCompletationStatusByLesson: state => id => {
         if (id=="0"){
            return null
         }
         const lesson = state.lessons.find(l => l.strapiId == id)
         let status = ("evaluatives" in lesson) ? lesson.evaluatives.map(e => e.status.grade) : []
         return (status.length > 0) ? status.reduce((a, b) => a + b, 0) / status.length : null
      },


      //-------Evaluative
      getEvaluativeByStatus: state => payload => {
         return state.evaluatives.find(e => e.strapiId == payload.id)
      },

   },
   mutations: {
      //-----------------------Authentication-----------------------------------
      setLogin(state, login) {
         state.login = login
      },
      setJWT(state, jwt) {
         state.jwt = jwt
      },
      setUser(state, user) {
         state.user = user
      },
      setRole(state, role) {
         state.role = role
      },
      /*loadStudentFunctions(state,playload){
         console.log(state,playload)
      },
      loadTeacherFunctions(state, playload){
         console.log(state,playload)
      },*/


      //-----------------------Teacher------------------------------------------
      createEditableCourse(state){
         const c = state.courses;
         c.forEach(course => {
            course.children.forEach(module => {
               module.children.push({
                  type: "add",
                  name: "add Lesson",
                  locked: true,
                  contentType: "lesson",
                  parentId: module.strapiId,
                  strapiId: 0,
                  children: []
               })
            });
            course.children.push({
               type: "add",
               name: "add Module",
               locked: true,
               contentType: "module",
               parentId: course.strapiId,
               strapiId: 0,
               children: []
            })
         })
      },
      addLessonByModuleId(state, id) {
         const module = state.courses.flatMap(c => c.children).find(m => m.strapiId == id)
         const n = Math.max(...state.lessons.map(l => l.strapiId))
         module["children"].splice(module["children"].length - 1, 0, {
            strapiId: n + 1,
            name: "New Lesson Name",
            description: "New Lesson Description",
            contentType: "lesson",
            evaluatives: [],
            expositives: [],
            new: true,
            id:state.maxId
         })
         state.maxId = state.maxId+1
         this.commit("updateStructure")
      },
      addModuleByCourseId(state, id) {
         const course = state.courses.find(c => c.strapiId == id)
         const n = Math.max(...state.modules.map(m => m.strapiId))
         course["children"].splice(course["children"].length - 1, 0, {
            strapiId: n + 1,
            name: "New Module Name",
            contentType: "module",
            id: state.maxId,
            children: [{
               type: "add",
               name: "add Lesson",
               locked: true,
               contentType: "lesson",
               parentId: n + 1,
               strapiId: 0,
               children: [],
               id: state.maxId+1
            }],
            new: true,
         })
         state.maxId = state.maxId+2
         this.commit("updateStructure")
      },
      deleteLesson(state, id) {
         const module = state.courses.flatMap(c => c.children).find(m => m.children.map(l => l.strapiId).includes(id))
         let index = module["children"].findIndex(obj => obj.strapiId == id);
         module.children.splice(index, 1)
         this.commit("updateStructure")
      },
      deleteModule(state, id) {
         const course = state.courses.find(c => c.children.map(m => m.strapiId).includes(id))
         let index = course["children"].findIndex(obj => obj.strapiId == id);
         course.children.splice(index, 1)
         this.commit("updateStructure")
      },
      upLesson(state, id){
         const course = state.courses[0]
         const module = state.courses.flatMap(c => c.children).find(m => m.children.map(l => l.strapiId).includes(id))
         const indexLesson = module["children"].findIndex(obj => obj.strapiId == id);
         const lesson = module.children[indexLesson]
         const indexModule = course["children"].findIndex(obj => obj.strapiId == module.strapiId);
         if (indexLesson > 0){
            module.children.splice(indexLesson,1)
            module.children.splice(indexLesson-1,0,lesson)
         } else if (indexModule > 0) {
            module.children.splice(indexLesson,1)
            const newModule = course.children[indexModule-1]
            newModule.children.splice(newModule.children.length-1,0,lesson)
         }
         this.commit("updateStructure")
      },
      downLesson(state, id){
         const course = state.courses[0]
         const module = state.courses.flatMap(c => c.children).find(m => m.children.map(l => l.strapiId).includes(id))
         const indexLesson = module["children"].findIndex(obj => obj.strapiId == id);
         const lesson = module.children[indexLesson]
         const indexModule = course["children"].findIndex(obj => obj.strapiId == module.strapiId);
         if (indexLesson < module.children.length-2){
            module.children.splice(indexLesson,1)
            module.children.splice(indexLesson+1,0,lesson)
         } else if (indexModule < course.children.length-2) {
            module.children.splice(indexLesson,1)
            const newModule = course.children[indexModule+1]
            newModule.children.splice(0,0,lesson)
         }
         this.commit("updateStructure")
      },
      upModule(state, id){
         const course = state.courses[0]
         const index = course["children"].findIndex(obj => obj.strapiId == id);
         const module = course.children[index]
         if (index > 0){
            course.children.splice(index,1)
            course.children.splice(index-1,0,module)
         }
         this.commit("updateStructure")
      },
      downModule(state, id){
         const course = state.courses[0]
         const index = course["children"].findIndex(obj => obj.strapiId == id);
         const length = course.children.length
         const module = course.children[index]
         if (index < length-2){
            course.children.splice(index,1)
            course.children.splice(index+1,0,module)
         }
         this.commit("updateStructure")
      },
      editableInput(state, obj){
         const value = obj.value
         const type = obj.type
         const field = obj.field
         const id = obj.id
         if (type == "course"){
            if (field == "name"){
               this.commit("changeCourseName", value)
            }
         } else if (type == "module"){
            if (field == "name"){
               this.commit("changeModuleName", [id, value])
            }
         } else if (type == "lesson"){
            if (field == "name"){
               this.commit("changeLessonName", [id, value])
            }
         }
      },
      changeCourseName(state, name){
         const course = state.courses[0]
         course.name = name
         this.commit("updateStructure")
      },
      changeModuleName(state, [id,name]){
         const course = state.courses[0]
         const module = course.children.find(m => m.strapiId == id)
         module.name = name
         this.commit("updateStructure")
      },
      changeLessonName(state, [id, name]){
         const course = state.courses[0]
         const lesson = course.children.flatMap(m => m.children).find(l => l.strapiId == id)
         lesson.name = name
         this.commit("updateStructure")
      },
      updateStructure(state) {
         state.modules = state.courses.flatMap(c => c.children)
         state.lessons = state.modules.flatMap(c => c.children)
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

      }

   },
   actions: {
      //--------------------------Authentication--------------------------------
      async login(state, loginData) {
         const requestData = { identifier: loginData[0], password: loginData[1] }
         let url = serverData.domain + serverData.authentication
         await axios.post(url, requestData)
            .then(resp => {
               state.commit("setJWT", resp.data.jwt)
               state.commit("setUser", resp.data.user)
            })
         let role;
         const auth = 'Bearer ' + state.getters.getJWT
         url = serverData.domain + serverData.me
         await axios.get(url, {
            headers: {
               'Authorization': auth
            }
         })
            .then(resp => {
               role = resp.data.role.type
            })
         this.commit("setRole", role)
         role = role.charAt(0).toUpperCase() + role.slice(1)
         this.commit("setLogin", true)
         if (role == "Student") {
            this.dispatch("fetchCourse")
            //this.commit("loadStudentFunctions")
         } else if (role == "Teacher") {
            //.commit("loadTeacherFunctions")
            console.log("teacher")
         }
         router.push({ name: role })
      },


      //--------------------------Student---------------------------------------
      async setProgress(state, payload) {
         const auth = 'Bearer ' + state.getters.getJWT
         const evaluative = state.getters.getEvaluativeByStatus(payload)
         const url = serverData.domain + serverData.statuses + "/" + evaluative.status.id
         axios.put(url, { data: payload.data }, {
            headers: {
               'Authorization': auth
            },
         })
         await state.dispatch("fetchCourse")
      },
      async fetchCourse(state) {
         const auth = 'Bearer ' + state.getters.getJWT
         let resp;
         const url = serverData.domain + serverData.courses
         await axios.get(url, {
            headers: {
               'Authorization': auth
            }
         })
            .then(response => {
               resp = response.data.data
            })
         const allCourses = [];
         const allModules = [];
         const allLessons = [];
         const allExpositives = [];
         const allEvaluatives = [];

         let moduleCount = 1
         let lessonCount = 1
         let count = 1

         resp.forEach(course => {
            course.strapiId = course.id
            course.id = count
            count++
            course.attributes.modules.forEach(module => {
               module.strapiId = module.id
               module.id = count
               count++
               module.lessons.forEach(lesson => {
                  lesson.strapiId = lesson.id
                  lesson.id = count
                  count++
                  lesson.expositives = lesson.expositives.data
                  lesson.expositives.forEach(expositive => {
                     Object.keys(expositive.attributes).forEach(key => {
                        expositive[key] = expositive.attributes[key];
                     });
                     expositive.strapiId = expositive.id
                     expositive.contentType = expositive.type
                     delete expositive.id
                     delete expositive.attributes
                     allExpositives.push(expositive)
                  })
                  lesson.evaluatives = lesson.evaluatives.data
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
                           evaluative.questions = evaluative.content[0]["questions"].data
                           evaluative.questions.forEach(question => {
                              Object.keys(question.attributes).forEach(key2 => {
                                 question[key2] = question.attributes[key2];
                              });
                              delete question.attributes
                           })
                        } else if (key != "id") {
                           evaluative[key] = evaluative.content[0][key];
                        }
                     });
                     evaluative.strapiId = evaluative.id
                     delete evaluative.content
                     delete evaluative.id
                     delete evaluative.attributes
                     allEvaluatives.push(evaluative)
                  })
                  lesson.contentType = "lesson"
                  lesson.internalId = "L" + lessonCount
                  lessonCount++
                  allLessons.push(lesson);
               });
               module["children"] = module.lessons
               module.contentType = "module"
               module.internalId = "M" + moduleCount
               moduleCount++
               delete module.lessons
               allModules.push(module)
            });
            Object.keys(course.attributes).forEach(key => {
               if (key == "modules") {
                  course["children"] = course.attributes[key];
               } else {
                  course[key] = course.attributes[key];
               }
            });
            course.contentType = "course"
            delete course.attributes
            allCourses.push(course);
         });
         data.state.courses = [...allCourses];
         data.state.lessons = [...allLessons];
         data.state.expositives = [...allExpositives];
         data.state.evaluatives = [...allEvaluatives];
         data.state.modules = [...allModules];
         data.state.maxId = count
      },


      //--------------------------Teacher---------------------------------------
      async fetchEmptyCourse(state){
         data.state.courses=emptyCourse
         data.state.maxId=4
         state.commit("updateStructure")
      },
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
}


export default new Vuex.Store(data);
