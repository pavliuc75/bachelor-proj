// @ts-ignore
import validator from "validator";
import i18next from "../translations/i18n";

interface ValidationResult {
  isValid: boolean;
  errorText: string | "";
}

function validateEmailAddress(value: any): ValidationResult {
  let trimmedString = (value || "").trim();
  let result = validator.isEmail(trimmedString);
  if (!value) {
    result = true;
  }
  return {
    isValid: result,
    errorText: result ? "" : i18next.t("invalidEmail"),
  };
}

function validateRequired(value: any): ValidationResult {
  let result = !validator.isEmpty(value || "");
  return {
    isValid: result,
    errorText: result ? "" : i18next.t("required"),
  };
}

function validateContainsFiveCharacters(value: any): ValidationResult {
  let trimmedString = (value || "").trim();
  let result = trimmedString.length >= 5;
  if (!value) {
    result = true;
  }
  return {
    isValid: result,
    errorText: result ? "" : i18next.t("minimumLengthIsFiveCharacters"),
  };
}

function validateContainsANumber(value: any): ValidationResult {
  let trimmedString = (value || "").trim();
  let result = /\d/.test(trimmedString);
  if (!value) {
    result = true;
  }
  return {
    isValid: result,
    errorText: result ? "" : i18next.t("shouldContainANumber"),
  };
}

function validateIsIban(value: any): ValidationResult {
  let trimmedString = (value || "").trim();
  let result = validator.isIBAN(trimmedString);
  if (!value) {
    result = true;
  }
  return {
    isValid: result,
    errorText: result ? "" : i18next.t("invalidIbanNumber"),
  };
}

function validateIsInteger(value: any): ValidationResult {
  let trimmedString = (value || "").trim();
  let result = validator.isInt(trimmedString);
  if (!value) {
    result = true;
  }
  return {
    isValid: result,
    errorText: result ? "" : i18next.t("shouldContainOnlyDigits"),
  };
}

function validateIsFloat(value: any): ValidationResult {
  let trimmedString = (value || "").trim();
  trimmedString = trimmedString.replace(",", ".");
  let result = validator.isFloat(trimmedString);
  if (!value) {
    result = true;
  }
  return {
    isValid: result,
    errorText: result ? "" : i18next.t("invalidInput"),
  };
}

function validateIsPositive(value: any): ValidationResult {
  let trimmedString = (value || "").trim();
  let result = parseFloat(trimmedString) > 0;
  if (!value) {
    result = true;
  }
  return {
    isValid: result,
    errorText: result ? "" : i18next.t("shouldBeBiggerThanZero"),
  };
}

function validateIsNotNegative(value: any): ValidationResult {
  let trimmedString = (value || "").trim();
  let result = parseFloat(trimmedString) >= 0;
  if (!value) {
    result = true;
  }
  return {
    isValid: result,
    errorText: result ? "" : i18next.t("shouldNotBeNegativeNumber"),
  };
}

function validateSwiftCode(value: any): ValidationResult {
  let swiftRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
  let trimmedString = (value || "").trim();
  let result = swiftRegex.test(trimmedString);
  if (!value) {
    result = true;
  }
  return {
    isValid: result,
    errorText: result ? "" : i18next.t("invalidSwiftCode"),
  };
}

function validateIsPhoneNumber(value: any): ValidationResult {
  let trimmedString = (value || "").trim();
  let result =
    trimmedString.length === 9 &&
    !isNaN(trimmedString) &&
    trimmedString.charAt(0) === "0";
  if (!value) {
    result = true;
  }
  return {
    isValid: result,
    errorText: result
      ? ""
      : i18next.t("shouldConsistOfNineDigitsAndStartWithZero"),
  };
}

export const validatorHelper = {
  validateEmailAddress,
  validateRequired,
  validateContainsFiveCharacters,
  validateContainsANumber,
  validateIsIban,
  validateIsInteger,
  validateIsFloat,
  validateIsPositive,
  validateIsNotNegative,
  validateSwiftCode,
  validateIsPhoneNumber,
};
