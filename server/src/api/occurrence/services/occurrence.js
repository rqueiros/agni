'use strict';

/**
 * occurrence service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::occurrence.occurrence');
