'use strict';

/**
 * Read the documentation
 * (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  createPaymentIntent: async (ctx) => {
    const { cart } = ctx.request.body;

    // simplify cart data
    const cartGamesIds = await strapi.config.functions.cart.cartGamesIds(cart);

    // get all games
    const games = await strapi.config.functions.cart.cartItems(cartGamesIds);

    if (!games.length) {
      ctx.response.status = 404;

      return {
        error: 'No valid games found!',
      };
    }

    const totalInCents = await strapi.config.functions.cart.totalInCents(games);

    if (totalInCents === 0) {
      return {
        freeGames: true,
      };
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalInCents,
        currency: 'usd',
        metadata: { cart: JSON.stringify(cartGamesIds) },
      });

      return paymentIntent;
    } catch (err) {
      return {
        error: err.raw.message,
      };
    }
  },

  create: async (ctx) => {
    // pegar as informações do frontend
    const { cart, paymentIntentId, paymentMethod } = ctx.request.body;

    // pega o token
    const token = await strapi.plugins['users-permissions'].services.jwt.getToken(
      ctx,
    );

    // pegar o usuário
    const userId = token.id;

    // pegar as informações do usuário
    const userInfo = await strapi.query('user', 'users-permissions').
      findOne({ id: userId });

    // simplify cart data
    const cartGamesIds = await strapi.config.functions.cart.cartGamesIds(cart);

    // pegar os jogos
    const games = await strapi.config.functions.cart.cartItems(cartGamesIds);

    // pegar o total (saber se é free ou não)
    const totalInCents = await strapi.config.functions.cart.totalInCents(games);

    // pegar o paymentIntentId
    // pegar as informações do pagamento (paymentMethod)
    // salvar no banco
    const entry = {
      total_in_cents: totalInCents,
      payment_intent_id: paymentIntentId,
      card_brand: null,
      card_last4: null,
      user: userInfo,
      games,
    };

    const entity = await strapi.services.order.create(entry);

    // enviar um email da compra para o usuário

    // retornando que foi salvo no banco
    return sanitizeEntity(entity, { model: strapi.models.order });
  },
};
