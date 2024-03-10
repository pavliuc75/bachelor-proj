<template>
  <form class="flex flex-col">
    <c-input
      data-cy="product-name-input"
      ref="cInputName"
      v-model="name"
      size="medium"
      :label-text="$t('name') + ' *'"
      :validator-functions="[validateRequired]"
    ></c-input>
    <c-textarea
      ref="cTextareaDescription"
      v-model="description"
      :label-text="$t('description') + ' *'"
      :validator-functions="[validateRequired]"
      class="mt-8"
    ></c-textarea>
    <span class="block c-text-14 mt-8 mb-2">
      {{ $t("category") + " *" }}
    </span>
    <div class="inline-block">
      <c-menu is-radio :items="categories">
        <template #activator>
          <c-button-primary
            type="button"
            :text="selectedCategory"
            icon-end="fa-solid fa-chevron-down"
          ></c-button-primary>
        </template>
      </c-menu>
    </div>
    <p style="max-width: calc(96px * 4)" class="mt-2">
      {{ $t("ifYouCannotTheCategoryThatFitsTheProductYouCan") }}
    </p>
    <c-info
      class="mt-10"
      :text="$t('theFilesBelowHaveToBeInPngCommaJpgOrJpegFormat')"
    ></c-info>
    <c-file-input
      :non-native-file-name="mainImageKey ? $t('someImageUploaded') : ''"
      accept="image/png, image/jpeg, image/jpg"
      class="mt-8"
      :label-text="$t('mainImage') + ' *'"
      ref="cFileInputMainImage"
      @fileSelected="handleMainImageSelected"
      :description-text="$t('mainImageDescription')"
    ></c-file-input>
    <c-file-input
      :non-native-file-name="image1Key ? $t('someImageUploaded') : ''"
      accept="image/png, image/jpeg, image/jpg"
      class="mt-8"
      :label-text="$t('image') + ' 1'"
      ref="cFileInputImage1"
      @fileSelected="file => handleSecondaryImageSelected(file, 1)"
      :description-text="$t('firstSecondaryImageDescription')"
    ></c-file-input>
    <c-file-input
      :non-native-file-name="image2Key ? $t('someImageUploaded') : ''"
      accept="image/png, image/jpeg, image/jpg"
      class="mt-8"
      :label-text="$t('image') + ' 2'"
      ref="cFileInputImage2"
      @fileSelected="file => handleSecondaryImageSelected(file, 2)"
    ></c-file-input>
    <c-file-input
      :non-native-file-name="image3Key ? $t('someImageUploaded') : ''"
      accept="image/png, image/jpeg, image/jpg"
      class="mt-8"
      :label-text="$t('image') + ' 3'"
      ref="cFileInputImage3"
      @fileSelected="file => handleSecondaryImageSelected(file, 3)"
    ></c-file-input>
    <c-file-input
      :non-native-file-name="image4Key ? $t('someImageUploaded') : ''"
      accept="image/png, image/jpeg, image/jpg"
      class="mt-8"
      :label-text="$t('image') + ' 4'"
      ref="cFileInputImage4"
      @fileSelected="file => handleSecondaryImageSelected(file, 4)"
    ></c-file-input>
    <c-file-input
      :non-native-file-name="image5Key ? $t('someImageUploaded') : ''"
      accept="image/png, image/jpeg, image/jpg"
      class="mt-8"
      :label-text="$t('image') + ' 5'"
      ref="cFileInputImage5"
      @fileSelected="file => handleSecondaryImageSelected(file, 5)"
    ></c-file-input>
    <c-input
      ref="cInputPrice"
      v-model="price"
      size="medium"
      class="mt-8"
      :label-text="$t('pricePerUnit') + ' (MDL) *'"
      :validator-functions="[validateRequired, validateIsFloat, validateIsPositive]"
    ></c-input>
    <c-input
      ref="cInputAmountInStock"
      v-model="amountInStock"
      size="medium"
      class="mt-8"
      :label-text="$t('itemsInStock') + ' *'"
      :validator-functions="[validateRequired, validateIsInteger, validateIsPositive]"
    ></c-input>
    <div class="mt-8 flex items-center justify-end gap-x-6" data-test="footer">
      <c-button-secondary type="button" @click="$emit('close')" :text="$t('cancel')"></c-button-secondary>
      <c-button-primary data-cy="save-product-button" type="button" @click="handleSaveProduct()" :text="$t('confirm')"></c-button-primary>
    </div>
  </form>
</template>

<script lang="ts">
import CInput from "@/components/common/CInput";
import validatorMixin from "@/util/validatorMixin";
import CTextarea from "@/components/common/CTextarea";
import CMenu from "@/components/common/CMenu";
import CButtonPrimary from "@/components/common/CButtonPrimary";
import CFileInput from "@/components/common/CFileInput";
import CInfo from "@/components/common/CInfo";
import CButtonSecondary from "@/components/common/CButtonSecondary";
import Vue from "vue";
import { PatchProductRequest, ProductRequest } from "@/generated-sources/openapi";
import { stringFormatter } from "@/util/stringFormatter";

