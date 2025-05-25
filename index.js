; const express = require('express')
const cors = require('cors')


const app = express();
const PORT = 8000

const corsConfig = {
  origin: "http://localhost:5173",
  credential: true,
  method: ["GET", "POST", "DELETE", "OPTION"]
}
app.use(cors((corsConfig)));
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://cleaning:ztO9f2Xl7Y1YH7zC@cluster0.vabrqqs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    const Users = client.db('ProCleaning').collection('userData')


    // USER GET
    app.get("/userData", async (req, res) => {
      const result = await Users.find().toArray()
      res.send(result)
    });


    // USER PORST
    app.post("/userData", async (req, res) => {
      try {
        const data = req.body;
        if (Array.isArray(data)) {
          const result = await Users.insertMany(data);
          res.send(result);
        } else {
          const result = await Users.insertOne(data);
          res.send(result);
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
      }
    });



    // DELETE USER 
    app.delete("/userData/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await Users.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.log(error)
      }
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
///////

}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running well");
});

app.listen(PORT, () => {
  console.log(`Simple crud is running on port: ${PORT}`);
});