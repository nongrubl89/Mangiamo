const express = require("express");
const Review = require("./models/review");
const User = require("./models/user");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const sharp = require("sharp");
const multerSettings = require("./multer");
const methodOverride = require("method-override");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

const db =
  "mongodb+srv://lisab:fedex1@cluster0.p9qni.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(3000))
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
    console.log("all reviews:", result);
    res.render("index", {
      reviews: result,
      title: "Mangiamo || Home",
    });
  });
  //   res.render("index", { reviews: result, title: "Mangiamo || Home" });
});

app.get("/login", (req, res) => {
  res.render("login", {
    title: "Mangiamo || Login",
  });
});

app.post("/login", (req, res) => {
  console.log(req.body);
});

app.get("/new-entry", (req, res) => {
  res.render("newentry", { title: "Mangiamo || New Entry" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "Mangiamo || About" });
});

app.get("/reviews/:id", (req, res) => {
  const id = req.params.id;
  Review.findById(id)
    .then((result) => {
      res.render("reviewdetails", {
        review: result,
        title: `Mangiamo || ${result.title}`,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/", multerSettings.upload.single("image"), async (req, res, next) => {
  const { filename: image } = req.file;
  await sharp(req.file.path)
    .resize(200, 200)
    .jpeg({ quality: 90 })
    .toFile(path.resolve(req.file.destination, "resized", image))
    .catch((error) => {
      console.log(error);
    });
  req.body.image = [];
  req.body.image.push(req.file);
  const review = new Review(req.body);
  review
    .save()
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  Review.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.put("/:id", (req, res) => {
  console.log(req.params.id);
  res.redirect("/");
});

app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  Review.findById(id).then((result) => {
    res.render("editentry", { title: "Edit Entry", review: result });
  });
});

app.put("/edit/:id", async (req, res) => {
  Review.findOneAndUpdate({ _id: req.params.id }, { $set: req.body })
    .then((result) => {
      res.redirect("/");
    })

    .catch((err) => {
      console.log(err);
    });
});

app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
