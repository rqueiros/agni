'use strict';

/**
 * import controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

//module.exports = createCoreController('api::import.import');


const uid='api::import.import'

module.exports = createCoreController(uid, () => {
  return {
    async update(ctx){
        console.log(111)
        //const result = await super.update(ctx)
        console.log(result)
        return null
    },
    async find(ctx){
        console.log(111)
        const result = await super.find(ctx)
        console.log(result)
        return result
    }
  }
})
