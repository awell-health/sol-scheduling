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
  'no-underline',
  'block',
  'inline',
  'inline-block',
  'hidden',
  'decoration-',
  'leading-',
  'tracking-',
  'indent-',
  'align-',
  'whitespace-',
  'break-',
  'truncate',
  'cursor-',
  'pointer-events-',
  'resize-',
  'select-',
  'ring-',
  'fill-',
  'stroke-',
  // Colors
  'slate-',
  'gray-',
  'red-',
  'orange-',
  'amber-',
  'yellow-',
  'lime-',
  'green-',
  'emerald-',
  'teal-',
  'cyan-',
  'sky-',
  'blue-',
  'indigo-',
  'violet-',
  'purple-',
  'fuchsia-',
  'pink-',
  'rose-',
  'white',
  'black',
  'transparent',
  'current',
  // Sizes
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl'
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
  '2xl:',
  'group-hover:',
  'peer-hover:',
  'focus-within:',
  'focus-visible:'
];

// Skip these class patterns entirely
const skipPatterns = [
  'btn-',
  'card-',
  'loading-',
  'avatar',
  'skeleton',
  'base-',
  'daisyui-'
];

// Helper function to transform a single class string
function transformClass(cls) {
  // Skip already prefixed classes
  if (cls.includes('sol-')) return cls;

  // Skip classes in the skipPatterns list
  for (const pattern of skipPatterns) {
    if (cls.includes(pattern)) {
      return cls;
    }
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
}

// Process a clsx string argument
function processClsxString(str) {
  return str
    .split(' ')
    .map((cls) => transformClass(cls.trim()))
    .join(' ');
}

// Find all TypeScript and TSX files in src directory
const findOutput = execSync(
  'find src -type f -name "*.ts" -o -name "*.tsx"'
).toString();
const files = findOutput.trim().split('\n');

let totalChanges = 0;

files.forEach((filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let fileChanges = 0;

    // 1. First handle simple className="..." patterns
    const classNameRegex = /className=(["'])(.*?)\1/g;
    let match;

    while ((match = classNameRegex.exec(content)) !== null) {
      const originalClasses = match[2];
      const newClasses = processClsxString(originalClasses);

      if (originalClasses !== newClasses) {
        // Replace just this className pattern
        const fullMatch = `className=${match[1]}${originalClasses}${match[1]}`;
        const replacement = `className=${match[1]}${newClasses}${match[1]}`;
        newContent = newContent.replace(fullMatch, replacement);
        fileChanges++;
      }
    }

    // 2. Handle string literals inside quotes, primarily in clsx calls
    // This is a safer approach than trying to parse the entire clsx call
    const stringLiteralRegex = /'([^']+)'/g;

    while ((match = stringLiteralRegex.exec(newContent)) !== null) {
      const originalString = match[1];
      const contextBefore = newContent.substring(
        Math.max(0, match.index - 30),
        match.index
      );

      // Only process if it looks like a className context
      if (
        contextBefore.includes('className') ||
        contextBefore.includes('clsx')
      ) {
        // Check if this looks like a class string (has spaces or Tailwind-like patterns)
        if (
          originalString.includes(' ') ||
          tailwindUtilityPrefixes.some((prefix) =>
            originalString.includes(prefix)
          ) ||
          tailwindModifiers.some((mod) => originalString.includes(mod))
        ) {
          const newString = processClsxString(originalString);

          if (originalString !== newString) {
            // Replace just this string literal
            const fullMatch = `'${originalString}'`;
            const replacement = `'${newString}'`;

            // We need to be careful to replace only this specific instance
            const beforeReplacement = newContent.substring(0, match.index);
            const afterReplacement = newContent.substring(
              match.index + fullMatch.length
            );
            newContent = beforeReplacement + replacement + afterReplacement;

            // Update the regex lastIndex to account for any length change
            stringLiteralRegex.lastIndex +=
              replacement.length - fullMatch.length;

            fileChanges++;
          }
        }
      }
    }

    // Do the same for double-quoted strings
    const doubleStringLiteralRegex = /"([^"]+)"/g;

    while ((match = doubleStringLiteralRegex.exec(newContent)) !== null) {
      const originalString = match[1];
      const contextBefore = newContent.substring(
        Math.max(0, match.index - 30),
        match.index
      );

      // Only process if it looks like a className context
      if (
        contextBefore.includes('className') ||
        contextBefore.includes('clsx')
      ) {
        // Check if this looks like a class string (has spaces or Tailwind-like patterns)
        if (
          originalString.includes(' ') ||
          tailwindUtilityPrefixes.some((prefix) =>
            originalString.includes(prefix)
          ) ||
          tailwindModifiers.some((mod) => originalString.includes(mod))
        ) {
          const newString = processClsxString(originalString);

          if (originalString !== newString) {
            // Replace just this string literal
            const fullMatch = `"${originalString}"`;
            const replacement = `"${newString}"`;

            // We need to be careful to replace only this specific instance
            const beforeReplacement = newContent.substring(0, match.index);
            const afterReplacement = newContent.substring(
              match.index + fullMatch.length
            );
            newContent = beforeReplacement + replacement + afterReplacement;

            // Update the regex lastIndex to account for any length change
            doubleStringLiteralRegex.lastIndex +=
              replacement.length - fullMatch.length;

            fileChanges++;
          }
        }
      }
    }

    if (fileChanges > 0) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated ${fileChanges} class instances in ${filePath}`);
      totalChanges += fileChanges;
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
});

console.log(`Total changes made: ${totalChanges}`);
