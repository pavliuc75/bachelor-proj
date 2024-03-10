<template>
  <div class="flex flex-col mt-7">
    <div class="flex flex-row justify-space-between">
        <span class="block ml-4 font-bold c-text-14 mb-2">
          <slot name="author" :author="messageObject.author">
            {{ messageObject.author?.email + "" }}
            {{ messageObject.author?.isProductOwner ? " (" + $t("owner") + ")" : "" }}
          </slot>
        </span>
      <span class="block c-text-12">
      <slot name="date">
          {{ getFormattedDateTime(messageObject.createdDate) }}
      </slot>
        </span>
    </div>
    <p class="text-cinder">
      <slot name="text">
        {{ messageObject.text }}
      </slot>
    </p>
    <div class="flex flex-row justify-end grow" v-if="isReplyEnabled">
      <c-button-secondary v-if="!isReplyShown" @click="handleOpenReplyTextarea()"
                          :text="$t('reply')"></c-button-secondary>
      <div class="flex flex-col grow" v-if="isReplyShown">
        <c-textarea :is-disabled="isCommentLoading" :validate-on-blur="false" ref="cTextareaReply" size="small"
                    v-model="reply" class="mt-4 self-end"
                    :rows="3"
                    :validator-functions="[validateRequired]"
                    :placeholder="$t('typeYourQuestionHere')"></c-textarea>
        <div class="flex flex-row justify-end gap-5 mt-3">
          <c-button-secondary :is-disabled="isCommentLoading" @click="handleCloseReplyTextarea()"
                              :text="$t('cancel')"></c-button-secondary>
          <c-button-primary :is-disabled="isCommentLoading" icon-end="fa-solid fa-paper-plane"
                            @click="handleSendNewMessage()"
                            :text="$t('send')"></c-button-primary>
        </div>
      </div>
    </div>
    <div class="flex flex-col" v-if="depth < 3">
      <c-comment :depth="depth+1" :is-comment-loading="isCommentLoading"
                 :is-reply-enabled="depth < 2 && isReplyEnabled"
                 @postNewComment="(payload) => $emit('postNewComment', payload)"
                 :message-object="comment"
                 class="ml-6"
                 v-for="comment in messageObject.children"
                 :key="comment.commentNodeId">
      </c-comment>
    </div>
  </div>
</template>

<script>
import CButtonSecondary from "@/components/common/CButtonSecondary.vue";
import CTextarea from "@/components/common/CTextarea.vue";
import CButtonPrimary from "@/components/common/CButtonPrimary.vue";
import validatorMixin from "@/util/validatorMixin";
import dateFormatterMixin from "@/util/dateFormatterMixin";

export default {
  name: "CComment",
  data() {
    return {
      reply: "",
      isReplyShown: false
    };
  },
  mixins: [validatorMixin, dateFormatterMixin],
  components: {
    CButtonPrimary,
    CButtonSecondary,
    CTextarea
  },
  watch: {
    isCommentLoading(isShown) {
      if (!isShown) {
        this.reply = "";
        this.isReplyShown = false;
      }
    }
  },
  props: {
    isReplyEnabled: {
      type: Boolean,
      default: true
    },
    messageObject: {
      type: Object,
      default: () => {
        return {};
      }
    },
    isCommentLoading: {
      type: Boolean,
      default: false
    },
    depth: {
      type: Number,
      default: 0
    }
  },
  mounted() {
    this.$root.$on("close-reply-section", () => {
      this.isReplyShown = false;
    });
  },
  beforeDestroy() {
    this.$root.$off("close-reply-section");
  },
  methods: {
    handleSendNewMessage() {
      let isMessageValid = this.$refs.cTextareaReply.validateInput();
      if (isMessageValid) {
        this.$emit("postNewComment", {
          targetCommentId: this.messageObject.commentNodeId,
          text: this.reply
        });
      }
    },
    handleOpenReplyTextarea() {
      this.$root.$emit("close-reply-section");
      this.handleCloseReplyTextarea();
    },
    handleCloseReplyTextarea() {
      this.isReplyShown = !this.isReplyShown;
      this.reply = "";
    }
  }
};
</script>

<style scoped>

</style>