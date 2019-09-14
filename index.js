require('dotenv').config()
const express = require('express');
const helmet = require("helmet");
const morgan = require("morgan");

const mongoose = require("mongoose");

// debug env instances
const debugStartup = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");


// routers
const genresRouter = require("./routers/genres");
const rootRouter = require("./routers/root");
const customersRouter = require("./routers/customers");
const moviesRouter = require("./routers/movies");
const rentalRouter = require("./routers/rentals")
const authRouter = require('./routers/auth');

const app = express();

// mongoose db connection
mongoose
		.connect("mongodb://localhost/vidly" , { useNewUrlParser: true ,useCreateIndex: true  })
		.then(() => {dbDebugger("connected to mongoose")})
		.catch(err => {dbDebugger(err)})


debugStartup("app startin up");


app.use(helmet());
app.use(express.json());
app.use(morgan("tiny"))

// Auth middlewares


// router middlewares
app.use("/api/genres" , genresRouter);
app.use("/api/customers" , customersRouter)
app.use("/api/movies" , moviesRouter);
app.use("/api/rentals" , rentalRouter);
app.use("/api/auth" , authRouter)
app.use('/' , rootRouter)


const port = process.env.PORT || 3000 ;

console.log(process.env.NODE_ENV)

app.listen(port , () =>{
	console.log(`Vidly running on ${port}`)
})