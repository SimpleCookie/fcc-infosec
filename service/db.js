const { MongoClient } = require('mongodb');

const connect = async () => {
  return await MongoClient.connect(process.env.DB, { useUnifiedTopology: true, useNewUrlParser: true })
}

const useThreads = async (callback) => {
  try {
    const client = connect()
    const collection = client.db("free_code_camp").collection("msg_board_threads")
    callback(collection)
  } catch (error) {
    console.error("error", error)
  } finally {
    client.close();
  }
}

const useReplies = async (callback) => {
  try {
    const client = connect()
    const collection = client.db("free_code_camp").collection("msg_board_replies")
    callback(collection)
  } catch (error) {
    console.error("error", error)
  } finally {
    client.close();
  }
}

const addThread = async ({ board, text, password }) => {
  const callback = async (collection) => {
    await collection.insertOne({ board, text, password })
  }
  useThreads(callback)
}

const addReply = async (board, threadId, text, password) => {
  const callback = async (collection) => {
    await collection.insertOne({ board, text, password })
  }
  useReplies(callback)
}


module.exports = {
  addThread,
  deleteThread,
  reportThread,
  addReply,
  deleteReply,
  reportReply,
}