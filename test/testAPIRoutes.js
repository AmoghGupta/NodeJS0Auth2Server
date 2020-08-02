module.exports = (router, app, testAPIService) => {
    router.get("/hello", app.oauth.authorise(), testAPIService.helloWorld);

    return router;
};