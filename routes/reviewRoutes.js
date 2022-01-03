const express = require("express");
const reviewController = require("../controllers/reviewController");
const multerSettings = require("../multer");

const router = express.Router();

router.post(
  "/",
  multerSettings.upload.single("image"),
  reviewController.newReview
);
// router.get("/", reviewController.findAllAndDisplay);
router.put("/edit/:id", reviewController.findAndDisplay);
router.get("/edit/:id", reviewController.findAndEdit);
router.get("/:id", reviewController.findOneAndDisplay);
router.delete("/delete/:id", reviewController.findAndDelete);

module.exports = router;
