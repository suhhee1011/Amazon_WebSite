const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

require('dotenv').config({path:"./config/keys.env"});

const app = express();

app.engine("handlebars",exphbs());
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));




//load product model
const generalController = require("./controllers/general");
const productController = require("./controllers/product");

//map each controller to the app object

/*
    localhost:3000/contact-us
    localhost:3000/product
*/
app.use("/",generalController);
app.use("/product",productController);

//MONGODB
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log(`Connected to MongoDB Database`);
})
.catch(err=>console.log(`Error occured when connecting to database ${err}`));

//set up server
const PORT = process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log("Web server is running");
    console.log(PORT);
});

