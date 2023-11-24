'use strict';

/**
 * class controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

const fs = require('fs');


const statusJson = JSON.parse(fs.readFileSync("./src/api/data/content/status.json"))
const statusStructure = statusJson.statusStructure
const courseJson = JSON.parse(fs.readFileSync("./src/api/data/content/course.json"))
const courseStructure = courseJson.courseStructure

const uid = 'api::class.class'

module.exports = createCoreController(uid, () => {
   return {
      async find(ctx) {
         const author = ctx.state.user.id
         let entity = await strapi.entityService.findMany(uid, {
            ...ctx.query,
            populate: { author: true },
         })
         entity = entity.filter(c => c.author.id == author)
         const sanitizedEntity = await this.sanitizeOutput(entity, ctx)
         return this.transformResponse(sanitizedEntity)
      },

      async findOne(ctx) {
         const { id } = ctx.request.params
         const populate = ctx.query.populate
         if (typeof (populate) == "string" && populate == "stat"){
            const classe = await strapi.entityService.findOne(uid, id, {
               populate: { occurrence: true, students: true },
            });
            let stat = []
            for (let student of classe.students){
               let ctx2 = ctx
               ctx2.request.body = {data:JSON.stringify(student.id)}
               ctx2.request.params = {id:JSON.stringify(student.id)}
               ctx2.params = {id:JSON.stringify(student.id)}
               let s = await strapi.controller("api::student.student").findOne(ctx2)
               let newS = student
               newS.performance = s.performance
               stat.push(newS)
            }


            let students = []
            for (let student of classe.students){
               let s = await strapi.entityService.findOne("api::student.student", student.id, {
                  populate: { statuses: { populate: statusStructure } },
               })
               students.push(s)
            }
            let studentLen = students.length
            let statuses = students.flatMap(s => s.statuses)
                     
            const occurrence = await strapi.entityService.findOne("api::occurrence.occurrence", classe.occurrence.id, {
               populate: { courses: true },
            })
            let courses = []
            for (let i = 0; i < occurrence.courses.length; i++) {
               let r = await strapi.entityService.findOne("api::course.course", occurrence.courses[i].id, {
                  populate: courseStructure,
               })
               delete r.author
               courses.push(r)
            }

            let evaluatives = []
         
            const currentDate = new Date();
            const startDate = new Date(occurrence.startDate)

            let evalDic = []
            for (let i = 0; i < courses.length; i++) {
               let course = courses[i]
               for (let j = 0; j < course.modules.length; j++) {
                  let module = course.modules[j]
                  if (module.condition && (module.condition.type!=null || module.condition.afterPercDone!=null || module.condition.afterWeek!=null)){
                     if (module.condition.afterWeek) {
                        const limit = new Date(startDate.setDate(startDate.getDate() + (module.condition.afterWeek * 7)))
                        if (currentDate >= limit) {
                           for (let k = 0; k < module.lessons.length; k++) {
                              let lesson = module.lessons[k]
                              if (lesson.condition && (lesson.condition.type!=null || lesson.condition.afterPercDone!=null || lesson.condition.afterWeek!=null)) {
                                 if (lesson.condition.afterWeek) {
                                    let limit = new Date(startDate.getTime())
                                    limit = new Date(limit.setDate(limit.getDate() + (lesson.condition.afterWeek * 7)))
                                    if (currentDate > limit) {
                                       evaluatives.push(...lesson.evaluatives)
                                       evalDic.push(lesson.evaluatives)
                                    }
                                 }
                              } else {
                                 evaluatives.push(...lesson.evaluatives)
                                 evalDic.push(lesson.evaluatives)
                              }
                           }
                        }
                     }
                  } else {
                     for (let k = 0; k < module.lessons.length; k++) {
                        let lesson = module.lessons[k]
                        if (lesson.condition && (lesson.condition.type!=null || lesson.condition.afterPercDone!=null || lesson.condition.afterWeek!=null)) {
                           if (lesson.condition.afterWeek) {
                              let limit = new Date(startDate.getTime())
                              limit = new Date(limit.setDate(limit.getDate() + (lesson.condition.afterWeek * 7)))
                              if (currentDate > limit) {
                                 evaluatives.push(...lesson.evaluatives)
                                 evalDic.push(lesson.evaluatives)
                              }
                           }
                        } else {
                           evaluatives.push(...lesson.evaluatives)
                           evalDic.push(lesson.evaluatives)
                        }
                     }
                  }
               }
            }


            evaluatives.forEach(evaluative => {
               let evalStats = statuses.filter(s => s.evaluative.id == evaluative.id)
               evalStats = evalStats.map(s => s.grade==100 ? 1 : 0)
               let value = evalStats.reduce((accumulator, currentValue) => accumulator + currentValue, 0)/studentLen
               evaluative.correctPerc = Math.round(value*100)
            })

            let res = {students:stat, evaluatives:evaluatives}
            return res
         } else {
            const entity = await strapi.entityService.findOne(uid, id, {
               ...ctx.query,
               populate: { author: true },
            });
            if (ctx.state.user.id != entity.author.id) {
               return ctx.badRequest("You are not allowed to see this class")
            }
            const sanitizedEntity = await this.sanitizeOutput(entity, ctx)
            return this.transformResponse(sanitizedEntity)
         }
      },

      async create(ctx) {
         const result = []
         let data = (typeof(ctx.request.body.data)=="string") ? JSON.parse(ctx.request.body.data) : ctx.request.body.data
         data = (Array.isArray(data) == false) ? [data] : data
         for (const index of Array(data.length).keys()) {
            const ctx2 = await prepareCtx(ctx, data[index], "create")
            const r = await super.create(ctx2)
            result.push(r)
         }
         if (result.length == 1) {
            return result[0]
         }
         return result
      },

      async update(ctx) {
         const { id } = ctx.request.params
         const permission = await verifyAuthor(ctx.state.user.id, id)
         if (!permission) {
            return ctx.badRequest("You are not allowed to update this occurrence")
         }
         let data = (typeof(ctx.request.body.data)=="string") ? JSON.parse(ctx.request.body.data) : ctx.request.body.data

         const ctx2 = await prepareCtx(ctx, data, "update")
         const result = await super.update(ctx2)
         return result
      },

      async delete(ctx) {
         const { id } = ctx.request.params
         const entity = await strapi.entityService.findOne(uid, id, {
            ...ctx.query,
            populate: { author: true },
         });
         if (ctx.state.user.id != entity.author.id) {
            return ctx.badRequest("You are not allowed to delete this class")
         }

         const result = await super.delete(ctx)
         return result
      }
   }
})

async function prepareCtx(ctx, data, type) {
   let parm = ctx.params
   if ("students" in data && data.students != null) {
      data.students = await prepareStudents(ctx, data.students, type)
   }
   ctx.params = parm
   data.author = ctx.state.user.id
   ctx.request.body = {data:JSON.stringify(data)}
   return ctx
}

async function prepareStudents(ctx, students, type) {
   students = ((!typeof (students) == "object")) ? [students] : students
   let newStudents = []
   for (let student of students) {
      if (typeof(student) != "object"){
         newStudents.push(student)
      } else {
         let resp;
         if (student.new || type == "create") {
            delete student.new
            let ctx2 = ctx
            ctx2.request.body = {data:JSON.stringify(student)}
            resp = await strapi.controller("api::student.student").create(ctx2)
         } else if (type=="update"){
            let id = student.id
            delete student.id
            let ctx2 = ctx
            ctx2.request.body = {data:JSON.stringify(student)}
            ctx2.request.params = {id:JSON.stringify(id)}
            ctx2.params = {id:JSON.stringify(id)}
            resp = await strapi.controller("api::student.student").update(ctx2)
         }
         newStudents.push(resp.data.id)
      }
   }
   console.log(newStudents)
   return newStudents
}



async function verifyAuthor(authorId, contentId) {
   const entity = await strapi.entityService.findOne(uid, contentId, {
      populate: { author: true },
   })
   if (entity.author != null && entity.author.id == authorId) {
      return true
   }
   return false
}