<template>
  <div class="w-screen h-screen fixed bg-background z-50 top-0 left-0 flex flex-row justify-end">
    <div
      v-click-outside="handleClickOutside"
      class="sm:w-[480px] w-full flex flex-col h-full bg-white sm:border-l border-mid-gray border-solid"
    >
      <nav
        class="sm:pr-20 px-[16px] h-24 flex flex-row items-center justify-end border-b border-mid-gray border-solid shrink-0">
        <font-awesome-icon
          :title="$t('goBack')"
          @click="$emit('closeClicked')"
          size="xl"
          class="text-dark-blue cursor-pointer"
          icon="fa-solid fa-close"
        />
      </nav>
      <main class="sm:p-10 px-[16px] py-[40px] overflow-y-auto flex flex-col grow">
        <h3>{{ $t("reviews") }}</h3>
        <div v-if="!isEditRating" class="flex flex-col">
          <h1 class="mt-10">{{ formattedRating }}</h1>
          <c-rating is-total-rating-shown
                    :is-numeric-rating-shown="false"
                    :value="$store.state.productModule.product.rating.overallRating || 0"
                    :total-ratings="$store.state.productModule.product.rating.totalRatings || 0"></c-rating>
          <c-button-primary
            class="mt-5 self-start" is-total-rating-shown
            :text="$t('rateProduct')"
            @click="handleRateProduct()"></c-button-primary>
        </div>
        <div v-else class="flex flex-col">
          <p class="font-bold mt-7">{{ $t("rateProduct") }}</p>
          <c-rating-edit v-model="ratingSetByCurrentUser" @change="handleUpdateRating"
                         class="mt-10 px-6"></c-rating-edit>
          <div class="flex flex-row justify-end mt-10 gap-4">
            <c-button-secondary @click="isEditRating = false" :text="$t('cancel')"></c-button-secondary>
            <c-button-primary @click="handleUpdateRating()"
                              icon-end="fa-solid fa-paper-plane"
                              class="self-end "
                              :text="$t('rate')"></c-button-primary>
          </div>
        </div>
        <p class="font-bold mt-10">{{ $t("comments") }}</p>
        <div class="flex flex-col grow">
          <div v-if="!$store.state.productModule.comments.length && !$store.state.productModule.isCommentsLoading"
               class="flex flex-col grow items-center justify-center">
            <h4 class="text-spun-pearl">{{ $t("noComments") }}</h4>
          </div>
          <div class="flex flex-col mb-3">
            <c-comment :is-comment-loading="isReplyLoading" @postNewComment="postNewCommentReply"
                       :message-object="comment"
                       :is-reply-enabled="isReplyEnabled"
                       v-for="comment in $store.state.productModule.comments"
                       :key="comment.commentNodeId">
            </c-comment>
          </div>
          <div :class="[$store.state.productModule.comments.length ? 'grow' : '', 'flex flex-col justify-end']">
            <div class="flex flex-col mt-10" v-show="isNewCommentShown">
              <c-textarea :is-disabled="isNewCommentLoading" grow ref="cTextareaNewComment" size="small"
                          v-model="newComment"
                          :rows="2"
                          data-cy="comment-textarea"
                          :validate-on-blur="false" :validator-functions="[validateRequired]"
                          :placeholder="$t('typeANewComment')"></c-textarea>
              <div class="flex flex-row mt-3 gap-4 justify-end">
                <c-button-secondary @click="isNewCommentShown = false" :text="$t('cancel')"></c-button-secondary>
                <c-button-primary :is-disabled="isNewCommentLoading" @click="postNewComment()"
                                  icon-end="fa-solid fa-paper-plane"
                                  class="self-end "
                                  data-cy="post-comment-button"
                                  :text="$t('post')"></c-button-primary>
              </div>
            </div>
            <div id="target-new-comment-section"></div>
          </div>
          <c-button-primary v-if="!isNewCommentShown" @click="handleShowPostNewComment()"
                            class="self-end sticky bottom-0 bg-white"
                            icon-end="fa-solid fa-pen"
                            data-cy="write-a-comment-button"
                            :text="$t('writeAComment')"></c-button-primary>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { stringFormatter } from "@/util/stringFormatter";
import CRating from "@/components/common/CRating.vue";
import CButtonPrimary from "@/components/common/CButtonPrimary.vue";
import CComment from "@/components/common/CComment.vue";
import validatorMixin from "@/util/validatorMixin";
import CTextarea from "@/components/common/CTextarea.vue";
import Vue from "vue";
import { CreateNewCommentReplyRequest, CreateNewCommentRequest } from "@/generated-sources/openapi";
import CButtonSecondary from "@/components/common/CButtonSecondary.vue";
import CRatingEdit from "@/components/common/CRatingEdit.vue";

