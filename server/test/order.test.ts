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

describe("POST - Create an order /:vendorId/create", () => {

    it("Should successfully create an order and return status 201", async() => {
        const setUp = await setUpItems();
        const vendorId = setUp.vendor.verifiedUser._id
        const item1 = setUp.items.body[0]._id
        const name = setUp.items.body[0].name
        const item3 = setUp.items.body[2]._id

        const res = await request(app)
        .post(`/orders/${vendorId}/create`)
        .set("Authorization", setUp.vendor.accessToken)
        .send({userId: vendorId, vendorId: vendorId, items: [{itemId: item1, name: name, price: 10, quantity: 100}], 
        customItems: [], total: 100})
        
        expect(res.status).toBe(201);
    })
    it("Should fail to create an order and return status 500 with an error message", async() => {
        const setUp = await setUpItems();
        const vendorId = setUp.vendor.verifiedUser._id
        const item1 = setUp.items.body[0]._id
        const name = setUp.items.body[0].name
        const item3 = setUp.items.body[2]._id

        const res = await request(app)
        .post(`/orders/${vendorId}/create`)
        .set("Authorization", setUp.vendor.accessToken)
        .send({userId: vendorId, vendorId: vendorId, items: [{itemId: item1, name: name, price: 10, quantity: 101}], 
        customItems: [], total: 100})
        
        expect(res.status).toBe(500);
    })


})

describe("DELETE - /:vendorId/:orderId", ()=> {
    it("Should delete an order to simulate refunding an order", async() => {
        const setUp = await setUpItems();
        const vendorId = setUp.vendor.verifiedUser._id
        const item1 = setUp.items.body[0]._id
        const name = setUp.items.body[0].name
        const item3 = setUp.items.body[2]._id

        const order = await request(app)
        .post(`/orders/${vendorId}/create`)
        .set("Authorization", setUp.vendor.accessToken)
        .send({userId: vendorId, vendorId: vendorId, items: [{itemId: item1, name: name, price: 10, quantity: 100}], 
        customItems: [], total: 100})
        
        const orderId = order.body._id;

        const res = await request(app)
        .delete(`/orders/${vendorId}/${orderId}`)
        .set("Authorization", setUp.vendor.accessToken)

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("order successfully deleted")

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

const setUpItems = async () => {
    const vendor = await setUpVendor();

    await request(app)
        .post(`/items/${vendor.verifiedUser._id}/create`)
        .set("Authorization", vendor.accessToken)
        .send({name: "testItem1", price: 10 , stock: 100, category: "books", vendorId: vendor.verifiedUser._id})

    await request(app)
        .post(`/items/${vendor.verifiedUser._id}/create`)
        .set("Authorization", vendor.accessToken)
        .send({name: "testItem2", price: 15 , stock: 50, category: "books", vendorId: vendor.verifiedUser._id})

    await request(app)
        .post(`/items/${vendor.verifiedUser._id}/create`)
        .set("Authorization", vendor.accessToken)
        .send({name: "testItem3", price: 1 , stock: 25, category: "books", vendorId: vendor.verifiedUser._id})
    
    const items = await request(app)
        .get(`/items/${vendor.verifiedUser._id}`)
        .set("Authorization", vendor.accessToken) 

    return {vendor, items};
}   