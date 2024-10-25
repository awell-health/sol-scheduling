const express = require('express');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Serve Swagger UI
const openapiSpec = yaml.load(
  fs.readFileSync(path.join(__dirname, 'api.spec.yaml'), 'utf8')
);

app.use('/', swaggerUi.serve, swaggerUi.setup(openapiSpec));

// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Swagger UI available at http://localhost:${port}`);
});
