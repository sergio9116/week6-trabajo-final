require("../models");
const request = require("supertest");
const app = require("../app");
const Category = require("../models/Category");


let TOKEN
let product
let category
let productId


const BASE_URL = '/api/v1/products'
const BASE_URL_LOGIN = '/api/v1/users/login'

afterAll(async () => {
    await category.destroy()
})

beforeAll(async () => {
    const user = {
        email: "juan.perez@gmail.com",
        password: "juan1234"
    }

    const res = await request(app)
        .post(BASE_URL_LOGIN)
        .send(user)

    TOKEN = res.body.token

    const categoryBody = {
        name: "Zapatillas"
    }

    category = await Category.create(categoryBody)

    product = {
        title: 'nike jordan',
        description: 'lorem ipsiubdm 2015',
        price: 500,
        categoryId: category.id
    }
})


test("POST -> 'BASE_URL', should return statusCode 201 and res.body.title === product.title", async () =>{
    const res = await request(app)
        .post(BASE_URL)
        .send(product)
        .set('Authorization', `Bearer ${TOKEN}`)

    productId = res.body.id

    expect(res.status).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.title).toBe(product.title)
});

test("GET -> 'BASE_URL', should return statusCode 200 and res.body.length = 1", async () => {
    const res = await request(app)
        .get(BASE_URL)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)

    expect(res.body[0].category).toBeDefined()
    expect(res.body[0].category.id).toBe(category.id)
});

test("GET -> 'BASE_URL/:id', should return statusCode 200 and res.body.title === product.title", async () => {
    const res = await request(app)
        .get(`${BASE_URL}/${productId}`)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.title).toBe(product.title)
    expect(res.body.category).toBeDefined()
    expect(res.body.category.id).toBe(category.id)
});

test("PUT -> 'BASE_URL/:id', should return statusCode 200 and res.body.title === productUpdate.title", async () => {
    const productUpdate = {
        title: 'nike jordan 2015'
    }

    const res = await request(app)
        .put(`${BASE_URL}/${productId}`)
        .send(productUpdate)
        .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.title).toBe(productUpdate.title)
});

test("DELETE -> 'BASE_URL/:id', should return statusCode 204", async () => {
    const res = await request(app)
        .delete(`${BASE_URL}/${productId}`)
        .set('Authorization', `Bearer ${TOKEN}`)
    
    expect(res.status).toBe(204)
});