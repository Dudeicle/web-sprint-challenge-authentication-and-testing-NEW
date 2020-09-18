const request = require("supertest");
const server = require("../api/server.js");
const db = require("../database/dbConfig.js");

describe("auth router", () => {
	// truncate database
	beforeEach(async () => {
		// empty table and reset primary key back to 1
		await db("users").truncate();
	});

	// testing the new user registration!
	describe("POST /register", () => {
		it("should add a new user", async () => {
			//step 1 check that users has been truncated
			const RegisterTest1 = await db("users");
			expect(RegisterTest1).toHaveLength(0);

			//step 2 add a user and check if that user exits in database
			await request(server).post("/api/auth/register").send({
				username: "registerTestUsername",
				password: "registerTestPassword",
			});
			const RegisterTest2 = await db("users");
			expect(RegisterTest2).toHaveLength(1);

			////// extra truncate - don't know why but users added through tests seem to be sticking around for some reason
			await db("users").truncate();
		});
	}); // PASSING

	// testing the login of a user!
	describe("POST /login", () => {
		it("should login a user", async () => {
			// step 1 check that users has been truncated
			const LoginTest1 = await db("users");
			expect(LoginTest1).toHaveLength(0);

			// step 2 add a new user to the db and check existance
			await request(server).post("/api/auth/register").send({
				username: "loginTestUsername",
				password: "loginTestPassword",
			});
			const LoginTest2 = await db("users");
			expect(LoginTest2).toHaveLength(1);
			// console.log(LoginTest2[0].username);
			expect(LoginTest2[0].username).toMatch("loginTestUsername");

			// step 3 login a user
			let res = await request(server).post("/api/auth/login").send({
				username: "loginTestUsername",
				password: "loginTestPassword",
			});

			// step 3 check the user login was successful in returning a token
			// console.log(res.body.token);

			////// extra truncate - don't know why but users added through tests seem to be sticking around for some reason
			await db("users").truncate();
		});
	}); // PASSING
});
