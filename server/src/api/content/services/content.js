'use strict';

/**
 * content service
 */

module.exports = {
  get: async (params) => {
    try {
      let search = params.filters.name.$containsi
      console.log("courses")
      let courses = await strapi.entityService.findMany(
        "api::course.course", {
          filters:{
            $or:[
              {
                name:{
                  $containsi: search
                }
              },
              {
                type:{
                  $containsi: search
                }
              },
              {
                goals:{
                  goal:{
                    $containsi: search
                  }
                }
              },
              {
                modules:{
                  name:{
                    $containsi: search
                  }
                }
              },
              {
                modules:{
                  lessons:{
                    name:{
                      $containsi: search
                    }
                  }
                }
              },
              {
                modules:{
                  lessons:{
                    description:{
                      $containsi: search
                    }
                  }
                }
              }
            ]
          },
          populate:{
            "name": true,
            "type": true,
            "goals": true,
            "author": true,
            "modules": {
              "populate": {
                  "name": true,
                  "lessons": {
                    "populate": {
                        "name": true,
                        "description": true,
                    }
                  }
                }
              }
          }
        }
      );
      courses = courses.map(c => {
        c.collectionType = "courses";
        c.icon = c.type == null ? "courses" : c.type
        c.label = c.name
        let label2 = ""
        console.log(1)
        if (c.type && c.type.toLowerCase().includes(search.toLowerCase())){
          label2 += " - Type:" + c.type
        }
        console.log(2)
        console.log(c.goals)
        if (c.goals){
          c.goals.forEach(goal => {
            console.log(2.5)
            if (goal.goal && goal.toLowerCase().includes(search.toLowerCase())){
              console.log(2.6)
              label2 += " - Goal:" + goal.goal
            }
          });
        }
        console.log(3)
        if (c.modules){
          c.modules.forEach(module => {
            console.log(4)
            if (module.name && module.name.toLowerCase().includes(search.toLowerCase())){
              label2 += " - Module:"+ module.name
            }
            console.log(5)
            if (module.lessons){
              module.lessons.forEach(lesson => {
                console.log(6)
                if (lesson.name && lesson.name.toLowerCase().includes(search.toLowerCase())){
                  label2 += " - Lesson:"+ lesson.name
                }
                console.log(7)
                if (lesson.description && lesson.description.toLowerCase().includes(search.toLowerCase())){
                  label2 += " - Lesson:"+ lesson.description
                }
              })
            }
          })
        }
        c.label2 = label2.length > 40 ? label2.substring(3,40) + " ..." : label2.substring(3,label2.length)
        return c;
      })
      console.log("expo")
      let expositives = await strapi.entityService.findMany(
        "api::expositive.expositive", {
          filters:{
            $or:[
              {
                name:{
                  $containsi: search
                }
              },
              {
                type:{
                  $containsi: search
                }
              }
            ]
          }
        }
      );
      expositives = expositives.map(e => {
        e.collectionType = "expositives";
        e.icon = e.type
        e.label = e.name
        let label2 = ""
        if (e.type && e.type.toLowerCase().includes(search.toLowerCase)){
          label2 += "Type:" + e.type
        }
        e.label2 = label2
        return e
      })
      console.log("eval")
      let evaluatives = await strapi.entityService.findMany(
        "api::evaluative.evaluative", {
          filters:{
            $or:[
              {
                name:{
                  $containsi: search
                }
              },/*
              {
                content:{
                  type: {
                    $containsi: search
                  }
                }
              },
              {
                content:{
                  statement: {
                    $containsi: search
                  }
                }
              },
              {
                skeleton:{
                  statement: {
                    $containsi: search
                  }
                }
              },
              {
                solution:{
                  statement: {
                    $containsi: search
                  }
                }
              },*/
            ]
          },
          populate:"*"
        }
      );
      evaluatives = evaluatives.map(e => {
        e.collectionType = "evaluatives";
        if (e.content[0].__component=="base.quiz"){
          e.icon = "quiz"
        } else {
          e.icon = e.content[0].type
        }
        e.label = e.name
        e.label2 = ""
        return e
      })
      console.log("quest")
      let questions = await strapi.entityService.findMany(
        "api::question.question", {
          filters:{
            $or:[
              {
                question:{
                  $containsi: search
                }
              },
              {
                answers:{
                  answer:{
                    $containsi: search
                  }
                }
              }
            ]
          },
          populate:"*"
        }
      );
      questions = questions.map(q => {
        q.collectionType = "questions"
        q.icon = "question"
        let que = q.question.substring(3,q.question.length-4)
        q.label = que.length > 30 ? que.substring(0,30)+" ..." : que
        let label2 = ""
        if (q.answers){
          q.answers.forEach(answer => {
            if(answer.answer && answer.answer.toLowerCase().includes(search.toLowerCase())){
              label2 += " - Answer:"+answer.answer
            }
          })
        }
        q.label2 = label2.length > 40 ? label2.substring(3,40) + " ..." : label2.substring(3,label2.length)
        return q
      })
      console.log("occ")
      let occurrences = await strapi.entityService.findMany(
        "api::occurrence.occurrence", {
          filters:{
            $or:[
              {
                year:{
                  $containsi: search
                }
              },
            ]
          }
        }
      );
      occurrences = occurrences.map(q => {
        q.collectionType = "occurrences"
        q.icon = "occurrence"
        q.label = "Occurrence"+q.year.toString()
        q.label2 = "Year:"+q.year.toString()
        return q
      })
      console.log("class")
      let classes = await strapi.entityService.findMany(
        "api::class.class", {
          filters:{
            $or:[
              {
                name:{
                  $containsi: search
                }
              }
            ]
          }
        }
      );
      classes = classes.map(q => {
        q.collectionType = "classes"
        q.icon = "class"
        q.label = q.name
        q.label2 = ""
        return q
      })
      console.log("students")
      let students = await strapi.entityService.findMany(
        "api::student.student", {
          filters:{
            $or:[
              {
                name:{
                  $containsi: search
                }
              }
            ]
          }
        }
      );
      students = students.map(q => {
        q.collectionType = "students"
        q.icon = "students"
        q.label = q.name
        q.label2 = ""
        return q
      })
      let entriesReduced = [...courses, ...expositives, ...evaluatives, ...questions, ...occurrences, ...classes, ...students]
      return entriesReduced;
    } catch (err) {
      return err;
    }
  },
  getNewContents: async () => {
    try {      
      let courses = await strapi.entityService.findMany(
        "api::course.course", {
          filters: {
            publishedAt: {
              $notNull: true,
            },
          },
          sort: { publishedAt: 'desc' },
          start: 0,
          limit: 2,
        }
      );
      let expostitives = await strapi.entityService.findMany(
        "api::expositive.expositive", {
          filters: {
            publishedAt: {
              $notNull: true,
            },
          },
          sort: { publishedAt: 'desc' },
          start: 0,
          limit: 2,
        }
      );
      let evaluatives = await strapi.entityService.findMany(
        "api::evaluative.evaluative", {
          filters: {
            publishedAt: {
              $notNull: true,
            },
          },
          populate: '*',
          sort: { publishedAt: 'desc' },
          start: 0,
          limit: 2,
        }
      );
      let questions = await strapi.entityService.findMany(
        "api::question.question", {
          filters: {
            publishedAt: {
              $notNull: true,
            },
          },
          sort: { publishedAt: 'desc' },
          start: 0,
          limit: 2,
        }
      );      
      let entries = []
      courses = courses.map(c => {
        c.contentType = "courses";
        c.tableKey = c.id.toString()+"course"
        return c;
      })
      expostitives = expostitives.map(e => {
        e.contentType = "expositives";
        e.tableKey = e.id.toString()+"expo"
        return e
      })
      evaluatives = evaluatives.map(e => {
        e.contentType = "evaluatives";
        e.tableKey = e.id.toString()+"eval"
        if(e.content[0].__component == "base.quiz"){
          e.type = "quiz"
        } else {
          e.type = e.content[0].type
        }
        return e
      })
      questions = questions.map(q => {
        q.contentType = "questions"
        q.tableKey = q.id.toString()+"ques"
        q.type = "question"
        q.name = q.question.substring(3, q.question.length-4).substring(0,30)
        return q
      })
      entries = [...courses, ...expostitives, ...evaluatives, ...questions]
      entries.sort(function(a, b) {
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      });
      return entries;
    } catch (err) {
      return err;
    }
  },
  sendEmail: async (message) => {
    console.log(message)
    try {
      await strapi.plugins['email'].services.email.send({
        to: 'yannikbauer@gmx.de',
        subject: 'The Strapi Email plugin worked successfully',
        text: 'Hello world!',
      })
      return []
    } catch (err) {
      return err
    }
  }
};
