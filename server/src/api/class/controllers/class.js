'use strict';

/**
 * class controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

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
         const entity = await strapi.entityService.findOne(uid, id, {
            ...ctx.query,
            populate: { author: true },
         });
         if (ctx.state.user.id != entity.author.id) {
            return ctx.badRequest("You are not allowed to see this class")
         }
         const sanitizedEntity = await this.sanitizeOutput(entity, ctx)
         return this.transformResponse(sanitizedEntity)
      },

      async create(ctx) {
         const result = []
         let data = JSON.parse(ctx.request.body["data"])
         data = (Array.isArray(data) == false) ? [data] : data
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
            return ctx.badRequest("You are not allowed to update this class")
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
            return ctx.badRequest("You are not allowed to delete this class")
         }

         const result = await super.delete(ctx)
         return result
      }
   }
})

async function prepareCtx(ctx, data) {
   if ("students" in data && data.students != []) {
      const students = await prepareStudents(ctx, data)
      data.students = students
   }
   data.author = ctx.state.user.id
   ctx.request.body.data = [JSON.stringify(data)]
   return ctx
}

async function prepareStudents(ctx, data) {
   let students = data.students
   const createStudents = students.filter(s => typeof (s) == "object")
   if (createStudents.length > 0) {
      const ctx2 = ctx
      ctx2.request.body.data = JSON.stringify(createStudents)
      let resp = await strapi.controller("api::student.student").create(ctx2)
      if (!(resp instanceof Array)) {
         resp = [resp]
      }
      resp = resp.map(r => r.data.id)
      students = myConcate(students, resp)
      return students
   }
   return students
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