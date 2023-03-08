'use strict';

/**
 * course controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const fs = require('fs');

const courseJson = JSON.parse(fs.readFileSync("./src/api/data/content/course.json"))
const courseStructure = courseJson.courseStructure

const statusJson = JSON.parse(fs.readFileSync("./src/api/data/content/status.json"))
const statusStructure = statusJson.statusStructure

const error = JSON.parse(fs.readFileSync("./src/api/data/error/error.json"))

const uid = 'api::course.course'


module.exports = createCoreController(uid, () => {
   return {
      async find(ctx) {
         const author = ctx.state.user
         if (author.role.id == 3){
            const res = await getStudentCourses(author,ctx)
            return this.transformResponse(res)
         } else {
            const entity = await strapi.entityService.findMany(uid, {
               ...ctx.query,
               populate: courseStructure,
            })
            const sanitizedEntity = await this.sanitizeOutput(entity, ctx)
            return this.transformResponse(sanitizedEntity)
         }
      },

      async findOne(ctx) {
         const populate = ctx.query.populate
         const { id } = ctx.request.params
         if (typeof (populate) == "string" && populate.startsWith("cloneData")) {
            const cloneData = JSON.parse(populate.slice(9))
            const entity = await strapi.entityService.findOne(uid, id, {
               ...ctx.query,
               populate: courseStructure,
            })
            let courseData = await this.sanitizeOutput(entity, ctx)
            courseData = cloneCourse(courseData,cloneData)
            return this.transformResponse(courseData)

         } else if (typeof (populate) == "string" && populate == "cloneBody") {
            const entity = await strapi.entityService.findOne(uid, id, {
               ...ctx.query,
               populate: courseStructure,
            })
            let courseData = await this.sanitizeOutput(entity, ctx)
            courseData = createCloneBody(courseData)
            return this.transformResponse(courseData)

         } else {
            const entity = await strapi.entityService.findOne(uid, id, {
               ...ctx.query,
               populate: courseStructure,
            })
            const sanitizedEntity = await this.sanitizeOutput(entity, ctx)
            return this.transformResponse(sanitizedEntity)
         }
      },

      async create(ctx) {
         let result = []
         let data = JSON.parse(ctx.request.body["data"])
         const images = ctx.request.files["files.image"]
         const files = ctx.request.files["files.file"]
         const check = checkImagesFiles(images, files, data)
         if (check == "image") {
            return ctx.badRequest(error.imageError.message, error.imageError.details)
         } else if (check == "file") {
            return ctx.badRequest(error.fileError.message, error.fileError.details)
         }
         data = (Array.isArray(data) == false) ? [data] : data
         for (const key of Array(data.length).keys()) {
            const ctx2 = await prepareCtx(ctx, images, files, data[key])
            const r = await super.create(ctx2)
            result.push(r)
         }
         result = (result.length == 1) ? result[0] : result
         //return this.transformResponse(result)
         return result
      },

      async update(ctx) {
         /*if (!verifyAuthor(ctx)){
           return ctx.unauthorized(`You can't update this entry`);
         }*/
         const data = JSON.parse(ctx.request.body["data"])
         const images = ctx.request.files["files.image"]
         const files = ctx.request.files["files.file"]
         const check = checkImagesFiles(images, files, data)
         if (check == "image") {
            return ctx.badRequest(error.imageError.message, error.imageError.details)
         } else if (check == "file") {
            return ctx.badRequest(error.fileError.message, error.fileError.details)
         }
         const ctx2 = await prepareCtx(ctx, images, files, data)
         const result = await super.update(ctx2)
         return result
      },

      async delete(ctx) {
         /*if (!verifyAuthor(ctx)){
           return ctx.unauthorized(`You can't delete this entry`);
         }*/
         const result = await super.delete(ctx)
         return result
      },
   }
})

async function prepareCtx(ctx, images, files, data) {
   if ("modules" in data) {
      for (const m of data.modules.keys()) {
         if ("lessons" in data.modules[m]) {
            for (const l of data.modules[m].lessons.keys()) {
               if ("expositives" in data.modules[m].lessons[l]) {
                  let expositives = data.modules[m].lessons[l].expositives
                  data.modules[m].lessons[l].expositives = await prepareExpositives(ctx, files, expositives)
               }
               if ("evaluatives" in data.modules[m].lessons[l]) {
                  let evaluatives = data.modules[m].lessons[l].evaluatives
                  data.modules[m].lessons[l].evaluatives = await prepareEvaluatives(ctx, images, evaluatives)
               }
               continue
            }
         }
      }
   }
   ctx.request.files['files.image'] = []
   ctx.request.files['files.file'] = []
   data.author = ctx.state.user.id
   ctx.request.body.data = JSON.stringify(data)
   return ctx
}

