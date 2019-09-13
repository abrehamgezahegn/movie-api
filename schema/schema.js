const mongoose = require("mongoose")

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
		required: true,
		minLength: 2,
		maxLength: 100,
	},
	username: {
		type: String,
		required: true,
		minLength: 2,
		maxLength: 100,
		match: /^(?![0-9])\w+$/
	},
	isGold: {
		type: Boolean,
		default: false
	},
	phone: {
		type: String,
		required: true,
		match: /^[0-9+-]+$/,
		minLength: 9,
		maxLength: 20
	},
	email: {
		type: String,
		unique: true,
		minLength: 7,
		maxLength: 80
	}
})

const Customer = mongoose.model("Customer" , customerSchema);



const movieSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	genres: [	
		{
			type:  mongoose.Schema.Types.ObjectId,
			ref: "Genre"
		}
	]
	,
	numberInStock: {
		type: Number,
		required: true
	}
})

const Movie = mongoose.model("Movie" , movieSchema);

const rentalSchema = new mongoose.Schema({
	movie:{		
			type: mongoose.Schema.Types.ObjectId,
			ref: "Movie",
			required: true
		// 	validate: {
		// 		validator: function(movies){
		// 			const filtered = movies.filter(Boolean)
		// 			return filtered && filtered.length > 0
		// 		},
		// 		message: "A rental must have a movie"
		// }	
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