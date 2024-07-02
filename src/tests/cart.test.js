require("../models");
const request = require("supertest");
const app = require("../app");
const Product = require("../models/Product");
//const Category = require ("../models/Category");


let TOKEN 
let cart
let product
let cartId

const BASE_URL = '/api/v1/cart'
const BASE_URL_LOGIN = '/api/v1/users/login'

beforeAll(async () => {
    const user = {
        email: "juan.perez@gmail.com",
        password: "juan1234"
    }

    const res = await request(app)
        .post(BASE_URL_LOGIN)
        .send(user)

    TOKEN = res.body.token

    product = await Product.create({ 
        title: 'nike 2021',
        description: 'lorem ipsuom ipsum 2021',
        price: 650
    })

    cart = { 
        quantity: 1,
        productId: product.id
    }
})

afterAll(async () => {
    await product.destroy()
})

test("POST -> 'BASE_URL', should return statusCode 201 and res.body.quantity === cart.quantity", async () => {
    const res = await request(app)
        .post(BASE_URL)
        .send(cart)
        .set('Authorization', `Bearer ${TOKEN}`)
    
    cartId = res.body.id

    expect(res.status).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.quantity).toBe(cart.quantity)   
});

test("GET -> 'BASE_URL', should return statusCode 200 and res.body to have length = 1", async () => {
    const res = await request(app)
        .get(BASE_URL)
        .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
});

test("GET -> 'BASE_URL/:id', should return statusCode 200 and res.body.quantity === cart.quantity", async () => {
    const res = await request(app)
        .get(`${BASE_URL}/${cartId}`)
        .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.quantity).toBe(cart.quantity)
});

test("PUT -> 'BASE_URL/id', should return statusCode 200 and res.body.quantity === cartUpdate.quantity", async () => {
    const cartUpdate = {
        quantity: 2
    }

    const res = await request(app)
        .put(`${BASE_URL}/${cartId}`)
        .send(cartUpdate)
        .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.quantity).toBe(cartUpdate.quantity)

});

test("DELETE -> 'BASE_URL/:id', should return statusCode 204", async () => {
    const res = await request(app)
        .delete(`${BASE_URL}/${cartId}`)
        .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.status).toBe(204)
})

