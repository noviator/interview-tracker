const { Router } = require("express");
const programController = require("../controllers/programController");
const router = Router();

router.post("/programming", programController.programming_post);

module.exports = router;