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
            const ctx2 = await prepareCtx(ctx, images, data[key])
            const r = await super.create(ctx2)
            result.push(r)
         }
         return (result.length == 1) ? result[0] : result
      },

      async update(ctx) {
         /*if (!verifyAuthor(ctx)){
           return ctx.unauthorized(`You can't update this entry`);
         }*/
         const data = JSON.parse(ctx.request.body["data"])
         const images = ctx.request.files["files.image"]
         if (!checkImages(images, data)) {
            return ctx.badRequest(error.imageError.message, error.imageError.details)
         }
         const ctx2 = await prepareCtx(ctx, images, data)
         const result = await super.update(ctx2)
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

async function prepareCtx(ctx, images, data) {
   if ("content" in data && data.content[0]["__component"] == "base.quiz") {
      let questions = data.content[0].questions
      data.content[0].questions = await prepareQuestions(ctx, images, questions)
   }
   ctx.request.files['files.image'] = []
   data.author = ctx.state.user.id
   ctx.request.body.data = JSON.stringify(data)
   return ctx
}

async function prepareQuestions(ctx, images, questions){
   if (typeof (questions) == "undefined") {
      questions = []
   } else if (!(questions instanceof Array)) {
      questions = [questions]
   }
   const createQuestions = questions.filter(q => typeof (q) == "object")
   if (createQuestions != []) {
      const ctx2 = prepareQuestionCtx(ctx, images, createQuestions)
      let resp = await strapi.controller("api::question.question").create(ctx2)
      resp = (!(resp instanceof Array)) ? [resp] : resp
      resp = resp.map(r => r.data.id)
      questions = myConcate(questions, resp)
   }
   return questions
}

function prepareQuestionCtx(ctx, images, data) {
   if (typeof (images) == "undefined") {
      images = []
   } else if (!(images instanceof Array)) {
      images = [images]
   }
   const imageNames = data.filter(d => "image" in d).map(d => d.image)
   images = images.filter(i => imageNames.includes(i.name))
   ctx.request.files['files.image'] = images
   ctx.request.body.data = JSON.stringify(data)
   return ctx
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
