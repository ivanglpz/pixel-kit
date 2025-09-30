export function sanitizeInput(input: any): any {
  if (typeof input === "string") {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }

  if (typeof input === "object" && input !== null) {
    const sanitizedObject: any = {};
    for (const key in input) {
      if (!key.startsWith("$") && !key.includes(".")) {
        sanitizedObject[key] = sanitizeInput(input[key]);
      }
    }
    return sanitizedObject;
  }

  return input;
}
