<template>
  <div class="flex flex-col w-full" style="max-width: calc(96px * 4)">
    <label
      class="c-text-14 mb-2 inline-block self-start"
      v-if="labelText"
      :for="inputId"
    >{{ labelText }}</label
    >
    <div class="flex flex-row items-center gap-x-8">
      <c-button-primary
        type="button"
        @click="handleChooseFileClick()"
        :text="$t('chooseFile')"
        icon-end="fa-solid fa-upload"
      ></c-button-primary>
      <span v-if="fileName || nonNativeFileName" class="c-text-12">{{ fileName || nonNativeFileName }}</span>
      <span v-if="errorText" class="c-text-12 text-error">
        {{ errorText }}
      </span>
    </div>
    <p v-if="descriptionText" class="mt-2">
      {{ descriptionText }}
    </p>
    <input
      v-bind="$attrs"
      :id="inputId"
      style="display: none"
      type="file"
      @change="handleFileInputChange"
    />
  </div>
</template>

<script>
import { getRandomString } from "@/util/stringGenerator";
import CButtonPrimary from "@/components/common/CButtonPrimary";

const reader = new FileReader();

export default {
  name: "CFileInput",
  components: {
    CButtonPrimary
  },
  props: {
    labelText: {
      type: String
    },
    descriptionText: {
      type: String
    },
    nonNativeFileName: {
      type: String
    }
  },
  created() {
    this.inputId = "input-" + getRandomString(5);
  },
  data() {
    return {
      inputId: null,
      fileName: null,
      errorText: null,
      file: null
    };
  },
  methods: {
    handleChooseFileClick() {
      document.getElementById(this.inputId).click();
    },
    handleFileInputChange(event) {
      if (event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = () => {
          this.file = event.target.files[0];
          this.fileName = event.target.files[0].name;
          this.$emit("fileSelected", this.file);
          this.errorText = null;
        };
        reader.onerror = () => {
          this.file = null;
          this.fileName = null;
          this.errorText = this.$t("somethingWentWrongWhileReadingTheFile");
        };
      }
    },
    validateInput() {
      if (!this.file) {
        this.errorText = this.$t("pleaseUploadAFile");
        return false;
      }
      return true;
    },
    reset() {
      this.fileName = null;
      this.errorText = null;
      this.file = null;
      document.getElementById(this.inputId).value = "";
    }
  }
};
</script>

<style scoped></style>
