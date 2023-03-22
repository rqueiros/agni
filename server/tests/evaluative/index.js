const request = require('supertest');
const { getJWT } = require('../auth')
const fs = require('fs');


const evaluatives = JSON.parse(fs.readFileSync('./tests/data/evaluative.json'))
const goodEvaluatives = evaluatives.goodEvaluatives
const multiEvaluatives = evaluatives.multiEvaluatives
const errorEvaluatives = evaluatives.errorEvaluatives
const updateEvaluatives = evaluatives.updateEvaluatives


const evaluativeTests = {
   evaluativeTests() {
      describe("Evaluative Tests", function () {
         evaluativeTests.createEvaluatives()
         evaluativeTests.createManyEvaluatives()
         evaluativeTests.updateEvaluative1()
         evaluativeTests.updateEvaluative2()
      })
   },
   createEvaluatives() {
      for (const key of Object.keys(goodEvaluatives)) {
         evaluativeTests.createEvaluative(key)
      }
   },
   createEvaluative(key) {
      const evaluative = goodEvaluatives[key]
      it("teacher create " + evaluative.name, async () => {
         const [jwt, idTeacher] = await getJWT("teacher")
         let id = 0
         if (evaluative.name == "evaluative2") {
            id = await request(strapi.server.httpServer)
               .post('/api/evaluatives')
               .set('accept', 'application/json')
               .set('Content-Type', 'application/json')
               .set('Authorization', 'Bearer ' + jwt)
               .field("data", JSON.stringify(evaluative))
               .attach("files.image", "./tests/data/files/images/image1.png")
               .expect(200)
               .then(data => {
                  return data.body.data.id
               });
         } else {
            id = await request(strapi.server.httpServer)
               .post('/api/evaluatives')
               .set('accept', 'application/json')
               .set('Content-Type', 'application/json')
               .set('Authorization', 'Bearer ' + jwt)
               .field("data", JSON.stringify(evaluative))
               .expect(200)
               .then(data => {
                  return data.body.data.id
               });
         }
         await request(strapi.server.httpServer)
            .get('/api/evaluatives/' + id)
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then(data => {
               expect(data.body.data.attributes.author.data.id).toBe(idTeacher)
               checkKeys(evaluative, data.body.data.attributes)

            });
      })
   },
   updateEvaluative1() {
      const evaluative = updateEvaluatives.request8
      it("teacher update evaluative1", async () => {
         const [jwt,] = await getJWT("teacher")
         await request(strapi.server.httpServer)
            .put('/api/evaluatives/1')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(evaluative))
            .expect(200)
         await request(strapi.server.httpServer)
            .get('/api/evaluatives/2')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
      })
   },
   updateEvaluative2() {
      const evaluative = updateEvaluatives.request9
      it("teacher update evaluative2", async () => {
         const [jwt,] = await getJWT("teacher")
         await request(strapi.server.httpServer)
            .put('/api/evaluatives/2')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(evaluative))
            .attach("files.image", "./tests/data/files/images/image1.png")
            .expect(200)
         await request(strapi.server.httpServer)
            .get('/api/evaluatives/2')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
      })
   },
   createManyEvaluatives() {
      const evaluative = multiEvaluatives.request6
      it("create multiple Evaluatives with 1 request", async () => {
         const [jwt, idTeacher] = await getJWT("teacher")
         let ids = await request(strapi.server.httpServer)
            .post('/api/evaluatives')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(evaluative))
            .attach("files.image", "./tests/data/files/images/image1.png")
            .expect(200)
            .then(data => {
               return data.body.map(d => { return d.data.id })
            });
         for (const key of Object.keys(evaluative)) {
            await request(strapi.server.httpServer)
               .get('/api/evaluatives/' + ids[key])
               .set('accept', 'application/json')
               .set('Content-Type', 'application/json')
               .set('Authorization', 'Bearer ' + jwt)
               .expect(200)
               .then(data => {
                  expect(data.body.data.attributes.author.data.id).toBe(idTeacher)
                  checkKeys(evaluative[key], data.body.data.attributes)
               })
         }
      })
   }
}

const evaluativeErrorTests = {
   evaluativeErrorTests() {
      describe("Evaluative Error Tests", function () {
         evaluativeErrorTests.evaluativeErrorTest1()
         evaluativeErrorTests.evaluativeErrorTest2()
         evaluativeErrorTests.evaluativeErrorTest3()
         evaluativeErrorTests.evaluativeErrorTest4()
      })
   },
   evaluativeErrorTest1() {
      it("teacher create wrong evaluative11", async () => {
         const [jwt,] = await getJWT("teacher")
         const evaluative = errorEvaluatives["request7"]
         await request(strapi.server.httpServer)
            .post('/api/evaluatives')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(evaluative))
            .attach("files.image", "./tests/data/files/images/image2.png")
            .expect(400)
            .then(data => {
               expect(data.body.error.message).toBe("image names and submitted image names must be equal")
            });
      })
   },
   evaluativeErrorTest2() {
      it("teacher create wrong evaluative12", async () => {
         const [jwt,] = await getJWT("teacher")
         const evaluative = errorEvaluatives["request10"]
         await request(strapi.server.httpServer)
            .post('/api/evaluatives')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(evaluative))
            .expect(400)
            .then(data => {
               expect(data.body.error.message).toBe("test type and subtype are not combinable")
            });
      })
   },
   evaluativeErrorTest3() {
      it("teacher create wrong evaluative13", async () => {
         const [jwt,] = await getJWT("teacher")
         const evaluative = errorEvaluatives["request11"]
         await request(strapi.server.httpServer)
            .post('/api/evaluatives')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(evaluative))
            .expect(400)
            .then(data => {
               expect(data.body.error.message).toBe("test type and subtype are not combinable")
            });
      })
   },
   evaluativeErrorTest4() {
      it("teacher create wrong evaluative14", async () => {
         const [jwt,] = await getJWT("teacher")
         const evaluative = errorEvaluatives["request12"]
         await request(strapi.server.httpServer)
            .post('/api/evaluatives')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(evaluative))
            .expect(400)
            .then(data => {
               expect(data.body.error.message).toBe("test type and subtype are not combinable")
            });
      })
   }
}


module.exports = {
   evaluativeTests,
   evaluativeErrorTests
};


function checkKeys(data, respData) {
   for (key in data) {
      if (Array.isArray(data[key]) == true && key != "questions") {
         const d = data[key]
         const rD = respData[key]
         const l = d.length
         for (let i = 0; i < l; i++) {
            checkKeys(d[i], rD[i])
         }
      } else if (key != "questions") {
         expect(respData[key]).toBe(data[key])
      }
   }
}
