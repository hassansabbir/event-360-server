const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const httpStatus = require("http-status");
const uri = `mongodb+srv://eventAdmin:nrzZicSVQSaHKvUD@cluster0.5ymoa2u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const serviceCollection = client.db("eventManDb").collection("services");
    const eventItemsCollection = client
      .db("eventManDb")
      .collection("eventItems");
    const packagesCollection = client.db("eventManDb").collection("packages");
    const reviewCollection = client.db("eventManDb").collection("reviews");
    const recentEventCollection = client
      .db("eventManDb")
      .collection("recent-event");

    //services collection

    app.get("/services", async (req, res) => {
      try {
        const result = await serviceCollection.find().toArray();
        res.status(httpStatus.OK).send({ success: true, data: result });
      } catch (error) {
        console.error("Error fetching services:", error);
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ success: false, message: "Internal server error" });
      }
    });

    app.post("/add-services", async (req, res) => {
      const result = await serviceCollection.insertOne(req.body);
      res.send(result);
    });

    //eventItems Collection

    app.get("/eventItems", async (req, res) => {
      try {
        const result = await eventItemsCollection.find().toArray();
        res.status(httpStatus.OK).send({ success: true, data: result });
      } catch (error) {
        console.error("Error fetching services:", error);
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ success: false, message: "Internal server error" });
      }
    });

    //packages Collection

    app.get("/packages", async (req, res) => {
      try {
        const result = await packagesCollection.find().toArray();
        res.status(httpStatus.OK).send({ success: true, data: result });
      } catch (error) {
        console.error("Error fetching services:", error);
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ success: false, message: "Internal server error" });
      }
    });

    //reviews Collection

    app.get("/reviews", async (req, res) => {
      try {
        const result = await reviewCollection.find().toArray();
        res.status(httpStatus.OK).send({ success: true, data: result });
      } catch (error) {
        console.error("Error fetching services:", error);
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ success: false, message: "Internal server error" });
      }
    });

    //recentEvent Collection

    app.get("/recent-event", async (req, res) => {
      try {
        const result = await recentEventCollection.find().toArray();
        res.status(httpStatus.OK).send({ success: true, data: result });
      } catch (error) {
        console.error("Error fetching services:", error);
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ success: false, message: "Internal server error" });
      }
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
  res.send("event manager is running...");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
