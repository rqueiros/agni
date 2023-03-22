const request = require('supertest');
const fs = require('fs')

const users = JSON.parse(fs.readFileSync('./tests/data/auth.json'))

const authTests = {
   authTests() {
      describe("Authentication Tests", function () {
         authTests.registerUsers()
         authTests.loginUsers()
      })
   },
   registerUsers() {
      for (const key of Object.keys(users)) {
         authTests.registerUser(key)
      }
   },
   registerUser(key) {
      const user = users[key]
      it("register " + user.username + " user", async () => {
         const [jwt, id] = await request(strapi.server.httpServer)
            .post("/api/auth/local/register")
            .set("accept", "application/json")
            .set("Content-Type", "application/json")
            .send({
               username: user.username,
               email: user.email,
               password: user.password,
            })
            .expect(200)
            .then(data => {
               expect(data.body.user.username).toBe(user.username)
               expect(data.body.user.email).toBe(user.email)
               expect(data.body.jwt).toBeDefined()
               return [data.body.jwt, data.body.user.id]
            });
         await authTests.changeRole(jwt, id, user.role)
      });
   },
   async loginUsers() {
      for (const key of Object.keys(users)) {
         authTests.loginUser(key)
      }
   },
   loginUser(key) {
      const user = users[key]
      it("login " + user.username + " user", async () => {
         await request(strapi.server.httpServer)
            .post("/api/auth/local")
            .set("accept", "application/json")
            .set("Content-Type", "application/json")
            .send({
               identifier: user.email,
               password: user.password
            })
            .expect(200)
            .then(data => {
               expect(data.body.user.username).toBe(user.username)
               expect(data.body.user.email).toBe(user.email)
               expect(data.body.jwt).toBeDefined();
            });
      });
   },
   async changeRole(jwt, id, role) {
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
            expect(data.body.role.id).toBe(role)
         });
   }
}

async function getJWT(user) {
   dic = { "authenticated": 1, "public": 2, "student": 3, "teacher": 4, "teacher2": 5 }
   const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
      id: dic[user],
   });
   return [jwt, dic[user]]
}

module.exports = {
   authTests,
   getJWT
};