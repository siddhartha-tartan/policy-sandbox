export const isNoRule = (rulesData: Record<string, string[]>) => {
  return Object.values(rulesData).every(
    (rules) => rules.length === 0 || rules.every((rule) => rule.trim() === "")
  );
};
