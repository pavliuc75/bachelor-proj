import { mount } from "@vue/test-utils";
import CPagination from "@/components/common/CPagination";

describe("CPagination.vue", () => {
  test("shows left arrow when current page is > 1", () => {
    const wrapper = mount(CPagination,
      {
        propsData: {
          currentPage: 2,
          totalPages: 10
        }
      });

    const leftArrow = wrapper.findComponent("[data-test=\"arrow-left\"]");

    expect(leftArrow.exists()).toBe(true);
  });

  test("does not show left arrow when current page is <= 1", () => {
    const wrapper = mount(CPagination,
      {
        propsData: {
          currentPage: 1,
          totalPages: 10
        }
      });

    const leftArrow = wrapper.findComponent("[data-test=\"arrow-left\"]");

    expect(leftArrow.exists()).toBe(false);
  });

  test("shows right arrow when current page is not last", () => {
    const wrapper = mount(CPagination,
      {
        propsData: {
          currentPage: 2,
          totalPages: 10
        }
      });

    const leftArrow = wrapper.findComponent("[data-test=\"arrow-right\"]");

    expect(leftArrow.exists()).toBe(true);
  });

  test("does not show right arrow when current page is last", () => {
    const wrapper = mount(CPagination,
      {
        propsData: {
          currentPage: 10,
          totalPages: 10
        }
      });

    const leftArrow = wrapper.findComponent("[data-test=\"arrow-right\"]");

    expect(leftArrow.exists()).toBe(false);
  });

  test("3 dots will appear when there are many pages", () => {
    const wrapper = mount(CPagination,
      {
        propsData: {
          currentPage: 2,
          totalPages: 10
        }
      });

    const dots = wrapper.findComponent("[data-test=\"3dots\"]");

    expect(dots.exists()).toBe(true);
  });

  test("3 dots will not appear when there are few pages", () => {
    const wrapper = mount(CPagination,
      {
        propsData: {
          currentPage: 2,
          totalPages: 3
        }
      });

    const dots = wrapper.findComponent("[data-test=\"3dots\"]");

    expect(dots.exists()).toBe(false);
  });
});