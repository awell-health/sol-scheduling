# SOL scheduling

This project contains SOL's scheduling front-end component which is used in Hosted Pages to let a patient schedule an appointment with a provider. 

This repository only contains the front-end. All the logic and interaction with APIs happens within the extension and the Hosted Pages app.

## Installation

Note that we use [yarn PnP](https://yarnpkg.com/features/pnp) which might require [additional configuration](https://yarnpkg.com/getting-started/editor-sdks) in your IDE to work properly. You can follow the installation instructions below to get the repository running locally.

If you use a different IDE, check the yarn documentation for instructions on IDE setup.

### Installation (VSCode)

**Follow the steps below to set up the extensions repository locally on your machine:**

1. Check out the repository locally
2. Install the [ZipFS extension](https://marketplace.visualstudio.com/items?itemName=arcanis.vscode-zipfs) in VSCode
3. Explicitly set the Typescript version in VSCode:
   - Press `ctrl+shift+p` in a TypeScript file
   - Choose "Select TypeScript Version"
   - Pick "Use Workspace Version"

## Storybook

Browse and test all components in this repository via [Storybook](https://66b9e64731d191aeb07ea92e-tknjtscxrj.chromatic.com/).

Or run `yarn storybook` locally.

## Prerequisites

This repository currently uses UI components from Awell's [ui-library](https://github.com/awell-health/ui-library) to build the front-end faster. These components will be be unstyled if your app is not wrapped in Awell's [ThemeProvider](https://github.com/awell-health/ui-library/blob/main/src/atoms/themeProvider/ThemeProvider.tsx) and you are not importing [the styles from ui-library](https://github.com/awell-health/hosted-pages/blob/main/pages/_app.tsx#L2).

In this repository, this is handled by:

- Importing the stylesheet in `.storybook/preview.ts`
- All stories are decorated with the `<ThemeProvider />` component