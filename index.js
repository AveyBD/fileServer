const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

//get all files

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const fileCollection = client.db("fileApp").collection("file");

    app.get("/files", async (req, res) => {
      const query = {};
      const cursor = fileCollection.find(query);
      const files = await cursor.toArray();
      res.send(files);
    });

    // post files

    app.post("/files", async (req, res) => {
      const file = req.body;
      console.log(file);
      const result = await fileCollection.insertOne(file);
      res.send({ success: true, result });
    });

    //delete a file

    // delete Project API
    app.delete("/files/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await fileCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello File App");
});

app.listen(port, () => {
  console.log(`File App running at port:${port}`);
});
