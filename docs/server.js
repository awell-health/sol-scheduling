import express from 'express';
import swaggerUi from 'swagger-ui-express';
import openapiSpec from './api.spec.json' assert { type: 'json' };
import cors from 'cors';

const app = express();

// Enable CORS for all routes
app.use(cors());

// Serve Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Swagger UI available at http://localhost:${port}`);
});
