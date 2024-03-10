import { createLocalVue, mount } from "@vue/test-utils";
import CRating from "@/components/common/CRating";
import Vuetify from "vuetify";

describe("CRating.vue", () => {
  const localVue = createLocalVue();
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  test("all stars are empty when value is 0", () => {
    const wrapper = mount(CRating, {
      localVue,
      vuetify,
      propsData: {
        value: 0
      }
    });

    const emptyStars = wrapper.findAll("[data-test=\"empty-star\"]");
    expect(emptyStars.length).toBe(5);
  });

  test("all stars are full when value is 5", () => {
    const wrapper = mount(CRating, {
      localVue,
      vuetify,
      propsData: {
        value: 5
      }
    });

    const filledStars = wrapper.findAll("[data-test=\"filled-star\"]");
    expect(filledStars.length).toBe(5);
  });

  test("the number of filled and half stars is right", () => {
    const wrapper = mount(CRating, {
      localVue,
      vuetify,
      propsData: {
        value: 2
      }
    });

    const emptyStars = wrapper.findAll("[data-test=\"empty-star\"]");
    const filledStars = wrapper.findAll("[data-test=\"filled-star\"]");
    expect(filledStars.length).toBe(2);
    expect(emptyStars.length).toBe(3);
  });

  test("there are no half stars when the value has no fractional part", () => {
    const wrapper = mount(CRating, {
      localVue,
      vuetify,
      propsData: {
        value: 2
      }
    });

    const halfStars = wrapper.findAll("[data-test=\"half-star\"]");
    expect(halfStars.length).toBe(0);
  });

  test("there is a half stars when the value has fractional part", () => {
    const wrapper = mount(CRating, {
      localVue,
      vuetify,
      propsData: {
        value: 2.3
      }
    });

    const halfStars = wrapper.findAll("[data-test=\"half-star\"]");
    expect(halfStars.length).toBe(1);
  });

  test("the text value shown has commas instead of dots", () => {
    const wrapper = mount(CRating, {
      localVue,
      vuetify,
      propsData: {
        value: 2.3
      }
    });

    const valueSpan = wrapper.find("[data-test=\"value\"]");
    expect(valueSpan.text()).toBe("(2,3)");
  });
});

