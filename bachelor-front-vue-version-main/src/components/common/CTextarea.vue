<template>
  <div :class="[grow ? ' ' : 'max-w-[384px]', 'flex flex-none flex-col w-full']">
    <label
      :class="{
        'c-text-12 mb-0.5': size === 'small',
        'c-text-14 mb-0.5': size === 'medium',
      }"
      v-if="labelText"
      class="inline-block"
      :for="textareaId"
    >{{ labelText }}</label
    >
    <div class="flex flex-none">
      <textarea
        :disabled="isDisabled"
        :rows="rows"
        @input="handleInput"
        @blur="handleBlur"
        v-bind="$attrs"
        v-model="valueLocal"
        :class="{
          'px-3 py-2 c-text-14': size === 'small',
          'px-4 py-2.5': size === 'medium',
          'border-error focus-visible:border-error': errorTextLocal != null,
          'focus-visible:border-dark-blue': errorTextLocal == null,
          'border-spun-pearl focus-visible:border-spun-pearl text-mid-gray': isDisabled,
        }"
        class="resize-none w-full tracking-[unset] border border-solid border-mid-gray rounded-lg focus-visible:outline-none focus-visible:border-2 placeholder:text-spun-pearl"
        :id="textareaId"
      />
    </div>
    <span
      v-if="errorTextLocal"
      :class="{
        'ml-3': size === 'small',
        'ml-4': size === 'medium',
        'ml-6': size === 'large',
      }"
      class="block c-text-12 mt-1 text-error ml-4"
    >{{ errorTextLocal }}</span
    >
  </div>
</template>

<script>
import { getRandomString } from "@/util/stringGenerator";

export default {
  name: "CTextArea",
  props: {
    size: {
      type: String,
      default: "medium"
    },
    labelText: {
      type: String
    },
    rows: {
      type: Number,
      default: 5
    },
    value: {},
    errorText: {
      type: String
    },
    lazyValidation: {
      type: Boolean
    },
    validateOnBlur: {
      type: Boolean,
      default: true
    },
    validatorFunctions: {
      type: Array,
      default: () => []
    },
    grow: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
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
    this.textareaId = "textarea-" + getRandomString(5);
    this.valueLocal = this.value;
    this.errorTextLocal = this.errorText;
  },
  data() {
    return {
      textareaId: null,
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
    forceFocus() {
      document.getElementById(this.textareaId).focus();
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

<style scoped></style>
