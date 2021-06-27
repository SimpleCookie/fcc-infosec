'use strict';
const axios = require('axios');
const apiUrl = symbol => `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`

const likes = {}
const addLikes = stocks => {
  stocks.forEach(stock => {
    likes[stock] = likes[stock] ? likes[stock]++ : 1
  })
}
const notFound = "Not found"
module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async (req, res) => {
      const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
      console.log("ip", ip)
      const { stock, like } = req.query

      try {
        if (typeof stock === "string") {
          const { data } = await axios.get(apiUrl(stock))
          if (data === notFound) {
            res.send(notFound)
            return
          }
          if (like === "true") {
            addLikes([stock])
          }
          const stockData = { stock, price: data.latestPrice, likes: likes[stock] || 0 }
          console.log({ stockData })
          res.send({ stockData })
          return
        }

        const [stock1, stock2] = stock
        const result1 = await axios.get(apiUrl(stock1))
        if (result1.data === notFound) {
          res.send(`${stock1} not found`)
          return
        }
        const result2 = await axios.get(apiUrl(stock2))
        if (result2.data === notFound) {
          res.send(`${stock2} not found`)
          return
        }

        if (like === "true") addLikes([stock1, stock2])

        const stockData = [{
          stock: stock1,
          price: result1.data.latestPrice,
          rel_likes: likes[stock1] - likes[stock2] || 0
        },
        {
          stock: stock2,
          price: result2.data.latestPrice,
          rel_likes: likes[stock2] - likes[stock1] || 0
        }]
        console.log({ stockData })
        res.send({ stockData })
      } catch (error) {
        console.error(error)
      }
    });
};
