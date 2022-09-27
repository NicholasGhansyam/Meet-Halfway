const express = require('express')
const router = express.Router()
const homeController = require("../controllers/home");

router.get("/", homeController.getIndex)

// @route /user/
router.get("/halfwayroutes/:id", homeController.getHalfwayroutes)
router.get("/api/v1/halfway/:id", homeController.getHalfway)
router.post("/api/v1/halfway", homeController.addHalfway)


module.exports = router