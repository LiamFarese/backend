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

describe("POST - /items/:vendorId/create Create Item", () => {

    it("Should create a new item and return it with a 201 response code", async () => {
        const vendor = await setUpVendor();

        const res = await request(app)
        .post(`/items/${vendor.verifiedUser._id}/create`)
        .set("Authorization", vendor.accessToken)
        .send({name: "testItem", price: 10, stock: 100, category: "shoes", vendorId: vendor.verifiedUser._id});

        expect(res.status).toBe(201);
        expect(res.body.name).toBe("testItem");
        expect(res.body.vendorId).toBe(vendor.verifiedUser._id);
        expect(res.body.stock).toBe(100);
        expect(true).toBe(true)
    })
    it("Should not allow an item to be created with a string for a price", async () => {
        const vendor = await setUpVendor();
        const res = await request(app)
        .post(`/items/${vendor.verifiedUser._id}/create`)
        .set("Authorization", vendor.accessToken)
        .send({name: "testItem2", price: "foo" , stock: 100, category: "books", vendorId: vendor.verifiedUser._id})

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("price must be an number")

    })
    it("Should not allow an item to be created with a string for a stock", async () => {
        const vendor = await setUpVendor();
        const res = await request(app)
        .post(`/items/${vendor.verifiedUser._id}/create`)
        .set("Authorization", vendor.accessToken)
        .send({name: "testItem2", price: 10 , stock: "bar", category: "books", vendorId: vendor.verifiedUser._id})

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("stock must be an number")

    })
})

describe("GET - /" , () => {

    it("Should return 3 items inserted into the database", async () => {
        const vendor = await setUpVendor();
        
        await request(app)
        .post(`/items/${vendor.verifiedUser._id}/create`)
        .set("Authorization", vendor.accessToken)
        .send({name: "testItem1", price: 10 , stock: 1, category: "books", vendorId: vendor.verifiedUser._id})

        await request(app)
        .post(`/items/${vendor.verifiedUser._id}/create`)
        .set("Authorization", vendor.accessToken)
        .send({name: "testItem2", price: 10 , stock: 2, category: "books", vendorId: vendor.verifiedUser._id})

        await request(app)
        .post(`/items/${vendor.verifiedUser._id}/create`)
        .set("Authorization", vendor.accessToken)
        .send({name: "testItem3", price: 1 , stock: 4, category: "books", vendorId: vendor.verifiedUser._id})

        const res = await request(app)
        .get(`/items/${vendor.verifiedUser._id}`)
        .set("Authorization", vendor.accessToken)
        
        expect(res.body.length).toBe(3);

    })
})

describe("DELETE - /items/:vendorId/:itemId", () => {

    it("Should delete the item created and return status 202, and message item successfully deleted ", async () => {
        const vendor = await setUpVendor();

        const item = await request(app)
        .post(`/items/${vendor.verifiedUser._id}/create`)
        .set("Authorization", vendor.accessToken)
        .send({name: "testItem", price: 10, stock: 100, category: "shoes", vendorId: vendor.verifiedUser._id});

        const res = await request(app)
        .delete(`/items/${vendor.verifiedUser._id}/${item.body._id}`)
        .set("Authorization", vendor.accessToken)

        expect(res.status).toBe(202)
        expect(res.body.message).toBe("item successfully deleted")
    })
})

/**creates a dummy vendor user for logging in to get the access token */
const setUpVendor = async () => {
    const user = await createUser("testUser", "testpassword", "vendor");
    await saveUser(user);
    const vendor = await request(app)
        .post("/auth/login").send({username: "testUser", password: "testpassword"});

    return vendor.body;
}
   
