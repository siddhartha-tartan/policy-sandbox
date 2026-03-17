export const regexEmail =
  /^(?!\.)(?!.*\.\.)([a-z0-9]+(?:\.[a-z0-9]+)*)(\+[a-zA-Z0-9]+)?@([a-z0-9-]+\.)+[a-z]{2,}$/;
export const regexMobileNumber = /^(\+?0|\+?91)?[6-9]\d{9}$/;
export const regexWebsiteUrl =
  /^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/;
export const regexGST =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
export const regexNumericValues = /^[0-9]+$/;
export const regexAlphabetsValues = /^[A-Za-z]+$/;
export const regexAlphaNumericValues = /^[A-Za-z0-9]+$/;
export const regexAlphaNumericDash = /^[A-Za-z0-9-]+$/;
export const regexAlphaNumericSomeSymbols = /^[A-Za-z0-9- ,_]+$/;
export const regexURL = /^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/;
export const regexPan = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
export const regexSubdomain = /^[a-z][a-z0-9-_]{1,61}[a-z0-9]$/;
