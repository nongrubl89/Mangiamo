require("dotenv").config();
const express = require("express");
// const Review = require("../models/review");
const Review = require("./models/review")
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const reviewRoutes = require("./routes/reviewRoutes");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

const db = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.p9qni.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(process.env.PORT || 3000))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

app.get("/", (req, res) => {
  Review.find().then((result) => {
    res.render("index", {
      reviews: result,
      title: "Airplane Food || Home",
    });
  });
});

app.get("/new-entry", (req, res) => {
  res.render("newentry", { title: "Airplane Food || New Entry" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "Airplane Food || About" });
});

app.use("/reviews", reviewRoutes);

app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
