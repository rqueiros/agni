'use strict';

/**
 * occurrence controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

const courseStructure = {
   courses: {
      populate: {
         name: true,
         type: true,
         goals: true,
         modules: {
            populate: {
               name: true,
               lessons: {
                  populate: {
                     name: true,
                     description: true,
                     expositives: {
                        populate: {
                           name: true,
                           type: true,
                           file: true,
                           milestones: true
                        }
                     },
                     evaluatives: {
                        populate: {
                           name: true,
                           content: {
                              populate: {
                                 questions: {
                                    populate: {
                                       question: true,
                                       image: true,
                                       correctAnswer: true,
                                       answers: true
                                    }
                                 },
                                 type: true,
                                 language: true,
                                 instruction: true,
                                 instructionFiles: true,
                                 skeleton: true,
                                 solution: true,
                                 tests: true
                              }
                           }
                        }
                     }
                  }
               }
            }
         },
      }
   }
};
const occurrenceStructure = {
   author : true,
   year: true,
   startDate:true,
   endDate:true,
   courses: {
      populate: {
         name: true,
         type: true,
         modules: {
            populate: {
               condition:true,
               name: true,
               lessons: {
                  populate: {
                     condition:true,
                     name: true,
                  }
               }
            }
         },
      }
   },
   classes:{
      populate:{
         name:true,
         delay:true,
         students:{
            populate:{
               name:true,
               delay:true,
               statuses:true
            }
         }
      }
   }
};

const uid = 'api::occurrence.occurrence'

module.exports = createCoreController(uid, () => {
   return {
      async find(ctx) {
         if (ctx.query.populate === 'course') {
            const entity = await strapi.entityService.findMany(uid, {
               ...ctx.query,
               populate: courseStructure,
            })
            const sanitizedEntity = await this.sanitizeOutput(entity, ctx)
            return this.transformResponse(sanitizedEntity)
         }
         const author = ctx.state.user.id
         let entity = await strapi.entityService.findMany(uid, {
            ...ctx.query,
            populate: occurrenceStructure,
         })
         entity = entity.filter(c => (c.author != null && c.author.id == author))
         const sanitizedEntity = await this.sanitizeOutput(entity, ctx)
         return this.transformResponse(sanitizedEntity)
      },

      async findOne(ctx) {
         const { id } = ctx.request.params
         const entity = await strapi.entityService.findOne(uid, id, {
            ...ctx.query,
            populate: occurrenceStructure,
         });
         if (ctx.state.user.id != entity.author.id) {
            return ctx.badRequest("You are not allowed to see this occurrence")
         }
         const sanitizedEntity = await this.sanitizeOutput(entity, ctx)
         return this.transformResponse(sanitizedEntity)
      },

      async create(ctx) {
         const result = []

         let data = (typeof(ctx.request.body.data)=="string") ? JSON.parse(ctx.request.body.data) : ctx.request.body.data

         if (data.publishedAt == null) {
            data.author = ctx.state.user.id
            const occ = await strapi.db.query("api::occurrence.occurrence").create({
               data: data
            });
            return occ;
         }

         data = (Array.isArray(data) == false) ? [data] : data
         for (const index of Array(data.length).keys()) {
            const ctx2 = await prepareCtx(ctx, data[index], "create")
            const r = await super.create(ctx2)
            result.push(r)
         }
         result = (result.length == 1) ? result[0] : result
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
            return ctx.badRequest("You are not allowed to delete this occurrence")
         }

         const result = await super.delete(ctx)
         return result
      }
   }
})

async function prepareCtx(ctx, data, type) {
   let parm = ctx.params
   if ("classes" in data && data.classes != null) {
      data.classes = await prepareClasses(ctx, data.classes, type)
   }
   ctx.params = parm
   data.author = ctx.state.user.id
   ctx.request.body = {data:JSON.stringify(data)}
   return ctx
}

async function prepareClasses(ctx, classes, type) {
   classes = ((!typeof (classes) == "object")) ? [classes] : classes
   let newClasses = []
   for (let classe of classes) {
      if (typeof(classe) != "object"){
         newClasses.push(classe)
      } else {
         let resp;
         if (classe.new || type == "create") {
            delete classe.new
            let ctx2 = ctx
            ctx2.request.body = {data:JSON.stringify(classe)}
            resp = await strapi.controller("api::class.class").create(ctx2)
         } else if (type=="update"){
            let id = classe.id
            delete classe.id
            let ctx2 = ctx
            ctx2.request.body = {data:JSON.stringify(classe)}
            ctx2.request.params = {id:JSON.stringify(id)}
            ctx2.params = {id:JSON.stringify(id)}
            resp = await strapi.controller("api::class.class").update(ctx2)
         }
         newClasses.push(resp.data.id)
      }
   }
   return newClasses
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