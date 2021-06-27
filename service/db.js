const { MongoClient } = require('mongodb');

const addLike = async ({ ip, stock }) => {
  let client
  try {
    client = await MongoClient.connect(process.env.DB, { useUnifiedTopology: true, useNewUrlParser: true })
    const collection = client.db("free_code_camp").collection("likes")
    await collection.insertOne({ ip, stock })
  } catch (error) {
    console.error("error", error)
  } finally {
    client.close();
  }
}

const getLikesByStock = async stock => {
  let client
  try {
    client = await MongoClient.connect(process.env.DB, { useUnifiedTopology: true, useNewUrlParser: true })
    const collection = client.db("free_code_camp").collection("likes")
    return await collection.find({ stock }).toArray()
  } catch (error) {
    console.log(error)
  } finally {
    client.close();
  }
}


module.exports = {
  addLike,
  getLikesByStock,
}