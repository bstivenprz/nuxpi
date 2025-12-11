/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Extended FormData with a utility to retrieve all fields as a plain JSON object.
 */
export class FormDataWithJSON extends FormData {
  /**
   * Returns an object with all entries from the FormData. If there are multiple values for a key,
   * an array of those values will be returned; otherwise, a single value is returned.
   * File values are included as File objects.
   */
  toJSON(): Record<string, string | File | (string | File)[]> {
    const data: Record<string, any> = {};
    for (const [key, value] of this.entries()) {
      if (key in data) {
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }
    return data;
  }
}

/**
 * Converts a FormData instance to a plain JSON object.
 * If there are multiple values for a key, returns them as an array.
 * File instances will be included as File objects within the result.
 * @param formData - The FormData instance to convert.
 */
export function formDataToJSON(
  formData: FormData
): Record<string, string | File | (string | File)[]> {
  const data: Record<string, any> = {};
  for (const [key, value] of formData.entries()) {
    if (key in data) {
      if (Array.isArray(data[key])) {
        data[key].push(value);
      } else {
        data[key] = [data[key], value];
      }
    } else {
      data[key] = value;
    }
  }
  return data;
}

/**
 * Converts a JSON object to a FormData instance.
 * Handles primitives, File, and arrays/objects.
 * Arrays become repeated fields for simple types, or are stringified for objects/files.
 * @param json - The JSON object to convert.
 * @returns FormData instance
 */
export function jsonToFormData(
  json: Record<string, unknown>
): FormData {
  const formData = new FormData();

  Object.entries(json).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item instanceof File) {
          formData.append(key, item);
        } else if (
          typeof item === "string" ||
          typeof item === "number" ||
          typeof item === "boolean"
        ) {
          formData.append(key, item.toString());
        } else {
          // For non-primitive array items, stringify
          formData.append(key, JSON.stringify(item));
        }
      });
    } else if (
      typeof value === "object"
    ) {
      // For nested objects, stringify
      formData.append(key, JSON.stringify(value));
    } else {
      // Primitive value
      formData.append(key, value.toString());
    }
  });

  return formData;
}
