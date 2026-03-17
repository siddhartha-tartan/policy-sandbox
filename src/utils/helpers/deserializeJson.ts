export const deserializeJson = (riskyData: any, fallback: any) => {
  try {
    return JSON.parse(riskyData);
  } catch (err) {
    return fallback;
  }
};
