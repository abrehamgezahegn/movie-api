const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");


const genreSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minLength: 3,
		maxLength: 100
	},
	related: {
		type: [String],
		required: true,
		validate: {
			validator : function(related){
				return related && related.length > 0
			},
			message: "genre must atleast have one related genre"
		}
	},
	birthdate: {
		type: Date,
		default: Date.now,
	},
	subscribers: {
		type: Number,
		required: true
	},

})

const Genre = mongoose.model("Genre" , genreSchema)


const customerSchema = new mongoose.Schema({
	displayName: {
		type: String,
		minLength: 2,
		maxLength: 100,
	},
	username: {
		type: String,
		minLength: 2,
		maxLength: 100,
		match: /^(?![0-9])\w+$/,
		required: true,
		unique: true
	},
	isGold: {
		type: Boolean,
		default: false
	},
	phone: {
		type: String,
		match: /^[0-9+-]+$/,
		minLength: 9,
		maxLength: 20
	},
	email: {
		type: String,
		unique: true,
		minLength: 7,
		maxLength: 80,
		required: true
	},
	password: {
		type: String,
		minLength: 6,
		maxLength: 80,
		required: true
	},
	role: String
})

customerSchema.methods.generateAuthToken = function(){
	return jwt.sign({id: this._id , email: this.email , role: this.role} , process.env.JWT_SECRET);
}


const Customer = mongoose.model("Customer" , customerSchema);

const movieSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	genre: 
		{
			type:  mongoose.Schema.Types.ObjectId,
			ref: "Genre",
			required: true
		}
	,
	numberInStock: {
		type: Number,
		required: true
	}
})

const Movie = mongoose.model("Movie" , movieSchema);

const rentalSchema = new mongoose.Schema({
	// movie:{		
	// 		type: mongoose.Schema.Types.ObjectId,
	// 		ref: "Movie",
	// 		required: true
	// 	// 	validate: {
	// 	// 		validator: function(movies){
	// 	// 			const filtered = movies.filter(Boolean)
	// 	// 			return filtered && filtered.length > 0
	// 	// 		},
	// 	// 		message: "A rental must have a movie"
	// 	// }	
	// },

	movies: {
		type: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Movie"
		}],
		required: true,
		validate: {
				validator: function(movies){
					const filtered = movies.filter(Boolean)
					return filtered && filtered.length > 0
				},
				message: "A rental must have atleast one movie"
		}	
	},

	dateOut: {
		type: Date,
		default: Date.now()
	},
	customer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Customer",
		required: true
	}
})


const Rental = mongoose.model("Rental" , rentalSchema);

module.exports = {
	 Genre,
	 Customer,
	 Movie,
	 Rental
}