// 640
export default Vue.extend({
  name: "ProductViewSideBar",
  components: { CRatingEdit, CButtonSecondary, CComment, CButtonPrimary, CRating, CTextarea },
  mixins: [validatorMixin],
  computed: {
    formattedRating() {
      return stringFormatter.replaceDotsWithCommas(this.$store.state.productModule.product?.rating.overallRating || 0);
    }
  },
  created() {
    this.isReplyEnabled = this.$keycloak.authenticated;

    if (this.$keycloak.authenticated)
      this.$store.dispatch("userModule/fetchCurrentUserData");

    this.verifyAndSetRatingSetByCurrentUser();

    document.addEventListener("keyup", this.handleKeyReleased);
    if (!this.$store.state.productModule.comments.some(c => c.productId === this.$store.state.productModule.product.id)) {
      this.$store.dispatch("eventModule/showLoadingOverlay");
      this.$store.dispatch("productModule/fetchComments", true)
        .finally(() => this.$store.dispatch("eventModule/hideLoadingOverlay"));
    }
  },
  watch: {
    "$store.state.userModule.ratedProducts"() {
      this.verifyAndSetRatingSetByCurrentUser();
    }
  },
  mounted() {
    this.$root.$on("close-reply-section", () => {
      this.isNewCommentShown = false;
    });
  },
  beforeDestroy() {
    this.$root.$off("close-reply-section");
    document.removeEventListener("keyup", this.handleKeyReleased);
  },
  data() {
    return {
      isNewCommentShown: false,
      isNewCommentLoading: false,
      newComment: "",
      isReplyLoading: false,
      isReplyEnabled: false,
      isEditRating: false,
      isRateProductButtonEnabled: false,
      ratingSetByCurrentUser: 0
    };
  },
  methods: {
    handleUpdateRating() {
      this.$store.dispatch("productModule/updateRating", this.ratingSetByCurrentUser)
        .then(() => {
          this.isEditRating = false;
        });
    },
    verifyAndSetRatingSetByCurrentUser() {
      let currentUserRatingForCurrentProduct = this.$store.state.userModule.ratedProducts.find(rating => rating.ratedProductId === this.$route.params.productId);
      this.ratingSetByCurrentUser = currentUserRatingForCurrentProduct?.rating || 0;
    },
    scrollToEnd() {
      setTimeout(() => {
        document.getElementById("target-new-comment-section")?.scrollIntoView({ behavior: "smooth", inline: "end" });
      }, 0);
    },
    handleShowPostNewComment() {
      if (this.$keycloak.authenticated) {
        this.$root.$emit("close-reply-section");
        this.isNewCommentShown = true;
        this.scrollToEnd();
      } else {
        this.$keycloak.login({
          redirectUri: process.env.VUE_APP_URL + this.$route.fullPath
        });
      }
    },
    handleClickOutside() {
      this.$emit("closeClicked");
    },
    handleKeyReleased(e) {
      if (e.key === "Escape") {
        this.handleClickOutside();
      }
    },
    handleRateProduct() {
      if (this.$keycloak.authenticated) {
        this.isEditRating = true;
      } else {
        this.$keycloak.login({
          redirectUri: process.env.VUE_APP_URL + this.$route.fullPath
        });
      }
    },
    postNewComment() {
      let isCommentValid = this.$refs.cTextareaNewComment.validateInput();
      if (isCommentValid) {
        let createNewCommentRequest: Required<CreateNewCommentRequest> = {
          productId: this.$store.state.productModule.product.id,
          text: this.newComment
        };
        this.isNewCommentLoading = true;
        this.$store.dispatch("productModule/addComment", createNewCommentRequest).then(() => {
          this.isNewCommentShown = false;
          this.newComment = "";
          this.$store.dispatch("productModule/fetchComments")
            .then(() => {
              this.scrollToEnd();
            });
        }).catch(() => {
          this.$store.dispatch("eventModule/showSnackbar", {
            message: this.$t("failedToPostTheComment"),
            type: "error"
          });
        }).finally(() => {
          this.isNewCommentLoading = false;
        });
      }
    },
    postNewCommentReply(partOfReply: Pick<CreateNewCommentReplyRequest, "targetCommentId" | "text">) {
      let createNewCommentReplyRequest: Required<CreateNewCommentReplyRequest> = {
        ...partOfReply,
        productId: this.$store.state.productModule.product.id
      };
      this.isReplyLoading = true;
      this.$store.dispatch("productModule/addCommentReply", createNewCommentReplyRequest).then(() => {
        this.$store.dispatch("productModule/fetchComments");
      }).catch(() => {
        this.$store.dispatch("eventModule/showSnackbar", {
          message: this.$t("failedToPostTheComment"),
          type: "error"
        });
      }).finally(() => {
        this.isReplyLoading = false;
      });
    }
  }
});
</script>

<style scoped>

</style>