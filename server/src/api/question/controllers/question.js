'use strict';

/**
 * question controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

//module.exports = createCoreController('api::question.question');

const questionStructure = {
    question:true,
    image:true,
    correctAnswer:true,
    answers:true                  
};


const uid='api::question.question'

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
      })
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx)

      return this.transformResponse(sanitizedEntity)
    },
    async create(ctx){
      const result = []
      const files = ctx.request.files['files.image'] 
      const data = ctx.request.body["data"]
      //console.log(files[0].name)
      if (Array.isArray(data)==true){
        for await (const index of Array(data.length).keys()){
          const ctx2=ctx
          const d = JSON.parse(data[index])
          const image = d.image
          ctx2.request.files['files.image']=[]
          for await (const i of Array(files.length).keys())
            if (files[i].name==image){
                ctx2.request.files['files.image']=[files[i]]
                break
            }
          delete d.image
          ctx2.request.body.data=[JSON.stringify(d)]
          try{
            const r = await super.create(ctx2)
            result.push(r)
          }
          catch(error){
            console.log(error)
          }
        }    
        return result
      } else {
        const d = JSON.parse(data)
        delete d.image
        ctx.request.body.data=[JSON.stringify(d)]
        const result = await super.create(ctx)
        return result
      }
    }
  }
})
