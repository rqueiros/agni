'use strict';

/**
 * evaluative controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const fs = require('fs');

const evaluativeJson = JSON.parse(fs.readFileSync("./src/api/data/content/evaluative.json"))
const evaluativeStructure = evaluativeJson.evaluativeStructure
const error = JSON.parse(fs.readFileSync("./src/api/data/error/error.json"))

const uid = 'api::evaluative.evaluative'

module.exports = createCoreController(uid, () => {
   return {
      async find(ctx) {
         const entity = await strapi.entityService.findMany(uid, {
            ...ctx.query,
            populate: evaluativeStructure,
         })
         const sanitizedEntity = await this.sanitizeOutput(entity, ctx)
         return this.transformResponse(sanitizedEntity)
      },

      async findOne(ctx) {
         const { id } = ctx.request.params
         const entity = await strapi.entityService.findOne(uid, id, {
            ...ctx.query,
            populate: evaluativeStructure,
         })
         const sanitizedEntity = await this.sanitizeOutput(entity, ctx)
         return this.transformResponse(sanitizedEntity)
      },

      async create(ctx) {
         const result = []
         let data = JSON.parse(ctx.request.body["data"])
         const images = ctx.request.files["files.image"]
         if (!checkImages(images, data)) {
            return ctx.badRequest(error.imageError.message, error.imageError.details)
         }
         if (!checkTests(data)) {
            return ctx.badRequest(error.testError.message, error.testError.details)
         }
         data = (Array.isArray(data) == false) ? [data] : data
         for (const key of Array(data.length).keys()) {
            const ctx2 = await prepareCtx(ctx, images, data[key], "create")
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
            images = ctx.request.files["files.image"]
            if (!checkImages(images, data)) {
               return ctx.badRequest(error.imageError.message, error.imageError.details)
            }
         }
         
         let ctx2 = await prepareCtx(ctx, images, data, "update")
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
      populate: evaluativeStructure,
   })
   if (entity.author != null && entity.author.id == authorId) {
      return true
   }
   return false
}

async function prepareCtx(ctx, images, data, type) {
   let parm = ctx.params
   if ("content" in data && data.content[0]["__component"] == "base.quiz") {
      let questions = data.content[0].questions
      data.content[0].questions = await prepareQuestions(ctx, images, questions, type)
   }
   if ("files" in ctx.request){
      ctx.request.files['files.image'] = []
   }
   data.author = ctx.state.user.id
   ctx.params = parm
   ctx.request.body = { data: data }
   return ctx
}

async function prepareQuestions(ctx, images, questions, type){
   if (typeof (questions) == "undefined") {
      questions = []
   } else if (!(questions instanceof Array)) {
      questions = [questions]
   }
   let newQuestions = []
   for (let question of questions){
      if (typeof(question) != "object"){
         newQuestions.push(question)
      } else {
         let resp;
         if (question.new || type=="create"){
            delete question.new
            const ctx2 = prepareQuestionCtx(ctx, images, question)
            resp = await strapi.controller("api::question.question").create(ctx2)
         } else if (type=="update") {
            let id = question.id
            delete question.id
            let ctx2 = prepareQuestionCtx(ctx, images, question)
            ctx2.request.params = {id:JSON.stringify(id)}
            ctx2.params = {id:JSON.stringify(id)}
            resp = await strapi.controller("api::question.question").update(ctx2)
         }
         newQuestions.push(resp.data.id)
      }
   }
   return newQuestions
}

function prepareQuestionCtx(ctx, images, data) {
   /*
   if (typeof (images) == "undefined") {
      images = []
   } else if (!(images instanceof Array)) {
      images = [images]
   }
   if("image" in data){
      images = images.filter(i => imageNames.includes(i.name))
   }
   if("files" in ctx.request){
      ctx.request.files['files.image'] = images
   }*/
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
   data = Array.prototype.concat.apply([], data.filter(d => "content" in d).filter(d => d.content[0]["__component"] == "base.quiz").map(d => d.content[0].questions.filter(q => typeof (q) == "object").filter(q => "image" in q).map(q => q.image)))
   const verifyList = [...images.map(i => data.includes(i)), ...data.map(d => images.includes(d))]
   return (verifyList.includes(false)) ? false : true
}

function checkTests(data) {
   data = (!(data instanceof Array)) ? [data] : data
   const tests = data.filter(d => d.content[0]["__component"] == "base.programming-exercise").flatMap(e => e.content[0].tests)
   for (const key of Array(tests.length).keys()) {
      const test = tests[key]
      if (!(test.type == "log" && !("subtype" in test) ||
         test.type == "expression" && !("subtype" in test) ||
         test.type == "expression" && test.subtype == "error" ||
         test.type == "metric" && test.subtype == "occurrences" ||
         test.type == "metric" && test.subtype == "lines" ||
         test.type == "function" && !("subtype" in test))) {
         return false
      }
   }
   return true
}
