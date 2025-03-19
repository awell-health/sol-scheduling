// Script to update all Tailwind class names with the 'sol-' prefix
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// List of tailwind class prefixes to find
const tailwindPrefixes = [
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
const files = await glob('src/**/*.{ts,tsx}');

let totalChanges = 0;

for (const filePath of files) {
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
        if (cls.startsWith('sol-')) return cls;

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

        // Check if class starts with any Tailwind prefix and add 'sol-' prefix
        for (const prefix of tailwindPrefixes) {
          if (cls.startsWith(prefix)) {
            return `sol-${cls}`;
          }
        }

        // For simple classes like 'flex', 'grid', etc.
        if (tailwindPrefixes.includes(cls)) {
          return `sol-${cls}`;
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
        if (cls.startsWith('sol-')) return cls;

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

        // Check if class starts with any Tailwind prefix and add 'sol-' prefix
        for (const prefix of tailwindPrefixes) {
          if (cls.startsWith(prefix)) {
            return `sol-${cls}`;
          }
        }

        // For simple classes like 'flex', 'grid', etc.
        if (tailwindPrefixes.includes(cls)) {
          return `sol-${cls}`;
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
}

console.log(`Total changes made: ${totalChanges}`);
