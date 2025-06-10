const express = require("express");
const translateRoute = require("./Routes/translateRoute");

const app = express();
app.use(express.json());

app.use("/api", translateRoute);
