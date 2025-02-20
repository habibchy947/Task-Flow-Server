const express = require('express')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(express.json())
app.use(cors())

// mongodb

app.get('/', (req, res) => {
    res.send('the task is ongoing')
})

app.listen(port, () => {
    console.log(`this server is running on port : ${port}`)
})