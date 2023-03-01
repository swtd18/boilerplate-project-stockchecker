'use strict';

async function saveStock() {
  
}

module.exports = function (app) {

  app.route("/api/stock-prices").get(async function (req, res) {
    const { stock, like } = req.query;
    const response = await fetch(
      `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`
    );
    const { symbol, latestPrice } = await response.json();
    if(!symbol) {
      res.json({stockData: {likes: like ? true:false}});
      return;
    }
    res.json({
      stockData: {
        stock:symbol,
        price:latestPrice,
        likes:12,
      }
    });
  });
};
