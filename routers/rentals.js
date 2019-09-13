const express = require("express");
const {Rental} = require("../schema/schema");
const dbDebugger = require("debug")('app:db');

const router = express.Router();


router.get("/" , async (req ,res) => {
	try{
		const rentals = await Rental.find();
		res.send(rentals)
	}catch(err){
		res.status(500).send(err);
	}
})


router.post("/" , async (req , res) => {
	try{
		const data = req.body;
		const rental = new Rental({
			movies: data.movies,
			hours: data.hours,
			customer: data.customer
		})

		dbDebugger("rental: " , rental)
		const result = await rental.save();
		res.send(result);
	}catch(err){
		res.status(500).send(err)
	}
})


module.exports = router;