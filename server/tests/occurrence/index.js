const request = require('supertest');
const { getJWT } = require('../auth')
const fs = require('fs');


const occurrences = JSON.parse(fs.readFileSync('./tests/data/occurrence.json'))
const goodOccurrences = occurrences.goodOccurrences
const multiOccurrences = occurrences.multiOccurrences
const errorOccurrences = occurrences.errorOccurrences
const updateOccurrences = occurrences.updateOccurrences


const occurrenceTests = {
   occurrenceTests() {
      describe("Occurrence Tests", function () {
         occurrenceTests.createOccurrences()
         occurrenceTests.updateOccurrences()
         occurrenceTests.createManyOccurrences()
         occurrenceTests.getOccurrences()
         occurrenceTests.getOccurrences2()
      })
   },
   createOccurrences() {
      for (const key of Object.keys(goodOccurrences)) {
         occurrenceTests.createOccurrence(key)
      }
   },
   createOccurrence(o) {
      const occurrence = goodOccurrences[o]
      it("teacher create occurrence " + occurrence.year, async () => {
         const [jwt, idTeacher] = await getJWT("teacher")
         let id = await request(strapi.server.httpServer)
            .post('/api/occurrences')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(occurrence))
            .expect(200)
            .then(data => {
               return data.body.data.id
            });
         await request(strapi.server.httpServer)
            .get('/api/occurrences/' + id)
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then(data => {
               expect(data.body.data.attributes.author.data.id).toBe(idTeacher)
               expect(data.body.data.attributes.year).toBe(occurrence.year);
               expect(data.body.data.attributes.startDate).toBe(occurrence.startDate);
               expect(data.body.data.attributes.endDate).toBe(occurrence.endDate);
            });
      })
   },
   updateOccurrences() {
      for (const key of Object.keys(updateOccurrences)) {
         occurrenceTests.updateOccurrence(key)
      }
   },
   updateOccurrence(o) {
      const occurrence = updateOccurrences[o]
      it("teacher update occurrence" + occurrence.id, async () => {
         const [jwt,] = await getJWT("teacher")
         const id = occurrence.id
         delete occurrence.id
         await request(strapi.server.httpServer)
            .put('/api/occurrences/' + id)
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(occurrence))
            .expect(200)
         await request(strapi.server.httpServer)
            .get('/api/occurrences/' + id)
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
      })
   },
   createManyOccurrences() {
      const occurrence = multiOccurrences.request3
      it("create multiple Occurrences with 1 request", async () => {
         const [jwt, idTeacher] = await getJWT("teacher")
         let ids = await request(strapi.server.httpServer)
            .post('/api/occurrences')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(occurrence))
            .expect(200)
            .then(data => {
               return data.body.map(d => { return d.data.id })
            });
         for (const key of Object.keys(occurrence)) {
            await request(strapi.server.httpServer)
               .get('/api/occurrences/' + ids[key])
               .set('accept', 'application/json')
               .set('Content-Type', 'application/json')
               .set('Authorization', 'Bearer ' + jwt)
               .expect(200)
               .then(data => {
                  expect(data.body.data.attributes.author.data.id).toBe(idTeacher)
                  expect(data.body.data.attributes.year).toBe(occurrence[key].year)
                  expect(data.body.data.attributes.startDate).toBe(occurrence[key].startDate);
                  expect(data.body.data.attributes.endDate).toBe(occurrence[key].endDate);
               })
         }
      })
   },
   getOccurrences() {
      it("teacher get occurrences", async () => {
         const [jwt,] = await getJWT("teacher")
         await request(strapi.server.httpServer)
            .get('/api/occurrences')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then(data => {
               expect(data.body.data.length).toBe(4)
            })
      })
   },
   getOccurrences2() {
      it("teacher2 get occurrences", async () => {
         const [jwt,] = await getJWT("teacher2")
         await request(strapi.server.httpServer)
            .get('/api/occurrences')
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

const occurrenceErrorTests = {
   occurrenceErrorTests() {
      describe("Occurrence Error Tests", function () {
         occurrenceErrorTests.occurrenceErrorTest1()
         occurrenceErrorTests.occurrenceErrorTest2()
      })
   },
   occurrenceErrorTest1() {
      it("teacher create wrong occurrence", async () => {
         const [jwt,] = await getJWT("teacher")
         const occurrence = errorOccurrences["request4"]
         await request(strapi.server.httpServer)
            .post('/api/occurrences')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(occurrence))
            .expect(400)
      })
   },
   occurrenceErrorTest2() {
      it("teacher get wrong occurrence", async () => {
         const [jwt,] = await getJWT("teacher2")
         await request(strapi.server.httpServer)
            .get('/api/occurrences/1')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(400)
            .then(data => {
               expect(data.body.error.message).toBe("You are not allowed to see this occurrence")
            })
      })
   },
}

module.exports = {
   occurrenceTests,
   occurrenceErrorTests,
};

