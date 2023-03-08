'use strict';

const StockModel = require("../models").Stock;

async function createStock(stock, like, ip) {
  const newStock = new StockModel({
    symbol: stock,
    likes: like==='true' ? [ip] : [],
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
    if (like=='true' && foundStock.likes.indexOf(ip) === -1) {
      foundStock.likes.push(ip);
    }
    saved = await foundStock.save();
    return saved;
  }
}

async function getStock(stock) {
  const response = await fetch(
    `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`
  );
  const { symbol, latestPrice } = await response.json();
  return {symbol,latestPrice};
}


module.exports = function (app) {

  app.route("/api/stock-prices").get(async function (req, res) {
    const { stock, like } = req.query;
    let oneStockData;
    if(Array.isArray(stock)){
      let obj1;
      let obj2;
      const { symbol:symbol1, latestPrice:latestPrice1 } = await getStock(stock[0]);
      if(!symbol1) {
        obj1={
          error: "external source error",
          rel_likes:like==='true' ? 1:0,
        }
      }
      else {
        oneStockData=await saveStock(stock[0],like,req.ip);
        obj1={
          stock:symbol1,
          price:latestPrice1,
          rel_likes:oneStockData.likes.length,
        }
      }
      const { symbol:symbol2, latestPrice:latestPrice2  } = await getStock(stock[1]);
      if(!symbol2) {
        obj2={
          error: "external source error",
          rel_likes:like==='true' ? 1:0,
        }
      }
      else {
          oneStockData=await saveStock(stock[1],like,req.ip);
          obj2={
          stock:symbol2,
          price:latestPrice2,
          rel_likes:oneStockData.likes.length,
        }
      }
    obj1.rel_likes=obj1.rel_likes-obj2.rel_likes;
    obj2.rel_likes=-obj1.rel_likes;
    res.json({stockData:[obj1,obj2]});
  }
  else {
    const { symbol, latestPrice } = await getStock(stock);
    if(!symbol) {
      res.json({stockData: {likes: like==='true' ? 1:0}});
      return;
    }

    oneStockData=await saveStock(stock,like,req.ip);
    res.json({
      stockData: {
        stock:symbol,
        price:latestPrice,
        likes:oneStockData.likes.length,
      }
    });
  }
  });
};
