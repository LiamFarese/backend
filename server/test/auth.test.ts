import request from "supertest";
import app from "../src/app";
import { connect, drop, close } from "./testDB";
import { createUser, saveUser } from "../src/models/User";

beforeAll(async() => {
    await connect();
})

afterEach(async() => {
    await drop();
})

afterAll(async() => {
    await drop();
    await close();
})

describe("POST - /auth/register", () => {
    it("should return status 201 if the user is successfully created", async () => {
        const res  = await request(app)
        .post("/auth/register")
        .send({username: "testUser", password: "testPassword", userType: "administrator", vendorId: null});

        expect(res.status).toBe(201);
        expect(res.body.username).toBe("testUser");
        expect(res.body.userType).toBe("administrator");
     })
    it("should throw an error if any field is missing", async () => {
        const res = await request(app)
        .post("/auth/register")
        .send({username: "", password: "testPassword", userType: "administrator", vendorId: null});

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Missing required fields")
    })
    it("should throw an error if the userType does not match the pre defined types", async () => {
        const res = await request(app)
        .post("/auth/register")
        .send({username: "testUser", password: "testPassword", userType: "foo", vendorId: null});

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("could not create user: not a valid user type")
    })

})

describe("POST - /auth/login", () => {

    it("Should retrieve a user successfully if they exist in the database", async () => {
        await userSetup();
        const res = await request(app)
        .post("/auth/login")
        .send({username: "testUser", password: "testpassword"});

        expect(res.status).toBe(200);
        expect(res.body.verifiedUser.username).toBe("testUser");
        expect(res.body).toHaveProperty("accessToken");
    })
    it("Should return a 404 if the user does not exist", async () => {
        await userSetup();
        const res = await request(app)
        .post("/auth/login")
        .send({username: "foo", password: "bar"});

        expect(res.status).toBe(404);
    })

})

describe("POST - /auth/logout", () => {

    it("Should log out the correct user", async () => {
        await userSetup();
        const res = await request(app)
        .post("/auth/login")
        .send({username: "testUser", password: "testpassword"});

        const logout = await request(app)
        .post("/auth/logout")
        .set("Cookie" , res.header["set-cookie"])

        expect(logout.status).toBe(200);
        expect(res.header["set-cookie"]).not.toContain("refresh_token=");
    })
})

describe("GET - /auth/refresh", () => {

    it("Should retrieve a new access token if reached", async () => {
        await userSetup();
        const res = await request(app)
        .post("/auth/login")
        .send({username: "testUser", password: "testpassword"});

        const refresh = await request(app)
        .get("/auth/refresh")
        .set("Cookie" , res.header["set-cookie"]);

        expect(refresh.status).toBe(201);
        expect(refresh.body).toHaveProperty("accessToken")

    })
})

const userSetup = async () => {
    const user = await createUser("testUser", "testpassword", "vendor");
    const savedUser = await saveUser(user);
    return savedUser;
}