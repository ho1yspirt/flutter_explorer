String.prototype.fromSnakeToPascalCase = function (this: string): string {
  return this.toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
};

String.prototype.fromSnakeToCamelCase = function (this: string): string {
  return this.toLowerCase()
    .split("_")
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("");
};
