import {
  regexAlphabetsValues,
  regexAlphaNumericDash,
  regexAlphaNumericSomeSymbols,
  regexAlphaNumericValues,
  regexEmail,
  regexGST,
  regexMobileNumber,
  regexNumericValues,
  regexPan,
  regexURL,
} from "../../../utils/common/regex";
import { TFormValidators } from "./data";

export const commonValidator: TFormValidators = {
  numericValues: (value) => {
    if (!regexNumericValues.test(String(value))) {
      return "Numbers only (0-9).";
    }
  },
  alphabetValues: (value) => {
    if (!regexAlphabetsValues.test(String(value))) {
      return "Letters only (A-Z).";
    }
  },
  alphaNumericValues: (value) => {
    if (!regexAlphaNumericValues.test(String(value))) {
      return "Only letters & numbers.";
    }
  },
  alphaNumericDash: (value) => {
    if (!regexAlphaNumericDash.test(String(value))) {
      return "Letters, numbers & '-' allowed.";
    }
  },
  alphaNumericSomeSymbols: (value) => {
    if (!regexAlphaNumericSomeSymbols.test(String(value))) {
      return "Letters, numbers, '-', ',', '_' & spaces allowed.";
    }
  },
  min3Characters: (value) => {
    if (String(value).trim().length < 3) {
      return "Minimum 3 characters required!";
    }
  },
  min5Characters: (value) => {
    if (String(value).trim().length < 5) {
      return "Minimum 5 characters required!";
    }
  },
  max20Characters: (value) => {
    if (String(value).trim().length > 20) {
      return "Maximum 20 characters allowed!";
    }
  },
  max120Characters: (value) => {
    if (String(value).trim().length > 120) {
      return "Maximum 120 characters allowed!";
    }
  },
  email: (value) => {
    if (!regexEmail.test(String(value))) {
      return "Invalid email!";
    }
  },
  mobile: (value) => {
    if (!regexMobileNumber.test(String(value))) {
      return "Invalid mobile number!";
    }
  },
  gst: (value) => {
    if (!regexGST.test(String(value))) {
      return "Invalid GST Number!";
    }
  },
  url: (value) => {
    if (!regexURL.test(String(value))) {
      return "Please enter a valid URL (must start with https://)";
    }
  },
  notRequiredUrl: (value) => {
    if (!value) return "";
    if (!regexURL.test(String(value))) {
      return "Please enter a valid URL (must start with https://)";
    }
  },
  pincode: (value) => {
    const trimmedValue = String(value).trim();
    if (trimmedValue.length !== 6 || !regexNumericValues.test(String(value))) {
      return "Invalid Postal Code!";
    }
  },
  panNumber: (value) => {
    if (!regexPan.test(String(value))) {
      return "Please enter a valid pan number!";
    }
  },
  subdomain: (value) => {
    const alias = String(value || "").trim();
    // 1. Alias is empty
    if (!alias) {
      return "Alias cannot be empty.";
    }
    // 2. Contains uppercase letters
    if (/[A-Z]/.test(alias)) {
      return "Alias must be in lowercase only.";
    }
    // 3. Contains spaces or invalid special characters
    // This regex now allows underscores in the character set [^a-z0-9-_].
    if (/[^a-z0-9-_]/.test(alias)) {
      return "Alias cannot contain spaces or special characters.";
    }
    // 4. Too short
    if (alias.length < 3) {
      return "Alias must be at least 3 characters long.";
    }
    // 5. Too long
    if (alias.length > 30) {
      return "Alias must not exceed 30 characters.";
    }
    // 6. Starts or ends with a hyphen or underscore
    // This regex checks for a hyphen or underscore at the start (^) or end ($) of the string.
    if (/^[-_]|[-_]$/.test(alias)) {
      return "Alias cannot start or end with a hyphen or underscore.";
    }
    // 7. Consecutive hyphens or underscores
    // This regex looks for any two or more hyphens or underscores together (e.g., --, __, -_, _-).
    if (/[_-]{2,}/.test(alias)) {
      return "Alias cannot contain consecutive hyphens or underscores.";
    }
  },
  // ✅ NEW PASSWORD VALIDATORS START HERE
  min8Characters: (value) => {
    if (String(value).trim().length < 8) {
      return "Minimum 8 characters required!";
    }
  },
  oneUpperCase: (value) => {
    if (!/[A-Z]/.test(String(value))) {
      return "At least one uppercase letter (A-Z) required!";
    }
  },
  oneLowerCase: (value) => {
    if (!/[a-z]/.test(String(value))) {
      return "At least one lowercase letter (a-z) required!";
    }
  },
  oneNumber: (value) => {
    if (!/[0-9]/.test(String(value))) {
      return "At least one number (0-9) required!";
    }
  },
  oneSpecialChar: (value) => {
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(String(value))) {
      return "At least one special character required!";
    }
  },
  json: (value) => {
    if (!value || String(value).trim() === "") return undefined;
    try {
      JSON.parse(String(value));
      return undefined;
    } catch (e) {
      return 'Invalid JSON format. Expected: {"key": "value"}';
    }
  },
};
