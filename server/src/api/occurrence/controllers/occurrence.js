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
   courses:{
      populate:{
         name:true,
         type:true
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
         let data = JSON.parse(ctx.request.body["data"])
         if (Array.isArray(data) == false) {
            data = [data]
         }
         for (const index of Array(data.length).keys()) {
            const ctx2 = await prepareCtx(ctx, data[index])
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
            return ctx.badRequest("You are not allowed to update this occurrence")
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
            return ctx.badRequest("You are not allowed to delete this occurrence")
         }

         const result = await super.delete(ctx)
         return result
      }
   }
})

async function prepareCtx(ctx, data) {
   if ("classes" in data && data.classes != []) {
      const classes = await prepareClasses(ctx, data)
      data.classes = classes
   }
   data.author = ctx.state.user.id
   ctx.request.body.data = [JSON.stringify(data)]
   return ctx
}

async function prepareClasses(ctx, data) {
   let classes = data.classes
   const createClasses = classes.filter(c => typeof (c) == "object")
   if (createClasses.length > 0) {
      const ctx2 = ctx
      ctx2.request.body.data = JSON.stringify(createClasses)
      let resp = await strapi.controller("api::class.class").create(ctx2)
      if (!(resp instanceof Array)) {
         resp = [resp]
      }
      resp = resp.map(r => r.data.id)
      classes = myConcate(classes, resp)
      return classes
   }
   return classes
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

async function verifyAuthor(ctx) {
   const author = ctx.state.user.id
   const { id } = ctx.request.params
   const entity = await strapi.entityService.findOne(uid, id, {
      ...ctx.query,
      populate: { author: true },
   });
   if (author == entity.id) {
      return true
   } else {
      return false
   }
}