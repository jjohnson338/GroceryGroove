const a = require("../../utils/asyncify");
const createRouter = require("../../http/create-router");
const queries = require("../../db/queries");

module.exports = function createLoginRouter ({
    db,
    jwtService,
    jsonBodyParser,
    logger,
}) {
    logger = logger.child({
        router_creator: "login",
    });

    return createRouter(r => {
        r.post("/email", jsonBodyParser, a(function* (ctx, next) {
            const email    = ctx.request.body.email;
            const password = ctx.request.body.password;

            const userid = yield queries.users.checkByEmail(db, logger, [
                email,
                password,
            ]);

            if (userid) {
                ctx.body = {
                    token: jwtService.encode(userid),
                };
            } else {
                ctx.status = 403;
            }
        }));

        r.post("/deviceid", jsonBodyParser, a(function* (ctx, next) {
            const deviceid  = ctx.request.body.deviceid;

            const userid = yield queries.users.checkByDeviceID(db, logger, [
                deviceid,
            ]);

            if (userid) {
                ctx.body = {
                    token: jwtService.encode(userid),
                };
            } else {
                ctx.status = 403;
            }
        }));
    });
};
