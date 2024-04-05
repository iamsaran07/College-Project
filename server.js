const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require('mongoose');
const app = express();
require("./config/mongo");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "hbs");
const viewPath = path.join(__dirname, "view");
app.set("views", viewPath);

app.use(express.static("Images"));

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("main");
});
app.get("/home", (req, res) => {
  res.render("home");
});
app.get("/studentHome", (req, res) => {
  res.render("studentHome");
});

app.use("/ssm/mca", require("./routes/index"));

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("CONNECTED TO DATABASE...");
    app.listen(PORT, () => {
      console.log(`PORT CONNECTED TO ${PORT}...`);
    });
  })
  .catch((err) => {
    console.log("FAILED TO CONNECT DATABASE...")
    console.log(err);
  });