export default Vue.extend({
  name: "EditProduct",
  mixins: [validatorMixin],
  components: {
    CInput,
    CTextarea,
    CMenu,
    CButtonPrimary,
    CFileInput,
    CInfo,
    CButtonSecondary
  },
  props: {
    product: {
      type: Object
    }
  },
  computed: {
    categories() {
      return this.$store.state.productModule.categories.map(category => {
        return {
          name: this.$t(category.category),
          selected: category.id === this.categoryId,
          function: () => {
            this.categoryId = category.id;
          }
        };
      });
    },
    selectedCategory() {
      let categoryName = this.$store.state.productModule.categories
        .find(category => category.id === this.categoryId)?.category;
      return categoryName ? this.$t(categoryName) : "...";
    }
  },
  data() {
    return {
      name: null,
      description: null,
      categoryId: null,
      price: null,
      amountInStock: null,

      mainImageKey: null,
      mainImageUrl: null,
      image1Key: null,
      image1Url: null,
      image2Key: null,
      image2Url: null,
      image3Key: null,
      image3Url: null,
      image4Key: null,
      image4Url: null,
      image5Key: null,
      image5Url: null
    };
  },
  created() {
    if (!this.$store.state.productModule.categories.length) {
      this.$store.dispatch("productModule/fetchCategories", true)
        .then(() => {
          if (!this.product)
            this.categoryId = this.$store.state.productModule.categories[0].id;
        })
        .catch(() => {
          this.$emit("close");
        });
    } else {
      if (!this.product)
        this.categoryId = this.$store.state.productModule.categories[0].id;
    }

    if (this.product) {
      this.name = this.product.name;
      this.price = this.product.price + '';
      this.categoryId = this.product.categoryId;
      this.description = this.product.description;
      this.amountInStock = this.product.stockAmount + '';
      this.mainImageKey = this.product.mainImage.imageKey;
      this.mainImageUrl = this.product.mainImage.imageUrl;

      this.product.additionalImages.forEach((image, index) => {
        this[`image${index + 1}Key`] = image.imageKey;
        this[`image${index + 1}Url`] = image.imageUrl;
      });
    }
  },
  methods: {
    handleMainImageSelected(file) {
      this.$store.dispatch("businessManagementToolModule/uploadProductImage", file)
        .then(response => {
          this.mainImageKey = response.data.imageKey;
          this.mainImageUrl = response.data.imageUrl;
        })
        .catch(() => {
          this.$store.dispatch("eventModule/showSnackbar", { message: this.$t("somethingWentWrong"), type: "error" });
          this.$refs.cFileInputMainImage.reset();
          this.$refs.cFileInputMainImage.validateInput();
        });
    },
    handleSecondaryImageSelected(file, imageNumber) {
      this.$store.dispatch("businessManagementToolModule/uploadProductImage", file)
        .then(response => {
          this[`image${imageNumber}Key`] = response.data.imageKey;
          this[`image${imageNumber}Url`] = response.data.imageUrl;
        })
        .catch(() => {
          this.$store.dispatch("eventModule/showSnackbar", { message: this.$t("somethingWentWrong"), type: "error" });
          this.$refs[`cFileInputImage${imageNumber}`].reset();
        });
    },
    validateMainImage() {
      if (this.mainImageKey && this.mainImageUrl) {
        return true;
      } else {
        this.$refs.cFileInputMainImage.reset();
        return this.$refs.cFileInputMainImage.validateInput();
      }
    },
    handleSaveProduct() {
      let isNameValid = this.$refs.cInputName.validateInput();
      let isDescriptionValid = this.$refs.cTextareaDescription.validateInput();
      let isPriceValid = this.$refs.cInputPrice.validateInput();
      let isAmountInStockValid = this.$refs.cInputAmountInStock.validateInput();
      let isMainImageValid = this.validateMainImage();

      if (isNameValid && isDescriptionValid && isPriceValid && isAmountInStockValid && isMainImageValid) {
        let additionalImages = [];

        if (this.image1Key && this.image1Url) {
          additionalImages.push({ imageKey: this.image1Key, imageUrl: this.image1Url });
        }
        if (this.image2Key && this.image2Url) {
          additionalImages.push({ imageKey: this.image2Key, imageUrl: this.image2Url });
        }
        if (this.image3Key && this.image3Url) {
          additionalImages.push({ imageKey: this.image3Key, imageUrl: this.image3Url });
        }
        if (this.image4Key && this.image4Url) {
          additionalImages.push({ imageKey: this.image4Key, imageUrl: this.image4Url });
        }
        if (this.image5Key && this.image5Url) {
          additionalImages.push({ imageKey: this.image5Key, imageUrl: this.image5Url });
        }

        if (this.product) {
          let patchProductRequest: PatchProductRequest = {
            id: this.product.id,
            name: this.name,
            price: stringFormatter.replaceCommasWithDots(this.price),
            categoryId: this.categoryId,
            description: this.description,
            stockAmount: this.amountInStock,
            mainImage: {
              imageKey: this.mainImageKey,
              imageUrl: this.mainImageUrl
            },
            additionalImages: additionalImages
          };

          this.$store.dispatch("businessManagementToolModule/updateProduct", patchProductRequest)
            .then(() => {
                this.$emit("close");
                this.$store.dispatch("businessManagementToolModule/fetchProducts", 1);
              }
            )
            .catch(() => this.$store.dispatch("eventModule/showSnackbar", {
              message: this.$t("somethingWentWrong"),
              type: "error"
            }));

        } else {
          let productRequest: ProductRequest = {
            name: this.name,
            price: stringFormatter.replaceCommasWithDots(this.price),
            categoryId: this.categoryId,
            description: this.description,
            stockAmount: this.amountInStock,
            mainImage: {
              imageKey: this.mainImageKey,
              imageUrl: this.mainImageUrl
            },
            additionalImages: additionalImages
          };

          this.$store.dispatch("businessManagementToolModule/createProduct", productRequest)
            .then(() => {
                this.$emit("close");
                this.$store.dispatch("businessManagementToolModule/fetchProducts", 1);
              }
            )
            .catch(() => this.$store.dispatch("eventModule/showSnackbar", {
              message: this.$t("somethingWentWrong"),
              type: "error"
            }));
        }
      }
    }
  }
});
</script>

<style scoped>

</style>