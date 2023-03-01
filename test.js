const express = require('express');
const app = express();

app.get('/',async function(req,res) {
  const response = await fetch(
    `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`
  );
  const { symbol, latestPrice } = await response.json();
  if(!symbol) {
    console.log(like);
    res.json({stockData: {likes:like ? 1:0}});
    return;
  }
  res.json({
    stockData:{
      stock:"",
      price:1,
      likes:1,
    }
  });
  console.log(res.json());
});
 
var like=true;
var res={
  stockData:{
    stock:"21",
    price:1,
    likes:like ? 1:0,
  }
};
console.log(res);
//getStock("goog");

