const request = require('supertest');
const { getJWT } = require('../auth')
const fs = require('fs');


const questions = JSON.parse(fs.readFileSync('./tests/data/question.json'))
const goodQuestions = questions.goodQuestions
const multiQuestions = questions.multiQuestions
const errorQuestions = questions.errorQuestions


const questionTests = {
   questionTests() {
      describe("Question Tests", function () {
         questionTests.createQuestions()
         questionTests.updateQuestion(7)
         questionTests.createManyQuestions()
      })
   },
   createQuestions() {
      for (const key of Object.keys(goodQuestions)) {
         questionTests.createQuestion(key)
      }
   },
   createQuestion(q) {
      const question = goodQuestions[q]
      it("teacher create " + question.question, async () => {
         const [jwt, idTeacher] = await getJWT("teacher")
         const image = question.image
         let id = 0
         if (typeof image === "string") {
            id = await request(strapi.server.httpServer)
               .post('/api/questions')
               .set('accept', 'application/json')
               .set('Content-Type', 'application/json')
               .set('Authorization', 'Bearer ' + jwt)
               .field("data", JSON.stringify(question))
               .attach("files.image", "./tests/data/files/images/" + image)
               .expect(200)
               .then(data => {
                  return data.body.data.id
               });
         } else {
            id = await request(strapi.server.httpServer)
               .post('/api/questions')
               .set('accept', 'application/json')
               .set('Content-Type', 'application/json')
               .set('Authorization', 'Bearer ' + jwt)
               .field("data", JSON.stringify(question))
               .expect(200)
               .then(data => {
                  return data.body.data.id
               });
         }
         await request(strapi.server.httpServer)
            .get('/api/questions/' + id)
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then(data => {
               expect(data.body.data.attributes.author.data.id).toBe(idTeacher)
               checkKeys(question,data.body.data.attributes)
            });
      })
   },
   updateQuestion(id) {
      it("teacher update question1", async () => {
         const [jwt, idTeacher] = await getJWT("teacher")
         await request(strapi.server.httpServer)
            .put('/api/questions/' + id)
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .send({
               data: { question: "updatedQuestionName" }
            })
            .expect(200)
         await request(strapi.server.httpServer)
            .get('/api/questions/' + id)
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then(data => {
               expect(data.body.data.attributes.question).toBe("updatedQuestionName");
            });
      })
   },
   createManyQuestions() {
      const question = multiQuestions.request5
      it("create multiple Questions with 1 request", async () => {
         const [jwt, idTeacher] = await getJWT("teacher")
         const images = question.map(q => { if ("image" in q) { return q.image } })
         let ids = await request(strapi.server.httpServer)
            .post('/api/questions')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(question))
            .attach("files.image", "./tests/data/files/images/" + images[0])
            .attach("files.image", "./tests/data/files/images/" + images[1])
            .expect(200)
            .then(data => {
               return data.body.map(d => { return d.data.id })
            });
         for (const key of Object.keys(question)) {
            await request(strapi.server.httpServer)
               .get('/api/questions/' + ids[key])
               .set('accept', 'application/json')
               .set('Content-Type', 'application/json')
               .set('Authorization', 'Bearer ' + jwt)
               .expect(200)
               .then(data => {
                  expect(data.body.data.attributes.author.data.id).toBe(idTeacher)
                  checkKeys(question[key],data.body.data.attributes)
               })
         }
      })
   }
}

const questionErrorTests = {
   questionErrorTests() {
      describe("Question Error Tests", function () {
         questionErrorTests.questionErrorTest1()
         questionErrorTests.questionErrorTest2()
         questionErrorTests.questionErrorTest3()
         questionErrorTests.questionErrorTest4()
      })
   },
   questionErrorTest1() {
      it("teacher create wrong question9", async () => {
         const [jwt,] = await getJWT("teacher")
         const question = errorQuestions["request6"]
         await request(strapi.server.httpServer)
            .post('/api/questions')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(question))
            .expect(400)
            .then(data => {
               expect(data.body.error.message).toBe("image names and submitted image names must be equal")
            });
      })
   },
   questionErrorTest2() {
      it("teacher create wrong question10", async () => {
         const [jwt,] = await getJWT("teacher")
         const question = errorQuestions["request7"]
         await request(strapi.server.httpServer)
            .post('/api/questions')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(question))
            .attach("files.image", "./tests/data/files/images/image1.png")
            .expect(400)
            .then(data => {
               expect(data.body.error.message).toBe("image names and submitted image names must be equal")
            });
      })
   },
   questionErrorTest3() {
      it("teacher create wrong question11", async () => {
         const [jwt,] = await getJWT("teacher")
         const question = errorQuestions["request8"]
         await request(strapi.server.httpServer)
            .post('/api/questions')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(question))
            .attach("files.image", "./tests/data/files/images/image1.png")
            .attach("files.image", "./tests/data/files/images/image2.png")
            .expect(400)
            .then(data => {
               expect(data.body.error.message).toBe("image names and submitted image names must be equal")
            });
      })
   },
   questionErrorTest4() {
      it("teacher create wrong question12", async () => {
         const [jwt,] = await getJWT("teacher")
         const question = errorQuestions["request9"]
         await request(strapi.server.httpServer)
            .post('/api/questions')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(question))
            .attach("files.image", "./tests/data/files/images/image1.png")
            .expect(400)
            .then(data => {
               expect(data.body.error.message).toBe("image names and submitted image names must be equal")
            });
      })
   }
}

module.exports = {
   questionTests,
   questionErrorTests,
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
      } else if (key == "image") {
         expect(respData[key].data.attributes.name).toBe(data[key])
      } else {
         expect(respData[key]).toBe(data[key])
      }
   }
}

