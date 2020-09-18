const request = require("supertest");
const server = require("../api/server.js");
const db = require("../database/dbConfig.js");

describe("jokes-router", () => {
	// truncate users table
	beforeEach(async () => {
		// empty users table and reset PK to 1
		await db("users").truncate();
		const trunkTest = await db("users");
		expect(trunkTest).toHaveLength(0);
	});

	// testing the GET endpoint!
	// "https://icanhazdadjoke.com/search"
	describe("GET /", () => {
		it("should return an array of dad jokes", async () => {
			// step 1 check that users has been truncated
			const getTestUsersPresent1 = await db("users");
			expect(getTestUsersPresent1).toHaveLength(0);

			// step 2 add a user
			await request(server).post("/api/auth/register").send({
				username: "getTestUsername",
				password: "getTestPassword",
			});

			// step 3 login a user
			let res = await request(server).post("/api/auth/login").send({
				username: "getTestUsername",
				password: "getTestPassword",
			});

			// step 4 check that res.body contains token & set to variable
			//// console.log(res.body.token); // token confirmed
			let token = res.body.token;

			// step 5 use token to access GET endpoint behind authentication
			let result = await request(server).get("/api/jokes").set({ Authorization: token });

			// step 6 examine the result of the get request
			console.log("DAD JOKES", result.body);
			// expect(result.body[0]).toHaveLength(20);

			////// extra truncate - don't know why but users added through tests seem to be sticking around for some reason
			await db("users").truncate();
		});
	});
});
