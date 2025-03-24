/**
 * Converts a string to snake_case.
 * Handles various input formats: camelCase, PascalCase, kebab-case, and space-separated words.
 * @param text The input string to convert.
 * @returns The snake_case representation of the input string.
 */
export function toSnakeCase(text: string): string {
  if (!text) return "";

  // Handle already snake_case text
  if (/^[a-z0-9]+(_[a-z0-9]+)*$/.test(text)) {
    return text;
  }

  // Special handling for uppercase strings with underscores or hyphens
  if (text === text.toUpperCase() && /[_-]/.test(text)) {
    return text.toLowerCase().replace(/[-]+/g, "_");
  }

  // Handle special case of all uppercase text
  if (text === text.toUpperCase() && !/[_-\s]/.test(text)) {
    return text.toLowerCase();
  }

  // First replace any separators (hyphens, spaces) with underscores
  let result = text.replace(/[-\s]+/g, "_");

  // Handle CamelCase and PascalCase: insert underscore before uppercase letters
  // but don't separate consecutive capitals in acronyms
  result = result.replace(/([a-z0-9])([A-Z])/g, "$1_$2");

  // Handle acronyms - insert underscore before transition from uppercase to lowercase
  // e.g., APIResponse → API_Response
  result = result.replace(/([A-Z])([A-Z][a-z])/g, "$1_$2");

  // Clean up: remove any consecutive underscores and convert to lowercase
  result = result.replace(/_+/g, "_").toLowerCase();

  // Remove leading underscore if present (happens when input starts with capital)
  return result.replace(/^_/, "");
}

/**
 * Converts a string to camelCase.
 * Handles various input formats: snake_case, PascalCase, kebab-case, and space-separated words.
 * @param text The input string to convert.
 * @returns The camelCase representation of the input string.
 */
export function toCamelCase(text: string): string {
  if (!text) return "";

  // Handle already camelCase text
  if (/^[a-z][a-zA-Z0-9]*$/.test(text)) {
    return text;
  }

  // Special handling for strings that start with numbers
  const startsWithNumber = /^\d/.test(text);

  // Handle special case of strings starting with numbers
  if (startsWithNumber) {
    // For number-prefixed PascalCase strings (maintain the case)
    if (/^\d+[A-Z][a-zA-Z0-9]*$/.test(text)) {
      return text;
    }
  }

  // First replace snake_case and kebab-case with spaces
  let result = text.replace(/[_-]+/g, " ");

  // Special handling for acronyms
  // This gets tricky as we need to identify sequences of uppercase letters
  const acronymHandled = result.replace(
    /([A-Z]+)([A-Z][a-z])/g,
    (_, acronym, nextChar) => {
      return (
        acronym.charAt(0).toUpperCase() +
        acronym.slice(1).toLowerCase() +
        nextChar
      );
    }
  );

  // Convert the first character based on whether we're dealing with camelCase
  let processedResult;

  if (startsWithNumber) {
    // For strings starting with numbers, capitalize after the numbers
    processedResult = acronymHandled.replace(
      /^(\d+)([a-zA-Z])/,
      (_, numbers, firstChar) => {
        return numbers + firstChar.toUpperCase();
      }
    );

    // Then continue with the camelCase pattern for the rest
    processedResult = processedResult.replace(/[\s_-]+(.)/g, (_, char) =>
      char.toUpperCase()
    );
  } else {
    // Standard handling for non-number prefixed strings
    // Convert to lowercase and capitalize after word boundaries
    processedResult = acronymHandled
      .toLowerCase()
      .replace(/\s+(.)/g, (_, char) => char.toUpperCase());
  }

  // If it's already in proper camelCase, return as is
  if (startsWithNumber) {
    return processedResult;
  } else {
    // Ensure first character is lowercase for camelCase
    return processedResult.charAt(0).toLowerCase() + processedResult.slice(1);
  }
}

/**
 * Converts a string to PascalCase.
 * Handles various input formats: snake_case, camelCase, kebab-case, and space-separated words.
 * @param text The input string to convert.
 * @returns The PascalCase representation of the input string.
 */
export function toPascalCase(text: string): string {
  if (!text) return "";

  // Handle already PascalCase text
  if (/^[A-Z][a-zA-Z0-9]*$/.test(text)) {
    return text;
  }

  // Special handling for strings that start with numbers
  const startsWithNumber = /^\d/.test(text);

  if (startsWithNumber) {
    // For number-prefixed PascalCase strings (maintain the case)
    if (/^\d+[A-Z][a-zA-Z0-9]*$/.test(text)) {
      return text;
    }
  }

  // First get the camelCase version
  const camelCase = toCamelCase(text);

  // Then capitalize the first letter
  if (startsWithNumber) {
    // For strings starting with numbers, find the first letter and capitalize it
    return camelCase.replace(/^(\d+)([a-z])/, (_, digits, firstChar) => {
      return digits + firstChar.toUpperCase();
    });
  } else {
    // Normal case - capitalize first letter
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
  }
}

// Example usage:
// const snake = toSnakeCase("helloWorld");  // "hello_world"
// const camel = toCamelCase("hello_world"); // "helloWorld"
// const pascal = toPascalCase("hello_world"); // "HelloWorld"
