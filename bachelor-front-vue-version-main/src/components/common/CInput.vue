<template>
  <div class="flex flex-none flex-col w-full" style="max-width: calc(96px * 4)">
    <label
      :class="{
        'c-text-12 mb-0.5': size === 'small',
        'c-text-14 mb-0.5': size === 'medium',
        'c-text-14 mb-1': size === 'large',
      }"
      v-if="labelText"
      class="inline-block"
      :for="inputId"
    >{{ labelText }}</label
    >
    <div class="flex flex-none">
      <input
        @input="handleInput"
        @blur="handleBlur"
        v-bind="$attrs"
        v-on="$listeners"
        v-model="valueLocal"
        :class="{
          'h-10 px-3 c-text-14': size === 'small',
          'h-12 px-4': size === 'medium',
          'h-14 pl-6 pr-6': size === 'large',
          'border-error focus-visible:border-error': errorTextLocal != null,
          'focus-visible:border-dark-blue': errorTextLocal == null,
        }"
        :style="{
          'padding-right': extraPaddingForInputAfterSlot && '80px !important',
        }"
        class="c-input w-full tracking-[unset] border border-solid border-mid-gray rounded-lg focus-visible:outline-none focus-visible:border-2 placeholder:text-spun-pearl"
        :id="inputId"
      />
      <slot name="inputAfter"></slot>
    </div>
    <span
      data-test="error-text"
      v-if="errorTextLocal"
      :class="{
        'ml-3': size === 'small',
        'ml-4': size === 'medium',
        'ml-6': size === 'large',
      }"
      class="block c-text-12 mt-1 text-error ml-4"
    >{{ errorTextLocal }}</span
    >
    <p v-if="descriptionText" class="mt-1">
      {{ descriptionText }}
    </p>
  </div>
</template>

<script>
import { getRandomString } from "@/util/stringGenerator";

export default {
  name: "CInput",
  props: {
    labelText: {
      type: String
    },
    size: {
      type: String,
      default: "small"
    },
    errorText: {
      type: String
    },
    extraPaddingForInputAfterSlot: {
      type: Boolean
    },
    validatorFunctions: {
      type: Array,
      default: () => []
    },
    lazyValidation: {
      type: Boolean
    },
    validateOnBlur: {
      type: Boolean,
      default: true
    },
    value: {},
    descriptionText: {
      type: String
    }
  },
  model: {
    prop: "value",
    event: "update"
  },
  watch: {
    value(newValue) {
      this.valueLocal = newValue;
    },
    errorText(newValue) {
      this.errorTextLocal = newValue;
    }
  },
  created() {
    this.inputId = "input-" + getRandomString(5);
    this.valueLocal = this.value;
    this.errorTextLocal = this.errorText;
  },
  data() {
    return {
      inputId: null,
      valueLocal: null,
      errorTextLocal: null
    };
  },
  methods: {
    handleInput() {
      if (!this.lazyValidation) {
        this.validateInput();
      }
      this.$emit("update", this.valueLocal);
    },
    handleBlur() {
      if (this.validateOnBlur) {
        this.validateInput();
      }
    },
    forceBlur() {
      document.getElementById(this.inputId).blur();
    },
    forceFocus() {
      document.getElementById(this.inputId).focus();
    },
    validateInput() {
      for (const validatorFunction of this.validatorFunctions) {
        let result = validatorFunction(this.valueLocal);
        if (!result.isValid) {
          this.errorTextLocal = result.errorText;
          break;
        } else {
          this.errorTextLocal = null;
        }
      }
      return this.errorTextLocal == null;
    }
  }
};
</script>
