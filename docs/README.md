# API Documentation

Our Scheduling API documentation follows the [OpenAPI Specification](https://www.openapis.org/), and we use [Swagger UI](https://swagger.io/tools/swagger-ui/) for an interactive, browser-based display of the documentation.

## Local Development

To update the documentation, modify the `api.spec.yaml` file. For a more streamlined experience in VSCode, we recommend the "OpenAPI (Swagger) Editor" extension, which offers built-in validation, auto-completion, and a Swagger UI preview feature directly within VSCode.

Alternatively, you can run `yarn serve-docs` to serve the API docs locally. Please note that hot reloading is not implemented, so any changes require restarting the command.

## Building and Deploying

Our API documentation deploys automatically to GitHub Pages with every push to the main branch. You can view the latest version here: https://awell-health.github.io/sol-scheduling/.

The docs can be built with the `yarn build-docs` command.

## Contributing

The Awell and Sol teams jointly maintain this API documentation. All updates should be submitted via pull requests, making this the single source of truth for the API documentation.

### Suggestions, comments, questions

For suggestions, comments, and questions regarding the API and its documentation, we recommend using GitHub Issues. This allows you to reference specific lines or sections of the API specification directly, as it is source-controlled within the repository. This approach makes discussions clearer and ensures feedback is tied to specific parts of the documentation.
