// const express = require("express");
// const designController = require("../controllers/designControllers");
// const authMiddleware = require("../middlewares/authorization");
// const multer = require("multer");

// const router = express.Router();

// const upload = multer({ storage: multer.memoryStorage() }).array("img");

// router.post('/', authMiddleware(['master']), designController.createDesign);
// router.get('/', designController.getAllDesigns);
// router.get('/:id',designController.getDesignById)
// router.patch('/:id', upload,authMiddleware(['master', 'architect']), designController.updateDesign);
// router.delete('/:id',designController.deleteDesign)

// router.get('/architect',authMiddleware(["master"],["architect"]),designController.getDesignByArchitect)

// module.exports = router;
const express = require("express");
const designController = require("../controllers/designControllers");
const authMiddleware = require("../middlewares/authorization");
const multer = require("multer");
const router = express.Router();
// const upload = multer({storage: multer.memoryStorage()}).array("img");
const upload = multer({
  storage: multer.memoryStorage(),
}).fields([
  {name: "img"}, // No maxCount, allows unlimited images
  {name: "premiumdoc", maxCount: 5}, // Max 5 PDFs for premium docs
  {name: "luxurydoc", maxCount: 5}, // Max 5 PDFs for luxury docs
]);

router.post("/", upload, authMiddleware(["master"]), designController.createDesign);
router.get("/", designController.getAllDesigns);
router.get("/:id", designController.getDesignById);
router.patch("/:id", upload, authMiddleware(["master", "architect"]), designController.updateDesign);
router.delete("/:id", designController.deleteDesign);
router.get("/architect", authMiddleware(["master"], ["architect"]), designController.getDesignByArchitect);
module.exports = router;
