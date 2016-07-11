const a = require("../utils/asyncify");

module.exports = function createRequestIdentifier () {
    let currentId = 0;

    return a(function* requestIdentifier (ctx, next) {
        currentId += 1;

        // Give the id to the request as a string because I could see this
        // becoming a uuid some day. Plus no one needs to do numeric operations
        // on this value.
        ctx.request.id = `${ currentId }`;
        ctx.response.set("X-Request-Id", ctx.request.id);
    });
};