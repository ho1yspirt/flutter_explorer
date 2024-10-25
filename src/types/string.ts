declare global {
  interface String {
    fromSnakeToPascalCase(): string;

    fromSnakeToCamelCase(): string;
  }
}
