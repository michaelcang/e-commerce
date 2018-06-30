const router = require('express').Router();
const itemController = require('../controllers/item')
const imagesHelper = require('../helpers/images')

router.get("/", itemController.getAllItems);
router.put("/:id", itemController.updateItem);
router.delete("/:id", itemController.deleteItem);

router.post("/", 
imagesHelper.multer.single('image'), 
imagesHelper.sendUploadToGCS,
itemController.addItem);

module.exports = router;