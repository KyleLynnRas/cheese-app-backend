///////////////////////////////
//DEPENDENCIES
////////////////////////////////
require("dotenv").config()
//port 
const {PORT = 3000, MONGODB_URL} = process.env
//express
const express = require("express")
//app
const app = express()
//mongoose
const mongoose = require("mongoose")
//middlware
const cors = require("cors");
const morgan = require("morgan");

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true, 
    useNewUrlParser: true
})

mongoose.connection 
    .on("open", () => console.log("Connected to Mongo"))
    .on("close", () => console.log("Disconnected from Mongo"))
    .on("error", (error) => console.log(error))


///////////////////////////////
//MODELS
////////////////////////////////
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String,
})

const Cheese = mongoose.model("Cheese", CheeseSchema)

///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(cors()); 
app.use(morgan("dev")); 
app.use(express.json()); 

///////////////////////////////
//ROUTES
////////////////////////////////
//test 
app.get("/", (req, res) => {
    res.send("hello world")
})

//Index
app.get("/cheese", async (req, res) => {
    try {
        res.json(await Cheese.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})

//Create
app.post("/cheese", async (req, res) => {
    try {
      res.json(await Cheese.create(req.body));
    } catch (error) {
      res.status(400).json(error);
    }
  });

//Update
app.put("/cheese/:id", async (req, res) => {
    try {
        res.json (await Cheese.findByIdAndUpdate(req.params.id, req.body, {new: true})) 
    } catch (error) {
        res.status(400).json(error)
    }  
})

//Delete
app.delete("/cheese/:id", async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})

///////////////////////////////
//LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
