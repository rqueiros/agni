const convert = {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    prepareCourseForServer(state, course) {
      let newCourse = {};
      let files = [];
      if (course.new) {
        newCourse.new = course.new;
      } else {
        newCourse.id = course.id;
      }
      if ("goals" in course) {
        newCourse.goals = [];
        course.goals.forEach(goal => {
          if (goal.new) {
            newCourse.goals.push({ goal: goal.goal });
          } else {
            newCourse.goals.push(goal);
          }
        });
      }
      if ("name" in course) {
        newCourse.name = course.name;
      }
      if ("type" in course && course.type != null) {
        newCourse.type = course.type;
      }
      if ("children" in course) {
        newCourse.modules = [];
        course.children.forEach(module => {
          if (module.type == "add") {
            return;
          }
          let newModule = {};
          if (!module.new) {
            newModule.id = module.id;
          }
          if ("name" in module) {
            newModule.name = module.name;
          }
          if ("condition" in module && module.condition != null) {
            newModule.condition = {};
            if (module.condition.new) {
              newModule.condition = module.condition;
              delete newModule.condition.id;
            } else {
              newModule.condition = module.condition;
            }
            if (module.condition.type == "") {
              newModule.condition.type = null;
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
                newLesson.id = lesson.id;
              }
              if ("name" in lesson) {
                newLesson.name = lesson.name;
              }
              if ("description" in lesson && lesson.description != null) {
                newLesson.description = lesson.description;
              }
              if ("condition" in lesson && lesson.condition != null) {
                newLesson.condition = {};
                if (lesson.condition.new) {
                  newLesson.condition = lesson.condition;
                  delete newLesson.condition.id;
                } else {
                  newLesson.condition = lesson.condition;
                }
              }
              if ("expositives" in lesson) {
                newLesson.expositives = [];
                lesson.expositives.forEach(async expositive => {
                  let files2;
                  let newExpositive;
                  [newExpositive, files2] = await this.dispatch(
                    "convert/prepareExpositiveForServer",
                    expositive
                  );
                  for (const element of files2) {
                    files.push(element);
                  }
                  newLesson.expositives.push(newExpositive);
                });
              }
              if ("evaluatives" in lesson) {
                newLesson.evaluatives = [];
                lesson.evaluatives.forEach(async evaluative => {
                  let files2;
                  let newEvaluative;
                  [newEvaluative, files2] = await this.dispatch(
                    "convert/prepareEvaluativeForServer",
                    evaluative
                  );
                  for (const element of files2) {
                    files.push(element);
                  }
                  newLesson.evaluatives.push(newEvaluative);
                });
              }
              newModule.lessons.push(newLesson);
            });
          }
          newCourse.modules.push(newModule);
        });
      }
      return [newCourse, files];
    },
    prepareExpositiveForServer(state, expositive) {
      let files = [];
      let newExpositive = {};
      if (expositive.new) {
        newExpositive.new = true;
      } else {
        newExpositive.id = expositive.id;
      }
      if ("name" in expositive) {
        newExpositive.name = expositive.name;
      }
      if ("type" in expositive) {
        if (expositive.type == "") {
          newExpositive.type = null;
        } else {
          newExpositive.type = expositive.type;
        }
      }
      if ("file" in expositive && "name" in expositive.file) {
        newExpositive.file = expositive.file.name;
        files.push({ type: "file", file: expositive.file });
      } else if ("file" in expositive && "id" in expositive.file.data) {
        newExpositive.file = expositive.file.data.id;
      }
      if ("milestones" in expositive) {
        newExpositive.milestones = [];
        expositive.milestones.forEach(milestone => {
          if (milestone.new) {
            delete milestone.id;
            delete milestone.new;
            newExpositive.milestones.push(milestone);
          } else {
            newExpositive.milestones.push(milestone);
          }
        });
      }
      return [newExpositive, files];
    },
    prepareEvaluativeForServer(state, evaluative) {
      let files = [];
      let newEvaluative = {};
      if (evaluative.new) {
        newEvaluative.new = true;
      } else {
        newEvaluative.id = evaluative.id;
      }
      if ("name" in evaluative) {
        newEvaluative.name = evaluative.name;
      }
      newEvaluative.content = [{ id: evaluative.compId }];
      if (evaluative.contentType == "quiz") {
        newEvaluative.content[0].__component = "base.quiz";
        if ("questions" in evaluative) {
          newEvaluative.content[0].questions = [];
          evaluative.questions.forEach(async question => {
            let newQuestion;
            let files2;
            [newQuestion, files2] = await this.dispatch(
              "convert/prepareQuestionForServer",
              question
            );
            for (const element of files2) {
              files.push(element);
            }
            newEvaluative.content[0].questions.push(newQuestion);
          });
        }
      } else {
        newEvaluative.content[0].__component = "base.programming-exercise";
        if ("type" in evaluative) {
          newEvaluative.content[0].type = evaluative.type;
        }
        if ("language" in evaluative) {
          newEvaluative.content[0].language = evaluative.language;
        }
        if ("statement" in evaluative) {
          newEvaluative.content[0].statement = evaluative.statement;
        }
        if ("skeleton" in evaluative) {
          newEvaluative.content[0].skeleton = evaluative.skeleton;
        }
        if ("solution" in evaluative) {
          newEvaluative.content[0].solution = evaluative.solution;
        }
        if ("contexts" in evaluative) {
          newEvaluative.content[0].contexts = [];
          evaluative.contexts.forEach(context => {
            if (context.new) {
              delete context.new;
              delete context.id;
              newEvaluative.content[0].contexts.push(context);
            } else {
              newEvaluative.content[0].contexts.push(context);
            }
          });
        }
        if ("tests" in evaluative) {
          newEvaluative.content[0].tests = [];
          evaluative.tests.forEach(test => {
            if (test.subtype == "") {
              test.subtype = null;
            }
            if (test.type == "") {
              test.type = null;
            }
            if (test.new) {
              delete test.new;
              delete test.id;
              newEvaluative.content[0].tests.push(test);
            } else {
              newEvaluative.content[0].tests.push(test);
            }
          });
        }
      }
      return [newEvaluative, files];
    },
    prepareQuestionForServer(state, question) {
      let newQuestion = {};
      let files = [];
      if (question.new) {
        newQuestion.new = true;
      } else {
        newQuestion.id = question.id;
      }
      if ("correctAnswer" in question) {
        newQuestion.correctAnswer = JSON.stringify(question.correctAnswer);
      }
      if ("question" in question) {
        newQuestion.question = question.question;
      }
      if ("image" in question && "name" in question.image) {
        newQuestion.image = question.image.name;
        files.push({ type: "image", file: question.image });
      } else if ("image" in question && question.image.data != null) {
        newQuestion.image = question.image.data.id;
      } else {
        newQuestion.image = null;
      }
      if ("answers" in question) {
        newQuestion.answers = [];
        question.answers.forEach(answer => {
          if (answer.new) {
            delete answer.id;
            delete answer.new;
            newQuestion.answers.push(answer);
          } else {
            newQuestion.answers.push(answer);
          }
        });
      }
      return [newQuestion, files];
    },
    async prepareOccurrenceForServer(state, occ) {
      if (occ.new) {
        delete occ.id;
      }
      occ.classes.forEach(classe => {
        if (classe.new) {
          delete classe.id;
        }
        if (typeof classe.delay != "number") {
          classe.delay = parseInt(classe.delay);
          if (isNaN(classe.delay)) {
            classe.delay = null;
          }
        }
        classe.students.forEach(async student => {
          if (student.new) {
            delete student.id;
            let id = await this.dispatch("request/createStudentUser",student)
            delete student.email
            student.student = id
          }
          if (typeof student.delay != "number") {
            student.delay = parseInt(student.delay);
            if (isNaN(student.delay)) {
              student.delay = null;
            }
          }
        });
      });
      return [occ, []];
    },


    prepareCloneCourse(state, resp) {
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
    async prepareCourses(state, [resp, isCopy]) {
      let course = resp;

      let moduleCount = 1;
      let lessonCount = 1;
      let count = 1;

      course.idMenu = count;
      count++;

      for (const module of course.attributes.modules) {
        module.idMenu = count;
        count++;
        for (const lesson of module.lessons) {
          lesson.contentType = "lesson";
          lesson.internalId = "L" + lessonCount;
          lessonCount++;
          lesson.idMenu = count;
          count++;
          let newExpositives = [];
          let newEvaluatives = [];
          lesson.expositives = lesson.expositives.data;
          for (let i = 0; i < lesson.expositives.length; i++) {
            let expo = await this.dispatch("convert/prepareExpositives", [
              lesson.expositives[i],
              false
            ]);
            newExpositives.push(expo);
          }
          lesson.evaluatives = lesson.evaluatives.data;
          for (let i = 0; i < lesson.evaluatives.length; i++) {
            let evalu = await this.dispatch("convert/prepareEvaluatives", [
              lesson.evaluatives[i],
              false
            ]);
            newEvaluatives.push(evalu);
          }
          lesson.expositives = newExpositives;
          lesson.evaluatives = newEvaluatives;
        };
        module.children = module.lessons;
        module.contentType = "module";
        module.internalId = "M" + moduleCount;
        moduleCount++;
        delete module.lessons;
      };
      Object.keys(course.attributes).forEach(key => {
        if (key == "modules") {
          course.children = course.attributes[key];
        } else if (key == "goals") {
          let goalsCount = -1;
          course.goals = [];
          course.attributes.goals.forEach(goal => {
            if (isCopy) {
              goal.id = goalsCount;
              --goalsCount;
              goal.new = true;
              course.goals.push(goal);
            } else {
              course.goals.push(goal);
            }
          });
        } else {
          course[key] = course.attributes[key];
        }
      });
      course.contentType = "course";
      delete course.attributes;
      this.commit("main/setMaxID", count);
      return course;
    },
    async prepareExpositives(state, [resp, isCopy]) {
      let expositive = resp;
      expositive.id = resp.id;
      //expositive.name=resp.attributes.name
      Object.keys(expositive.attributes).forEach(key => {
        expositive[key] = expositive.attributes[key];
      });

      expositive.contentType = expositive.type;
      delete expositive.attributes;
      if (isCopy && "milestones" in expositive) {
        expositive.milestones.forEach(milestone => {
          delete milestone.id;
        });
      }
      return expositive;
    },
    async prepareEvaluatives(state, [resp, isCopy]) {
      let evaluative = {};
      evaluative.id = resp.id;
      evaluative.valid = true;

      Object.keys(resp.attributes).forEach(key => {
        evaluative[key] = resp.attributes[key];
      });

      if (resp.attributes.content) {
        let testsCount = -1;
        for (const key of Object.keys(resp.attributes.content[0])) {
          if (key == "__component") {
            if (resp.attributes.content[0]["__component"] == "base.quiz") {
              evaluative.type = "quiz";
              evaluative.contentType = "quiz";
            } else {
              evaluative.contentType = "code";
            }
          } else if (key == "id" && !isCopy) {
            evaluative.compId = resp.attributes.content[0].id;
          } else if (key == "questions") {
            //evaluative.questions = resp.attributes.content[0]["questions"];
            evaluative.questions = [];
            //let newQuestions = []
            for (
              var i = 0;
              i < resp.attributes.content[0].questions.data.length;
              i++
            ) {
              let que = await this.dispatch("convert/prepareQuestions", [
                resp.attributes.content[0].questions.data[i],
                false
              ]);
              evaluative.questions.push(que);
              //newQuestions.push(que)
            }
            //evaluative.questions = newQuestions
            //evaluative.questions = newQuestions
          } else if (key == "tests" && isCopy) {
            let newTests = resp.attributes.content[0].tests;
            newTests.forEach(test => {
              test.id = testsCount;
              test.new = true;
              test.correct = false;
              --testsCount;
            });
            evaluative[key] = newTests;
          } else if (key != "id") {
            evaluative[key] = resp.attributes.content[0][key];
          }
        };
        if (evaluative.contentType == "code" && !("contexts" in evaluative)) {
          evaluative.contexts = [];
        }
      }
      //delete evaluative.content;
      //delete evaluative.attributes;
      //let evaluative = {name:"eval", id:resp.id}
      return evaluative;
    },
    async prepareQuestions(state, [resp, isCopy]) {
      let question = {};
      question.id = resp.id;
      Object.keys(resp.attributes).forEach(key2 => {
        if (key2 == "answers") {
          question.answers = [];
          //let newAnswers = []
          for (let i = 0; i < resp.attributes.answers.length; i++) {
            //newAnswers.push(resp.attributes.answers[i])
            question.answers.push(resp.attributes.answers[i]);
          }
          //question.answers = newAnswers
        } else {
          question[key2] = resp.attributes[key2];
        }
      });
      question.correctAnswer = JSON.parse(question.correctAnswer);
      let answerCount = -1;
      if (isCopy && "answers" in question) {
        question.answers.forEach(answer => {
          answer.id = answerCount;
          answer.new = true;
          --answerCount;
        });
      }
      return question;
    },
    prepareOccurrences(state, [resp, isCopy]) {
      let occ = {};
      //let occ = resp.attributes;
      occ.id = resp.id;

      Object.keys(resp.attributes).forEach(key => {
        if (key == "courses") {
          occ.courses = [];
          resp.attributes.courses.data.forEach(course => {
            let newCourse = {};
            newCourse.id = course.id;
            Object.keys(course.attributes).forEach(key => {
              newCourse[key] = course.attributes[key];
            });
            occ.courses.push(newCourse);
          });
          occ.courses = occ.courses[0];
        } else if (key == "classes") {
          if (!isCopy) {
            occ.classes = [];
            resp.attributes.classes.data.forEach(c => {
              let newClass = {};
              newClass.id = c.id;
              newClass.students = [];
              c.attributes.students.data.forEach(student => {
                let newStudent = {};
                newStudent.id = student.id;
                /* TODO
                student.attributes.statuses.data.forEach(status => {
                  Object.keys(status.attributes).forEach(key => {
                    status[key] = status.attributes[key];
                  });
                  delete status.attributes;
                });*/
                Object.keys(student.attributes).forEach(key => {
                  newStudent[key] = student.attributes[key];
                });
                newClass.students.push(newStudent);
                //student.statuses = student.statuses.data;
              });
              Object.keys(c.attributes).forEach(key => {
                if (key != "students") {
                  newClass[key] = c.attributes[key];
                }
              });
              occ.classes.push(newClass);
            });
          } else {
            occ.classes = [];
          }
        } else {
          occ[key] = resp.attributes[key];
        }
      });
      return occ;
    },

    cleanCourseData({ rootGetters }, resp) {
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
            rootGetters["request/getUserEmail"] ==
            course.attributes.author.data.attributes.email;
        } else {
          newCourse.my = false;
        }
        newResp.push(newCourse);
      });
      return newResp;
    },
    cleanExpositiveData({ rootGetters }, resp) {
      let newResp = [];
      resp.forEach(expositive => {
        let newExpositive = {};
        newExpositive.id = expositive.id;
        newExpositive.name = expositive.attributes.name;
        newExpositive.type = expositive.attributes.type;
        if (expositive.attributes.author.data != null) {
          newExpositive.my =
            rootGetters["request/getUserEmail"] ==
            expositive.attributes.author.data.attributes.email;
        } else {
          newExpositive.my = false;
        }
        newExpositive.state =
          expositive.attributes.publishedAt == null ? "Draft" : "Published";
        newResp.push(newExpositive);
      });
      return newResp;
    },
    cleanEvaluativeData({ rootGetters }, resp) {
      let newResp = [];
      resp.forEach(evaluative => {
        let newEvaluative = {};
        newEvaluative.id = evaluative.id;
        newEvaluative.name = evaluative.attributes.name;
        newEvaluative.type = evaluative.attributes.content[0].__component.split(
          "."
        )[1];
        if (evaluative.attributes.author.data != null) {
          newEvaluative.my =
            rootGetters["request/getUserEmail"] ==
            evaluative.attributes.author.data.attributes.email;
        } else {
          newEvaluative.my = false;
        }
        newEvaluative.state =
          evaluative.attributes.publishedAt == null ? "Draft" : "Published";
        newResp.push(newEvaluative);
      });
      return newResp;
    },
    cleanQuestionData({ rootGetters }, resp) {
      let newResp = [];
      resp.forEach(question => {
        let newQuestion = {};
        newQuestion.id = question.id;
        newQuestion.question = question.attributes.question;
        if (question.attributes.author.data != null) {
          newQuestion.my =
            rootGetters["request/getUserEmail"] ==
            question.attributes.author.data.attributes.email;
        } else {
          newQuestion.my = false;
        }
        newQuestion.state =
          question.attributes.publishedAt == null ? "Draft" : "Published";
        newResp.push(newQuestion);
      });
      return newResp;
    },
    cleanOccurrenceData(state, resp) {
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
    }
  }
};

export default convert;
