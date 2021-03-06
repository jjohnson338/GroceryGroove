require('dotenv').load();
global.Promise = require("bluebird");

const bunyan = require("bunyan");
const createJwtAuthMw = require("./src/middleware/create-jwt-auth");
const createJwtService = require("./src/http/jwt/create-service");
const createServerCallback = require("./src/server/create-callback");
const createMessageService = require("./src/server/services/create-message-service");
const createCacherService = require("./src/server/services/create-cacher-service");
const Pool = require('pg').Pool;
const redis = require("redis");
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const openHttpPort = (function () {
    const http = require("http");

    return function openHttpPort (port, callback) {
        return new Promise((resolve, reject) => {
            const listener = http.createServer(callback);
            listener.on("listening", () => {
                resolve(listener);
            });
            listener.on("error", error => {
                reject(error);
            });
            listener.listen(port);
        });
    };
})();

(async () => {
    const mode = (
        (process.env.NODE_ENV === "development")
        ? "development"
        : "production"
    );

    const redisClient = redis.createClient({
        host: process.env.REDIS_IP,
        port: process.env.REDIS_PORT,
    });

    const services = {
        cacher: createCacherService(redisClient),

        db: new Pool({
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            host: process.env.DB_HOST,
        }),

        jwt: createJwtService(process.env.JWTSECRET),

        logger: bunyan.createLogger({
            name: "api",
            src: true,
        }),

        messenger: createMessageService(redisClient, process.env.REDIS_MESSAGE_QUEUE_NAME),
    };

    const middlewares = {
        authJwt: createJwtAuthMw(services.jwt, services.logger, () => Date.now()),
    };

    const serverCallback = createServerCallback(mode, services, middlewares);

    try {
        await openHttpPort(8080, serverCallback);
        services.logger.info("Server started on http://localhost:8080");
    } catch (e) {
        services.logger.error(e, "startup error");
    }
})();
