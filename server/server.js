require('dotenv').config();
const express = require("express");
const mongo = require("./config/connection");
const routes = require("./routes");
const cors = require("cors");
const path = require('path');
//^_~

const PORT = process.env.PORT || 3001;
const app = express();

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


// Serve react build files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
}

//Routes
app.use(routes);

// Catch all for react routing in production
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

mongo.once("open", () => {
  console.log("✅ MongoDB connected");
  app.listen(PORT, () =>
    console.log(`🚀 API running: http://localhost:${PORT}`),
  );
});