'use strict';

/**
 * status controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { createDiffieHellmanGroup } = require('crypto');
const fs = require('fs');


const statusJson = JSON.parse(fs.readFileSync("./src/api/data/content/status.json"))

const uid = 'api::status.status'

module.exports = createCoreController(uid, () => {
   return {
      
      async find(ctx) {
         let entity = await strapi.entityService.findMany(uid, {
            ...ctx.query,
            populate: statusJson.statusStructure,
         })
         const sanitizedEntity = await this.sanitizeOutput(entity, ctx)
         return this.transformResponse(sanitizedEntity)
      },

      async findOne(ctx) {
         const { id } = ctx.request.params
         const entity = await strapi.entityService.findOne(uid, id, {
            ...ctx.query,
            populate: statusJson.statusStructure,
         });
         const sanitizedEntity = await this.sanitizeOutput(entity, ctx)
         return this.transformResponse(sanitizedEntity)
      },

      async create(ctx) {
         let result = []
         let data = JSON.parse(ctx.request.body.data)
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

      /*
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
      }*/
   }
})

function prepareCtx(ctx, data) {
   ctx.request.body.data = JSON.stringify(data)
   return ctx
}