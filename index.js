const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
      .collection("recentEvents");

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

    app.patch("/services/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: "offAir",
        },
      };
      const result = await serviceCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    //eventItems Collection

    app.get("/eventItems", async (req, res) => {
      try {
        const result = await eventItemsCollection
          .find({ status: "onAir" })
          .toArray();
        res.status(httpStatus.OK).send({ success: true, data: result });
      } catch (error) {
        console.error("Error fetching services:", error);
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ success: false, message: "Internal server error" });
      }
    });

    app.get("/eventItems/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await eventItemsCollection.findOne(query);

        if (!result) {
          res
            .status(httpStatus.NOT_FOUND)
            .send({ success: false, message: "Event not found" });
          return;
        }
        res.status(httpStatus.OK).send({ success: true, data: result });
      } catch (error) {
        console.error("Error fetching event:", error);
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ success: false, message: "Internal server error" });
      }
    });

    app.post("/eventItems", async (req, res) => {
      const result = await eventItemsCollection.insertOne(req.body);
      res.send(result);
    });

    app.patch("/new-eventItems/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const replacementDoc = req.body;
        const result = await eventItemsCollection.replaceOne(
          filter,
          replacementDoc
        );

        if (result.matchedCount === 0) {
          res
            .status(httpStatus.NOT_FOUND)
            .send({ success: false, message: "Event not found" });
          return;
        }

        res
          .status(httpStatus.OK)
          .send({ success: true, message: "Event updated successfully" });
      } catch (error) {
        console.error("Error updating event:", error);
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ success: false, message: "Internal server error" });
      }
    });

    app.patch("/eventItems/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: "offAir",
        },
      };
      const result = await eventItemsCollection.updateOne(filter, updateDoc);
      res.send(result);
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
        const result = await recentEventCollection
          .find({ status: "onAir" })
          .toArray();
        res.status(httpStatus.OK).send({ success: true, data: result });
      } catch (error) {
        console.error("Error fetching services:", error);
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ success: false, message: "Internal server error" });
      }
    });

    app.get("/recent-event/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await recentEventCollection.findOne(query);

        if (!result) {
          res
            .status(httpStatus.NOT_FOUND)
            .send({ success: false, message: "Event not found" });
          return;
        }
        res.status(httpStatus.OK).send({ success: true, data: result });
      } catch (error) {
        console.error("Error fetching event:", error);
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ success: false, message: "Internal server error" });
      }
    });

    app.post("/recent-event", async (req, res) => {
      const result = await recentEventCollection.insertOne(req.body);
      res.send(result);
    });

    app.patch("/recent-event/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: "offAir",
        },
      };
      const result = await recentEventCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.patch("/full-recent-event/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const replacementDoc = req.body;
        const result = await recentEventCollection.replaceOne(
          filter,
          replacementDoc
        );

        if (result.matchedCount === 0) {
          res
            .status(httpStatus.NOT_FOUND)
            .send({ success: false, message: "Event not found" });
          return;
        }

        res
          .status(httpStatus.OK)
          .send({ success: true, message: "Event updated successfully" });
      } catch (error) {
        console.error("Error updating event:", error);
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
