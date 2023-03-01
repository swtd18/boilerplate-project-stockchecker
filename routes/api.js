'use strict';

const StockModel = require("../models").Stock;
const fetch = require("node-fetch");

async function createStock(stock, like, ip) {
  const newStock = new StockModel({
    symbol: stock,
    likes: like ? [ip] : [],
  });
  const savedNew = await newStock.save();
  return savedNew;
}

async function findStock(stock) {
  return await StockModel.findOne({ symbol: stock }).exec();
}

async function saveStock(stock, like, ip) {
  let saved = {};
  const foundStock = await findStock(stock);
  if (!foundStock) {
    const createsaved = await createStock(stock, like, ip);
    return createsaved;
  } else {
    if (like && foundStock.likes.indexOf(ip) === -1) {
      foundStock.likes.push(ip);
    }
    saved = await foundStock.save();
    return saved;
  }
}


module.exports = function (app) {

  app.route("/api/stock-prices").get(async function (req, res) {
    const { stock, like } = req.query;
    const response = await fetch(
      `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`
    );
    const { symbol, latestPrice } = await response.json();
    if(!symbol) {
      res.json({stockData: {likes: like ? 1:0}});
      return;
    }

    const oneStockData=await saveStock(stock,like,req.ip);
    console.log(oneStockData);
    console.log(req.ip);
    res.json({
      stockData: {
        stock:symbol,
        price:latestPrice,
        likes:oneStockData.likes.length,
      }
    });
  });
};
