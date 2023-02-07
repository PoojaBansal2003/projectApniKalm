const express = require('express')

const app = express();

const cookieParser = require("cookie-parser");

const errorMiddleWare = require("./middleware/error");


/* For Using json file Bassicallly Postman Request */
app.use(express.json());

/* Cookie Parser */
app.use(cookieParser());


// route Imports

/* For Product */
const product = require("./routes/productRoute");
app.use("/api/v1",product);

/* For User things */
const user =  require("./routes/userRoutes");
app.use("/api/v1",user)


/* MiddleWare for Error */

app.use(errorMiddleWare);



module.exports = app;

