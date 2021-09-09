const isAdmin = (req,res,next) => {
	console.log(req.user)
	if(req.user.role !== "admin") return res.status(403).send("You are trying to access a classified info.")
	next();
}


module.exports = isAdmin