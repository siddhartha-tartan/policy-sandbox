export const isNullOrUndefined = (value: any): value is null | undefined => {
  return value === null || value === undefined;
};

export const getNestedValue = (obj: any, path: string, fallback: any = "") => {
  return path.split(".").reduce((acc, key) => {
    return acc && acc[key] !== undefined ? acc[key] : fallback;
  }, obj);
};
