import express from "express";
const app = express();
const port = process.env.PORT || 3000;
import bodyParser from "body-parser";
import db from "./db/conn.mjs";
import dotenv from "dotenv";
import cors from 'cors';
app.use(cors());
dotenv.config();

// bodyParser middleware to make sure submitted data is parsed correctly
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

// logging middleware to report when a request is received
const logging = function(req, res, next){
    console.log("Request Received");
    next();
};

app.use(logging);

// error handling middleware taking 4 arguments
app.use((err, req, res, next) => {
    console.log("Error encountered")
    res.status(400).send(err.message);
});

// post request for mechs
app.post("/api/mechs/", async (req, res) => {
    let collection = await db.collection("mechs");
    let newDocument = req.body;
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
});

app.route("/api/mechs/:id")
    .get(async (req, res) => { // get request for mechs
        let collection = await db.collection("mechs");
        let query = { id: parseInt(req.params.id) };
        let result = await collection.findOne(query);
        
        if (!result) res.send("Not found").status(404);
        else res.send(result).status(200);
    })
    .patch(async (req, res) => { // patch request for mechs
        let collection = await db.collection("mechs");
        let query = { id: parseInt(req.params.id) };
        let result = await collection.updateMany(query, {
          $set: { id: req.body.id },
        });
      
        if (!result) res.send("Not found").status(404);
        else res.send(result).status(200);
    })
    .delete(async (req, res) => { // delete request for mechs
        let collection = await db.collection("mechs");
        let query = { id: parseInt(req.params.id) };
        let result = await collection.deleteMany(query);
        
        if (!result) res.send("Not found").status(404);
        else res.send(result).status(200);
    });

// error handling middleware for missing resources
app.use((req, res) => {
    res.status(404);
    res.json({ error: "Resource Not Found" });
});

app.listen(port, () => {
    console.log(`Server listening on port: ${port}.`);
});