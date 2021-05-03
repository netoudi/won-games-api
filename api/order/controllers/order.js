'use strict';

/**
 * Read the documentation
 * (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

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

    return games;
  },
};
