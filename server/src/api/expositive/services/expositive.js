'use strict';

/**
 * expositive service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::expositive.expositive');
