module.exports = (router, app, tokenCheckService) => {
    router.get("/", tokenCheckService.helloWorld);

    return router;
};