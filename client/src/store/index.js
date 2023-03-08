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
      resourceId: 0,
      courses: [],
      lessons: [],
      expositives: [],
      evaluatives: [],

      progress: localStorage.progress ? JSON.parse(localStorage.progress) : [],
   },
   getters: {
      // -----------------------Authentication------------------------------
      isLogged: state => state.login,


      //--------------------------Student-----------------------------------
      // Course
      getCourse: state => {
         const newCourse = [];
         state.courses.forEach(course => {
            const c = course;
            c.contentType = "course";
            let mCount = 1;
            let lCount = 1;
            c.children = [];
            course.modules.forEach(module => {
               const m = module;
               m.children = [];
               m.contentType = "module";
               m.internalID = "M" + mCount;
               mCount = mCount + 1;
               module.lessons.forEach(lesson => {
                  const l = lesson;
                  l.contentType = "lesson";
                  l.internalID = "L" + lCount;
                  lCount = lCount + 1;
                  m.children.push(l);
               });
               delete m.lessons;
               c.children.push(m);
            });
            delete c.modules;
            newCourse.push(c);
         });
         return newCourse;
      },

      // Modules
      //getModules: state => state.modules,
      getModuleByResourceId: state => {
         return function (id, type) {
            if (type == "lesson") {
               let module = {};
               state.courses.forEach(c => {
                  c.children.forEach(m => {
                     m.children.forEach(l => {
                        if (l.strapiId == id) {
                           module = m;
                        }
                     });
                  });
               });
               return module;
            } else if (type == "code" || type == "quiz") {
               let module = {};
               state.courses.forEach(c => {
                  c.children.forEach(m => {
                     m.children.forEach(l => {
                        l["evaluatives"].forEach(e => {
                           if (e.strapiId == id) {
                              module = m;
                           }
                        });
                     });
                  });
               });
               return module;
            } else {
               let module = {};
               state.courses.forEach(c => {
                  c.children.forEach(m => {
                     m.children.forEach(l => {
                        l["expositives"].forEach(e => {
                           if (e.strapiId == id) {
                              module = m;
                           }
                        });
                     });
                  });
               });
               return module;
            }
         };
      },
      getModuleNameByResourceId: state => id => {
         return state.courses.find(module => module.resources.includes(id)).name;
      },

      // Sheets
      getSheets: state =>
         state.resources.filter(resource => resource.type == "sheet"),

      getSheetByResourceId: state => id => {
         return state.lessons.find(l => {
            if (
               l.expositives.map(e => e.strapiId).includes(id) ||
               l.evaluatives.map(e => e.strapiId).includes(id)
            ) {
               return l;
            }
         });
      },
      getLessonByResourceId: state => id => {
         return state.lessons.find(l => {
            if (
               l.expositive.map(e => e.strapiId).includes(id) ||
               l.evaluatives.map(e => e.strapiId).includes(id)
            ) {
               return l;
            }
         });
      },
      getCompletationStatusBySheetId: (state, getters) => id => { // ainda vou ter que fazer é para o main overview
         let sum = 0;
         const exercises = getters.getResourceById(id).exercises;
         if (typeof exercises !== "undefined") {
            exercises.forEach(exerciseId => {
               const score = state.progress.find(
                  resource => resource.id == exerciseId
               )?.status;
               if (typeof score !== "undefined") {
                  sum += +score;
               }
            });
            return isNaN(sum) ? 0 : sum / exercises.length;
         }
      },

      // Resources
      getResourceId: state => state.resourceId,
      getResourcesByModuleId: state => id =>
         state.resources.filter(resource => resource.moduleId == id),
      getResourceById: state => {
         return function (id, type) {
            if (type != "course" && type != "module") {
               return state[type + "s"].find(r => r.strapiId == id);
            }
            return undefined;
         };
      },
      getCode: state => state.code,
      getQuizByResourceId: state => id =>
         state.quizzes.find(quiz => quiz.id == id),

      // Progress
      getProgressFromResourceId: state => id => {
         return state.evaluatives.find(evaluative => evaluative.status.id == id).status
      },
      getStupid: state => payload => {
         return state.evaluatives.find(e => e.strapiId == payload.id)
      },
      getJWT: state => {
         return state.jwt
      }
   },
   mutations: {
      // ----------------authentication functions---------------------------
      async login(state, loginData) {
         const requestData = { identifier: loginData[0], password: loginData[1] }
         let url = serverData.domain + serverData.authentication
         await axios.post(url, requestData)
            .then(resp => {
               state.jwt = resp.data.jwt
               state.user = resp.data.user
            })
         let role;
         const auth = 'Bearer ' + state.jwt
         url = serverData.domain + serverData.me
         await axios.get(url, {
            headers: {
               'Authorization': auth
            }
         })
            .then(resp => {
               role = resp.data.role
            })
         let roletype = role.type
         roletype = roletype.charAt(0).toUpperCase() + roletype.slice(1)
         state.login = true;
         if (roletype == "Student") {
            this.commit("fetchCourse")
            //this.commit("loadStudentFunctions")
         } else if (roletype == "Teacher") {
            //.commit("loadTeacherFunctions")
            console.log("teacher")
         }
         router.push({ name: roletype })
      },/*
      loadStudentFunctions(state,playload){
         console.log(state,playload)
      },
      loadTeacherFunctions(state, playload){
         console.log(state,playload)
      },*/


      // -----------------------student functions---------------------------
      async fetchCourse(state) {
         const auth = 'Bearer ' + state.jwt
         let c;
         const url = serverData.domain + serverData.courses
         await axios.get(url, {
            headers: {
               'Authorization': auth
            }
         })
            .then(resp => {
               c = resp.data.data
            })
         const allCourses = [];
         const allLessons = [];
         const allExpositives = [];
         const allEvaluatives = [];
         c.forEach(course => {
            const c = {};
            c.id = course.id;
            Object.keys(course.attributes).forEach(key => {
               if (key != "modules") {
                  c[key] = course.attributes[key];
               }
            });
            c.modules = [];
            course.attributes.modules.forEach(module => {
               const m = module;
               const les = [];
               module.lessons.forEach(lesson => {
                  const l = lesson;
                  const exp = [];
                  const eva = [];
                  if (lesson.expositives != null && lesson.expositives.data) {
                     lesson.expositives.data.map(expositive => {
                        const e = expositive.attributes;
                        e.id = expositive.id;
                        e.strapiId = expositive.id;
                        e.contentType = expositive.attributes.type;
                        allExpositives.push(e);
                        exp.push(e);
                        return e;
                     });
                     l.expositives = l.expositives.data;
                  }
                  if (lesson.evaluatives != null && lesson.evaluatives.data) {
                     l.evaluatives.data.map(evaluative => {
                        const e = evaluative.attributes;
                        e.id = evaluative.id;
                        e.strapiId = evaluative.id;
                        for (let i in evaluative.attributes.content[0]) {
                           if (i == "__component") {
                              if (evaluative.attributes.content[0][i] == "base.quiz") {
                                 e.type = "quiz";
                                 e.contentType = "quiz";
                              } else {
                                 e.contentType = "code";
                              }
                           } else if (i == "questions") {
                              let que = [];
                              evaluative.attributes.content[0]["questions"].data.forEach(
                                 q => {
                                    let question = q.attributes;
                                    question.id = q.id;
                                    que.push(question);
                                 }
                              );
                              e[i] = que;
                           } else {
                              e[i] = evaluative.attributes.content[0][i];
                           }
                        }
                        delete e.content;
                        allEvaluatives.push(e);
                        eva.push(e);
                        return e;
                     });
                     l.evaluatives = l.evaluatives.data;
                  }
                  l.expositives = exp;
                  l.evaluatives = eva;
                  allLessons.push(l);
                  les.push(l);
               });
               m.lessons = les;
               c.modules.push(m);
            });
            allCourses.push(c);
         });
         data.state.courses = [...allCourses];
         data.state.lessons = [...allLessons];
         data.state.expositives = [...allExpositives];
         data.state.evaluatives = [...allEvaluatives];
      },
      setResourceId(state, payload) {
         state.resourceId = payload;
      },
      async setProgress(state, payload) {
         const auth = 'Bearer ' + state.jwt
         const evaluative = state.evaluatives.find(e => e.strapiId == payload.id)
         const url = serverData.domain + serverData.statuses + "/" + evaluative.status.id
         let d;
         if (payload.code){
            d = {
               answer:[{__component:"solution.code",code:payload.code}]
            }
         } else if ("grade" in payload){
            d = {
               grade:payload.grade
            }
         } else {
            d={
               grade:0
            }
         }
         await axios.put(url, {data:d},{
            headers: {
               'Authorization': auth
            },
         })
         await this.commit("fetchCourse")
      },
   },
   actions: {
      async setProgress(state, payload) {
         const auth = 'Bearer ' + state.getters.getJWT
         const evaluative = state.getters.getStupid(payload)
         const url = serverData.domain + serverData.statuses + "/" + evaluative.status.id
         let d;
         if (payload.code){
            d = {
               answer:[{__component:"solution.code",code:payload.code}]
            }
         } else if ("grade" in payload){
            d = {
               grade:payload.grade
            }
         } else {
            console.log(payload)
         }
         await axios.put(url, {data:d},{
            headers: {
               'Authorization': auth
            },
         })
         await state.dispatch("fetchCourse")
      },
      async fetchCourse(state) {
         const auth = 'Bearer ' + state.getters.getJWT
         let c;
         const url = serverData.domain + serverData.courses
         await axios.get(url, {
            headers: {
               'Authorization': auth
            }
         })
            .then(resp => {
               c = resp.data.data
            })
         const allCourses = [];
         const allLessons = [];
         const allExpositives = [];
         const allEvaluatives = [];
         c.forEach(course => {
            const c = {};
            c.id = course.id;
            Object.keys(course.attributes).forEach(key => {
               if (key != "modules") {
                  c[key] = course.attributes[key];
               }
            });
            c.modules = [];
            course.attributes.modules.forEach(module => {
               const m = module;
               const les = [];
               module.lessons.forEach(lesson => {
                  const l = lesson;
                  const exp = [];
                  const eva = [];
                  if (lesson.expositives != null && lesson.expositives.data) {
                     lesson.expositives.data.map(expositive => {
                        const e = expositive.attributes;
                        e.id = expositive.id;
                        e.strapiId = expositive.id;
                        e.contentType = expositive.attributes.type;
                        allExpositives.push(e);
                        exp.push(e);
                        return e;
                     });
                     l.expositives = l.expositives.data;
                  }
                  if (lesson.evaluatives != null && lesson.evaluatives.data) {
                     l.evaluatives.data.map(evaluative => {
                        const e = evaluative.attributes;
                        e.id = evaluative.id;
                        e.strapiId = evaluative.id;
                        for (let i in evaluative.attributes.content[0]) {
                           if (i == "__component") {
                              if (evaluative.attributes.content[0][i] == "base.quiz") {
                                 e.type = "quiz";
                                 e.contentType = "quiz";
                              } else {
                                 e.contentType = "code";
                              }
                           } else if (i == "questions") {
                              let que = [];
                              evaluative.attributes.content[0]["questions"].data.forEach(
                                 q => {
                                    let question = q.attributes;
                                    question.id = q.id;
                                    que.push(question);
                                 }
                              );
                              e[i] = que;
                           } else {
                              e[i] = evaluative.attributes.content[0][i];
                           }
                        }
                        delete e.content;
                        allEvaluatives.push(e);
                        eva.push(e);
                        return e;
                     });
                     l.evaluatives = l.evaluatives.data;
                  }
                  l.expositives = exp;
                  l.evaluatives = eva;
                  allLessons.push(l);
                  les.push(l);
               });
               m.lessons = les;
               c.modules.push(m);
            });
            allCourses.push(c);
         });
         data.state.courses = [...allCourses];
         data.state.lessons = [...allLessons];
         data.state.expositives = [...allExpositives];
         data.state.evaluatives = [...allEvaluatives];
      },
   },
   modules: {}
};

