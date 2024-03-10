import validatorMixin from "../src/util/validatorMixin";

// Normally, when returning a negative result, the validator function
// would also return the error message generated using the i18n library.
// Since the library cannot be used during unit testing, the validator function
// throws an error instead. The unit test then checks if the error is thrown.

describe("validateEmailAddress", () => {
  test("valid: test@gmail.com", () => {
    let str = "test@gmail.com";
    expect(validatorMixin.methods.validateEmailAddress(str).isValid).toBeTruthy();
  });

  test("invalid: randomstr", () => {
    let str = "randomstr";
    expect(() => validatorMixin.methods.validateEmailAddress(str).isValid).toThrow();
  });

  test("valid: very.common@example.com", () => {
    let str = "very.common@example.com";
    expect(validatorMixin.methods.validateEmailAddress(str).isValid).toBeTruthy();
  });

  test("valid: disposable.style.email.with+symbol@example.com", () => {
    let str = "disposable.style.email.with+symbol@example.com";
    expect(validatorMixin.methods.validateEmailAddress(str).isValid).toBeTruthy();
  });

  test("valid: other.email-with-dash@example.com", () => {
    let str = "other.email-with-dash@example.com";
    expect(validatorMixin.methods.validateEmailAddress(str).isValid).toBeTruthy();
  });

  test("valid: Abc@example.com", () => {
    let str = "Abc@example.com";
    expect(validatorMixin.methods.validateEmailAddress(str).isValid).toBeTruthy();
  });

  test("invalid: john..doe@example.com", () => {
    let str = "john..doe@example.com";
    expect(() => validatorMixin.methods.validateEmailAddress(str).isValid).toThrow();
  });

  test("invalid: jjohn.doe@example..com", () => {
    let str = "john.doe@example..com";
    expect(() => validatorMixin.methods.validateEmailAddress(str).isValid).toThrow();
  });

  test("invalid: A@b@c@example.com", () => {
    let str = "A@b@c@example.com";
    expect(() => validatorMixin.methods.validateEmailAddress(str).isValid).toThrow();
  });

  test("invalid: A @example.com", () => {
    let str = "A @example.com";
    expect(() => validatorMixin.methods.validateEmailAddress(str).isValid).toThrow();
  });
});

describe("validateRequired", () => {
  test("valid: test", () => {
    let str = "test";
    expect(validatorMixin.methods.validateRequired(str).isValid).toBeTruthy();
  });

  test("invalid: ''", () => {
    let str = "";
    expect(() => validatorMixin.methods.validateRequired(str).isValid).toThrow();
  });

  test("invalid: null", () => {
    let str = null;
    expect(() => validatorMixin.methods.validateRequired(str).isValid).toThrow();
  });

  test("invalid: undefined", () => {
    let str = undefined;
    expect(() => validatorMixin.methods.validateRequired(str).isValid).toThrow();
  });
});

describe("validateContainsFiveCharacters", () => {
  test("valid: 12345", () => {
    let str = "12345";
    expect(validatorMixin.methods.validateContainsFiveCharacters(str).isValid).toBeTruthy();
  });

  test("valid: 123456", () => {
    let str = "12345";
    expect(validatorMixin.methods.validateContainsFiveCharacters(str).isValid).toBeTruthy();
  });

  test("invalid: 1234", () => {
    let str = '1234';
    expect(() => validatorMixin.methods.validateContainsFiveCharacters(str).isValid).toThrow();
  });
});

describe("validateContainsANumber", () => {
  test("valid: aa1", () => {
    let str = "aa1";
    expect(validatorMixin.methods.validateContainsANumber(str).isValid).toBeTruthy();
  });

  test("valid: 1", () => {
    let str = "1";
    expect(validatorMixin.methods.validateContainsANumber(str).isValid).toBeTruthy();
  });

  test("invalid: aa", () => {
    let str = 'aa';
    expect(() => validatorMixin.methods.validateContainsANumber(str).isValid).toThrow();
  });
});

describe("validateIsIban", () => {
  test("valid: MD21EX000000000001234567", () => {
    let str = "MD21EX000000000001234567";
    expect(validatorMixin.methods.validateIsIban(str).isValid).toBeTruthy();
  });

  test("valid: BE71096123456769", () => {
    let str = "BE71096123456769";
    expect(validatorMixin.methods.validateIsIban(str).isValid).toBeTruthy();
  });

  test("invalid: 00000BE71096123456769", () => {
    let str = '00000BE71096123456769';
    expect(() => validatorMixin.methods.validateIsIban(str).isValid).toThrow();
  });
});

describe("validateIsInteger", () => {
  test("valid: 12345", () => {
    let str = "12345";
    expect(validatorMixin.methods.validateIsInteger(str).isValid).toBeTruthy();
  });

  test("valid: 0", () => {
    let str = "0";
    expect(validatorMixin.methods.validateIsInteger(str).isValid).toBeTruthy();
  });

  test("valid: -100", () => {
    let str = "-100";
    expect(validatorMixin.methods.validateIsInteger(str).isValid).toBeTruthy();
  });

  test("invalid: 123.312", () => {
    let str = '123.312';
    expect(() => validatorMixin.methods.validateIsInteger(str).isValid).toThrow();
  });

  test("invalid: 1a1", () => {
    let str = '1a1';
    expect(() => validatorMixin.methods.validateIsInteger(str).isValid).toThrow();
  });
});

describe("validateSwiftCode", () => {
  test("valid: APMMDKKK", () => {
    let str = "APMMDKKK";
    expect(validatorMixin.methods.validateSwiftCode(str).isValid).toBeTruthy();
  });

  test("invalid: BE71096123456769", () => {
    let str = 'BE71096123456769';
    expect(() => validatorMixin.methods.validateSwiftCode(str).isValid).toThrow();
  });
});

// moldovan format without country code
describe("validateIsPhoneNumber", () => {
  test("valid: 079292929", () => {
    let str = "079292929";
    expect(validatorMixin.methods.validateIsPhoneNumber(str).isValid).toBeTruthy();
  });

  test("invalid: 79292929", () => {
    let str = '79292929';
    expect(() => validatorMixin.methods.validateIsPhoneNumber(str).isValid).toThrow();
  });
  
  test("invalid: +37379292929", () => {
    let str = '+37379292929';
    expect(() => validatorMixin.methods.validateIsPhoneNumber(str).isValid).toThrow();
  });
});
