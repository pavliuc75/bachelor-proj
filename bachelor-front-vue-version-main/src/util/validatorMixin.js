import validator from "validator";

export default {
  methods: {
    validateEmailAddress(value) {
      let trimmedString = (value || "").trim();
      let result = validator.isEmail(trimmedString);
      if (!value) {
        result = true;
      }
      return {
        isValid: result,
        errorText: result ? "" : this.$i18n.t("invalidEmail"),
      };
    },
    validateRequired(value) {
      let result = !validator.isEmpty(value || "");
      return {
        isValid: result,
        errorText: result ? "" : this.$i18n.t("required"),
      };
    },
      validateContainsFiveCharacters(value) {
      let trimmedString = (value || "").trim();
      let result = trimmedString.length >= 5;
      if (!value) {
        result = true;
      }
      return {
        isValid: result,
        errorText: result ? "" : this.$i18n.t("minimumLengthIsFiveCharacters"),
      };
    },
    validateContainsANumber(value) {
      let trimmedString = (value || "").trim();
      let result = /\d/.test(trimmedString);
      if (!value) {
        result = true;
      }
      return {
        isValid: result,
        errorText: result ? "" : this.$i18n.t("shouldContainANumber"),
      };
    },
    validateIsIban(value) {
      let trimmedString = (value || "").trim();
      let result = validator.isIBAN(trimmedString);
      if (!value) {
        result = true;
      }
      return {
        isValid: result,
        errorText: result ? "" : this.$i18n.t("invalidIbanNumber"),
      };
    },
    validateIsInteger(value) {
      let trimmedString = (value || "").trim();
      let result = validator.isInt(trimmedString);
      if (!value) {
        result = true;
      }
      return {
        isValid: result,
        errorText: result ? "" : this.$i18n.t("shouldContainOnlyDigits"),
      };
    },
    validateIsFloat(value) {
      let trimmedString = (value || "").trim();
      trimmedString = trimmedString.replace(",", ".");
      let result = validator.isFloat(trimmedString);
      if (!value) {
        result = true;
      }
      return {
        isValid: result,
        errorText: result ? "" : this.$i18n.t("invalidInput"),
      };
    },
    validateIsPositive(value) {
      let trimmedString = (value || "").trim();
      let result = parseFloat(trimmedString) > 0;
      if (!value) {
        result = true;
      }
      return {
        isValid: result,
        errorText: result ? "" : this.$i18n.t("shouldBeBiggerThanZero"),
      };
    },
    validateIsNotNegative(value) {
      let trimmedString = (value || "").trim();
      let result = parseFloat(trimmedString) >= 0;
      if (!value) {
        result = true;
      }
      return {
        isValid: result,
        errorText: result ? "" : this.$i18n.t("shouldNotBeNegativeNumber"),
      };
    },
    validateSwiftCode(value) {
      let swiftRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
      let trimmedString = (value || "").trim();
      let result = swiftRegex.test(trimmedString);
      if (!value) {
        result = true;
      }
      return {
        isValid: result,
        errorText: result ? "" : this.$i18n.t("invalidSwiftCode"),
      };
    },
    validateIsPhoneNumber(value) {
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
          : this.$i18n.t("shouldConsistOfNineDigitsAndStartWithZero"),
      };
    },
  },
};
