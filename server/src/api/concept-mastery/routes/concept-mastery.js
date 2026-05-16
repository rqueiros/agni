'use strict';

/**
 * concept-mastery router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/concept-masteries',
      handler: 'concept-mastery.create',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};