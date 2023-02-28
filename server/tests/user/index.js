const request = require('supertest');
const { boostrapPermissions } = require("./../helpers/strapi");


// user mock data
const mockUserData = {
   username: "tester",
   email: "tester@strapi.com",
   provider: "local",
   password: "1234abc",
   confirmed: true,
   blocked: null,
};

it("should login user and return jwt token", async () => {
   /** Creates a new user and save it to the database */
   await strapi.plugins["users-permissions"].services.user.add({
      ...mockUserData,
   });

   await request(strapi.server.httpServer) // app server is an instance of Class: http.Server
      .post("/api/auth/local")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .send({
         identifier: mockUserData.email,
         password: mockUserData.password,
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .then((data) => {
         expect(data.body.jwt).toBeDefined();
      });
});

it('should return users data for authenticated user', async () => {
   /** Gets the default user role */
   const defaultRole = await strapi.query('plugin::users-permissions.role').findOne({}, []);


   //const role = defaultRole ? defaultRole.id : null;

   const role = 1;

   console.log("ROLE_______", role)

   /** Creates a new user an push to database */
   const user = await strapi.plugins['users-permissions'].services.user.add({
      ...mockUserData,
      username: 'tester2',
      email: 'tester2@strapi.com',
      role,
   });

   const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
      id: user.id,
   });

   await boostrapPermissions();

   //await grantPrivilege(1, "permissions.application.controllers.occurrence.find");  // Gives Public access to endpoint

   await request(strapi.server.httpServer) // app server is an instance of Class: http.Server
      .get('/api/occurrences')
      .set('accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + jwt)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(data => {
         console.log(data)
      });

   await request(strapi.server.httpServer) // app server is an instance of Class: http.Server
      .post('/api/occurrences')
      .set('accept', 'application/json')
      .set('Content-Type', 'application/json')
      //.set('Authorization', 'Bearer ' + jwt)
      .send({
         year: 2023,
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then(data => {
         console.log(data)
      });
});
