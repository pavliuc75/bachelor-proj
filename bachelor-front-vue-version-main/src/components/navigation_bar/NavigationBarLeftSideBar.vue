<template>
  <div class="w-screen h-screen fixed bg-background z-50">
    <div
      v-click-outside="handleClickOutside"
      class="sm:w-[480px] w-full flex flex-col h-full bg-white sm:border-r sm:border-mid-gray sm:border-solid"
    >
      <nav
        class="sm:pl-20 px-[16px] h-24 flex flex-row items-center border-b border-mid-gray border-solid shrink-0"
      >
        <font-awesome-icon
          :title="$t('goBack')"
          @click="$emit('closeClicked')"
          size="xl"
          class="text-dark-blue mr-8 cursor-pointer"
          icon="fa-solid fa-arrow-left"
        />
        <router-link to="/" :title="$t('frontPage')">
          <img @click="$emit('closeClicked')" src="@/assets/images/logo.png" class="w-20" alt="">
<!--          <span-->
<!--          @click="$emit('closeClicked')"-->
<!--          class="text-2xl font-bold text-dark-blue underline hover:no-underline"-->
<!--        >abobus</span>-->
        </router-link>
      </nav>
      <main class="sm:pl-20 px-[16px] py-6 overflow-y-auto">
        <div class="sm:hidden">
          <navigation-bar-search @closeSidebar="$emit('closeClicked')" class="mt-10"></navigation-bar-search>
          <ul class="mt-10 ml-8 flex flex-col gap-3">
            <li class="inline-flex">
              <router-link to="/cart">
                <c-button-secondary
                  :class="[
                    $parent.isCurrentRoute('cart')
                      ? 'text-dark-blue no-underline'
                      : '',
                  ]"
                  @click="$emit('closeClicked')"
                  iconEnd="fa-solid fa-cart-shopping"
                  size="medium"
                  :text="$t('cart')"
                ></c-button-secondary>
              </router-link>
            </li>
            <li class="inline-flex">
              <router-link to="/favorites">
                <c-button-secondary
                  :class="[
                    $parent.isCurrentRoute('favorites')
                      ? 'text-dark-blue no-underline'
                      : '',
                  ]"
                  @click="$emit('closeClicked')"
                  iconEnd="fa-solid fa-solid fa-heart"
                  size="medium"
                  :text="$t('favorites')"
                ></c-button-secondary>
              </router-link>
            </li>
            <li
              class="inline-flex"
              v-if="$parent.isBusinessManagementToolShown()"
            >
              <router-link to="/business-management-tool">
                <c-button-secondary
                  :class="[
                    $parent.isCurrentRoute('businessManagementTool')
                      ? 'text-dark-blue no-underline'
                      : '',
                  ]"
                  @click="$emit('closeClicked')"
                  iconEnd="fa-solid fa-briefcase"
                  size="medium"
                  :text="$t('businessManagementTool')"
                ></c-button-secondary>
              </router-link>
            </li>
            <li
              class="inline-flex"
              v-if="$parent.isAdministratorManagementToolShown()"
            >
              <router-link to="/administrator-management-tool">
                <c-button-secondary
                  :class="[
                    $parent.isCurrentRoute('administratorManagementTool')
                      ? 'text-dark-blue no-underline'
                      : '',
                  ]"
                  @click="$emit('closeClicked')"
                  iconEnd="fa-solid fa-solar-panel"
                  size="medium"
                  :text="$t('administratorManagementTool')"
                ></c-button-secondary>
              </router-link>
            </li>
            <li class="inline-flex">
              <router-link to="/account">
                <c-button-secondary
                  :class="[
                    $parent.isCurrentRoute('account')
                      ? 'text-dark-blue no-underline'
                      : '',
                  ]"
                  @click="$emit('closeClicked')"
                  iconEnd="fa-solid fa-user"
                  size="medium"
                  :text="$t('account')"
                ></c-button-secondary>
              </router-link>
            </li>
          </ul>
        </div>
        <div class="mt-10">
          <router-link to="/categories">
            <h3 @click="$emit('closeClicked')"
                class="underline hover:no-underline hover:text-dark-blue">{{ $t("allCategories") }}</h3>
          </router-link>
          <ul class="mt-10 ml-8 flex flex-col gap-3">
            <li :key="-1">
              <router-link :to="{name: 'base'}">
                <c-button-secondary
                  @click="$emit('closeClicked')"
                  size="medium"
                  :text="$t('allProducts')"
                ></c-button-secondary>
              </router-link>
            </li>
            <li v-for="category in $store.state.productModule.categories.slice(0, categoriesShownAtOnce)"
                :key="category.id">
              <router-link :to="{name: 'base', query: {categories: category.id}}">
              <c-button-secondary
                  @click="$emit('closeClicked')"
                  size="medium"
                  :text="$t(category.category?.toLowerCase())"
                ></c-button-secondary>
              </router-link>
            </li>
            <c-button-primary
              v-if="isLoadMoreShownForCategories"
              class="self-start mt-5"
              @click="handleLoadMoreCategories()" :text="$t('loadMore')">
            </c-button-primary>
          </ul>
        </div>
        <div class="mt-10">
          <router-link to="/business-pages" data-cy="business-pages-button">
            <h3 @click="$emit('closeClicked')" class="underline hover:no-underline hover:text-dark-blue">
              {{ $t("companies") }}</h3>
          </router-link>
          <ul class="mt-10 ml-8 flex flex-col gap-3">
            <li v-for="businessPage in $store.state.businessModule.businessPages" :key="businessPage.id">
              <router-link :to="{name: 'businessPage', params: {businessPageId: businessPage.id}}">
                <c-button-secondary
                  @click="$emit('closeClicked')"
                  size="medium"
                  :text="businessPage.businessDescription.legalName"
                ></c-button-secondary>
              </router-link>
            </li>
            <c-button-primary
              v-if="isLoadMoreShownForBusinessPages"
              class="self-start mt-5"
              @click="$store.dispatch('businessModule/fetchBusinessPages')" :text="$t('loadMore')">
            </c-button-primary>
          </ul>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import CButtonSecondary from "@/components/common/CButtonSecondary";
import NavigationBarSearch from "@/components/navigation_bar/NavigationBarSearch";
import CButtonPrimary from "@/components/common/CButtonPrimary";

export default {
  name: "NavigationBarLeftSideBar",
  components: {
    CButtonSecondary,
    NavigationBarSearch,
    CButtonPrimary
  },
  computed: {
    isLoadMoreShownForBusinessPages() {
      return this.$store.state.businessModule.totalBusinessPagesPagesOnServer > this.$store.state.businessModule.businessPagesCurrentPage + 1;
    },
    isLoadMoreShownForCategories() {
      return this.categoriesShownAtOnce < this.$store.state.productModule.categories.length;
    }
  },
  created() {
    document.addEventListener("keyup", this.handleKeyReleased);
    if (!this.$store.state.businessModule.businessPages.length)
      this.$store.dispatch("businessModule/fetchBusinessPages");

    if (!this.$store.state.productModule.categories.length)
      this.$store.dispatch("productModule/fetchCategories");
  },
  beforeDestroy() {
    document.removeEventListener("keyup", this.handleKeyReleased);
  },
  data() {
    return {
      categoriesShownAtOnce: 4
    };
  },
  methods: {
    handleClickOutside() {
      this.$emit("closeClicked");
    },
    handleKeyReleased(e) {
      if (e.key === "Escape") {
        this.handleClickOutside();
      }
    },
    handleLoadMoreCategories() {
      this.categoriesShownAtOnce += 10;
    }
  }
};
</script>

<style scoped></style>
