'use strict';

/**
 * Read the documentation
 * (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  async create(ctx) {
    const token = await strapi.plugins['users-permissions'].services.jwt.getToken(ctx);

    const body = {
      ...ctx.request.body,
      user: token.id,
    };

    const entity = await strapi.services.wishlist.create(body);

    return sanitizeEntity(entity, { model: strapi.models.wishlist });
  },
};