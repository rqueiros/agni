'use strict';

/**
 * expositive controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

//module.exports = createCoreController('api::expositive.expositive');

const expositiveStructure = {
    name:true,
    type:true,
    file:true,
    milestones:true                  
};


const uid='api::expositive.expositive'

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
    async create(ctx){
      const result = []
      const files = ctx.request.files['files.file'] 
      const data = ctx.request.body["data"]
      if (Array.isArray(data)==true){
        for await (const index of Array(data.length).keys()){
          const ctx2=ctx
          ctx2.request.body.data=[data[index]]
          ctx2.request.files['files.file']=[files[index]]
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
        const result = await super.create(ctx)
        return result
      }
      
    }
  }
})