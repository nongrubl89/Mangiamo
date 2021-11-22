const express = require("express");
const Review = require("./models/review");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const sharp = require("sharp");
const multerSettings = require("./multer");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const db =
  "mongodb+srv://lisab:fedex1@cluster0.p9qni.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(3000))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  Review.find().then((result) => {
    // console.log(result[0].author);
    res.render("index", {
      reviews: result,
      title: "Mangiamo || Home",
    });
  });
  //   res.render("index", { reviews: result, title: "Mangiamo || Home" });
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

app.put("/:id", (req, res) => {
  const id = req.params.id;
  Review.findOneAndUpdate(
    { id: req.body.id },
    { $set: req.body },
    { new: true }
  )
    .then((result) => {
      res.redirect(`/`);
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

app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  Review.findById(id).then((result) => {
    res.render("editentry", { title: "Edit Entry", review: result });
  });
});

app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
