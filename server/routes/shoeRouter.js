const express = require("express");
const shoeController = require("../controllers/shoeController");
const router = express.Router();

router.post("/create", shoeController.create);
router.get("/all", shoeController.all);
router.put("/addToFavorites", shoeController.addShoeToUserFavorites);
router.post("/userFavorites", shoeController.showUserFavorites);
router.put("/removeFromFavorites", shoeController.removeFromUserFavorites);
router.post("/search", shoeController.searchShoe);

module.exports = router;