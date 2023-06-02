'use strict';

/**
 * question controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const fs = require('fs');


const questionJson = JSON.parse(fs.readFileSync("./src/api/data/content/question.json"))
const questionStructure = questionJson.questionStructure

const error = JSON.parse(fs.readFileSync("./src/api/data/error/error.json"))

const uid = 'api::question.question'


module.exports = createCoreController(uid, () => {
   return {
      async find(ctx) {
         const entity = await strapi.entityService.findMany(uid, {
            ...ctx.query,
            populate: questionStructure,
         })
         const sanitizedEntity = await this.sanitizeOutput(entity, ctx)
         return this.transformResponse(sanitizedEntity)
      },

      async findOne(ctx) {
         const { id } = ctx.request.params
         const entity = await strapi.entityService.findOne(uid, id, {
            ...ctx.query,
            populate: questionStructure,
         });
         const sanitizedEntity = await this.sanitizeOutput(entity, ctx)
         return this.transformResponse(sanitizedEntity)
      },

      async create(ctx) {
         const result = []
         const images = ctx.request.files['files.image']
         let data = JSON.parse(ctx.request.body.data)
         if (!checkImages(images, data)) {
            return ctx.badRequest(error.imageError.message, error.imageError.details)
         }
         data = (Array.isArray(data) == false) ? [data] : data
         for (const index of Array(data.length).keys()) {
            const ctx2 = prepareCtx(ctx, images, data[index])
            const r = await super.create(ctx2)
            result.push(r)
         }
         return (result.length == 1) ? result[0] : result
      },

      async update(ctx) {
         const { id } = ctx.request.params
         if (!(await verifyAuthor(ctx.state.user.id, id))) {
            return ctx.unauthorized(`No permission to delete this content`);
         }

         let data;
         try {
            data = JSON.parse(ctx.request.body.data)
         } catch (err) {
            data = ctx.request.body.data
         }

         let images = []
         if ("files" in ctx.request) {
            images = ctx.request.files['files.image']
            if (!checkFiles(images, data)) {
               return ctx.badRequest(error.fileError.message, error.fileError.details)
            }
         }
         
         const ctx2 = prepareCtx(ctx, images, data)
         let resp = await super.update(ctx2)
         return resp
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

async function verifyAuthor(authorId, contentId) {
   const entity = await strapi.entityService.findOne(uid, contentId, {
      populate: questionStructure,
   })
   if (entity.author != null && entity.author.id == authorId) {
      return true
   }
   return false
}

function prepareCtx(ctx, images, data) {
   if ("image" in data) {
      images = (!(images instanceof Array)) ? [images] : images
      images = images.filter(i => i.name == data.image)
      ctx.request.files['files.image'] = images
   } else if ("files" in ctx.request) {
      ctx.request.files['files.image'] = []
   }
   delete data.image
   data.author = ctx.state.user.id
   ctx.request.body = {data:data}
   return ctx
}

function checkImages(images, data) {
   if (typeof (images) == "undefined") {
      images = []
   } else if (!(images instanceof Array)) {
      images = [images]
   }
   data = (!(data instanceof Array)) ? [data] : data
   images = images.map(i => i.name)
   data = data.filter(d => "image" in d).map(d => d.image)
   const verifyList = [...images.map(i => data.includes(i)), ...data.map(d => images.includes(d))]
   return (verifyList.includes(false)) ? false : true
}



