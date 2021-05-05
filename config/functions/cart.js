const cartGamesIds = async (cart) => {
  return await cart.map((game) => ({
    id: game.id,
  }));
};

const cartItems = async (cart) => {
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
};

const totalInCents = async (games) => {
  const amount = games.reduce((acc, game) => {
    return acc + game.price;
  }, 0);

  // 518.39123 * 100 => 51839
  return Number((amount * 100).toFixed(0));
};

module.exports = {
  cartGamesIds,
  cartItems,
  totalInCents,
};
