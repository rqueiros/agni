'use strict';

/**
 * A set of functions called "actions" for `iaedu`
 */

module.exports = {
  async getHandler(ctx) {
    const { id } = ctx.query;

    if (!id) {
      return ctx.badRequest("id missing");
    }

    const user = await strapi.entityService.findOne('plugin::users-permissions.user', id, {
      populate: {
        aiProvider: true,
        aiModel: true,
      }
    });

    if (!user) {
      return ctx.badRequest("User not found");
    }

    const aiProviders = { "google": ["gemini-3-flash-preview"], "groq": ["openai/gpt-oss-120b"], "iaedu": ["GPT-4o"] };
    
    const provider = user.aiProvider;
    const model = user.aiModel;

    ctx.body = { provider, model, aiProviders };
  },

  async updateHandler(ctx) {
    const body = ctx.request.body;

    if (!body.id || !body.provider || !body.apiKey || !body.model) {
      return ctx.badRequest("Request body missing")
    }

    await strapi.entityService.update('plugin::users-permissions.user', body.id, {
      data: {
        aiProvider: body.provider,
        aiApiKey: body.apiKey,
        aiModel: body.model
      }
    });

    ctx.body = { ok: true };
  },

  async getHintHandler(ctx) {
    const { description, code, courseID } = ctx.query;

     if (!courseID || !description || !code) {
      return ctx.badRequest('Request params missing');
    }

    const course = await strapi.entityService.findOne('api::course.course', courseID, {
      populate: {
        author: true
      }
    });

    const user = await strapi.entityService.findOne('plugin::users-permissions.user', course.author.id, {
      populate: {
        aiProvider: true,
        aiApiKey: true
      }
    });

    if (!user) {
      return ctx.badRequest("Course author not found");
    }

    const provider = user.aiProvider;
    const apiKey = user.aiApiKey;
    const model = user.aiModel;

    const cleanDescription = stripHtml(description);

    const result = await strapi.service('api::ai-manager.ai-manager').genHint(provider, apiKey, model, cleanDescription, code);

    ctx.body = { hint: result };
  }
};

function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, ' ');
}

