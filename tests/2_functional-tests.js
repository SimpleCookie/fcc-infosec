const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  test("Post /api/threads/{board}", async () => {
    const res = await chai.request(server).post("/api/threads/testboard").send({
      text: "Lorem ipsum, dolar set amet",
      delete_password: "pessword",
    });

    assert.equal(res.status, 200);
    assert.equal(res.text, "Lorem ipsum, dolar set amet");
    assert.equal(res.body.delete_password, "pessword");
  });
});
