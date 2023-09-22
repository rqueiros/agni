'use strict';

/**
 * A set of functions called "actions" for `content`
 */

module.exports = {
  async find(ctx, next) {
    try {
      const populate = ctx.query.populate
      let data 
      if (typeof (populate) == "string" && populate == "newContents"){
        data = await strapi
          .service("api::content.content")
          .getNewContents();
      } else {
        data = await strapi
          .service("api::content.content")
          .get(ctx.query);
      }
      ctx.body = data;
    } catch (err) {
      ctx.badRequest("Post report controller error", { moreDetails: err });
    }
  },
  async sendEmail(ctx, next) {
    try {
      let data = ctx.request.body.data
      let data2 = await strapi
          .service("api::content.content")
          .sendEmail(data);
      ctx.body = data2
    } catch (err) {
      ctx.badRequest("Post report controller error", { moreDetails: err });
    }
  }
};
