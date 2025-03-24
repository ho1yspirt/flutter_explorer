import { toSnakeCase, toCamelCase, toPascalCase } from "./stringUtil";

// Test data structure: [input, expectedSnakeCase, expectedCamelCase, expectedPascalCase]
const testCases: [string, string, string, string][] = [
  // Empty string
  ["", "", "", ""],

  // Already formatted strings
  [
    "snake_case_string",
    "snake_case_string",
    "snakeCaseString",
    "SnakeCaseString",
  ],
  [
    "camelCaseString",
    "camel_case_string",
    "camelCaseString",
    "CamelCaseString",
  ],
  [
    "PascalCaseString",
    "pascal_case_string",
    "pascalCaseString",
    "PascalCaseString",
  ],

  // Space separated words
  [
    "simple string test",
    "simple_string_test",
    "simpleStringTest",
    "SimpleStringTest",
  ],
  [
    "Mixed Case String",
    "mixed_case_string",
    "mixedCaseString",
    "MixedCaseString",
  ],

  // Kebab case
  [
    "kebab-case-string",
    "kebab_case_string",
    "kebabCaseString",
    "KebabCaseString",
  ],

  // Mixed formats
  ["snake_and-kebab", "snake_and_kebab", "snakeAndKebab", "SnakeAndKebab"],
  [
    "Mixed With-different_formats",
    "mixed_with_different_formats",
    "mixedWithDifferentFormats",
    "MixedWithDifferentFormats",
  ],

  // Edge cases
  ["ALL_CAPS_SNAKE", "all_caps_snake", "allCapsSnake", "AllCapsSnake"],
  [
    "SCREAMING-KEBAB-CASE",
    "screaming_kebab_case",
    "screamingKebabCase",
    "ScreamingKebabCase",
  ],
  ["alllowercase", "alllowercase", "alllowercase", "Alllowercase"],
  ["ALLUPPERCASE", "alluppercase", "alluppercase", "Alluppercase"],

  // Numbers
  [
    "mix3d_with_numb3rs",
    "mix3d_with_numb3rs",
    "mix3dWithNumb3rs",
    "Mix3dWithNumb3rs",
  ],
  [
    "camelCase123String",
    "camel_case123_string",
    "camelCase123String",
    "CamelCase123String",
  ],
  [
    "123StartWithNumbers",
    "123_start_with_numbers",
    "123StartWithNumbers",
    "123StartWithNumbers",
  ],

  // Multiple separators
  [
    "multiple__underscores",
    "multiple_underscores",
    "multipleUnderscores",
    "MultipleUnderscores",
  ],
  [
    "multiple--hyphens",
    "multiple_hyphens",
    "multipleHyphens",
    "MultipleHyphens",
  ],
  ["multiple  spaces", "multiple_spaces", "multipleSpaces", "MultipleSpaces"],

  // Acronyms
  ["handle_JSON_data", "handle_json_data", "handleJsonData", "HandleJsonData"],
  [
    "parseHTMLString",
    "parse_html_string",
    "parseHtmlString",
    "ParseHtmlString",
  ],
  [
    "API_Response_Handler",
    "api_response_handler",
    "apiResponseHandler",
    "ApiResponseHandler",
  ],
];

// Run tests
function runTests() {
  let passedTests = 0;
  let failedTests = 0;

  console.log("Running string case conversion tests...\n");

  testCases.forEach(
    ([input, expectedSnake, expectedCamel, expectedPascal], index) => {
      console.log(`Test case #${index + 1}: "${input}"`);

      // Test toSnakeCase
      const snakeResult = toSnakeCase(input);
      const snakePass = snakeResult === expectedSnake;
      console.log(
        `  toSnakeCase: ${
          snakePass ? "PASS" : "FAIL"
        } → Got: "${snakeResult}", Expected: "${expectedSnake}"`
      );

      // Test toCamelCase
      const camelResult = toCamelCase(input);
      const camelPass = camelResult === expectedCamel;
      console.log(
        `  toCamelCase: ${
          camelPass ? "PASS" : "FAIL"
        } → Got: "${camelResult}", Expected: "${expectedCamel}"`
      );

      // Test toPascalCase
      const pascalResult = toPascalCase(input);
      const pascalPass = pascalResult === expectedPascal;
      console.log(
        `  toPascalCase: ${
          pascalPass ? "PASS" : "FAIL"
        } → Got: "${pascalResult}", Expected: "${expectedPascal}"`
      );

      console.log(""); // Empty line for readability

      if (snakePass && camelPass && pascalPass) {
        passedTests++;
      } else {
        failedTests++;
      }
    }
  );

  console.log(
    `Test Summary: ${passedTests} test cases passed, ${failedTests} test cases failed.`
  );

  if (failedTests === 0) {
    console.log("All tests passed! 🎉");
  } else {
    console.log("Some tests failed. Please check the implementation.");
  }
}

// Run the tests
runTests();
