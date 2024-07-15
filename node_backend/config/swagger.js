import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pixel Pulse HumanAIze Hackathon 2024 Fintech edition Backend Server',
      version: '1.0.0',
      description: 'This is an express based backend server for our proposed solution to the problem statement of the personal financial planning',
    },
    servers: [
      {
        url: 'http://localhost:8001',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export default specs;