async function prepareEvaluatives(ctx, images, evaluatives){
   evaluatives = ((!typeof (evaluatives) == "object")) ? [evaluatives] : evaluatives
   const createEvaluatives = evaluatives.filter(e => typeof (e) == "object")
   if (createEvaluatives != []) {
      const ctx2 = prepareEvaluativeCtx(ctx, images, createEvaluatives)
      let resp = await strapi.controller("api::evaluative.evaluative").create(ctx2)
      resp = (!(resp instanceof Array)) ? [resp] : resp
      resp = resp.map(r => r.data.id)
      evaluatives = myConcate(evaluatives, resp)
   }
   return evaluatives
}

async function prepareExpositives(ctx, files, expositives){
   expositives = ((!typeof (expositives) == "object")) ? [expositives] : expositives
   const createExpositives = expositives.filter(e => typeof (e) == "object")
   if (createExpositives != []) {
      const ctx2 = prepareExpositiveCtx(ctx, files, createExpositives)
      let resp = await strapi.controller("api::expositive.expositive").create(ctx2)
      resp = (!(resp instanceof Array)) ? [resp] : resp
      resp = resp.map(r => r.data.id)
      expositives = myConcate(expositives, resp)
   }
   return expositives
}

function prepareEvaluativeCtx(ctx, images, data) {
   if (typeof (images) == "undefined") {
      images = []
   } else if (!(images instanceof Array)) {
      images = [images]
   }
   const imageNames = data.filter(ev => ev.content[0]["__component"] == "base.quiz").flatMap(ev => ev.content[0].questions.filter(q => typeof (q) == "object").filter(q => "image" in q).map(q => q.image))
   images = images.filter(i => imageNames.includes(i.name))
   ctx.request.files['files.image'] = images
   ctx.request.files['files.file'] = []
   ctx.request.body.data = JSON.stringify(data)
   return ctx
}

function prepareExpositiveCtx(ctx, files, data) {
   if (typeof (files) == "undefined") {
      files = []
   } else if (!(files instanceof Array)) {
      files = [files]
   }
   const fileNames = data.filter(d => "file" in d).map(d => d.file)
   files = files.filter(f => fileNames.includes(f.name))
   ctx.request.files['files.file'] = files
   ctx.request.files['files.image'] = []
   ctx.request.body.data = JSON.stringify(data)
   return ctx
}

function myConcate(l1, l2) {
   let c = 0
   for (const i of Array(l1.length).keys()) {
      if (typeof (l1[i]) == "object") {
         l1[i] = l2[c]
         c = c + 1
      }
   }
   return l1
}

function checkImagesFiles(images, files, data) {
   if (typeof (images) == "undefined") {
      images = []
   } else if (!(images instanceof Array)) {
      images = [images]
   }
   if (typeof (files) == "undefined") {
      files = []
   } else if (!(files instanceof Array)) {
      files = [files]
   }
   data = (!(data instanceof Array)) ? [data] : data
   files = files.map(f => f.name)
   images = images.map(i => i.name)
   const dataFiles = data.filter(d => "modules" in d).flatMap(d => d.modules.filter(m => "lessons" in m).flatMap(m => m.lessons.filter(l => "expositives" in l).flatMap(l => l.expositives.filter(e => typeof (e) == "object").filter(e => "file" in e).map(e => e.file))))
   const dataImages = data.filter(d => "modules" in d).flatMap(d => d.modules.filter(m => "lessons" in m).flatMap(m => m.lessons.filter(l => "evaluatives" in l).flatMap(l => l.evaluatives.filter(e => typeof (e) == "object").filter(ev => ev.content[0]["__component"] == "base.quiz").flatMap(ev => ev.content[0].questions.filter(q => typeof (q) == "object").filter(q => "image" in q).map(q => q.image)))))
   const verifyListIm = [...images.map(i => dataImages.includes(i)), ...dataImages.map(d => images.includes(d))]
   const verifyListFi = [...files.map(i => dataFiles.includes(i)), ...dataFiles.map(d => files.includes(d))]
   if (verifyListIm.includes(false)) {
      return "image"
   } else if (verifyListFi.includes(false)) {
      return "file"
   } else {
      return true
   }
}

