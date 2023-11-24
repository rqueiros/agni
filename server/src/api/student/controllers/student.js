'use strict';

/**
 * student controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const fs = require('fs');


const uid = 'api::student.student'

const statusJson = JSON.parse(fs.readFileSync("./src/api/data/content/status.json"))
const statusStructure = statusJson.statusStructure
const courseJson = JSON.parse(fs.readFileSync("./src/api/data/content/course.json"))
const courseStructure = courseJson.courseStructure

module.exports = createCoreController(uid, () => {
   return {
      async find(ctx) {
         const author = ctx.state.user.id
         let entity = await strapi.entityService.findMany(uid, {
            ...ctx.query,
            populate: { author: true , user:true},
         })
         entity = entity.filter(c => c.author.id == author)
         const sanitizedEntity = await this.sanitizeOutput(entity, ctx)
         return this.transformResponse(sanitizedEntity)
      },

      async findOne(ctx) {
         const { id } = ctx.request.params
         const populate = ctx.query.populate
         if (typeof (populate) == "string" && populate == "stat"){
            let statusList = []
            let correctExercises = 10 //percentage of all exercises correct
            let engagment = 0 //Exercises completed of the last two lessons
            const student = await strapi.entityService.findOne("api::student.student", id, {
               populate: { class: true, statuses: { populate: statusStructure } },
            })
            statusList=student.statuses
            const classe = await strapi.entityService.findOne("api::class.class", student.class.id, {
               populate: { occurrence: true, students: true },
            })
            const occurrence = await strapi.entityService.findOne("api::occurrence.occurrence", classe.occurrence.id, {
               populate: { courses: true },
            })
            const courses = occurrence.courses

            let res = []
            for (let i = 0; i < courses.length; i++) {
               let r = await strapi.entityService.findOne("api::course.course", courses[i].id, {
                  populate: courseStructure,
               })
               delete r.author
               res.push(r)
            }

            let evaluatives = []
            
            const currentDate = new Date();
            const startDate = new Date(occurrence.startDate)

            let evalDic = []
            for (let i = 0; i < res.length; i++) {
               let course = res[i]
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

            let finalStatuses = []
            let count = 1
            evaluatives.forEach(evaluative => {
               if (statusList.find(s => s.evaluative.id == evaluative.id)){
                  finalStatuses.push(statusList.find(s => s.evaluative.id == evaluative.id))
               } else {
                  finalStatuses.push({
                     evaluative:{
                        id: evaluative.id,
                        name: evaluative.name
                     },
                     grade:0,
                     id:-count,
                     created:true,
                  })
                  count++
               }
            })

            correctExercises = (finalStatuses.filter(s => s.grade == 100).length / finalStatuses.length) * 100
            correctExercises = Math.round(correctExercises)

            evalDic = evalDic.filter(l => l.length != 0)
            let engagementStatuses = []
            if (evalDic.length>2){
               engagementStatuses.push(...evalDic[evalDic.length-1])
               engagementStatuses.push(...evalDic[evalDic.length-2])
            } else if (evalDic.length == 1){
               engagementStatuses.push(...evalDic[evalDic.length-1])
            }
            engagementStatuses = engagementStatuses.map(s => finalStatuses.find(stat => stat.evaluative.id == s.id))
            engagment = engagementStatuses.map(s => s.grade).reduce((accumulator, currentValue) => accumulator + currentValue, 0)/engagementStatuses.length
            engagment = Math.round(engagment)

            let performance = (correctExercises + engagment) / 2
            performance = Math.round(performance)


            return {
               correctExercises : correctExercises,
               engagment : engagment,
               performance : performance,
               statuses : finalStatuses,
            }
         } else {
            const entity = await strapi.entityService.findOne(uid, id, {
               ...ctx.query,
               populate: { author: true, user:true},
            });
            if (ctx.state.user.id != entity.author.id) {
               return ctx.badRequest("You are not allowed to see this student")
            }
            const sanitizedEntity = await this.sanitizeOutput(entity, ctx)
            return this.transformResponse(sanitizedEntity)
         }
      },

      async create(ctx) {
         let result = []
         let data = (typeof(ctx.request.body.data)=="string") ? JSON.parse(ctx.request.body.data) : ctx.request.body.data
         if (Array.isArray(data) == false) {
            data = [data]
         }
         for (const index of Array(data.length).keys()) {
            const ctx2 = prepareCtx(ctx, data[index])
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
         const entity = await strapi.entityService.findOne(uid, id, {
            ...ctx.query,
            populate: { author: true },
         });
         if (ctx.state.user.id != entity.author.id) {
            return ctx.badRequest("You are not allowed to update this student")
         }

         const result = await super.update(ctx)
         return result
      },

      async delete(ctx) {
         const { id } = ctx.request.params
         const entity = await strapi.entityService.findOne(uid, id, {
            ...ctx.query,
            populate: { author: true },
         });
         if (ctx.state.user.id != entity.author.id) {
            return ctx.badRequest("You are not allowed to delete this student")
         }

         const result = await super.delete(ctx)
         return result
      }
   }
})

function prepareCtx(ctx, data) {
   data.author = ctx.state.user.id
   ctx.request.body = {data:JSON.stringify(data)}
   return ctx
}
