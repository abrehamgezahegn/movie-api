const express = require("express");
const {Movie} = require("../schema/schema");
const dbDebugger = require("debug")("app:db");

const router = express.Router();


router.get("/" , async (req,res)=> {
	try{
		const movies = await Movie.find().populate("genres");
		res.send(movies)
	}catch(err){
		res.status(500).send(err);		
	}

})


router.get("/:id" , async (req,res) => {
	const movieId = req.params.id;
	try{
		const movie = await Movie.findById(movieId).populate({path: "genres"});
		if(!movie) return res.status(400).send("NOthing found bro");

		res.send(movie);

	}catch(err){
		res.status(500).send(err);		
	}

})


router.post("/" , async (req,res) => {
	const data = req.body;

	try{
		const movie = new Movie({
			title: data.title,
			numberInStock: data.numberInStock,
			genres: data.genres
		})

		dbDebugger("movie: " , movie)

		const result = await movie.save();
		res.send(result);
	}catch(err){
		res.status(500).send(err);		
	}
})


router.put("/" , async (req,res) => {
	const data = req.body;

	try{
		const result = await Movie.findByIdAndUpdate({_id: data.id} , {
			$set: data
		} , {new : true});
		res.send(result);
	}catch(err){
		res.status(500).send(err);		
	}
})


router.delete("/:id" , async (req,res)=> {
	try{
		const id = req.params.id;
		const result = await Movie.deleteOne({_id: id});
		res.send(result)
	}catch(err){
		res.status(500).send(err)
	}
})

module.exports = router;