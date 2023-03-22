const request = require('supertest');
const { getJWT } = require('../auth')
const fs = require('fs');


const expositives = JSON.parse(fs.readFileSync('./tests/data/expositive.json'))
const goodExpositives = expositives.goodExpositives
const multiExpositives = expositives.multiExpositives
const errorExpositives = expositives.errorExpositives


const expositiveTests = {
   expositiveTests() {
      describe("Expostive Tests", function () {
         expositiveTests.createExpostives()
         expositiveTests.updateExpostive(1)
         expositiveTests.createManyExpostives()
      })
   },
   createExpostives() {
      for (const key of Object.keys(goodExpositives)) {
         expositiveTests.createExpositive(key)
      }
   },
   createExpositive(key) {
      const expositive = goodExpositives[key]
      it("teacher create " + expositive.name, async () => {
         const [jwt, idTeacher] = await getJWT("teacher")
         const file = expositive.file
         let id = 0
         if (typeof file === "string") {
            id = await request(strapi.server.httpServer)
               .post('/api/expositives')
               .set('accept', 'application/json')
               .set('Content-Type', 'application/json')
               .set('Authorization', 'Bearer ' + jwt)
               .field("data", JSON.stringify(expositive))
               .attach("files.file", "./tests/data/files/" + file)
               .expect(200)
               .then(data => {
                  return data.body.data.id
               });
         } else {
            id = await request(strapi.server.httpServer)
               .post('/api/expositives')
               .set('accept', 'application/json')
               .set('Content-Type', 'application/json')
               .set('Authorization', 'Bearer ' + jwt)
               .field("data", JSON.stringify(expositive))
               .expect(200)
               .then(data => {
                  return data.body.data.id
               });
         }
         await request(strapi.server.httpServer)
            .get('/api/expositives/' + id)
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then(data => {
               expect(data.body.data.attributes.author.data.id).toBe(idTeacher)
               checkKeys(expositive, data.body.data.attributes)
            });
      })
   },
   updateExpostive(id) {
      it("teacher update expostive1", async () => {
         const [jwt,] = await getJWT("teacher")
         await request(strapi.server.httpServer)
            .put('/api/expositives/' + id)
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .send({
               data: { name: "expositiveNewName" }
            })
            .expect(200)
         await request(strapi.server.httpServer)
            .get('/api/expositives/' + id)
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then(data => {
               expect(data.body.data.attributes.name).toBe("expositiveNewName");
            });
      })
   },
   createManyExpostives() {
      const expositive = multiExpositives.request5
      it("teacher create multiple Expositives with 1 request", async () => {
         const [jwt, idTeacher] = await getJWT("teacher")
         const files = expositive.map(e => { if ("file" in e) { return e.file } })
         let ids = await request(strapi.server.httpServer)
            .post('/api/expositives')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(expositive))
            .attach("files.file", "./tests/data/files/" + files[0])
            .attach("files.file", "./tests/data/files/" + files[1])
            .attach("files.file", "./tests/data/files/" + files[2])
            .attach("files.file", "./tests/data/files/" + files[3])
            .expect(200)
            .then(data => {
               return data.body.map(d => { return d.data.id })
            });
         for (const key of Object.keys(expositive)) {
            await request(strapi.server.httpServer)
               .get('/api/expositives/' + ids[key])
               .set('accept', 'application/json')
               .set('Content-Type', 'application/json')
               .set('Authorization', 'Bearer ' + jwt)
               .expect(200)
               .then(data => {
                  expect(data.body.data.attributes.author.data.id).toBe(idTeacher)
                  checkKeys(expositive[key], data.body.data.attributes)
               })
         }
      })
   }
}

const expositiveErrorTests = {
   expositiveErrorTests() {
      describe("Expositive Error Tests", function () {
         expositiveErrorTests.expositiveErrorTest1()
         expositiveErrorTests.expositiveErrorTest2()
         expositiveErrorTests.expositiveErrorTest3()
      })
   },
   expositiveErrorTest1() {
      it("teacher create wrong expositive9", async () => {
         const [jwt,] = await getJWT("teacher")
         const expositive = errorExpositives["request6"]
         await request(strapi.server.httpServer)
            .post('/api/expositives')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(expositive))
            .expect(400)
            .then(data => {
               expect(data.body.error.message).toBe("file names and submitted file names must be equal")
            });
      })
   },
   expositiveErrorTest2() {
      it("teacher create wrong expositive10", async () => {
         const [jwt,] = await getJWT("teacher")
         const expositive = errorExpositives["request7"]
         await request(strapi.server.httpServer)
            .post('/api/expositives')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(expositive))
            .attach("files.file", "./tests/data/files/pdf1.pdf")
            .expect(400)
            .then(data => {
               expect(data.body.error.message).toBe("file names and submitted file names must be equal")
            });
      })
   },
   expositiveErrorTest3() {
      it("teacher create wrong expositive11", async () => {
         const [jwt,] = await getJWT("teacher")
         const expositive = errorExpositives["request8"]
         await request(strapi.server.httpServer)
            .post('/api/expositives')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(expositive))
            .attach("files.file", "./tests/data/files/video1.mov")
            .attach("files.file", "./tests/data/files/video2.mov")
            .expect(400)
            .then(data => {
               expect(data.body.error.message).toBe("file names and submitted file names must be equal")
            });
      })
   }
}


module.exports = {
   expositiveTests,
   expositiveErrorTests
};


function checkKeys(data,respData){
   for (key in data){
      if (Array.isArray(data[key])==true){
         const d = data[key]
         const rD = respData[key]
         const l = d.length
         for (let i = 0; i < l; i++){
            checkKeys(d[i],rD[i])
         }
      } else if (key == "file") {
         expect(respData[key].data.attributes.name).toBe(data[key])
      } else {
         expect(respData[key]).toBe(data[key])
      }
   }
}

