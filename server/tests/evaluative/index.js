const request = require('supertest');
const {getJWT} = require('../auth')
const fs = require('fs');


const evaluatives=JSON.parse(fs.readFileSync('./tests/data/evaluative.json'))
const goodEvaluatives = evaluatives.goodEvaluatives
const multiEvaluatives = evaluatives.multiEvaluatives
const errorEvaluatives = evaluatives.errorEvaluatives
const updateEvaluatives = evaluatives.updateEvaluatives


const evaluativeTests = {
  evaluativeTests(){
    describe("Evaluative Tests", function() {
      evaluativeTests.createEvaluatives()
      evaluativeTests.createManyEvaluatives()
      evaluativeTests.updateEvaluative1()
      evaluativeTests.updateEvaluative2()
    })
  },
  createEvaluatives(){
    for (const key of Object.keys(goodEvaluatives)){
      evaluativeTests.createEvaluative(key)
    }
  },
  createEvaluative(e){
    const evaluative = goodEvaluatives[e]
    it("teacher create "+evaluative.name, async () => {
      const [jwt,idTeacher] = await getJWT("teacher")
      let id = 0
      if (evaluative.name=="evaluative2"){
        id = await request(strapi.server.httpServer) 
          .post('/api/evaluatives')
          .set('accept', 'application/json')
          .set('Content-Type', 'application/json')
          .set('Authorization', 'Bearer ' + jwt)
          .field("data",JSON.stringify(evaluative))
          .attach("files.image","./tests/data/files/images/image1.png")
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
          .field("data",JSON.stringify(evaluative))
          .expect(200)
          .then(data => {
              return data.body.data.id
        });
      }
      await request(strapi.server.httpServer) 
        .get('/api/evaluatives/'+id)
        .set('accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .expect(200)
        .then(data => {
            expect(data.body.data.attributes.author.data.id).toBe(idTeacher)
            expect(data.body.data.attributes.name).toBe(evaluative.name);
            if (data.body.data.attributes.content[0]["__component"]=="base.quiz"){

            } else if (data.body.data.attributes.content[0]["__component"]=="base.programming-exercise"){
              expect(data.body.data.attributes.content.type).toBe(evaluative.content.type);
              if ("language" in evaluative) {
                expect(data.body.data.attributes.content.language).toBe(evaluative.content.language);
              }
              expect(data.body.data.attributes.content.statement).toBe(evaluative.content.statement);
              if ("skeleton" in evaluative) {
                expect(data.body.data.attributes.content.skeleton).toBe(evaluative.content.skeleton);
              }
              expect(data.body.data.attributes.content.solution).toBe(evaluative.content.solution);
              if ("contexts" in evaluative) {
                expect(data.body.data.attributes.content.contexts).toBe(evaluative.content.contexts);
              }
              expect(data.body.data.attributes.content.tests).toBe(evaluative.content.tests);
            }
        });
    })
  },
  updateEvaluative1(){
    const evaluative = updateEvaluatives.request8
    it("teacher update evaluative1", async () => {
      const [jwt,] = await getJWT("teacher")
      await request(strapi.server.httpServer) 
        .put('/api/evaluatives/1')
        .set('accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .field("data",JSON.stringify(evaluative))
        .expect(200)
      await request(strapi.server.httpServer) 
        .get('/api/evaluatives/2')
        .set('accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .expect(200)
    })
  },
  updateEvaluative2(){
    const evaluative = updateEvaluatives.request9
    it("teacher update evaluative2", async () => {
      const [jwt,] = await getJWT("teacher")
      await request(strapi.server.httpServer) 
        .put('/api/evaluatives/2')
        .set('accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .field("data",JSON.stringify(evaluative))
        .attach("files.image","./tests/data/files/images/image1.png")
        .expect(200)
      await request(strapi.server.httpServer) 
        .get('/api/evaluatives/2')
        .set('accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .expect(200)
    })
  },
  createManyEvaluatives(){
    const evaluative = multiEvaluatives.request6
    it("create multiple Evaluatives with 1 request", async () => {
      const [jwt,idTeacher] = await getJWT("teacher")
      let ids = await request(strapi.server.httpServer) 
        .post('/api/evaluatives')
        .set('accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .field("data",JSON.stringify(evaluative))
        .attach("files.image","./tests/data/files/images/image1.png")
        .expect(200)
        .then(data => {
          return data.body.map(d => {return d.data.id})
      });
      for (const key of Object.keys(evaluative)){
        await request(strapi.server.httpServer) 
          .get('/api/evaluatives/'+ids[key])
          .set('accept', 'application/json')
          .set('Content-Type', 'application/json')
          .set('Authorization', 'Bearer ' + jwt)
          .expect(200)
          .then(data => {
            expect(data.body.data.attributes.author.data.id).toBe(idTeacher)
            expect(data.body.data.attributes.name).toBe(evaluative[key].name);
            if (data.body.data.attributes.content[0]["__component"]=="base.quiz"){

            } else if (data.body.data.attributes.content[0]["__component"]=="base.programming-exercise"){
              expect(data.body.data.attributes.content.type).toBe(evaluative[key].content.type);
              if ("language" in evaluative) {
                expect(data.body.data.attributes.content.language).toBe(evaluative[key].content.language);
              }
              expect(data.body.data.attributes.content.statement).toBe(evaluative[key].content.statement);
              if ("skeleton" in evaluative) {
                expect(data.body.data.attributes.content.skeleton).toBe(evaluative[key].content.skeleton);
              }
              expect(data.body.data.attributes.content.solution).toBe(evaluative[key].content.solution);
              if ("contexts" in evaluative) {
                expect(data.body.data.attributes.content.contexts).toBe(evaluative[key].content.contexts);
              }
              expect(data.body.data.attributes.content.tests).toBe(evaluative[key].content.tests);
            }
        })
      }
    })
  }
}

const evaluativeErrorTests = {
  evaluativeErrorTests(){
    describe("Evaluative Error Tests", function() {
      evaluativeErrorTests.evaluativeErrorTest1()
      evaluativeErrorTests.evaluativeErrorTest2()
      evaluativeErrorTests.evaluativeErrorTest3()
      evaluativeErrorTests.evaluativeErrorTest4()
    })
  },
  evaluativeErrorTest1(){
    it("teacher create wrong evaluative11", async () => {
      const [jwt,] = await getJWT("teacher")
      const evaluative = errorEvaluatives["request7"]
      await request(strapi.server.httpServer) 
        .post('/api/evaluatives')
        .set('accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .field("data",JSON.stringify(evaluative))
        .attach("files.image", "./tests/data/files/images/image2.png")
        .expect(400)
        .then(data => {
          expect(data.body.error.message).toBe("image names and submitted image names must be equal")
      });
    })
  },
  evaluativeErrorTest2(){
    it("teacher create wrong evaluative12", async () => {
      const [jwt,] = await getJWT("teacher")
      const evaluative = errorEvaluatives["request10"]
      await request(strapi.server.httpServer) 
        .post('/api/evaluatives')
        .set('accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .field("data",JSON.stringify(evaluative))
        .expect(400)
        .then(data => {
          expect(data.body.error.message).toBe("test type and subtype are not combinable")
      });
    })
  },
  evaluativeErrorTest3(){
    it("teacher create wrong evaluative13", async () => {
      const [jwt,] = await getJWT("teacher")
      const evaluative = errorEvaluatives["request11"]
      await request(strapi.server.httpServer) 
        .post('/api/evaluatives')
        .set('accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .field("data",JSON.stringify(evaluative))
        .expect(400)
        .then(data => {
          expect(data.body.error.message).toBe("test type and subtype are not combinable")
      });
    })
  },
  evaluativeErrorTest4(){
    it("teacher create wrong evaluative14", async () => {
      const [jwt,] = await getJWT("teacher")
      const evaluative = errorEvaluatives["request12"]
      await request(strapi.server.httpServer) 
        .post('/api/evaluatives')
        .set('accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .field("data",JSON.stringify(evaluative))
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

