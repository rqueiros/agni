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
         let data = JSON.parse(JSON.stringify(ctx.request.body.data))
         console.log(data)
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
         const data = JSON.parse(JSON.stringify(ctx.request.body.data))

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
   ctx.request.body = {data:data}
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
            ctx2.request.body = {data:student}
            resp = await strapi.controller("api::student.student").create(ctx2)
         } else if (type=="update"){
            let id = student.id
            delete student.id
            let ctx2 = ctx
            ctx2.request.body = {data:student}
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