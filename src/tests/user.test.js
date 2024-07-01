const request = require('supertest');
const app = require('../app');

let TOKEN
let userId

const BASE_URL = '/api/v1/users'


beforeAll(async () => {
  const body = {
    email: "juan.perez@gmail.com",
    password: "juan1234"
  }

  const res = await request(app)
    .post(`${BASE_URL}/login`)
    .send(body)
  //console.log(res.body.token);

  TOKEN = res.body.token
})

test("POST -> 'BASE_URL', should return statusCode 201, and res.body.firstName === user.firstName", async () => {
    const user = {
      firstName: "Alvaro",
      lastName: "Mendez",
      email: "alvaro@gmail.com",
      password: "alvaro1234",
      phone: "2347920"
    }
    const res = await request(app)
      .post(BASE_URL)
      .send(user)

userId = res.body.id
      
    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.firstName).toBe(user.firstName)
  });


test("GET -> 'BASE_URL', should return statusCode 200, and res.body.length === 2", async () => {
    const res = await request(app)
      .get(BASE_URL)
      .set('Authorization', `Bearer ${TOKEN}`)

    //console.log(res.body);
    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(2)
  });

 test("PUT -> 'BASE_URL/:id' should return statusCode 200, and res.body.lastName === userUpdate.lastName", async () => {
    const userUpdate  = {
        lastName: "Martin",
    }

    const res = await request(app)
        .put(`${BASE_URL}/${userId}`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(userUpdate)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.lastName).toBe(userUpdate.lastName)
  });

test("POST -> 'BASE_URL/login',should return statusCode 401", async () => { // test para el error
    const body = {
      email: "alvaro@gmail.com",
      password: "credential invalid" // passsword diferente a la correcta
    }

    const res = await request(app)
      .post(`${BASE_URL}/login`)
      .send(body)

    //console.log(res.body);

    expect(res.status).toBe(401)
});

test("POST -> 'BASE_URL/login', should return statusCode 200, res.body.user and res.body.token to be defined, and res.body.user.email === body.email", async () => {
    const body = {
      email: "alvaro@gmail.com",
      password: "alvaro1234"
    }

    const res = await request(app)
      .post(`${BASE_URL}/login`)
      .send(body)
    
    //console.log(res.body);

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.user).toBeDefined()
    expect(res.body.token).toBeDefined()
    expect(res.body.user.email).toBe(body.email)
});


test("DELETE -> 'BASE_URL/:id', should return statusCode 204", async () => {
    const res = await request(app)
      .delete(`${BASE_URL}/${userId}`)
      .set('Authorization', `Bearer ${TOKEN}`)

     expect(res.status).toBe(204)
});