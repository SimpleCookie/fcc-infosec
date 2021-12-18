const mongoose = require("mongoose")

mongoose.connect(process.env.DB, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})

const replySchema = new mongoose.Schema({
  created_on: String,
  text: String,
  delete_password: String,
  reported: Boolean,
})

const messageSchema = new mongoose.Schema({
  board: String,
  created_on: String,
  bumped_on: String,
  reported: Boolean,
  text: String,
  delete_password: String,
  replies: [replySchema],
  password: String,
})

const Message = mongoose.model("Message", messageSchema)
const Reply = mongoose.model("Reply", replySchema)

const addMsg = async (message) => {
  const newMessage = new Message(message)
  await newMessage.save()
  return newMessage
}

const reportThread = async ({ thread_id }) => {
  const selector = mongoose.Types.ObjectId(thread_id)
  const result = await Message.findByIdAndUpdate(
    selector,
    { reported: true },
    { useFindAndModify: false }
  )
  if (result) return "success"
  return "invalid thread_id"
}

const deleteThread = async ({ thread_id, delete_password }) => {
  const selector = { _id: mongoose.Types.ObjectId(thread_id), delete_password }
  const result = await Message.findOneAndDelete(selector)
  if (result) return "success"
  return "incorrect password"
}

const addReply = async ({ board, thread_id, reply }) => {
  const selector = { board, _id: mongoose.Types.ObjectId(thread_id) }
  const thread = Message.findOne(selector)

  thread.replies.push(new Reply(reply))
  thread.bumped_on = reply.created_on
  await thread.save()
  return newReply
}

const reportReply = async () => {
  console.log("success")
}

const deleteReply = async ({ board, thread_id, reply_id, delete_password }) => {
  const selector = { board, _id: mongoose.Types.ObjectId(thread_id) }
  const thread = Message.findOne(selector)
  const replyIdx = thread.replies.findIndex((it) => it._id === reply_id)
  if (!replyIdx) return "invalid reply_id"
  if (thread.replies[replyIdx].delete_password !== delete_password) {
    return "incorrect password"
  }
  thread.replies[replyIdx].text = "[deleted]"
  thread.save()
  return "success"
}

module.exports = {
  addMsg,
  addReply,
  reportThread,
  deleteThread,
  deleteReply,
  reportReply,
}
