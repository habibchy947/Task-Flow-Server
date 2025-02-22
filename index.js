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


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n2npp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const userCollection = client.db('TaskManagementDB').collection('users')
    const taskCollection = client.db('TaskManagementDB').collection('tasks')


    // create user
    app.post('/user', async (req, res) => {
      const user = req.body
      const query = { email: user.email }
      const isExist = await userCollection.findOne(query)
      if (isExist) {
        return res.send({ message: 'user already exist', insertedId: null })
      }
      const result = await userCollection.insertOne(user)
      res.send(result)
    })


    // Get tasks by user email
    app.get('/tasks/:email', async (req, res) => {
      const { email } = req.params;
      try {
        const tasks = await taskCollection.find({ email }).toArray();
        res.json(tasks);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
      }
    });

    app.get('/singleTasks/:id', async (req, res) => {
      const  id  = req.params.id;
      const query = {_id: new ObjectId(id)}
        const task = await taskCollection.findOne(query)
        res.json(task);
    });

    // add task
    app.post('/tasks', async(req,res)=> {
      const task = req.body
      const result = await taskCollection.insertOne(task)
      res.send(result)
    })

    // 

    app.delete('/tasks/:id', async(req,res)=>{
      const id = req.params.id
      console.log(id)
      const query = {_id : new ObjectId(id)}
      const result = await taskCollection.deleteOne(query)
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('the task is ongoing')
})

app.listen(port, () => {
  console.log(`this server is running on port : ${port}`)
})