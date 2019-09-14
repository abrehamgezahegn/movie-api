const express = require("express");
const Fawn = require("fawn");
const mongoose  = require("mongoose")
const {Rental , Movie , Customer} = require("../schema/schema");
const dbDebugger = require("debug")('app:db');
const authorize = require("../middlewares/auth");


const router = express.Router();

// mongoose.connect("mongodb://localhost/vidly" , { useNewUrlParser: true })

Fawn.init(mongoose);

router.get("/" , async (req ,res) => {
	try{
		const rentals = await Rental.find().populate("movies")
		res.send(rentals)
	}catch(err){
		res.status(500).send(err);
	}
})


router.post("/" , authorize, async (req , res) => {

	try{
		const data = req.body;

//////////////////////////////////////////////////////////////////

		let movieItem = null;

		data.movies.forEach(async item => {
			movieItem =  await Movie.findById(item);
			if(!movieItem) return res.status(404).send(`movie by ${movieItem} not found`)
			if(movieItem.numberInStock === 0) return res.status(400).send(`movie by ${movieItem} rented out`)
		})


		const customer = await Customer.findById(data.customer);
		if(!customer) return res.status(404).send("customer not found")

		const rental = new Rental({
			movies: data.movies,
			customer: data.customer
		})


		dbDebugger("rental: " , rental)
		const result = await rental.save();

		data.movies.forEach(async item => {
			movieItem =  await Movie.findById(item);		
			movieItem.numberInStock--;
			movieItem.save();
		})


/////////////////////////////////////////////////////////////


		// const movie = await Movie.findById(data.movie);
		// if(!movie) return res.status(404).send("movie not found");

		// if(movie.numberInStock === 0) return res.status(400).send("Movies rented out.")

		// const customer = await Customer.findById(data.customer);
		// if(!customer) return res.status(404).send("customer not found")

		// const rental = new Rental({
		// 	movie: data.movie,
		// 	customer: data.customer
		// })

		// dbDebugger("rental: " , rental)
		// const result = await rental.save();

		// movie.numberInStock--;
		// movie.save();


		// new Fawn.Task()
		// 	.save("rentals" , rental)
		// 	.update("movies" , {_id: data.movie} , { $inc: {numberInStock: -1}})
		// 	.run()

		res.send(rental);
	}catch(err){
		dbDebugger("rental error: " , err)
		res.status(500).send(err)
	}
})


module.exports = router;