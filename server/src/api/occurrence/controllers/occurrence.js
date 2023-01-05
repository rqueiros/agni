'use strict';

/**
 * occurrence controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

//module.exports = createCoreController('api::occurrence.occurrence');

const courseStructure = {
    courses: {
        populate:{
            name:true,
            type:true,
            goals:true,
            modules:{
                populate:{
                    name:true,
                    lessons:{
                        populate:{
                            name:true,
                            description:true,
                            expositives:{
                                populate:{
                                    name:true,
                                    type:true,
                                    file:true,
                                    milestones:true
                                }
                            },
                            evaluatives:{
                                populate:{
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
                                            instruction:true,
                                            instructionFiles:true,
                                            skeleton:true,
                                            solution:true,
                                            tests:true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
        }
    }
};

const uid='api::occurrence.occurrence'

module.exports = createCoreController(uid, () => {
    return {
      async find(ctx) {
        // to show course
        if (ctx.query.populate === 'course') {
            const entity = await strapi.entityService.findMany(uid, {
              ...ctx.query,
              populate: courseStructure,
            })
            const sanitizedEntity = await this.sanitizeOutput(entity, ctx)
    
            return this.transformResponse(sanitizedEntity)
          }

        // maintain default functionality for all other request
        return super.find(ctx)
      },
      async findOne(ctx) {
  
        const { id } = ctx.request.params
  
        return super.findOne(ctx)
      },
    }
  })
