const a = require("../../utils/asyncify");
const DuplicateNameError = require("../../errors/duplicate-name-error");
const queries = require("../../db/queries");

module.exports = {
    path: "/items",

    middlewares: [
        "jwtAuth",
        "jsonBodyParser",
        "householdExtractor",
        "userExtractor",
    ],

    deps: [
        "db",
        "logger",
    ],

    routes: [
        {
            method: "POST",
            path: "/",

            produces: [
                "application/json",
            ],

            parameters: [
                {
                    name: "name",
                    in: "body",
                    description: "Name of item to add",
                    required: "true",
                    type: "string",
                },
                {
                    name: "description",
                    in: "body",
                    description: "Description of item to add",
                    required: "false",
                    type: "string",
                },
                {
                    name: "categoryId",
                    in: "body",
                    required: "true",
                    type: "integer",
                },
            ],

            responses: {
                200: {},
                400: {},
            },

            handler: a(function* (db, logger, ctx, next) {
                const itemName = ctx.request.body.name;
                const itemDescription = ctx.request.body.description;
                const categoryId = ctx.request.body.categoryId;

                //TODO: Currently someone could pass an invalid categoryId and
                //the insert would fail but it's not handled properly here in code

                if (!itemName) {
                    ctx.throw(400, "Must include item name in request body");
                } else if (!categoryId) {
                    ctx.throw(400, "Must include categoryId in the request body");
                } else {
                    try {
                        ctx.body = {
                            itemId: yield queries.items.addAndCategorizeOne(db, logger, [
                                ctx.state.householdId,
                                itemName,
                                itemDescription,
                                categoryId,
                            ]),
                        };
                    } catch (e) {
                        if (e instanceof DuplicateNameError) {
                            ctx.throw(400, "Item name must be unique");
                        } else {
                            throw e;
                        }
                    }
                }
            }),
        },
    ],
};