function cloneCourse(courseData, cloneData){
   if ("modules" in courseData) {
      for (let m = courseData.modules.length - 1; m >= 0; m--) {
         const module = courseData.modules[m]
         if (!cloneData.modules[m].clone) {
            courseData.modules.splice(m, 1)
         } else {
            if ("lessons" in module) {
               for (let l = module.lessons.length - 1; l >= 0; l--) {
                  const lesson = module.lessons[l]
                  if (!cloneData.modules[m].lessons[l].clone) {
                     courseData.modules[m].lessons.splice(l, 1)
                  } else {
                     if ("expositives" in lesson) {
                        for (let ex = lesson.expositives.length - 1; ex >= 0; ex--) {
                           if (!cloneData.modules[m].lessons[l].expositives[ex].clone) {
                              courseData.modules[m].lessons[l].expositives.splice(ex, 1)
                           }
                        }
                     }
                     if ("evaluatives" in lesson) {
                        for (let ev = lesson.evaluatives.length - 1; ev >= 0; ev--) {
                           if (!cloneData.modules[m].lessons[l].evaluatives[ev].clone) {
                              courseData.modules[m].lessons[l].evaluatives.splice(ev, 1)
                           }
                        }
                     }
                  }
               }
            }
         }
      }
   }
   return courseData
}

function createCloneBody(courseData) {
   const keys = Object.keys(courseData).filter(k => !((k == "id") || (k == "name") || (k == "modules")))
   keys.forEach(k => {
      delete courseData[k]
   });
   if ("modules" in courseData) {
      for (let m = courseData.modules.length - 1; m >= 0; m--) {
         const module = courseData.modules[m]
         const keys = Object.keys(module).filter(k => !((k == "name") || (k == "lessons")))
         keys.forEach(k => {
            delete courseData.modules[m][k]
         });
         courseData.modules[m].clone = false
         if ("lessons" in module) {
            for (let l = module.lessons.length - 1; l >= 0; l--) {
               const lesson = module.lessons[l]
               const keys = Object.keys(lesson).filter(k => !((k == "name") || (k == "expositives") || (k == "evaluatives")))
               keys.forEach(k => {
                  delete courseData.modules[m].lessons[l][k]
               });
               courseData.modules[m].lessons[l].clone = false
               if ("expositives" in lesson) {
                  for (let ex = lesson.expositives.length - 1; ex >= 0; ex--) {
                     const keys = Object.keys(lesson.expositives[ex]).filter(k => !(k == "name"))
                     keys.forEach(k => {
                        delete courseData.modules[m].lessons[l].expositives[ex][k]
                     });
                     courseData.modules[m].lessons[l].expositives[ex].clone = false
                  }
               }
               if ("evaluatives" in lesson) {
                  for (let ev = lesson.evaluatives.length - 1; ev >= 0; ev--) {
                     const keys = Object.keys(lesson.evaluatives[ev]).filter(k => !(k == "name"))
                     keys.forEach(k => {
                        delete courseData.modules[m].lessons[l].evaluatives[ev][k]
                     });
                     courseData.modules[m].lessons[l].evaluatives[ev].clone = false
                  }
               }
            }
         }
      }
   }
   return courseData
}

