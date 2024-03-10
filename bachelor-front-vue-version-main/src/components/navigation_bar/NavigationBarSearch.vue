<template>
  <div>
    <c-input
      data-cy="search-input"
      @keydown.enter="handleNavigateToSearchPage()"
      class="bg-white relative z-10"
      @click="handleInputClick()"
      extra-padding-for-input-after-slot
      size="large"
      :placeholder="$t('searchProduct')"
      ref="cInputSearch"
      v-model="keyword"
    >
      <template #inputAfter>
        <div class="c-invisible-wrapper border-mid-gray border-l">
          <div
            class="h-14 border-solid absolute right-14 border-inherit"
            style="border-left-width: inherit"
          ></div>
        </div>
        <div class="c-invisible-wrapper text-mid-gray">
          <div
            class="flex flex-none h-14 w-14 items-center justify-center absolute right-px"
            @click="$refs.cInputSearch.forceFocus()"
          >
            <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
          </div>
        </div>
      </template>
    </c-input>
    <div class="relative top-1 h-0 z-10" v-if="isMiniSearchShown && keyword">
      <ul class="flex flex-col shrink-0 bg-white border border-solid border-mid-gray">
        <li
          v-for="(item, index) in $store.state.searchModule.miniSearchResults"
          :key="index"
          class="flex flex-row items-center shrink-0 min-h-[72px] border-b border-solid border-mid-gray px-4 py-0.5"
          @click="handleSearchResultClick(item)"
          @click.prevent.stop
        >
          <img
            :src="item.mainImage.imageUrl"
            @error="(e) => e.target.src = require('@/assets/images/image_failed_to_load.svg')"
            alt=""
            class="rounded-lg w-12 h-12 aspect-square object-cover self-center mr-4"
          />
          <div class="flex flex-row grow self-start justify-space-between mt-[9px] min-w-0">
            <div class="flex flex-col min-w-0">
              <p class="text-cinder truncate">{{ item.name }}</p>
              <p class="c-text-12 mt-px truncate">{{ item.description }}</p>
            </div>
            <span class="block font-bold c-text-14 shrink-0 ml-2">{{ getFormattedPrice(item.price) }}</span>
          </div>
        </li>
        <li class="h-9 flex flex-row items-center justify-center">
          <c-button-secondary type="button" icon-end="fa-solid fa-arrow-up-right-from-square"
                              @click="handleNavigateToSearchPage()"
                              :text="$t('viewAllResults')"></c-button-secondary>
        </li>
      </ul>
    </div>
    <div @click="handleClickOutside" v-if="isMiniSearchShown" class="fixed bottom-0 right-0 top-0 left-0"></div>
  </div>
</template>

<script>
import CInput from "@/components/common/CInput";
import { stringFormatter } from "@/util/stringFormatter";
import CButtonSecondary from "@/components/common/CButtonSecondary";
import _debounce from "lodash/debounce";

export default {
  name: "NavigationBarSearch",
  components: {
    CInput,
    CButtonSecondary
  },
  computed: {
    keyword: {
      get() {
        return this.$store.state.searchModule.keyword;
      },
      set(value) {
        this.$store.commit("searchModule/setKeyword", value);
        this.searchMiniLocalWithDebounce();
      }
    }
  },
  created() {
    document.addEventListener("keyup", this.handleKeyReleased);
  },
  beforeDestroy() {
    document.removeEventListener("keyup", this.handleKeyReleased);
  },
  data() {
    return {
      isMiniSearchShown: false
    };
  },
  methods: {
    searchMiniLocalWithDebounce: _debounce(function() {
      this.$store.dispatch("searchModule/searchMini");
    }, 200),
    handleInputClick() {
      this.isMiniSearchShown = true;
    },
    handleClickOutside() {
      this.isMiniSearchShown = false;
      this.$refs.cInputSearch.forceBlur();
    },
    handleKeyReleased(e) {
      if (e.key === "Escape") {
        this.handleClickOutside();
      }
    },
    handleSearchResultClick(item) {
      this.$emit('closeSidebar');
      this.handleClickOutside();
      this.$router.push({ name: "product", params: { productId: item.id } });
    },
    getFormattedPrice(price) {
      return stringFormatter.getFormattedPrice(price);
    },
    handleNavigateToSearchPage() {
      if (this.keyword) {
        this.$emit('closeSidebar');
        this.isMiniSearchShown = false;
        this.$refs.cInputSearch.forceBlur();
        this.$router.push({ name: "search", query: { keyword: this.keyword } });
      }
    }
  }
};
</script>

<style scoped lang="scss">
input:focus + div {
  border-left-width: 2px;
  border-color: var(--dark-blue) !important;
}

input:focus + div + div {
  right: 1px;
  color: var(--dark-blue);
}

li:hover .text-cinder {
  @apply underline cursor-default;
}

</style>
