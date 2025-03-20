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

## Integrating with Other Tailwind Projects

To avoid styling conflicts when using this library in another project that uses Tailwind CSS:

### Prefixed Classes

All Tailwind classes in this project are prefixed with `sol-` to prevent conflicts with your host project's Tailwind classes. For example, instead of `flex`, use `sol-flex`.

#### Important Note About Modifiers

Tailwind modifiers (like `hover:`, `focus:`, `sm:`, etc.) are correctly positioned before the `sol-` prefix. Examples:

- `hover:underline` becomes `hover:sol-underline`
- `focus:text-blue-500` becomes `focus:sol-text-blue-500`
- `sm:p-4` becomes `sm:sol-p-4`

This ensures proper functionality while still maintaining isolation from your host project's styles.

### Component Styling

All internal components in this project have been updated to use the prefixed Tailwind classes. This includes:

- Simple class names (`flex` → `sol-flex`)
- Classes with modifiers (`hover:text-blue-500` → `hover:sol-text-blue-500`)
- Complex conditional classes in `clsx()` objects (including multi-line expressions)
- Nested class structures

**Note on Component Consistency**:
Special attention has been given to components with complex conditional class styling, including:

- `ProviderCard.tsx` with nested context-specific class names
- `Slots.tsx` with orientation-dependent classes
- `NavigationButton.tsx` with dynamic direction styling
- `DayCard.tsx` with date and availability-dependent styles

#### Complete Prefixing Checklist

The following categories of classes have been fully prefixed with `sol-`:

- [x] Layout classes: `flex`, `grid`, `block`, etc.
- [x] Spacing classes: `p-`, `m-`, `gap-`, etc.
- [x] Sizing classes: `w-`, `h-`, `max-`, `min-`, etc.
- [x] Typography classes: `text-`, `font-`, etc.
- [x] Border classes: `border`, `rounded`, etc.
- [x] Background classes: `bg-`
- [x] Effect classes: `shadow`, `ring`, etc.
- [x] Position classes: `top`, `left`, etc.
- [x] DaisyUI component classes:
  - [x] `card`, `card-body`, `card-title`
  - [x] `avatar`
  - [x] `btn` and all its variants (`btn-primary`, `btn-secondary`, `btn-sm`, `btn-circle`, etc.)
  - [x] `loading` and its variants (`loading-infinity`, `loading-md`, etc.)
  - [x] `input` and its variants
  - [x] `link` and its variants (`link-primary`, etc.)
  - [x] Filter badges and overlay components
- [x] List styling: `list-none`, `list-disc`, etc.
- [x] Custom props passing class names: `classes="w-32 h-32"` → `classes="sol-w-32 sol-h-32"`
- [x] Complex nested conditions in clsx calls
- [x] Template string class assignments

All Tailwind classes in these components have been prefixed, maintaining all functionality and styling behavior while ensuring isolation from host projects.

**Note:** Special attention has been given to:

- Filter badges and filter overlays with complex class conditions
- Dynamic class assignments in buttons and interactive elements
- Components with conditional styling based on state

All classes have been verified through both automated script processing and manual review to ensure 100% prefixing coverage.

You don't need to make any changes to the component code, as all of this was done automatically. When inspecting elements in the browser, you'll see classes like `sol-flex`, `sol-p-4`, and modifiers like `hover:sol-underline`.

### Using the Library

When importing components from this library, use the following approach:

1. Import the components as usual:

   ```js
   import { SchedulingComponent } from '@awell-health/sol-scheduling';
   ```

2. Import the styles:

   ```js
   import '@awell-health/sol-scheduling/style.css';
   ```

3. Use the prefixed Tailwind classes for any custom styling or make sure to target the specific component wrapper:
   ```jsx
   <div className='sol-container'>
     <SchedulingComponent />
   </div>
   ```

This approach ensures that the library's styles won't conflict with your project's Tailwind styles.

### Alternative: CSS Isolation

If you're experiencing style conflicts despite the prefix, you can further isolate the library styles by wrapping the components in a specific CSS module or using Shadow DOM techniques.
