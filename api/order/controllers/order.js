'use strict';

/**
 * Read the documentation
 * (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = {
  createPaymentIntent: async (ctx) => {
    const { cart } = ctx.request.body;

    let games = [];

    await Promise.all(
      cart?.map(async (game) => {
        const validateGame = await strapi.services.game.findOne({
          id: game.id,
        });

        if (validateGame) {
          games.push(validateGame);
        }
      }),
    );

    if (!games.length) {
      ctx.response.status = 404;

      return {
        error: 'No valid games found!',
      };
    }

    const total = games.reduce((acc, game) => {
      return acc + game.price;
    }, 0);

    if (total === 0) {
      return {
        freeGames: true,
      };
    }

    return { total_in_cents: total * 100, games };
  },
};
