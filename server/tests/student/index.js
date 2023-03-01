const request = require('supertest');
const { getJWT } = require('../auth')
const fs = require('fs');


const students = JSON.parse(fs.readFileSync('./tests/data/student.json'))
const goodStudents = students.goodStudents
const multiStudents = students.multiStudents
const errorStudents = students.errorStudents
const updateStudents = students.updateStudents


const studentTests = {
   studentTests() {
      describe("Student Tests", function () {
         studentTests.createStudents()
         studentTests.updateStudents()
         studentTests.createManyStudents()
         studentTests.getStudents()
         studentTests.getStudents2()
      })
   },
   createStudents() {
      for (const key of Object.keys(goodStudents)) {
         studentTests.createStudent(key)
      }
   },
   createStudent(s) {
      const student = goodStudents[s]
      it("teacher create " + student.name, async () => {
         const [jwt, idTeacher] = await getJWT("teacher")
         let id = await request(strapi.server.httpServer)
            .post('/api/students')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(student))
            .expect(200)
            .then(data => {
               return data.body.data.id
            });
         await request(strapi.server.httpServer)
            .get('/api/students/' + id)
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then(data => {
               expect(data.body.data.attributes.name).toBe(student.name)
               expect(data.body.data.attributes.author.data.id).toBe(idTeacher)
            });
      })
   },
   updateStudents() {
      for (const key of Object.keys(updateStudents)) {
         studentTests.updateStudent(key)
      }
   },
   updateStudent(s) {
      const student = updateStudents[s]
      it("teacher update student" + student.id, async () => {
         const [jwt,] = await getJWT("teacher")
         const id = student.id
         delete student.id
         await request(strapi.server.httpServer)
            .put('/api/students/' + id)
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(student))
            .expect(200)
         await request(strapi.server.httpServer)
            .get('/api/students/' + id)
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then(data => {
               for (const key in student) {
                  expect(data.body.data.attributes[key]).toBe(student[key])
               }
            });
      })
   },
   createManyStudents() {
      const student = multiStudents.request6
      it("create multiple Students with 1 request", async () => {
         const [jwt, idTeacher] = await getJWT("teacher")
         let ids = await request(strapi.server.httpServer)
            .post('/api/students')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(student))
            .expect(200)
            .then(data => {
               return data.body.map(d => { return d.data.id })
            });
         for (const key of Object.keys(student)) {
            await request(strapi.server.httpServer)
               .get('/api/students/' + ids[key])
               .set('accept', 'application/json')
               .set('Content-Type', 'application/json')
               .set('Authorization', 'Bearer ' + jwt)
               .expect(200)
               .then(data => {
                  expect(data.body.data.attributes.author.data.id).toBe(idTeacher)
                  for (const key2 in student[key]) {
                     expect(data.body.data.attributes[key2]).toBe(student[key][key2])
                  }
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
         const [jwt,id] = await getJWT("student")
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

const studentErrorTests = {
   studentErrorTests() {
      describe("Student Error Tests", function () {
         studentErrorTests.studentErrorTest1()
         studentErrorTests.studentErrorTest2()
      })
   },
   studentErrorTest1() {
      it("teacher create wrong student", async () => {
         const [jwt,] = await getJWT("teacher")
         const student = errorStudents["request7"]
         await request(strapi.server.httpServer)
            .post('/api/students')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(student))
            .expect(400)
      })
   },
   studentErrorTest2() {
      it("teacher get wrong student", async () => {
         const [jwt,] = await getJWT("teacher2")
         await request(strapi.server.httpServer)
            .get('/api/students/1')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(400)
            .then(data => {
               expect(data.body.error.message).toBe("You are not allowed to see this student")
            })
      })
   },
}

module.exports = {
   studentTests,
   studentErrorTests,
};

