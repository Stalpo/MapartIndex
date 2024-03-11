const swaggerUi = require('swagger-ui-express');
const express = require('express');
const router = express.Router();
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    failOnErrors: true,
    verbose: false,
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Mapart Index API',
            version: '1.0.0',
        },
    },
    apis: ['./routes/api/*.js'],
};
const openapiSpecification = swaggerJsdoc(options);

router.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

router.use('/mapId', require('./api/mapid'));
router.use('/user', require('./api/user'));

router.use((_, res) => res.redirect("/api/docs"));
module.exports = router;