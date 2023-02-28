const request = require('supertest');
const { getJWT } = require('../auth')
const fs = require('fs');


const classes = JSON.parse(fs.readFileSync('./tests/data/class.json'))
const goodClasses = classes.goodClasses
const multiClasses = classes.multiClasses
const errorClasses = classes.errorClasses
const updateClasses = classes.updateClasses


const classTests = {
   classTests() {
      describe("Class Tests", function () {
         classTests.createClasses()
         classTests.updateClasses()
         classTests.createManyClasses()
         classTests.getClasses()
         classTests.getClasses2()
      })
   },
   createClasses() {
      for (const key of Object.keys(goodClasses)) {
         classTests.createClass(key)
      }
   },
   createClass(c) {
      const clas = goodClasses[c]
      it("teacher class " + clas.name, async () => {
         const [jwt, idTeacher] = await getJWT("teacher")
         let id = await request(strapi.server.httpServer)
            .post('/api/classes')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(clas))
            .expect(200)
            .then(data => {
               return data.body.data.id
            });
         await request(strapi.server.httpServer)
            .get('/api/classes/' + id)
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then(data => {
               expect(data.body.data.attributes.name).toBe(clas.name)
               expect(data.body.data.attributes.author.data.id).toBe(idTeacher)
            });
      })
   },
   updateClasses() {
      for (const key of Object.keys(updateClasses)) {
         classTests.updateClass(key)
      }
   },
   updateClass(c) {
      const clas = updateClasses[c]
      it("teacher update class" + clas.id, async () => {
         const [jwt,] = await getJWT("teacher")
         const id = clas.id
         delete clas.id
         await request(strapi.server.httpServer)
            .put('/api/classes/' + id)
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(clas))
            .expect(200)
         await request(strapi.server.httpServer)
            .get('/api/classes/' + id)
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then(data => {
               for (const key in clas) {
                  expect(data.body.data.attributes[key]).toBe(clas[key])
               }
            });
      })
   },
   createManyClasses() {
      const clas = multiClasses.request3
      it("create multiple Classes with 1 request", async () => {
         const [jwt, idTeacher] = await getJWT("teacher")
         let ids = await request(strapi.server.httpServer)
            .post('/api/classes')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(clas))
            .expect(200)
            .then(data => {
               return data.body.map(d => { return d.data.id })
            });
         for (const key of Object.keys(clas)) {
            await request(strapi.server.httpServer)
               .get('/api/classes/' + ids[key])
               .set('accept', 'application/json')
               .set('Content-Type', 'application/json')
               .set('Authorization', 'Bearer ' + jwt)
               .expect(200)
               .then(data => {
                  expect(data.body.data.attributes.author.data.id).toBe(idTeacher)
                  expect(data.body.data.attributes.name).toBe(clas[key].name)
               })
         }
      })
   },
   getClasses() {
      it("teacher get classes", async () => {
         const [jwt,] = await getJWT("teacher")
         await request(strapi.server.httpServer)
            .get('/api/classes')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then(data => {
               expect(data.body.data.length).toBe(4)
            })
      })
   },
   getClasses2() {
      it("teacher2 get classes", async () => {
         const [jwt,] = await getJWT("teacher2")
         await request(strapi.server.httpServer)
            .get('/api/classes')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then(data => {
               expect(data.body.data.length).toBe(0)
            })
      })
   }
}

const classErrorTests = {
   classErrorTests() {
      describe("Class Error Tests", function () {
         classErrorTests.classErrorTest1()
         classErrorTests.classErrorTest2()
      })
   },
   classErrorTest1() {
      it("teacher create wrong class", async () => {
         const [jwt,] = await getJWT("teacher")
         const clas = errorClasses["request4"]
         await request(strapi.server.httpServer)
            .post('/api/classes')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(clas))
            .expect(400)
      })
   },
   classErrorTest2() {
      it("teacher get wrong occurrence", async () => {
         const [jwt,] = await getJWT("teacher2")
         await request(strapi.server.httpServer)
            .get('/api/classes/1')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(400)
            .then(data => {
               expect(data.body.error.message).toBe("You are not allowed to see this class")
            })
      })
   },
}

module.exports = {
   classTests,
   classErrorTests,
};

