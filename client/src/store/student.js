const data = {
  state: {
    resourceId: 0,
    courses: [],
    lessons: [],
    expositives: [],
    evaluatives: [],

    progress: localStorage.progress ? JSON.parse(localStorage.progress) : [],
    code: ""
  },
  getters: {
    // Auth
    isLogged: state => state.login,

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
      return function(id, type) {
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
    getCompletationStatusBySheetId: (state, getters) => id => {
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
      return function(id, type) {
        if (type != "course") {
          return state[type + "s"].find(r => r.strapiId == id);
        }
        return undefined;
      };
    },
    getCode: state => state.code,
    getQuizByResourceId: state => id =>
      state.quizzes.find(quiz => quiz.id == id),

    // Progress
    getProgressFromResourceId: state => id =>
      state.progress.find(progress => progress.id == id)
  },
  mutations: {
    setResourceId(state, payload) {
      state.resourceId = payload;
    },
    setCode(state, payload) {
      state.code = payload;
    },

    setProgress(state, payload) {
      if (state.progress.some(progress => progress.id == payload.id)) {
        state.progress.map(progress => {
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
    }
  },
  actions: {},
  modules: {}
};
