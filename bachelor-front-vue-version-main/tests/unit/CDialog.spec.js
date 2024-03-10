import { createLocalVue, mount } from "@vue/test-utils";
import CDialog from "@/components/common/CDialog";
import Vuetify from "vuetify";

//had to fill the slot to skip setting up i18n
describe("CDialog.vue", () => {
  let localVue;
  let vuetify;
  let wrapper;

  test("should open the dialog", async () => {
    vuetify = new Vuetify();
    localVue = createLocalVue();

    const App = localVue.component("App", {
      components: { CDialog },
      data() {
        return { dialog: false };
      },
      template: `
        <v-app>
        <c-dialog
          ref="c-dialog"
          :is-shown="dialog"
        >
          <template v-slot:footer>
            <div data-test="footer">
            </div>
          </template>
        </c-dialog>
        </v-app>
      `
    });

    wrapper = mount(App, {
      localVue,
      vuetify,
      attachToDocument: true
    });

    wrapper.setData({ dialog: true });
    await wrapper.vm.$nextTick();

    expect(wrapper.find("[data-test=\"footer\"]").exists()).toBe(true);
  });

  test("should close the dialog", async () => {
    vuetify = new Vuetify();
    localVue = createLocalVue();

    const App = localVue.component("App", {
      components: { CDialog },
      data() {
        return { dialog: false };
      },
      template: `
        <v-app>
        <c-dialog
          ref="c-dialog"
          :is-shown="dialog"
        >
          <template v-slot:footer>
            <div data-test="footer">
            </div>
          </template>
        </c-dialog>
        </v-app>
      `
    });

    wrapper = mount(App, {
      localVue,
      vuetify,
      attachToDocument: true
    });

    await wrapper.setData({ dialog: true });

    expect(wrapper.find("[data-test=\"footer\"]").exists()).toBe(true);

    await wrapper.setData({ dialog: false });

    expect(wrapper.find(".v-dialog").html().includes("display: none;")).toBe(true);
  });

  test("should not show default footer when slot is filled", async () => {
    vuetify = new Vuetify();
    localVue = createLocalVue();

    const App = localVue.component("App", {
      components: { CDialog },
      data() {
        return { dialog: false };
      },
      template: `
        <v-app>
        <c-dialog
          ref="c-dialog"
          :is-shown="dialog"
        >
          <template v-slot:footer>
            <div data-test="footer_">
            </div>
          </template>
        </c-dialog>
        </v-app>
      `
    });

    wrapper = mount(App, {
      localVue,
      vuetify,
      attachToDocument: true
    });

    await wrapper.setData({ dialog: true });

    expect(wrapper.find("[data-test=\"footer\"]").exists()).toBe(false);
  });
});

