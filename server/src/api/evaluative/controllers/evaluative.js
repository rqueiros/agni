'use strict';

/**
 * evaluative controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

//module.exports = createCoreController('api::evaluative.evaluative');

const evaluativeStructure = {
    name:true,
    content:{
        populate:{
            questions:{
                populate:{
                    question:true,
                    image:true,
                    correctAnswer:true,
                    answers:true
                }
            },
            type:true,
            language:true,
            statement:true,
            contexts:true,
            skeleton:true,
            solution:true,
            tests:true
        }
    },
    statuses:{
        populate:{
            grade:true,
            code:true,
            start:true,
            end:true,
            student:true,
        }
    }
};

const uid='api::evaluative.evaluative'

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
      async create(ctx){
        const result = []
        const data = ctx.request.body["data"]
        if (Array.isArray(data)==true){
          for await (const index of Array(data.length).keys()){
            const ctx2=ctx
            ctx2.request.body.data=data[index]
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
