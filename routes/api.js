const swaggerUi = require('swagger-ui-express');
const express = require('express');
const router = express.Router();
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    failOnErrors: true,
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
module.exports = router;