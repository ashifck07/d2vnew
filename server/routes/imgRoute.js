const express = require("express");
const { deleteImage } = require("../controllers/imageController");

const router = express.Router();

// Delete image by imageId
router.delete("/:imageId", deleteImage);

module.exports = router;