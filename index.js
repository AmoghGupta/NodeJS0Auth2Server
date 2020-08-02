const path = require("path");
var cookieParser = require('cookie-parser');
// Database imports
const pgPool = require("./db/pgWrapper");
const tokenDB = require("./db/tokenDB")(pgPool);
const userDB = require("./db/userDB")(pgPool);

// OAuth imports
const oAuthService = require("./auth/tokenService")(userDB, tokenDB);
const oAuth2Server = require("node-oauth2-server");

// Express
const express = require("express");
const app = express();
app.use(cookieParser());
app.oauth = oAuth2Server({
    model: oAuthService,
    grants: ["password"],
    debug: true,
});
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const testAPIService = require("./test/testAPIService.js");
const testAPIRoutes = require("./test/testAPIRoutes.js")(
    express.Router(),
    app,
    testAPIService
);

//Introspection
const tokenCheckService = require("./token_introspection/tokenCheckService");
const tokenCheckRoute = require("./token_introspection/tokenCheckRoute")(
    express.Router(),
    app,
    tokenCheckService
);

// Auth and routes
const authenticator = require("./auth/authenticator")(userDB,app);
const routes = require("./auth/routes")(
    express.Router(),
    app,
    authenticator
);



app.use(express.static(path.join(__dirname, "static")));

app.use(app.oauth.errorHandler());
app.use("/auth", routes);
app.use("/test", testAPIRoutes);
app.use("/oauth_intro", tokenCheckRoute);

const port = 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});