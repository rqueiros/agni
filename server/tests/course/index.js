const request = require('supertest');
const { getJWT } = require('../auth')
const fs = require('fs');


const courses = JSON.parse(fs.readFileSync('./tests/data/course.json'))
const goodCourses = courses.goodCourses
const multiCourses = courses.multiCourses
const errorCourses = courses.errorCourses
const updateCourses = courses.updateCourses
const cloneCourses = courses.cloneCourses


const courseTests = {
   courseTests() {
      describe("Course Tests", function () {
         courseTests.createCourses()
         courseTests.updateCourse(1)
         courseTests.createManyCourses()
         courseTests.updateCourse1()
         courseTests.updateCourse2()
         courseTests.cloneCourse1()
         courseTests.cloneCourse2()
         courseTests.getCourses()
      })
   },
   createCourses() {
      for (const key of Object.keys(goodCourses)) {
         courseTests.createCourse(key)
      }
   },
   createCourse(c) {
      const course = goodCourses[c]
      it("teacher create " + course.name, async () => {
         const [jwt, idTeacher] = await getJWT("teacher")
         let id = 0
         if (course.name == "course1" || course.name == "course3") {
            id = await request(strapi.server.httpServer)
               .post('/api/courses')
               .set('accept', 'application/json')
               .set('Content-Type', 'application/json')
               .set('Authorization', 'Bearer ' + jwt)
               .field("data", JSON.stringify(course))
               .attach("files.image", "./tests/data/files/images/image1.png")
               .attach("files.file", "./tests/data/files/pdf1.pdf")
               .expect(200)
               .then(data => {
                  return data.body.data.id
               });
         } else {
            id = await request(strapi.server.httpServer)
               .post('/api/courses')
               .set('accept', 'application/json')
               .set('Content-Type', 'application/json')
               .set('Authorization', 'Bearer ' + jwt)
               .field("data", JSON.stringify(course))
               .expect(200)
               .then(data => {
                  return data.body.data.id
               });
         }
         await request(strapi.server.httpServer)
            .get('/api/courses/' + id)
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then(data => {
               expect(data.body.data.attributes.author.data.id).toBe(idTeacher)
               expect(data.body.data.attributes.name).toBe(course.name);
               expect(data.body.data.attributes.type).toBe(course.type);
               if ("modules" in data.body.data.attributes) {
                  for (const key of Array(data.body.data.attributes.modules.length).keys()) {
                     expect(data.body.data.attributes.modules[key].name).toBe(course.modules[key].name);
                     //expect(data.body.data.attributes.modules[key].condition).toBe(course.modules[key].condition);
                     if ("lessons" in data.body.data.attributes.modules[key]) {
                        for (const key2 of Array(data.body.data.attributes.modules[key].lessons.length).keys()) {
                           expect(data.body.data.attributes.modules[key].lessons[key2].name).toBe(course.modules[key].lessons[key2].name);
                           expect(data.body.data.attributes.modules[key].lessons[key2].description).toBe(course.modules[key].lessons[key2].description);
                           //if (c=="request1") {console.log(data.body.data.attributes.modules[key].lessons[key2])}
                           //expect(data.body.data.attributes.modules[key].lessons[key].condition).toBe(course.modules[key].lesson[key].condition);
                        }
                     }
                  }
               }
            });
      });
   },
   updateCourse(id) {
      it("teacher update course1", async () => {
         const [jwt,] = await getJWT("teacher")
         await request(strapi.server.httpServer)
            .put('/api/courses/' + id)
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify({ name: "updatedCourseName" }))
            .expect(200)
         await request(strapi.server.httpServer)
            .get('/api/courses/' + id)
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then(data => {
               expect(data.body.data.attributes.name).toBe("updatedCourseName");
            });
      })
   },
   updateCourse1() {
      const course = updateCourses.request7
      it("teacher update course1", async () => {
         const [jwt,] = await getJWT("teacher")
         await request(strapi.server.httpServer)
            .put('/api/courses/1')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(course))
            .expect(200)
         await request(strapi.server.httpServer)
            .get('/api/courses/1')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then(data => {
               expect(data.body.data.attributes.goals.length).toBe(1)
            })
      })
   },
   updateCourse2() {
      const course = updateCourses.request8
      it("teacher update course2", async () => {
         const [jwt,] = await getJWT("teacher")
         await request(strapi.server.httpServer)
            .put('/api/courses/2')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(course))
            .expect(200)
         await request(strapi.server.httpServer)
            .get('/api/courses/2')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then(data => {
               expect(data.body.data.attributes.modules[0].lessons[0].name).toBe("lesson15")
            })
      })
   },
   createManyCourses() {
      const course = multiCourses.request4
      it("create multiple Courses with 1 request", async () => {
         const [jwt, idTeacher] = await getJWT("teacher")
         let ids = await request(strapi.server.httpServer)
            .post('/api/courses')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(course))
            .attach("files.image", "./tests/data/files/images/image1.png")
            .attach("files.file", "./tests/data/files/pdf1.pdf")
            .expect(200)
            .then(data => {
               return data.body.map(d => { return d.data.id })
            });
         for (const key of Object.keys(course)) {
            await request(strapi.server.httpServer)
               .get('/api/courses/' + ids[key])
               .set('accept', 'application/json')
               .set('Content-Type', 'application/json')
               .set('Authorization', 'Bearer ' + jwt)
               .expect(200)
               .then(data => {
                  expect(data.body.data.attributes.author.data.id).toBe(idTeacher)
                  expect(data.body.data.attributes.name).toBe(course[key].name);
                  expect(data.body.data.attributes.type).toBe(course[key].type);
                  if ("modules" in data.body.data.attributes) {
                     for (const key1 of Array(data.body.data.attributes.modules.length).keys()) {
                        expect(data.body.data.attributes.modules[key1].name).toBe(course[key].modules[key1].name);
                        //expect(data.body.data.attributes.modules[key].condition).toBe(course.modules[key].condition);
                        if ("lessons" in data.body.data.attributes.modules[key1]) {
                           for (const key2 of Array(data.body.data.attributes.modules[key1].lessons.length).keys()) {
                              expect(data.body.data.attributes.modules[key1].lessons[key2].name).toBe(course[key].modules[key1].lessons[key2].name);
                              expect(data.body.data.attributes.modules[key1].lessons[key2].description).toBe(course[key].modules[key1].lessons[key2].description);
                              //expect(data.body.data.attributes.modules[key].lessons[key].condition).toBe(course.modules[key].lesson[key].condition);
                           }
                        }
                     }
                  }
               })
         }
      })
   },
   cloneCourse1() {
      const body = cloneCourses["request9"]
      const course = goodCourses["request1"]
      it("teacher get clone of " + course.name + " with request9", async () => {
         const [jwt,] = await getJWT("teacher")
         await request(strapi.server.httpServer)
            .get('/api/courses/1?populate=cloneData' + JSON.stringify(body))
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then(data => {
               expect(JSON.stringify(data.body.data.attributes.modules[1].lessons)).toBe(JSON.stringify([]))
               expect(data.body.data.attributes.modules[0].lessons.length).toBe(2)
            });
      });
   },
   cloneCourse2() {
      const body = cloneCourses["request10"]
      it("teacher get clone body", async () => {
         const [jwt,] = await getJWT("teacher")
         await request(strapi.server.httpServer)
            .get('/api/courses/1?populate=cloneBody')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then(data => {
               expect(data.body.data.id).toBe(body.id)
               expect(data.body.data.attributes.name).toBe(body.name)
               if ("modules" in body) {
                  for (let m of body.modules.keys()) {
                     expect(data.body.data.attributes.modules[m].name).toBe(body.modules[m].name)
                     expect(data.body.data.attributes.modules[m].clone).toBe(body.modules[m].clone)
                     if ("lessons" in body.modules[m]) {
                        for (let l of body.modules[m].lessons.keys()) {
                           expect(data.body.data.attributes.modules[m].lessons[l].name).toBe(body.modules[m].lessons[l].name)
                           expect(data.body.data.attributes.modules[m].lessons[l].clone).toBe(body.modules[m].lessons[l].clone)
                           if ("expostives" in body.modules[m].lessons[l]) {
                              for (let ex of body.modules[m].lessons[l].expositives) {
                                 expect(data.body.data.attributes.modules[m].lessons[l].expositives[ex]).toBe(body.modules[m].lessons[l].expositives[ex])
                              }
                           }
                           if ("evaluatives" in body.modules[m].lessons[l]) {
                              for (let ev of body.modules[m].lessons[l].evaluatives) {
                                 expect(data.body.data.attributes.modules[m].lessons[l].evaluatives[ev]).toBe(body.modules[m].lessons[l].evaluatives[ev])
                              }
                           }
                        }
                     }
                  }
               }
            });
      });
   },
   getCourses() {
      it("teacher get courses", async () => {
         const [jwt,] = await getJWT("teacher")
         await request(strapi.server.httpServer)
            .get('/api/courses')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
      })
   }
}

const courseErrorTests = {
   courseErrorTests() {
      describe("Course Error Tests", function () {
         courseErrorTests.courseErrorTest1()
         courseErrorTests.courseErrorTest1()
      })
   },
   courseErrorTest1() {
      const course = errorCourses["request5"]
      it("teacher create wrong " + course.name, async () => {
         const [jwt,] = await getJWT("teacher")
         let id = 0
         id = await request(strapi.server.httpServer)
            .post('/api/courses')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(course))
            .attach("files.image", "./tests/data/files/images/image1.png")
            .expect(400)
            .then(data => {
               expect(data.body.error.message).toBe("file names and submitted file names must be equal")
            });
      })
   },
   courseErrorTest2() {
      const course = errorCourses.request6
      it("teacher create wrong " + course.name, async () => {
         const [jwt,] = await getJWT("teacher")
         let id = 0
         id = await request(strapi.server.httpServer)
            .post('/api/courses')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .field("data", JSON.stringify(course))
            .attach("files.image", "./tests/data/files/images/image1.png")
            .expect(400)
            .then(data => {
               expect(data.body.error.message).toBe("image names and submitted image names must be equal")
            });
      })
   }
}


module.exports = {
   courseTests,
   courseErrorTests
};

