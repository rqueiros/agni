const Strapi = require("@strapi/strapi");
const fs = require("fs");
const _ = require("lodash");


let instance;

async function setupStrapi() {
   fs.copyFile(".tmp/unitBase.db", ".tmp/unitTest.db", (err) => {
      if (err) {
         console.log("Error Found:", err);
      }
   });

   if (!instance) {
      await Strapi().load();
      instance = strapi;

      await instance.server.mount();
   }
   return instance;
}

async function cleanupStrapi() {
   const dbSettings = strapi.config.get("database.connection");

   //close server to release the db-file
   await strapi.server.httpServer.close();

   // close the connection to the database before deletion
   await strapi.db.connection.destroy();

   //delete test database after all tests have completed
   if (dbSettings && dbSettings.connection && dbSettings.connection.filename) {
      const tmpDbFile = dbSettings.connection.filename;
      if (fs.existsSync(tmpDbFile)) {
         fs.unlinkSync(tmpDbFile);
      }
   }
}

module.exports = {
   setupStrapi,
   cleanupStrapi,
};