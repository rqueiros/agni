'use strict';

/**
 * concept-mastery controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

const P_L0 = 0.25;   // initial mastery if new
const T = 0.10;      // learning probability per attempt
const G = 0.2;       // guess probability
const S = 0.25;      // slip probability

module.exports = createCoreController('api::concept-mastery.concept-mastery', ({ strapi }) => ({
    async create(ctx) {
        const { user, evaluative: evaluativeId, grade } = ctx.request.body;

        if (!user || !evaluativeId) {
            return ctx.badRequest('user, evaluative, and grade are required');
        }

        const isCorrect = grade == 1;

        const evaluative = await strapi.entityService.findOne('api::evaluative.evaluative', evaluativeId, {
            populate: {
                conceptTags: true
            }
        });
            
        const conceptIds = evaluative.conceptTags.map(concept => concept.id);

        if (!conceptIds.length) {
            return ctx.badRequest('Evaluative has no related concepts');
        }

        const student = await strapi.db.query('api::student.student').findOne({
            where: { user: user }
        });

        if (!student) {
            return ctx.badRequest('Student not found for user');
        }
        
        for (const id of conceptIds) {
            const curMastery = await strapi.db.query('api::concept-mastery.concept-mastery').findOne({
                where: ({
                    student: student.id,
                    concept: id
                })
            });

            if (curMastery) {
                const oldMastery = curMastery.mastery;
                const newMastery = updateBKT(oldMastery, isCorrect);
                await strapi.entityService.update('api::concept-mastery.concept-mastery',
                    curMastery.id,
                    {
                        data: {
                            mastery: newMastery
                        }
                    }
                )
            } else {
                const initial = P_L0;
                const newMastery = updateBKT(initial, isCorrect);
                await strapi.entityService.create('api::concept-mastery.concept-mastery',
                    {
                        data: {
                            mastery: newMastery,
                            student: student.id,
                            concept: id
                        }
                    }
                )
            }
        }

        return ctx.send({ message: 'Concept mastery updated successfully' });
    }
}));


function updateBKT(oldMastery, isCorrect) {
    let posterior;

    if (isCorrect) {
        posterior =
            (oldMastery * (1 - S)) /
            (oldMastery * (1 - S) + (1 - oldMastery) * G);
    } else {
        posterior =
            (oldMastery * S) /
            (oldMastery * S + (1 - oldMastery) * (1 - G));
    }

    // learning transition
    const newMastery =
        posterior + (1 - posterior) * T;

    return newMastery;
}
