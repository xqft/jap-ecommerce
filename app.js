const express = require("express");

const app = express();
const port = 3000;

const dataRouter = require("./routes/data");
app.use("/data", dataRouter);

app.listen(port);
