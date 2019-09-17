const express = require('express');
const Joi = require("@hapi/joi");
const {Genre} = require("../schema/schema")
const dbDebugger  = require("debug")("app:db");
const authorize = require("../middlewares/auth");
const isAdmin = require("../middlewares/admin");


const router = express.Router();


router.get("/" , async (req ,res) => {
	try{
		const result  = await Genre.find();
		res.send(result)
	}catch(err){
		res.status(500).send(err);
	}
})

router.get("/:id" , async (req,res) => {
	try{
		const id = req.params.id;
		const genre = await Genre.findById(id);
		if(!genre) return res.status(404).send("Nothing by that id bro");
		res.send(genre)
	}catch(err){
		res.status(500).send(err);
	}
})

router.post('/', authorize ,async (req,res) => {
	const data = req.body;
	const {error} = validateGenre(data);
	if(error) return res.status(400).send(error.details[0].message);

	try{
		const genre = new Genre({
							name: data.name,
							birthdate: data.birthdate,
							related: data.related,
							subscribers: data.subscribers		 
						})
		const response = await genre.save() 
		dbDebugger("post response: " , response);
		res.send(genre);
	}catch(err){
		res.status(500).send(err);
	}

})


router.put("/" , authorize , async (req,res) =>{
	const data = req.body;
	const {error} = validateGenre(data)
	if(error) return  res.status(400).send(error.details[0].message);
	if(!data.id) return  res.status(400).send("include id in the object");

	try{
		const result = await Genre.findByIdAndUpdate({_id: data.id} , {
			$set: data
		} , {new: true})
		res.send(result);

	}catch(err){
		res.status(500).send(err);	
	}
})


router.delete("/:id" , [authorize , isAdmin] , async (req ,res) => {
	const id = req.params.id;
	try{
		const result = await Genre.deleteOne({_id: id});
		res.send(result)
	}catch(err){		
		res.status(500).send(err);	
	}

})

const notFound = (item,id) => `${item} by an id of ${id} not found`;

const validateGenre = (genre) => {
	const schema = Joi.object().keys({
		name: Joi.string().min(3).max(100).required(),
		related: Joi.array().min(1).max(100).required(),
		subscribers: Joi.number().min(0).max(100000000000000).required(),
		id: Joi.string(),
		birthdate: Joi.date()
	})
	return Joi.validate(genre,schema);
}


module.exports = router;