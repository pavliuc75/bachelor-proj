import { mount } from "@vue/test-utils";
import CInput from "@/components/common/CInput";

describe("CInput.vue", () => {
  test("emits update when input value changes", async () => {
    const wrapper = mount(CInput,
      {
        propsData: {
          value: "test"
        }
      });

    let input = wrapper.find("input");
    await input.setValue("new value");

    expect(wrapper.emitted().update).toBeTruthy();
  });

  test("when validator does not succeed red borders around the input appear", async () => {
    function testValidatorFunction(value) {
      return {
        isValid: false,
        errorText: "Error"
      };
    }

    const wrapper = mount(CInput,
      {
        propsData: {
          value: "test",
          validatorFunctions: [testValidatorFunction]
        }
      });

    let input = wrapper.find("input");
    await input.setValue("any");

    expect(input.classes()).toContain("border-error");
  });

  test("when validator does not succeed error text appears", async () => {
    function testValidatorFunction(value) {
      return {
        isValid: false,
        errorText: "Error"
      };
    }

    const wrapper = mount(CInput,
      {
        propsData: {
          value: "test",
          validatorFunctions: [testValidatorFunction]
        }
      });

    let input = wrapper.find("input");
    await input.setValue("any");

    let errorTextSpan = wrapper.find("[data-test=\"error-text\"]");
    expect(errorTextSpan.text()).toBe("Error");
  });

  test("when validator succeeds again, the red border is gone", async () => {
    function testValidatorFunction(value) {
      return {
        isValid: value === "succeed",
        errorText: value === "succeed" ? "" : "Error"
      };
    }

    const wrapper = mount(CInput,
      {
        propsData: {
          value: "test",
          validatorFunctions: [testValidatorFunction]
        }
      });

    let input = wrapper.find("input");
    await input.setValue("any");

    expect(input.classes()).toContain("border-error");

    await input.setValue("succeed");
    expect(input.classes()).not.toContain("border-error");
  });


  test("when validator succeeds again, the error text is gone", async () => {
    function testValidatorFunction(value) {
      return {
        isValid: value === "succeed",
        errorText: value === "succeed" ? "" : "Error"
      };
    }

    const wrapper = mount(CInput,
      {
        propsData: {
          value: "test",
          validatorFunctions: [testValidatorFunction]
        }
      });


    let errorTextSpan;
    let input = wrapper.find("input");

    await input.setValue("any");

    errorTextSpan = wrapper.find("[data-test=\"error-text\"]");
    expect(errorTextSpan.text()).toBe("Error");

    await input.setValue("succeed");
    errorTextSpan = wrapper.find("[data-test=\"error-text\"]");

    expect(errorTextSpan.exists()).toBe(false);
  });

  test("does not actively validate when lazy validation is on", async () => {
    function testValidatorFunction(value) {
      return {
        isValid: false,
        errorText: "Error"
      };
    }

    const wrapper = mount(CInput,
      {
        propsData: {
          value: "test",
          validatorFunctions: [testValidatorFunction],
          lazyValidation: true
        }
      });

    let input = wrapper.find("input");
    await input.setValue("any");

    expect(input.classes()).not.toContain("border-error");
  });

  test("validates on blur", async () => {
    function testValidatorFunction(value) {
      return {
        isValid: false,
        errorText: "Error"
      };
    }

    const wrapper = mount(CInput,
      {
        propsData: {
          value: "test",
          validatorFunctions: [testValidatorFunction],
          lazyValidation: true,
          validateOnBlur: true
        }
      });

    let input = wrapper.find("input");
    await input.setValue("any");
    await input.trigger("blur");

    expect(input.classes()).toContain("border-error");
  });


  test("does not validate when blur is disabled", async () => {
    function testValidatorFunction(value) {
      return {
        isValid: false,
        errorText: "Error"
      };
    }

    const wrapper = mount(CInput,
      {
        propsData: {
          value: "test",
          validatorFunctions: [testValidatorFunction],
          lazyValidation: true,
          validateOnBlur: false
        }
      });

    let input = wrapper.find("input");
    await input.setValue("any");
    await input.trigger("blur");

    expect(input.classes()).not.toContain("border-error");
  });

  test("input field gets a random id", async () => {
    const wrapper = mount(CInput,
      {
        propsData: {
          value: "test"
        }
      });

    let input = wrapper.find("input");

    //e.g input-dsa2a
    expect(input.attributes().id.length).toBe(11);
  });

  test("border becomes bold on focus", async () => {
    const wrapper = mount(CInput,
      {
        propsData: {
          value: "test"
        }
      });

    let input = wrapper.find("input");
    await input.trigger("focus");

    expect(input.classes()).toContain("focus-visible:border-2");
  });
});