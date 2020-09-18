const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

// importing constan, model, validation(string)
const constants = require("../config/constants.js");
const Users = require("../jokes/jokes-model.js");
const { isValid } = require("../jokes/jokes-service.js");

// REGISTER A NEW USER
router.post("/register", (req, res) => {
	// implement registration
	const credentials = req.body;

	if (isValid(credentials)) {
		const rounds = process.env.BCRYPT_ROUNDS || 8;

		// hashbrown potatoes the password
		const hash = bcryptjs.hashSync(credentials.password, rounds);

		credentials.password = hash;

		// save the user to the database
		Users.add(credentials)
			.then((user) => {
				res.status(201).json({ data: user });
			})
			.catch((error) => {
				res.status(500).json({ message: error.message });
			});
	} else {
		res.status(400).json({ message: "Please provide username and password" });
	}
}); // WORKING

// LOGIN AN EXISTING USER
router.post("/login", (req, res) => {
	// implement login
	const { username, password } = req.body;

	if (isValid(req.body)) {
		Users.findBy({ username: username })
			.then(([user]) => {
				// check the attempted login password against what is stored in the database
				if (user && bcryptjs.compareSync(password, user.password)) {
					const token = signToken(user);

					res.status(200).json({ message: "Welcome to our API!", token });
				} else {
					res.status(401).json({ message: "Invalid credentials! -inside /login -findBy-" });
				}
			})
			.catch((error) => {
				res.status(500).json({ message: error.message }, "500 Error Hello!");
			});
	} else {
		res.status(400).json({ message: "Please provide username and password!" });
	}
}); // WORKING

function signToken(user) {
	const payload = {
		subject: user.id,
		username: user.username,
		role: user.role,
	};

	const secret = constants.jwtSecret;

	const options = {
		expiresIn: "1d",
	};

	return jwt.sign(payload, secret, options);
}

module.exports = router;
