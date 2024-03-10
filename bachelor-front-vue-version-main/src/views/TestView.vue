<template>
  <div>
    <c-rating-edit></c-rating-edit>
    <button @click="dialog = true">test</button>
    <c-pagination @currentPageChanged="(e) => page = e" :total-pages="10" :current-page="page"></c-pagination>
    <c-rating :value="0"></c-rating>
    <c-dialog @update="(value) => dialog = value" :is-shown="dialog"></c-dialog>
    <button @click="pay()">kek</button>
    <c-info text="cringe"></c-info>
    <c-info text="cringe" type="error"></c-info>
    <c-info text="cringe" type="warning"></c-info>
    <c-info size="sm" text="cringe"></c-info>
    <c-info text="cringe" size="sm" type="error"></c-info>
    <c-info text="cringe" size="sm" type="warning"></c-info>
    <c-info text="cringe" size="sm" type="success"></c-info>
    <div>
      <ul class="flex flex-col bg-white border border-solid border-mid-gray" style="max-width: 300px;">
        <li
          v-for="(item, index) in $store.state.searchModule.miniSearchResults"
          :key="index"
          class="flex "
          @click="handleSearchResultClick(item)"
          @click.prevent.stop
        >
          <div class="flex flex-row mt-[9px]">
            <div class="flex flex-col">
              <p class="text-cinder truncate break-all">{{ item.name }}</p>
              <p class="c-text-12 mt-px truncate block break-all">{{ item.description }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="border border-solid border-black truncate break-all flex" style="max-width: calc(96px * 4)">
      <span style="min-width: 0" class="">dsadsadsadsadsdsadsadsadsadsadsdsdsadsadsdsadsadsadsadasdsadsadsadsa</span>
    </div>
    <a href="http://kek" @click="lol()" class="bg-amber-100 h-20 w-20">
      <button @click.stop="lol2()">
        lol2
      </button>
    </a>
    <div class="max-w-[400px] ml-10">
      <c-comment></c-comment>
      <c-comment></c-comment>
      <c-comment></c-comment>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CPagination from "@/components/common/CPagination.vue";
import CRating from "@/components/common/CRating.vue";
import CDialog from "@/components/common/CDialog.vue";
import CInfo from "@/components/common/CInfo.vue";
import CComment from "@/components/common/CComment.vue";
import CRatingEdit from "@/components/common/CRatingEdit.vue";

export default Vue.extend({
  name: "TestView",
  components: { CRatingEdit, CComment, CDialog, CPagination, CRating, CInfo },
  data() {
    return {
      page: 2,
      dialog: false
    };
  },
  methods: {
    lol() {
      console.log("lol");
    },
    lol2() {
      console.log("lol2");
    },
    kek() {
      this.$router.push({ name: "businessManagementToolEditBusinessPage" });
    },
    pay() {
      // eslint-disable-next-line no-undef
      const paylike = Paylike({ key: "b69467e0-e715-410f-8820-8e0fce847a7e" });

      paylike.pay(
        {
          test: true,
          amount: { currency: "EUR", exponent: 2, value: 1499 },
          custom: { orderId: 1234 }
        },
        (err, result) => {
          if (err) return console.log(err);
          console.log(result.transaction.id);
          location.href = "/thank-you";
        }
      );
    }
  }
});
</script>

<style scoped></style>
