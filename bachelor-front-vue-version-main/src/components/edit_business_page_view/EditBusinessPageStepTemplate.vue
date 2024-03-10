<template>
  <div class="flex flex-col">
    <button
      @click="$emit('stepHeaderClicked')"
      :disabled="isDisabled"
      v-if="!isEditMode"
      type="button"
      class="flex self-start flex-row items-center tracking-[unset] hover-no-underline"
      :class="{
        'hover-border-blue hover:text-dark-blue border-mid-gray hover:border-dark-blue':
          !isDisabled,
        'border-spun-pearl text-spun-pearl': isDisabled,
      }"
    >
      <div
        class="w-8 h-8 shrink-0 flex items-center justify-center border border-solid rounded-full"
        style="border-color: inherit !important"
      >
        <h4>{{ stepNumber }}</h4>
      </div>
      <h4
        class="ml-10 text-left"
        :class="{
          underline: !isDisabled,
          'text-spun-pearl': isDisabled,
        }"
      >
        {{ stepTitle }}
      </h4>
    </button>
    <main v-show="isEditMode">
      <header class="flex flex-row items-center gap-x-10 mb-10">
        <div
          class="w-8 h-8 shrink-0 flex items-center justify-center border border-solid rounded-full border-dark-blue text-dark-blue"
        >
          <h4>{{ stepNumber }}</h4>
        </div>
        <h3>{{ stepTitle }}</h3>
      </header>
      <div class="sm:ml-[72px]">
        <slot name="default"></slot>
        <slot name="actionsEnd">
          <div class="flex flex-row items-center gap-x-8 mt-8 mb-6">
            <c-button-secondary
              icon-start="fa-solid fa-arrow-left"
              :text="$t('goBack')"
              @click="$emit('previousStepClicked')"
            ></c-button-secondary>
            <c-button-primary
              size="medium"
              :text="$t('continue')"
              @click="$emit('nextStepClicked')"
              icon-end="fa-solid fa-arrow-right"
            ></c-button-primary>
          </div>
        </slot>
      </div>
    </main>
  </div>
</template>

<script>
import CButtonSecondary from "@/components/common/CButtonSecondary";
import CButtonPrimary from "@/components/common/CButtonPrimary";

export default {
  name: "EditBusinessPageStepTemplate",
  components: {
    CButtonPrimary,
    CButtonSecondary,
  },
  props: {
    isDisabled: {
      type: Boolean,
      default: false,
    },
    stepNumber: {
      type: Number,
      required: true,
    },
    stepTitle: {
      type: String,
      required: true,
    },
    isEditMode: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.hover-no-underline:hover h4 {
  text-decoration: none !important;
}

.hover-border-blue:hover div {
  border-color: var(--dark-blue) !important;
}
</style>
