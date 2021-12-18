"use strict"
const {
  addThread,
  reportThread,
  deleteThread,
  addReply,
  reportReply,
  deleteReply,
} = require("../service/db")
const models = require("../service/models")

module.exports = function (app) {
  app
    .route("/api/threads/:board")
    .all((req, res, next) => {
      console.log("Request to thread", req)
      next()
    })
    .post(async (req, res, next) => {
      const { board, text, delete_password } = req.body
      const newMsg = models.msg({ board, text, delete_password })
      const newMessage = await addThread(newMsg)
      res.json(newMessage)
    })
    .put(async (req, res, next) => {
      const { thread_id } = req.body
      const result = await reportThread({ thread_id })
      res.send(result)
    })
    .delete(async (req, res, next) => {
      const { thread_id, delete_password } = req.body
      const result = await deleteThread({ thread_id, delete_password })
      res.send(result)
    })

  app
    .route("/api/replies/:board")
    .all((req, res, next) => {
      console.log("Request to reply", req)
      next()
    })
    .post(async (req, res, next) => {
      const { text, delete_password, thread_id, board } = req.body
      const reply = await models.reply({ text, delete_password })
      addReply({ board, thread_id, reply })
    })
    .put(async (req, res, next) => {
      const { board, thread_id, reply_id } = req.body
      const result = await reportReply({ board, thread_id, reply_id })
      res.send(result)
    })
    .delete(async (req, res, next) => {
      const { board, thread_id, reply_id, delete_password } = req.body
      const result = await deleteReply({
        board,
        thread_id,
        reply_id,
        delete_password,
      })
      res.send(result)
    })
}
