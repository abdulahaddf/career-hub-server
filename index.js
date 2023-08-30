const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wg0iu7v.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect((err) => {
      if (err) {
        console.error(err);
        return;
      }
    });

    const careerCollection = client.db("careerDb").collection("career");
    const categoryCollection = client.db("careerDb").collection("category");
//get all career
app.get("/career", async (req, res) => {
  try {
    const result = await careerCollection.find().toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("An error occurred while fetching data.");
  }
});
//get toy by ID
app.get("/job/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await careerCollection.findOne(query);
  res.send(result);
});
app.get("/category", async (req, res) => {
  try {
    const result = await categoryCollection.find().toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("An error occurred while fetching data.");
  }
});
 //search college
 app.get("/getajobsByText", async (req, res) => {
  console.log(req.query.name);
  let query = {};
  if (req.query?.name) {
    query = { jobTitle: req.query.name };
  }
  const result = await careerCollection.find(query).toArray();
  res.send(result);
});




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("career server is running");
});

app.listen(port, () => {
  console.log(`career Server is running on port: ${port}`);
});
