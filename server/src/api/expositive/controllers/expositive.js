'use strict';

/**
 * expositive controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const fs = require('fs');


const expositiveJson = JSON.parse(fs.readFileSync("./src/api/data/content/expositive.json"))
const expositiveStructure = expositiveJson.expositiveStructure

const error = JSON.parse(fs.readFileSync("./src/api/data/error/error.json"))

const uid = 'api::expositive.expositive'


module.exports = createCoreController(uid, () => {
   return {
      async find(ctx) {
         const entity = await strapi.entityService.findMany(uid, {
            ...ctx.query,
            populate: expositiveStructure,
         })
         const sanitizedEntity = await this.sanitizeOutput(entity, ctx)
         return this.transformResponse(sanitizedEntity)

      },

      async findOne(ctx) {
         const { id } = ctx.request.params
         const entity = await strapi.entityService.findOne(uid, id, {
            ...ctx.query,
            populate: expositiveStructure,
         })
         const sanitizedEntity = await this.sanitizeOutput(entity, ctx)
         return this.transformResponse(sanitizedEntity)
      },

      async create(ctx) {
         const result = []
         const files = ctx.request.files['files.file']
         let data = JSON.parse(ctx.request.body.data)
         if (!checkFiles(files, data)) {
            return ctx.badRequest(error.fileError.message, error.fileError.details)
         }
         data = (Array.isArray(data) == false) ? [data] : data
         for await (const index of Array(data.length).keys()) {
            const ctx2 = prepareCtx(ctx, files, data[index])
            const r = await super.create(ctx2)
            result.push(r)
         }
         return (result.length == 1) ? result[0] : result
      },

      async update(ctx) {
         /*if (!verifyAuthor(ctx)){
           return ctx.unauthorized(`You can't update this entry`);
         }*/
         const result = await super.update(ctx)
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

function prepareCtx(ctx, files, data) {
   if ("file" in data) {
      files = (!(files instanceof Array)) ? [files] : files
      files = files.filter(f => f.name == data.file)
      ctx.request.files['files.file'] = files
   } else {
      ctx.request.files['files.file'] = []
   }
   delete data.file
   data.author = ctx.state.user.id
   ctx.request.body.data = JSON.stringify(data)
   return ctx
}

function checkFiles(files, data) {
   if (typeof (files) == "undefined") {
      files = []
   } else if (!(files instanceof Array)) {
      files = [files]
   }
   data = (!(data instanceof Array)) ? [data] : data
   files = files.map(i => i.name)
   data = data.filter(d => "file" in d).map(d => d.file)
   const verifyList = [...files.map(f => data.includes(f)), ...data.map(d => files.includes(d))]
   return (verifyList.includes(false)) ? false : true
}