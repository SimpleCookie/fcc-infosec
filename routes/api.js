'use strict'

module.exports = function (app) {

  app.route('/api/threads/:board').all((req, res, next) => {
    console.log("Request to thread", board, req)
    next()
  })
    .post((req, res, next) => {
      const { board, text, delete_password } = req.body
      console.log("param", req.query)
      console.log("Post", req.body)
    })

  app.route('/api/replies/:board').all((req, res, next) => {
    console.log("Request to reply", board, req)
    next()
  })
    .post((req, res, next) => {
      const { thread_id, text, delete_password } = req.body
      console.log("param", req.query)
      console.log("Post", req.body)
    })

}
