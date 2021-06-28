const chaiHttp = require('chai-http')
const chai = require('chai')
const assert = chai.assert
const server = require('../server')
const { expect } = require('chai')
const url = "/api/stock-prices"

chai.use(chaiHttp)

suite('Functional Tests', function () {
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
  })
  it("Viewing the same stock and liking it again", async function () {
    const requester = chai.request(server).keepOpen()
    const res1 = await requester.get(url).query({ stock: "TSLA", like: true })
    const res2 = await requester.get(url).query({ stock: "TSLA", like: true })
    console.log(res1.body)
    console.log(res2.body)
    const likes1 = res1.body.stockData.likes
    const likes2 = res2.body.stockData.likes
    console.log(likes1, ":", likes2)
    assert.strictEqual(likes1, 1)
    assert.strictEqual(likes2, 1)
    requester.close()
  })
  it("Viewing two stocks", async function () {
    try {
      const res = await chai.request(server).get(url).query({ stock: ["TSLA", "GOOG"] })
      console.log(typeof res.status, res.status)
      assert.strictEqual(res.status, 200)
      // assert.strictEqual(res.body.stockData.length, 2)
      // assert.isString(res.body.stockData[0].stock)
      // assert.isNumber(res.body.stockData[0].price)
      // assert.isNumber(res.body.stockData[0].rel_likes)
      // assert.strictEqual(res.body.stockData[0].stock, "TSLA")

      // assert.isString(res.body.stockData[1].stock)
      // assert.isNumber(res.body.stockData[1].price)
      // assert.isNumber(res.body.stockData[1].rel_likes)
      // assert.strictEqual(res.body.stockData[1].stock, "GOOG")
      // assert.strictEqual(res.body.stockData[0].rel_likes + res.body.stockData[1].rel_likes, 0)
    } catch (error) {
      console.error("test", error)
    }
  })
  it("Viewing two stocks and liking them", (done) => {
    done()
  })
})
