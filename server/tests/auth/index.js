const request = require('supertest');
const fs = require('fs')

users = JSON.parse(fs.readFileSync('./tests/data/auth.json'))

function userTests() {
   describe("Authentication Tests", function () {
      registerAllUsers()
      loginAllUser()
   })
}

function registerAllUsers() {
   for (const [key, value] of Object.entries(users)) {
      registerUser(key)
   }
}

function registerUser(u) {
   it("register " + users[u].username + " user", async () => {
      const [jwt, id] = await request(strapi.server.httpServer)
         .post("/api/auth/local/register")
         .set("accept", "application/json")
         .set("Content-Type", "application/json")
         .send({
            username: users[u].username,
            email: users[u].email,
            password: users[u].password,
         })
         .expect("Content-Type", /json/)
         .expect(200)
         .then((data) => {
            return [data.body.jwt, data.body.user.id]
         });
      //console.log(u,id)
      await changeRole(jwt, id, users[u].role)
   });
}

async function loginAllUser() {
   for (const [key, value] of Object.entries(users)) {
      loginUser(key)
   }
}

function loginUser(u) {
   it("login " + users[u].username + " user", async () => {
      await request(strapi.server.httpServer)
         .post("/api/auth/local")
         .set("accept", "application/json")
         .set("Content-Type", "application/json")
         .send({
            identifier: users[u].email,
            password: users[u].password
         })
         .expect("Content-Type", /json/)
         .expect(200)
         .then((data) => {
            expect(data.body.jwt).toBeDefined();
         });
      //const a = await getJWT("public")
      //console.log(a)
   });
}

async function changeRole(jwt, id, role) {
   await request(strapi.server.httpServer)
      .put('/api/users/' + id)
      .set('accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + jwt)
      .send({
         role: role
      })
      .expect(200)
      .then(data => {
         expect(data.body).toBeDefined();
      });
   await request(strapi.server.httpServer)
      .get('/api/users/me?populate=*')
      .set('accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + jwt)
      .expect(200)
      .then(data => {
         expect(data.body).toBeDefined();
         expect(data.body.role.id).toBe(role);
      });
}

async function getJWT(u) {
   dic = { "authenticated": 1, "public": 2, "student": 3, "teacher": 4, "teacher2":5}
   const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
      id: dic[u],
   });
   return [jwt, dic[u]]
}

module.exports = {
   userTests,
   registerAllUsers,
   registerUser,
   loginAllUser,
   loginUser,
   getJWT
};