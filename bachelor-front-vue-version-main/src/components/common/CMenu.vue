<template>
  <v-menu
    max-width="320"
    max-height="384"
    v-model="isShownLocal"
    :close-on-content-click="false"
    content-class="bg-white rounded-none border border-solid border-mid-gray shadow-none"
    offset-y
    transition="fade-transition"
    v-bind="$attrs"
    nudge-bottom="4"
  >
    <template v-slot:activator="{ on }">
      <div @click="toggleMenu" v-on="on" @click.prevent.stop>
        <slot :shown="isShownLocal" name="activator" />
      </div>
    </template>
    <ul class="flex flex-col shrink-0">
      <li
        data-cy="menu-item"
        v-for="(item, index) in items"
        :key="index"
        :class="{
          'border-none': index === items.length - 1,
        }"
        class="flex flex-row items-center shrink-0 justify-between hover:bg-background cursor-pointer min-h-[36px] border-b border-solid border-mid-gray px-2"
        @click="handleClick(item)"
        @click.prevent.stop
      >
        <span
          class="c-text-12"
          :class="{
            'mr-3': isRadio || isCheckbox,
          }"
          >{{ item.name }}
        </span>
        <slot name="listItemEndSlot" :item="item">
          <div
            v-if="isRadio"
            class="flex flex-row shrink-0 h-4 w-4 items-center justify-center border-solid border border-mid-gray rounded-full"
          >
            <div
              v-if="item.selected"
              class="bg-mid-gray w-2.5 h-2.5 rounded-full"
            ></div>
            <div v-else></div>
          </div>
          <font-awesome-icon
            v-else-if="isCheckbox && item.selected"
            icon="fa-solid fa-check"
            class="text-mid-gray"
          ></font-awesome-icon>
        </slot>
      </li>
    </ul>
  </v-menu>
</template>
<script>
export default {
  //TODO: add accessibility
  name: "CMenu",
  model: {
    prop: "isShown",
    event: "toggle",
  },
  data() {
    return {
      isShownLocal: this.isShown,
    };
  },
  watch: {
    isShownLocal: {
      handler(isShown) {
        if (isShown) {
          this.$emit("open");
        } else {
          this.$emit("close");
        }
      },
    },
    isShown(value) {
      this.isShownLocal = value;
    },
  },
  props: {
    items: {
      type: Array,
      required: false,
    },
    isShown: {
      type: Boolean,
    },
    isRadio: {
      type: Boolean,
      default: false,
    },
    isCheckbox: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toggleMenu() {
      if (!this.isShownLocal && !this.$attrs.disabled) {
        this.isShownLocal = true;
        this.$emit("toggle", this.isShownLocal);
      } else {
        this.closeMenu();
      }
    },
    closeMenu() {
      this.isShownLocal = false;
      this.$emit("toggle", false);
    },
    handleClick(item) {
      item.function();
      this.closeMenu();
      this.$emit("click", item);
    },
  },
};
</script>

<style>
.v-menu__content {
  @apply rounded-none shadow-none;
  min-width: auto !important;
}
</style>
