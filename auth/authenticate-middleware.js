/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const jwt = require("jsonwebtoken");
const constants = require("../config/constants.js");

module.exports = (req, res, next) => {
	const token = req.headers.authorization;

	if (token) {
		jwt.verify(token, constants.jwtSecret, (error, decodedToken) => {
			if (error) {
				// token is not valid or was modified or has expired
				res.status(401).json({ you: "SHALL NOT PASS!" });
			} else {
				// token is good and have access
				req.decodedToken = decodedToken;

				next();
			}
		});
	} else {
		res.status(402).json({ message: "Please provide credentials" });
	}
};

//custom middleware from previous work for reference

// function validateUserId(req, res, next) {
// 	// do your magic!
// 	UserDb.getById(req.params.id)
// 		.then((result) => {
// 			if (!result) {
// 				res.state(404).json({ error: "user ID validation error" });
// 			} else {
// 				next();
// 			}
// 		})
// 		.catch((err) => {
// 			res.status(500).json({ error: "ID validation getById error" });
// 		});
// }

// function validateUser(req, res, next) {
// 	// do your magic!
// 	if (!req.body.name) {
// 		res.status(404).json({ error: "create user validation error" });
// 	} else {
// 		next();
// 	}
// }

// function validatePost(req, res, next) {
// 	// do your magic!
// 	let post = req.body;
// 	if (!post.text) {
// 		res.status(500).json({ message: "post validation error" });
// 	} else {
// 		next();
// 	}
// }
