// Script to update all Tailwind class names with the 'sol-' prefix
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// List of tailwind utility class prefixes to find (without modifiers)
const tailwindUtilityPrefixes = [
  'flex',
  'grid',
  'p-',
  'm-',
  'mt-',
  'mb-',
  'ml-',
  'mr-',
  'mx-',
  'my-',
  'pt-',
  'pb-',
  'pl-',
  'pr-',
  'px-',
  'py-',
  'text-',
  'font-',
  'bg-',
  'border',
  'rounded',
  'shadow',
  'h-',
  'w-',
  'min-',
  'max-',
  'items-',
  'justify-',
  'gap-',
  'space-',
  'overflow-',
  'absolute',
  'relative',
  'fixed',
  'sticky',
  'top-',
  'right-',
  'bottom-',
  'left-',
  'z-',
  'col-',
  'row-',
  'order-',
  'grow',
  'shrink',
  'basis-',
  'self-',
  'object-',
  'opacity-',
  'visible',
  'invisible',
  'underline',
  'line-through',
  'no-underline'
];

// Tailwind modifiers (should be kept before the utility class)
const tailwindModifiers = [
  'hover:',
  'focus:',
  'active:',
  'disabled:',
  'dark:',
  'sm:',
  'md:',
  'lg:',
  'xl:',
  '2xl:'
];

// Find all TypeScript and TSX files in src directory
const findOutput = execSync(
  'find src -type f -name "*.ts" -o -name "*.tsx"'
).toString();
const files = findOutput.trim().split('\n');

let totalChanges = 0;

files.forEach((filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  let fileChanges = 0;

  // 1. Look for patterns like className="..." or className='...'
  const classNameRegex = /className=(["'])(.*?)\1/g;
  let match;

  while ((match = classNameRegex.exec(content)) !== null) {
    const originalClasses = match[2];
    const newClasses = originalClasses
      .split(' ')
      .map((cls) => {
        // Skip already prefixed classes
        if (cls.includes('sol-')) return cls;

        // Skip daisyUI specific classes
        if (
          cls.startsWith('btn-') ||
          cls.startsWith('card-') ||
          cls.startsWith('loading-') ||
          cls.startsWith('avatar') ||
          cls === 'avatar' ||
          cls === 'card' ||
          cls === 'skeleton' ||
          cls.includes('base-')
        ) {
          return cls;
        }

        // Handle classes with modifiers
        for (const modifier of tailwindModifiers) {
          if (cls.startsWith(modifier)) {
            const baseClass = cls.slice(modifier.length);

            // Check if the base class should be prefixed
            for (const prefix of tailwindUtilityPrefixes) {
              if (baseClass === prefix || baseClass.startsWith(prefix)) {
                return `${modifier}sol-${baseClass}`;
              }
            }

            return cls; // No prefix needed
          }
        }

        // Handle classes without modifiers
        for (const prefix of tailwindUtilityPrefixes) {
          if (cls === prefix || cls.startsWith(prefix)) {
            return `sol-${cls}`;
          }
        }

        return cls;
      })
      .join(' ');

    if (originalClasses !== newClasses) {
      newContent = newContent.replace(
        `className=${match[1]}${originalClasses}${match[1]}`,
        `className=${match[1]}${newClasses}${match[1]}`
      );
      fileChanges++;
    }
  }

  // 2. Look for patterns like clsx('...')
  const clsxRegex = /clsx\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((match = clsxRegex.exec(content)) !== null) {
    const originalClasses = match[1];
    const newClasses = originalClasses
      .split(' ')
      .map((cls) => {
        // Skip already prefixed classes
        if (cls.includes('sol-')) return cls;

        // Skip daisyUI specific classes
        if (
          cls.startsWith('btn-') ||
          cls.startsWith('card-') ||
          cls.startsWith('loading-') ||
          cls.startsWith('avatar') ||
          cls === 'avatar' ||
          cls === 'card' ||
          cls === 'skeleton' ||
          cls.includes('base-')
        ) {
          return cls;
        }

        // Handle classes with modifiers
        for (const modifier of tailwindModifiers) {
          if (cls.startsWith(modifier)) {
            const baseClass = cls.slice(modifier.length);

            // Check if the base class should be prefixed
            for (const prefix of tailwindUtilityPrefixes) {
              if (baseClass === prefix || baseClass.startsWith(prefix)) {
                return `${modifier}sol-${baseClass}`;
              }
            }

            return cls; // No prefix needed
          }
        }

        // Handle classes without modifiers
        for (const prefix of tailwindUtilityPrefixes) {
          if (cls === prefix || cls.startsWith(prefix)) {
            return `sol-${cls}`;
          }
        }

        return cls;
      })
      .join(' ');

    if (originalClasses !== newClasses) {
      newContent = newContent.replace(
        `clsx('${originalClasses}')`,
        `clsx('${newClasses}')`
      );
      fileChanges++;
    }
  }

  if (fileChanges > 0) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${fileChanges} class instances in ${filePath}`);
    totalChanges += fileChanges;
  }
});

console.log(`Total changes made: ${totalChanges}`);
