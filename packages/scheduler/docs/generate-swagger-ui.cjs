const fs = require('fs');
const path = require('path');
const swaggerUiAssetPath = require('swagger-ui-dist').getAbsoluteFSPath();
const swaggerFile = path.join(__dirname, 'api.spec.yaml'); // Your OpenAPI YAML file

// Directory where the generated Swagger UI will be placed
const outputDir = path.join(__dirname, 'dist');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Copy Swagger UI static files
fs.readdirSync(swaggerUiAssetPath).forEach((file) => {
  const sourceFile = path.join(swaggerUiAssetPath, file);
  const destFile = path.join(outputDir, file);
  fs.copyFileSync(sourceFile, destFile);
});

// Generate the HTML with your OpenAPI YAML path
const indexHtml = `
<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Docs</title>
    <link rel="stylesheet" type="text/css" href="./swagger-ui.css" />
</head>
<body style="margin: 0; padding: 0">
    <div id="swagger-ui"></div>
    <script src="./swagger-ui-bundle.js"></script>
    <script src="./swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            const ui = SwaggerUIBundle({
                url: './api.spec.yaml', // Path to your OpenAPI YAML spec file
                dom_id: '#swagger-ui',
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                layout: "StandaloneLayout"
            })
        }
    </script>
</body>
</html>
`;

// Write the custom index.html file to serve the Swagger UI with your API spec
fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);

// Copy the OpenAPI spec YAML file to the output directory
fs.copyFileSync(swaggerFile, path.join(outputDir, 'api.spec.yaml')); // Ensure this copies the YAML file

console.log('Swagger UI generated successfully!');