async function getStudentCourses(author,ctx){
   const id = author.id
   const entity = await strapi.db.query('plugin::users-permissions.user').findOne({
      populate: {student:true},
      where: { id: id }
   })
   const studentId = entity.student.id
   const entity2 = await strapi.entityService.findOne("api::student.student", studentId, {
      populate: {class:true, statuses:{populate:statusStructure}},
   })
   const classId = entity2.class.id
   const entity3 = await strapi.entityService.findOne("api::class.class", classId, {
      populate: {occurrence:true,students:true},
   })
   const occId = entity3.occurrence.id
   const entity4 = await strapi.entityService.findOne("api::occurrence.occurrence", occId, {
      populate: {courses:true},
   })
   const courses = entity4.courses
   let res = []
   for (let i = 0; i < courses.length; i++){
      let r = await strapi.entityService.findOne(uid, courses[i].id, {
         populate: courseStructure,
      })
      delete r.author
      res.push(r)
   }
   let statuses = entity2.statuses
   const evIds = statuses.map(s => s.evaluative.id)

   for (let i = 0; i < res.length; i++){
      let c = res[i]
      for (let j = 0;j < c.modules.length;j++){
         let m = c.modules[j]
         for (let k = 0; k<m.lessons.length;k++){
            let l = m.lessons[k]
            for (let n = 0; n< l.evaluatives.length;n++){
               let evaluative = l.evaluatives[n]
               if (evIds.includes(evaluative.id)){
                  const s = statuses.find(s => s.evaluative.id==evaluative.id)
                  delete s.evaluative
                  statuses = statuses.filter(stat => stat != s)
                  evaluative.status = s
               } else {
                  const ctx2 = prepareStatusCtx(ctx,evaluative,studentId)
                  let resp = await strapi.entityService.create("api::status.status",{data:JSON.parse(ctx2.request.body.data)})
                  let resp2 = await strapi.entityService.findOne("api::status.status", resp.id, {
                     populate: statusStructure,
                  })
                  delete resp2.evaluative
                  evaluative.status = resp2
               }
            }
         }
      }
   }

   const currentDate = new Date();
   const startDate = new Date(entity4.startDate)

   for (let i = 0; i < res.length; i++){
      let course = res[i]
      for (let j = 0;j < course.modules.length;j++){
         let module= course.modules[j]
         if (module.condition){
            let locked = true
            let afterPercDone = false
            let afterWeek = false

            if (module.condition.afterWeek){
               const limit = new Date(startDate.setDate(startDate.getDate()+(module.condition.afterWeek*7)))
               if (currentDate >= limit){
                  afterWeek = true
               }
            }

            if (module.condition.afterPercDone){
               const limit = module.condition.afterPercDone
               if (j != 0){
                  let pastModule = course.modules[j-1]
                  const locked = pastModule.lessons.map(l => l.locked)
                  if (!(locked.includes(true))){
                     let grades = pastModule.lessons.flatMap(l => l.evaluatives.map(e => e.status.grade))
                     let mean = grades.reduce((acc, curr) => acc + curr, 0)/grades.length
                     if (mean >= limit) {
                        afterPercDone=true
                     }
                  }
               }
            }

            if (module.condition=="AND"){
               if (afterPercDone && afterWeek){
                  locked = false
               } 
            } else {
               if (afterPercDone | afterWeek){
                  locked = false
               }
            }
         
            if (locked){
               module.locked=true
               module.lessons=[]
            }
         }

         for (let k = 0; k<module.lessons.length;k++){
            let lesson = module.lessons[k]

            if (lesson.condition){
               let locked = true
               let afterPercDone = false
               let afterWeek = false
   
               if (lesson.condition.afterWeek){
                  let limit = new Date(startDate.getTime())
                  limit = new Date(limit.setDate(limit.getDate()+(lesson.condition.afterWeek*7)))
                  if (currentDate > limit){
                     afterWeek = true
                  }
               }
   
               if (lesson.condition.afterPercDone){
                  const limit = lesson.condition.afterPercDone
                  if (k != 0){
                     let pastLesson = module.lessons[k-1]
                     if (pastLesson.evaluatives.length>0){
                        const evaluatives = pastLesson.evaluatives.map(e => e.status.grade)
                        const mean = evaluatives.reduce((acc, curr) => acc + curr, 0)/evaluatives.length
                        if (mean >= limit) {
                           afterPercDone=true
                        }
                     }
                  } else {
                     if (j!=0){
                        let pastLesson = course.modules[j-1].lessons[course.modules[j-1].lessons.length-1]
                        if (pastLesson.evaluatives.length>0){
                           const evaluatives = pastLesson.evaluatives.map(e => e.status.grade)
                           const mean = evaluatives.reduce((acc, curr) => acc + curr, 0)/evaluatives.length
                           if (mean >= limit) {
                              afterPercDone=true
                           }
                        }
                     }
                  }
               }
   
               if (lesson.condition=="AND"){
                  if (afterPercDone && afterWeek){
                     locked = false
                  } 
               } else {
                  if (afterPercDone | afterWeek){
                     locked = false
                  }
               }
            
               if (locked){
                  lesson.locked=true
                  lesson.evaluatives=[]
                  lesson.evaluatives=[]
               }
            }
         }
      }
   }
   return res
}

function prepareStatusCtx(ctx,evaluative,studentId) {
   ctx.request.files = null
   const data = {
      grade:0.0,
      student:studentId,
      evaluative:evaluative.id
   }
   if (evaluative.content[0]["__component"]=="base.quiz"){
      let que = evaluative.content[0].questions.map(q => q.id)
      que = que.map(q => {return {"question":q}})
      data.answer = [{__component:"solution.quiz", questions: que}]
   } else {
      data.answer = [{__component:"solution.code", code:""}]
   }
   ctx.request.body.data = JSON.stringify(data)
   return ctx
}