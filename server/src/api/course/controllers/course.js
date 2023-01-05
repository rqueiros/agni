'use strict';

/**
 * course controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

//module.exports = createCoreController('api::course.course');

const courseStructure = {
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
                                    statement:true,
                                    contexts:true,
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
};

const uid='api::course.course'

module.exports = createCoreController(uid, () => {
    return {
        async find(ctx) {        
            const entity = await strapi.entityService.findMany(uid, {
            ...ctx.query,
            populate: courseStructure,
            })
            const sanitizedEntity = await this.sanitizeOutput(entity, ctx)

            return this.transformResponse(sanitizedEntity)
        
        },
        async findOne(ctx) {

            const { id } = ctx.request.params

            const entity = await strapi.entityService.findOne(uid, id, {
            ...ctx.query,
            populate: courseStructure,
            })
            const sanitizedEntity = await this.sanitizeOutput(entity, ctx)

            return this.transformResponse(sanitizedEntity)
        },
        async create(ctx){
            /*const data = ctx.request.body["data"]
            
            console.log(ctx.apply)
            const func=ctx.is
            if (Array.isArray(data)==true){
                for await (const index of Array(data.length).keys()){
                    const ctx2 = ctx
                    const course = data[index]
                    console.log(1)
                    for await (const indexMo of Array(course.modules.length).keys()){
                        console.log(2)
                        for await (const indexLe of Array(course.modules[indexMo].lessons.length).keys()){
                            console.log(3)
                            const evaluatives = course.modules[indexMo].lessons[indexLe].evaluatives
                            const evaluativesID = []
                            for await (const indexEV of Array(evaluatives.length).keys()){
                                console.log(4)
                                const evaluative = evaluatives[indexEV]
                                if (Number.isInteger(evaluative)){
                                    evaluativesID.push(evaluative)
                                } else {
                                    let l=createCoreController("api::evaluative.evaluative",() => {
                                        return super.create(ctx)
                                    })
                                    console.log(l(ctx))
                                    const ctxEv = ctx
                                    ctxEv.request.body.data = evaluative
                                    let data= {name:"name1"}
                                    let url="http://localhost:1337/api/evaluatives"
                                    let fetchData = {
                                        method:"POST",
                                        headers:{
                                            "content-Type":"application/json",
                                        },
                                        body: JSON.stringify(data),
                                    }
                                    fetch(url, fetchData)
                                        .then((response) => { 
                                            response.json().then((data) => {
                                                console.log(data)
                                        })
                                        }).catch((err) => {
                                            console.log(err);
                                    });
                                    
                                    ctxEv.request.body.data=evaluative
                                    //const r = await super.create(ctxMeu)
                                    //console.log(r)
                                    //console.log(r.id)
                                    //evaluativesID.push(r.id)
                                }
                            }
                        }
                    }
                    console.log("course: ",course)
                    console.log("ctx: ",ctx)
                }
            }
            return null*/
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