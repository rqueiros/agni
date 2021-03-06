require("dotenv").config();

const express = require("express");
const path = require("path");
const routes = require("./routes/index");

const lti = require("ltijs").Provider;

// Setup
lti.setup(
  process.env.LTI_TOOL_KEY,
  {
    //url: `mongodb://${process.env.LTI_TOOL_DB_HOST}:${process.env.LTI_TOOL_DB_PORT}/${process.env.LTI_TOOL_DB_NAME}`,
    url: "mongodb+srv://agniAdmin:agniAdminPass@agni.phbzj.mongodb.net/ltiDb?retryWrites=true&w=majority",
    connection: {
      authSource: process.env.LTI_TOOL_DB_AUTH,
      user: process.env.LTI_TOOL_DB_USERNAME,
      pass: process.env.LTI_TOOL_DB_PASSWORD,
    },
  },
  {
    staticPath: path.join(__dirname, "./app/views"), // Path to static files
    cookies: {
      secure: false, // Set secure to true if the testing platform is in a different domain and https is being used
      sameSite: "", // Set sameSite to 'None' if the testing platform is in a different domain and https is being used
    },
    devMode: true, // Set DevMode to true if the testing platform is in a different domain and https is not being used
  }
);

// When receiving successful LTI launch redirects to app
lti.onConnect(async (token, req, res) => {
  return res.sendFile(path.join(__dirname, "./app/views/index.html"));
});

// When receiving deep linking request redirects to deep screen
lti.onDeepLinking(async (token, req, res) => {
  return lti.redirect(res, "/lti-tool/deeplink", { newResource: true });
});

// Setting up routes
lti.app.use(routes);

// Setup function
const setup = async () => {
  console.log(process.env);
  await lti.deploy({ serverless: true });

  const app = express();
  app.use("/lti-tool", lti.app);
  app.listen(process.env.LTI_TOOL_PORT);

  /**
   * Register platform
   */
  const platform = await lti.registerPlatform({
    url: process.env.MOODLE_URL,
    name: process.env.LTI_TOOL_NAME,
    clientId: process.env.LTI_TOOL_CLIENT_ID,
    authenticationEndpoint: `${process.env.MOODLE_URL}/mod/lti/auth.php`,
    accesstokenEndpoint: `${process.env.MOODLE_URL}/mod/lti/token.php`,
    authConfig: {
      method: "JWK_SET",
      key: `${process.env.MOODLE_URL}/mod/lti/certs.php`,
    },
  });

  const authConfig = await platform.platformAuthConfig();
  console.log(authConfig);
  console.log(await platform.platformPublicKey());
};

setup();
