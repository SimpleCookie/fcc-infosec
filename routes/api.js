'use strict';
const axios = require('axios');
const { addLike, getLikesByStock } = require("../service/db")
const apiUrl = symbol => `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`

const byIp = _ip => it => it.ip === _ip
const notFound = "Not found"
module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async (req, res) => {
      const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
      const { stock, like } = req.query

      try {
        if (typeof stock === "string") {
          const { data } = await axios.get(apiUrl(stock))
          if (data === notFound) {
            res.send(notFound)
            return
          }
          const likes = (await getLikesByStock(stock)).filter(byIp(ip))
          if (like === "true") {
            if (likes.length < 1) await addLike({ ip, stock })
          }
          const newLikes = (await getLikesByStock(stock)).filter(byIp(ip))
          const stockData = { stock, price: data.latestPrice, likes: newLikes.length }
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

        const likes1 = (await getLikesByStock(stock1)).filter(byIp(ip))
        const likes2 = (await getLikesByStock(stock2)).filter(byIp(ip))
        if (like === "true") {
          if (likes1.length < 1) {
            await addLike({ ip, stock1 })
          }
          if (likes2.length < 1) {
            await addLike({ ip, stock2 })
          }
        }
        const newLikes1 = (await getLikesByStock(stock1)).filter(byIp(ip))
        const newLikes2 = (await getLikesByStock(stock2)).filter(byIp(ip))

        const stockData = [{
          stock: stock1,
          price: result1.data.latestPrice,
          rel_likes: newLikes1.length - newLikes2.length
        },
        {
          stock: stock2,
          price: result2.data.latestPrice,
          rel_likes: newLikes2.length - newLikes1.length
        }]
        res.send({ stockData })
      } catch (error) {
        console.error(error)
      }
    });
};
