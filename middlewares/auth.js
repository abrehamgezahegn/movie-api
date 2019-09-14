const jwt = require("jsonwebtoken");

const authorize = (req,res,next) => {
	const token = req.header('auth_token');
	if(!token) return res.status(401).send("Access denied.Token is required.")

	try{
		const decoded = jwt.verify(process.env.JWT_TOKEN);
		console.log("decoded: " , decoded);
		next();
	}catch(err){
		res.status(401).send("Access denied.Token is tempered with.")
	}
}

module.exports = authorize;