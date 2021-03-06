// importing modules
const express = require("express");
const session = require("express-session");
const app = express();
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const port = 8000;

// connecting mongoose to mongodb
mongoose.connect(
 "mongodb://localhost/encore",
 { useNewUrlParser: true },
 function(err, connection) {
  err ? console.log(__filename + ": Mongoose not connected to MongoDB.") : console.log(__filename + ": Mongoose connected to MongoDB.");
 }
)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// defining static path
app.use(express.static(path.join(__dirname, "public")));

// defining view engine
app.set("views", path.join(__dirname, "./server/views"));
app.set("view engine", "ejs");

// integrating sessions
app.use(
 session({
  secret: "encore",
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ url: "mongodb://localhost/encore-session" })
 })
);

if (process.env.NODE_ENV === "development") {
 var webpack = require("webpack");
 var webpackConfig = require("./webpack.config");
 var compiler = webpack(webpackConfig);

 app.use(
  require("webpack-dev-middleware")(compiler, {
   noInfo: true,
   publicPath: webpackConfig.output.publicPath
  })
 );

 app.use(require("webpack-hot-middleware")(compiler));
}

app.use(cors());

// routing
app.use("/api", require("./server/routes/api"));
app.use(require("./server/routes/index"));

// adding port
app.listen(port, () => {
 console.log(`server is running on http://localhost:${port}`);
});