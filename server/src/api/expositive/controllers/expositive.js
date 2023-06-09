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
         let data = (typeof(ctx.request.body.data)=="string") ? JSON.parse(ctx.request.body.data) : ctx.request.body.data

         if (data.publishedAt == null && "publishedAt" in data) {
            data.author = ctx.state.user.id
            const course = await strapi.db.query("api::expositive.expositive").create({
               data: data
            });
            return course;
         }

         const result = []
         let files = []
         if ("files" in ctx.request) {
            files = ctx.request.files['files.file']
         }
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
         const { id } = ctx.request.params
         if (!(await verifyAuthor(ctx.state.user.id, id))) {
            return ctx.unauthorized(`No permission to delete this content`);
         }

         let data = (typeof(ctx.request.body.data)=="string") ? JSON.parse(ctx.request.body.data) : ctx.request.body.data

         let files = []
         
         if ("files" in ctx.request) {
            files = ctx.request.files['files.file']
            if (!checkFiles(files, data)) {
               return ctx.badRequest(error.fileError.message, error.fileError.details)
            }
         }

         const ctx2 = prepareCtx(ctx, files, data)
         let resp = await super.update(ctx2)
         return resp
      },

      async delete(ctx) {
         const { id } = ctx.request.params
         const permission = await verifyAuthor(ctx.state.user.id, id)
         if (!permission) {
            return ctx.unauthorized(`No permission to delete this content`);
         }
         const result = await super.delete(ctx)
         return result
      },
   }
})

async function verifyAuthor(authorId, contentId) {
   const entity = await strapi.entityService.findOne(uid, contentId, {
      populate: expositiveStructure,
   })
   if (entity.author != null && entity.author.id == authorId) {
      return true
   }
   return false
}

function prepareCtx(ctx, files, data) {
   if ("file" in data && typeof(data.file)=="string") {   
      files = (!(files instanceof Array)) ? [files] : files
      files = files.filter(f => f.name == data.file)
      ctx.request.files['files.file'] = files
      delete data.file
   } else if ("files" in ctx.request) {
      ctx.request.files['files.file'] = []
   }
   data.author = ctx.state.user.id
   ctx.request.body = { data: JSON.stringify(data) }
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
   data = data.filter(d => "file" in d).map(d => d.file).filter(f => typeof(f)=="string")
   const verifyList = [...files.map(f => data.includes(f)), ...data.map(d => files.includes(d))]
   return (verifyList.includes(false)) ? false : true
}