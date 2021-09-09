const express = require("express");

const router = express.Router();

router.get("/" , (req,res) => {
	res.send("am working bruh")
})


module.exports = router