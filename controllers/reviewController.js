const Review = require("../models/review");

const newReview = async (req, res) => {
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
};

const findOneAndDisplay = (req, res) => {
  const id = req.params.id;
  Review.findById(id)
    .then((result) => {
      res.render("reviewdetails", {
        review: result,
        title: `Airplane Food || ${result.title}`,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const findAndDisplay = (req, res) => {
  Review.findOneAndUpdate({ _id: req.params.id }, { $set: req.body })
    .then((result) => {
      res.redirect("/");
    })

    .catch((err) => {
      console.log(err);
    });
};

const findAndEdit = (req, res) => {
  const id = req.params.id;
  Review.findById(id).then((result) => {
    res.render("editentry", { title: "Edit Entry", review: result });
  });
};

const findAndDelete = (req, res) => {
  const id = req.params.id;
  Review.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/" });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  newReview,
  findAndDelete,
  findAndDisplay,
  findAndEdit,
  findOneAndDisplay,
};
