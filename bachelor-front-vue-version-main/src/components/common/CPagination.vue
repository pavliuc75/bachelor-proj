<template>
  <ul class="flex flex-row grow-0 items-center">
    <li>
      <font-awesome-icon
        data-test="arrow-left"
        class="cursor-pointer hover:text-dark-blue mr-2"
        v-if="currentPage !== 1"
        @click="$emit('currentPageChanged', currentPage - 1)"
        icon="fa-solid fa-arrow-left"
      ></font-awesome-icon>
    </li>
    <li v-for="(page, index) in getPages()" :key="index">
      <span
        data-test="3dots"
        v-if="page === -1" class="c-text-14 mx-1">...</span>
      <c-button-primary
        v-else-if="page === currentPage"
        class="text-dark-blue border-dark-blue mx-1"
        :text="page + ''"
      ></c-button-primary>
      <c-button-primary
        class="mx-1"
        :text="page + ''"
        v-else
        @click="$emit('currentPageChanged', page)"
      >
      </c-button-primary>
    </li>
    <li>
      <font-awesome-icon
        data-test="arrow-right"
        class="cursor-pointer hover:text-dark-blue ml-2"
        v-if="currentPage !== totalPages"
        @click="$emit('currentPageChanged', currentPage + 1)"
        icon="fa-solid fa-arrow-right"
      ></font-awesome-icon>
    </li>
  </ul>
</template>

<script>
import CButtonPrimary from "@/components/common/CButtonPrimary";

export default {
  name: "CPagination",
  components: {
    CButtonPrimary,
  },
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  methods: {
    getPages() {
      let current = this.currentPage,
        last = this.totalPages,
        delta = 2,
        left = current - delta,
        right = current + delta + 1,
        range = [],
        rangeWithDots = [],
        l;

      for (let i = 1; i <= last; i++) {
        if (i === 1 || i === last || (i >= left && i < right)) {
          range.push(i);
        }
      }

      for (let i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push(-1);
          }
        }
        rangeWithDots.push(i);
        l = i;
      }

      return rangeWithDots;
    },
  },
};
</script>

<style scoped></style>
