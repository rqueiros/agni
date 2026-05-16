'use strict';

/**
 * A set of functions called "actions" for `concept-manager`
 */

module.exports = {
  async createHandler(ctx) {
    const body = ctx.request.body;

    if (!body.id || !body.collectionType || !body.userId || !body.mode) {
      return ctx.badRequest('Request body missing');
    }

    const user = await strapi.entityService.findOne('plugin::users-permissions.user', body.userId, {
      populate: {
        aiProvider: true,
        aiApiKey: true
      }
    });

    if (!user) {
      return ctx.badRequest("User not found");
    }

    const provider = user.aiProvider;
    const apiKey = user.aiApiKey;
    const model = user.aiModel;
    
    if (body.collectionType == "courses") {
      const result = await strapi.service('api::concept-manager.concept-manager').generateGraph(body.id, provider, apiKey, model, body.mode);
      ctx.body = { ok: result };
      return;
    } 

    if (body.collectionType == "expositives") {
      const result = await strapi.service('api::concept-manager.concept-manager').generateExpositiveConcepts(body.id, provider, apiKey, model, body.mode);
      ctx.body = { ok: result };
      return;
    }

    if (body.collectionType == "evaluatives") {
      const result = await strapi.service('api::concept-manager.concept-manager').generateEvaluativeConcepts(body.id, provider, apiKey, model, body.mode);
      ctx.body = { ok: result };
      return;
    }
  },

  async updateHandler(ctx) {
    const body = ctx.request.body;

    if (!body.id || !body.collectionType || (!body.edges && !body.concepts && !body.label && !body.nodes)) {
      return ctx.badRequest('Request body missing');
    }

    if (body.collectionType == "courses") {
      const result = await strapi.service('api::concept-manager.concept-manager').updateGraph(body.id, body.edges, body.nodes);
      ctx.body = { ok: result };
      return;
    }

    if (body.collectionType == "evaluatives") {
      const result = await strapi.service('api::concept-manager.concept-manager').updateEvaluativeConcepts(body.id, body.concepts);
      ctx.body = { ok: result };
      return;
    }

    if (body.collectionType == "expositives") {
      const result = await strapi.service('api::concept-manager.concept-manager').updateExpositiveConcepts(body.id, body.concepts);
      ctx.body = { ok: result };
      return;
    }
    
    if (body.collectionType == "concepts") {
      const result = await strapi.service('api::concept-manager.concept-manager').updateConcepts(body.id, body.label);
      ctx.body = { ok: result };
      return;
    }
  },

  async deleteHandler(ctx) {
    const body = ctx.request.body;

    if (!body.id) {
      return ctx.badRequest('Request body missing');
    }

    const result = await strapi.service('api::concept-manager.concept-manager').deleteGraph(body.id);
    ctx.body = { ok: result };
  },

  async deleteConceptHandler(ctx) {
    const body = ctx.request.body;

    if (!body.id) {
      return ctx.badRequest('Request body missing');
    }

    const result = await strapi.service('api::concept-manager.concept-manager').deleteConcept(body.id);
    ctx.body = { ok: result };
  },

  async getHandler(ctx) {
    const { id, collectionType } = ctx.query;    

    if (!id || !collectionType) {
      return ctx.badRequest('Request body missing');
    }

    if (collectionType === "evaluatives") {
      const result = await strapi.service('api::concept-manager.concept-manager').getEvaluativeConcepts(id);
      ctx.body = { concepts: result }
      return;
    }

    if (collectionType === "expositives") {
      const result = await strapi.service('api::concept-manager.concept-manager').getExpositiveConcepts(id);
      ctx.body = { concepts: result };
    }
  },
  async getAllHandler(ctx) {
    const result = await strapi.db.query('api::concept.concept').findMany();
    ctx.body = { concepts: result };
  },
  async createConceptHandler(ctx) {
    const body = ctx.request.body;

    if (!body.label) {
      return ctx.badRequest('Request body missing');
    }

    let concept = await strapi.db
      .query('api::concept.concept')
      .findOne({ where: { label: body.label } });

    if (concept) {
      return ctx.badRequest('Concept already exists');
    }

    concept = await strapi.db
        .query('api::concept.concept')
        .create({ data: { label: body.label } });
    
    ctx.body = { ok: true }
  },
  async getCourseHandler(ctx) {
    const { id } = ctx.query;    

    if (!id) {
      return ctx.badRequest('Id missing');
    }

    const result = await strapi.service('api::concept-manager.concept-manager').getCourseMaterialConcepts(id);
    ctx.body = { concepts: result }
  }
};
