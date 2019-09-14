const express = require("express");
const Joi = require("@hapi/joi");
const dbDebugger  = require("debug")("app:db");
const {Customer}  = require("../schema/schema");
const authorize = require("../middlewares/auth");




const router = express.Router();


router.get("/" , async (req,res)=> {
	try{
		const result = await Customer.find();
		res.send(result);
	}catch(err){
		dbDebugger("server error: " , err)
		res.status(500).send(err)
	}
})


router.get("/:id" , async (req,res) => {
	const id = req.params.id;
	try{
		const result = await Customer.find({_id: id});
		if(!result) res.status(404).send("No one found");

		res.send(result)
	}catch(err){
		dbDebugger("server error: " , err)
		res.status(500).send(err)
	}
})

// router.put("/" , async (req , res) => {
// 	const data = req.body;
// 	try{
// 		const {error} = validateCustomer(data);
// 		if(error) return res.status(400).send(error.details[0].message)
		
// 		const customer =  new Customer({
// 				displayName: data.displayName,
// 				username: data.username,
// 				isGold: data.isGold,
// 				phone: data.phone,
// 				email: data.email,
// 				password: data.password
// 		})
// 		const response = await customer.save();
// 		res.send(response);
// 	}catch(err){
// 		dbDebugger("server error: " , err)
// 		res.status(500).send(err)
// 	}
// })


router.put("/" ,  authorize,async (req,res)=> {
	const data = req.body;
	try{
		const {error} = validateCustomer(data);
		if(error) return res.status(400).send(error.details[0].message);
		if(!data.id) return  res.status(400).send("include id in the object");

		const updatedCustomer = await Customer.findByIdAndUpdate({_id: data.id},
				{
					$set:data
				} , {new : true}
		 );
		res.send(updatedCustomer);

	}catch(err){
		dbDebugger("server error: " , err)
		res.status(500).send(err)
	}
})

router.delete("/:id" ,  authorize, async (req,res) => {
	const id = req.params.id;
	try{
		const result = await Customer.deleteOne({_id: id});
		res.send(result)
	}catch(err){
		dbDebugger("server error: " , err)
		res.status(500).send(err)
	}
} )

const validateCustomer = (customer) => {
	const schema = Joi.object().keys({
		displayName: Joi.string().min(3).max(100),
		username: Joi.string().min(3).max(100).regex(/^(?![0-9])\w+$/).required(),
		isGold: Joi.boolean().optional(),
		phone: Joi.string().regex(/^[0-9+-]+$/).min(6).max(20),
		id: Joi.string().optional(),
		email: Joi.string().min(5).max(80).required().regex(/[^.*@.*$]/),
		password: Joi.string().min(6).max(80).required()
	})

	return Joi.validate(customer,schema);
}

module.exports = router;