/*
fetch("c.json")
   .then(r => r.json())
   .then(c => {
      const allCourses = [];
      const allLessons = [];
      const allExpositives = [];
      const allEvaluatives = [];
      c.forEach(course => {
         const c = {};
         c.id = course.id;
         Object.keys(course.attributes).forEach(key => {
            if (key != "modules") {
               c[key] = course.attributes[key];
            }
         });
         c.modules = [];
         course.attributes.modules.forEach(module => {
            const m = module;
            const les = [];
            module.lessons.forEach(lesson => {
               const l = lesson;
               const exp = [];
               const eva = [];
               if (lesson.expositives != null && lesson.expositives.data) {
                  lesson.expositives.data.map(expositive => {
                     const e = expositive.attributes;
                     e.id = expositive.id;
                     e.strapiId = expositive.id;
                     e.contentType = expositive.attributes.type;
                     allExpositives.push(e);
                     exp.push(e);
                     return e;
                  });
                  l.expositives = l.expositives.data;
               }
               if (lesson.evaluatives != null && lesson.evaluatives.data) {
                  l.evaluatives.data.map(evaluative => {
                     const e = evaluative.attributes;
                     e.id = evaluative.id;
                     e.strapiId = evaluative.id;
                     for (let i in evaluative.attributes.content[0]) {
                        if (i == "__component") {
                           if (evaluative.attributes.content[0][i] == "base.quiz") {
                              e.type = "quiz";
                              e.contentType = "quiz";
                           } else {
                              e.contentType = "code";
                           }
                        } else if (i == "questions") {
                           let que = [];
                           evaluative.attributes.content[0]["questions"].data.forEach(
                              q => {
                                 let question = q.attributes;
                                 question.id = q.id;
                                 que.push(question);
                              }
                           );
                           e[i] = que;
                        } else {
                           e[i] = evaluative.attributes.content[0][i];
                        }
                     }
                     delete e.content;
                     allEvaluatives.push(e);
                     eva.push(e);
                     return e;
                  });
                  l.evaluatives = l.evaluatives.data;
               }
               l.expositives = exp;
               l.evaluatives = eva;
               allLessons.push(l);
               les.push(l);
            });
            m.lessons = les;
            c.modules.push(m);
         });
         allCourses.push(c);
      });
      data.state.courses = [...allCourses];
      data.state.lessons = [...allLessons];
      data.state.expositives = [...allExpositives];
      data.state.evaluatives = [...allEvaluatives];
   });*/


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
