const autho = (req,res,next) => {
	console.log("autorization...")
	next()
}

module.exports = autho