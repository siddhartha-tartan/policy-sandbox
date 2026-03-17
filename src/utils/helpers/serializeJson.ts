export function serializeJson(jsonData: any): string {
  try {
    const stringified = JSON.stringify(jsonData);
    if (stringified === "{}") {
      return "";
    }

    if (!jsonData) {
      return "";
    }

    return stringified;
  } catch (err) {
    return "";
  }
}
