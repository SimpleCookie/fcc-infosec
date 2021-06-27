const chaiHttp = require('chai-http')
const chai = require('chai')
const assert = chai.assert
const server = require('../server')
const { expect } = require('chai')
const url = "/api/stock-prices"

chai.use(chaiHttp)

suite('Functional Tests', () => {
  let amountLikes = 0
  it("Viewing one stock", async () => {
    const res = await chai.request(server).get(url).query({ stock: "TSLA" })
    assert.strictEqual(res.status, 200)
    assert.isString(res.body.stockData.stock)
    assert.isNumber(res.body.stockData.price)
    assert.isNumber(res.body.stockData.likes)
  })
  it("Viewing one stock and liking it", async () => {
    const res = await chai.request(server).get(url).query({ stock: "TSLA", like: true })
    assert.strictEqual(res.status, 200)
    assert.isString(res.body.stockData.stock)
    assert.isNumber(res.body.stockData.price)
    assert.isNumber(res.body.stockData.likes)
    assert.strictEqual(res.body.stockData.stock, "TSLA")
    assert.strictEqual(res.body.stockData.likes, 1)
    amountLikes = res.body.stockData.likes
  })
  it("Viewing the same stock and liking it again", async () => {
    const mockServer = chai.request(server)
    const res = await mockServer.get(url).query({ stock: "TSLA", like: true })

    assert.strictEqual(res.status, 200)
    assert.isNumber(res.body.stockData.likes)
    assert.strictEqual(res.body.stockData.likes, 1)
    assert.strictEqual(amountLikes, 1)
  })
  it("Viewing two stocks", async () => {
    const mockServer = chai.request(server)
    const res = await mockServer.get(url).query({ stock: ["TSLA", "GOOG"] })

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.stockData.length, 2)

    assert.isString(res.body.stockData[0].stock)
    assert.isNumber(res.body.stockData[0].price)
    assert.isNumber(res.body.stockData[0].rel_likes)
    assert.strictEqual(res.body.stockData[0].stock, "TSLA")

    assert.isString(res.body.stockData[1].stock)
    assert.isNumber(res.body.stockData[1].price)
    assert.isNumber(res.body.stockData[1].rel_likes)
    assert.strictEqual(res.body.stockData[1].stock, "GOOG")

    console.log(res.body)

    assert.strictEqual(res.body.stockData[0].rel_likes + res.body.stockData[1].rel_likes, 0)
  })
  it("Viewing two stocks and liking them", () => {
  })
})
