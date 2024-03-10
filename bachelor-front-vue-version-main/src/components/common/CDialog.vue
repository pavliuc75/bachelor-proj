<template>
  <v-dialog
    v-model="isShownLocal"
    :width="width"
    overlay-color="var(--havelock-blue)"
    overlay-opacity="0.33"
    :content-class="contentClassOverwrite"
  >
    <slot name="title">
      <span class="font-bold">{{ titleText }}</span>
    </slot>
    <slot name="subtitle">
      <span v-if="subtitleText" class="mt-3 c-text-14 text-mid-gray"
      >{{ subtitleText }}</span
      >
    </slot>
    <slot name="body"></slot>
    <slot name="footer">
      <div class="mt-3 flex items-center justify-end gap-x-6" data-test="footer">
        <c-button-secondary @click="$emit('update', false)" :text="$t('cancel')"></c-button-secondary>
        <c-button-primary @click="$emit('confirm')" :text="$t('confirm')"></c-button-primary>
      </div>
    </slot>
  </v-dialog>
</template>

<script>
import CButtonPrimary from "@/components/common/CButtonPrimary";
import CButtonSecondary from "@/components/common/CButtonSecondary";

export default {
  name: "CDialog",
  components: {
    CButtonPrimary,
    CButtonSecondary
  },
  props: {
    isShown: {
      type: Boolean
    },
    titleText: {
      type: String
    },
    subtitleText: {
      type: String
    },
    width: {
      type: String,
      default: "600"
    },
    contentClassOverwrite: {
      type: String,
      default: () => 'border border-mid-gray border-solid bg-white pa-8 focus-visible:outline-none flex flex-col',
    },
  },
  model: {
    prop: "isShown",
    event: "update"
  },
  watch: {
    isShown(newValue) {
      this.isShownLocal = newValue;
    },
    isShownLocal(newValue) {
      this.$emit("update", newValue);
    }
  },
  data() {
    return {
      isShownLocal: false
    };
  }
};
</script>

<style scoped>
/deep/ .v-dialog {
  @apply rounded-none shadow-none;
}
</style>
