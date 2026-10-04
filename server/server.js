require('dotenv').config();
const express = require("express");
const mongo = require("./config/connection");
const routes = require("./routes");
const cors = require("cors");


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);
app.use(cors());

mongo.once("open", () => {
  console.log("✅ MongoDB connected");
  app.listen(PORT, () =>
    console.log(`🚀 API running: http://localhost:${PORT}`),
  );
});