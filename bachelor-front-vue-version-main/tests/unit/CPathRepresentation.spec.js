import { mount } from "@vue/test-utils";
import CPathRepresentation from "@/components/common/CPathRepresentation";

describe("CPathRepresentation.vue", () => {
  test("shows right number of chevrons when default config", () => {
    const wrapper = mount(CPathRepresentation,
      {
        propsData: {
          directories: [
            {
              name: "dir1",
              route: "/dir1"
            },
            {
              name: "dir1",
              route: "/dir1"
            },
            {
              name: "dir1",
              route: "/dir1"
            },
            {
              name: "dir1",
              route: "/dir1"
            }
          ]
        }
      }
    );

    const chevrons = wrapper.findAll("[data-test=\"chevron\"]");
    expect(chevrons.length).toBe(3);
  });

  test("shows right number of chevrons when when last route is absent", () => {
    const wrapper = mount(CPathRepresentation,
      {
        propsData: {
          directories: [
            {
              name: "dir1",
              route: "/dir1"
            },
            {
              name: "dir1",
              route: "/dir1"
            },
            {
              name: "dir1",
              route: "/dir1"
            },
            {
              name: "",
              route: "/dir1"
            }
          ]
        }
      }
    );

    const chevrons = wrapper.findAll("[data-test=\"chevron\"]");
    expect(chevrons.length).toBe(2);
  });
});
