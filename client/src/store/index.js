import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios'
import router from "../router"

Vue.use(Vuex);

const data = {
   state: {
      login: false,
      user: {},
      jwt: "",
      courses: [],
      modules: [],
      lessons: [],
      expositives: [],
      evaluatives: [],
   },
   getters: {
      //------------------------Authentication----------------------------------
      isLogged: state => state.login,
      getJWT: state => state.jwt,


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
         return state.modules.find(m => m.strapiId==id).children
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
         const lesson = state.lessons.find(l => l.strapiId == id)
         const status = lesson.evaluatives.map(e => e.status.grade)
         return (status.length>0) ? status.reduce((a, b) => a + b, 0)/status.length : null
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
      setJWT(state, jwt){
         state.jwt = jwt
      },
      setUser(state, user){
         state.user = user
      },
      /*loadStudentFunctions(state,playload){
         console.log(state,playload)
      },
      loadTeacherFunctions(state, playload){
         console.log(state,playload)
      },*/
 
   },
   actions: {
      //--------------------------Authentication--------------------------------
      async login(state, loginData) {
         const requestData = { identifier: loginData[0], password: loginData[1] }
         let url = serverData.domain + serverData.authentication
         await axios.post(url, requestData)
            .then(resp => {
               state.commit("setJWT",resp.data.jwt)
               state.commit("setUser",resp.data.user)
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
         role = role.charAt(0).toUpperCase() + role.slice(1)
         this.commit("setLogin",true)
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
         axios.put(url, {data:payload.data},{
            headers: {
               'Authorization': auth
            },
         })
         await state.dispatch("fetchCourse")
         console.log(3)
      },
      async fetchCourse(state) {
         console.log(1)
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
         console.log(2)
         const allCourses = [];
         const allModules = [];
         const allLessons = [];
         const allExpositives = [];
         const allEvaluatives = [];

         let moduleCount = 1
         let lessonCount = 1
         let count = 1

         resp.forEach(course => {
            course.attributes.modules.forEach(module => {
               module.lessons.forEach(lesson => {
                  lesson.expositives = lesson.expositives.data
                  lesson.expositives.forEach(expositive => {
                     Object.keys(expositive.attributes).forEach(key => {
                        expositive[key] = expositive.attributes[key];
                     });
                     expositive.strapiId = expositive.id
                     expositive.contentType=expositive.type
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
                        if (key == "__component"){
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
                  lesson.strapiId=lesson.id
                  lesson.id = count
                  count++
                  allLessons.push(lesson);
               });
               module["children"] = module.lessons
               module.contentType = "module"
               module.internalId = "M" + moduleCount
               moduleCount++
               module.strapiId = module.id
               module.id = count
               count++
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
            course.strapiId = course.id
            course.id = count
            count++
            delete course.attributes
            allCourses.push(course);
         });
         data.state.courses = [...allCourses];
         data.state.lessons = [...allLessons];
         data.state.expositives = [...allExpositives];
         data.state.evaluatives = [...allEvaluatives];
         data.state.modules = [...allModules];
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
