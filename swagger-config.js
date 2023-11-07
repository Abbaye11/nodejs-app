const os = require('os');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

module.exports = function (app,PORT) {

    //Swagger options
    const swaggerOptions = {
        definition: {
        openapi: "3.1.0",
        info: {
            title: "NodeJS sample App",
            version: "0.1.0",
            description:
            "Application http simple",
            license: {
            name: "Creative Commons",
            url: "https://creativecommons.org/",
            },
            contact: {
            name: "SebChevre",
            url: "https://seb-chevre.org/nodejs-app",
            email: "seb.chevre@gmail.com",
            },
        },
        servers: [
            {
            url: `http://${os.hostname()}:${PORT}`,
            },
        ],
        },
        apis: ["./routes.js"],
    };

    const swaggerSpecs = swaggerJsdoc(swaggerOptions);

    //middleware
    app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpecs, {explorer: true })
    );

}