const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRouter = require("./routes/authRouter");
const errorHandler = require("./routes/errorHandler");
const shoeRouter = require("./routes/shoeRouter");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/shoe", shoeRouter);

app.use(errorHandler);

module.exports = app;