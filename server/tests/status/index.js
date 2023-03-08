const request = require('supertest');
const { getJWT } = require('../auth')
const fs = require('fs');


const statuses = JSON.parse(fs.readFileSync('./tests/data/status.json'))
const goodStatuses = statuses.goodStatuses
const multiStatuses = statuses.multiStatuses
const errorStatuses = statuses.errorStatuses
const updateStatuses = statuses.updateStatuses


const statusTests = {
   statusTests() {
      describe("Status Tests", function () {
         statusTests.createStatuses()
         statusTests.updateStatuses()
         statusTests.createManyStatuses()
      })
   },
   createStatuses() {
      for (const key of Object.keys(goodStatuses)) {
         statusTests.createStatus(key)
      }
   },
   createStatus(s) {
      const status = goodStatuses[s]
      it("student create status", async () => {
         const [jwt, ] = await getJWT("student")
         let id = await request(strapi.server.httpServer)
            .post('/api/statuses')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(status))
            .expect(200)
            .then(data => {
               return data.body.data.id
            });
         await request(strapi.server.httpServer)
            .get('/api/statuses/' + id)
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then(data => {
               expect(data.body.data.attributes.grade).toBe(status.grade)
            });
      })
   },
   updateStatuses() {
      for (const key of Object.keys(updateStatuses)) {
         statusTests.updateStatus(key)
      }
   },
   updateStatus(s) {
      const status = updateStatuses[s]
      it("student update status", async () => {
         const [jwt,] = await getJWT("student")
         const id = status.id
         delete status.id
         await request(strapi.server.httpServer)
            .put('/api/statuses/' + id)
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(status))
            .expect(200)
         await request(strapi.server.httpServer)
            .get('/api/statuses/' + id)
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then(data => {
               expect(data.body.data.attributes.answer[0].code).toBe("some new code")
            });
      })
   },
   createManyStatuses() {
      const status = multiStatuses.request3
      it("create multiple Statuses with 1 request", async () => {
         const [jwt, ] = await getJWT("student")
         let ids = await request(strapi.server.httpServer)
            .post('/api/statuses')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(status))
            .expect(200)
            .then(data => {
               return data.body.map(d => { return d.data.id })
            });
         for (const key of Object.keys(status)) {
            await request(strapi.server.httpServer)
               .get('/api/statuses/' + ids[key])
               .set('accept', 'application/json')
               .set('Content-Type', 'application/json')
               .set('Authorization', 'Bearer ' + jwt)
               .expect(200)
               .then(data => {
                  expect(data.body.data.attributes.grade).toBe(status[key].grade)
               })
         }
      })
   },
   getStudents() {
      it("teacher get students", async () => {
         const [jwt,] = await getJWT("teacher")
         await request(strapi.server.httpServer)
            .get('/api/students')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then(data => {
               expect(data.body.data.length).toBe(5)
            })
      })
   },
   getStudents2() {
      it("teacher2 get students", async () => {
         const [jwt,] = await getJWT("teacher2")
         await request(strapi.server.httpServer)
            .get('/api/students')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then(data => {
               expect(data.body.data.length).toBe(0)
            })
      })
   },
   getCourses() {
      it("student get courses", async () => {
         const [jwt, id] = await getJWT("student")
         await request(strapi.server.httpServer)
            //.get('/api/courses?populate=student{"id":'+id+'}')
            .get('/api/courses?filter[id][$eq]=1')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
      })
   },
}

const statusErrorTests = {
   statusErrorTests() {
      describe("Status Error Tests", function () {
         statusErrorTests.statusErrorTest1()
      })
   },
   statusErrorTest1() {
      it("student create wrong status", async () => {
         const [jwt,] = await getJWT("student")
         const status = errorStatuses["request4"]
         await request(strapi.server.httpServer)
            .post('/api/statuses')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(status))
            .expect(400)
      })
   },
}

module.exports = {
   statusTests,
   statusErrorTests,
};

