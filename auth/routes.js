module.exports = (router, app, authenticator) => {
    router.post("/register", authenticator.registerUser);
    router.post("/login2",app.oauth.grant(),authenticator.login2);
    router.post("/login",authenticator.login);

    return router;
};