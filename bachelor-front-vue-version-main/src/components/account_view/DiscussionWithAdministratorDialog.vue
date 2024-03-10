<template>
  <c-dialog width="644"
            content-class-overwrite="border border-mid-gray border-solid bg-white focus-visible:outline-none flex flex-col"
            :is-shown="isDialogShown" @update="(e) => !e ? $emit('close') : {}">
    <template #body>
      <c-dialog :title="$t('deleteDiscussion')"
                @confirm="closeIssue()" :subtitle-text="$t('deleteDiscussionSubtitle')"
                v-model="isConfirmDeleteDialogShown"></c-dialog>
      <div class="flex flex-col">
        <div class="border-solid border-b border-mid-gray flex-col sticky top-0 bg-white">
          <c-comment class="px-8 mb-3" v-if="threadInfo" :is-reply-enabled="false">
            <template #author>
              {{ $t("askedByYou") }}
            </template>
            <template #date>
              {{ getFormattedDateTime(threadInfo.createdDate) }}
            </template>
            <template #text>
              {{ threadInfo.threadTopic }}
            </template>
          </c-comment>
        </div>
        <c-comment class="ml-12 px-8" v-for="(message) in messages" :key="message.threadReplyId"
                   :is-reply-enabled="false"
                   :message-object="message">
          <template #author="{author}">
            {{ author.isCreatorOfTheThread ? $t("you") : $t("administrator") }}
          </template>
        </c-comment>
        <div v-if="!messages.length" class="flex flex-col grow min-h-[144px] items-center justify-center mt-6">
          <h4 class="text-spun-pearl">{{ $t("noMessages") }}</h4>
        </div>
        <div id="target-last-item"></div>
        <div class="pb-4 sticky bottom-0 bg-white mt-6 pt-3 border-t border-solid border-mid-gray">
          <div class="ml-12 flex flex-col px-8">
            <c-textarea :is-disabled="isReplyLoading" grow ref="cTextareaNewMessage" size="small" v-model="newMessage"
                        :rows="2"
                        data-cy="new-message-textarea"
                        :validate-on-blur="false" :validator-functions="[validateRequired]"
                        :placeholder="$t('typeANewMessage')"></c-textarea>
            <div class="flex flex-row justify-end gap-6 mt-3 items-center flex-wrap">
              <c-button-secondary data-cy="close-issue-button" @click="handleCloseIssue()" :text="$t('closeIssue')"></c-button-secondary>
              <c-button-secondary @click="$emit('close')" :text="$t('exitDialog')"></c-button-secondary>
              <c-button-primary :is-disabled="isReplyLoading" @click="handleSendNewMessage()"
                                icon-end="fa-solid fa-paper-plane"
                                class="self-end"
                                data-cy="send-message-button"
                                :text="$t('send')"></c-button-primary>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div></div>
    </template>
  </c-dialog>
</template>

<script>
import CButtonSecondary from "@/components/common/CButtonSecondary.vue";
import CTextarea from "@/components/common/CTextarea.vue";
import CDialog from "@/components/common/CDialog.vue";
import CButtonPrimary from "@/components/common/CButtonPrimary.vue";
import CComment from "@/components/common/CComment.vue";
import dateFormatterMixin from "@/util/dateFormatterMixin";
import validatorMixin from "@/util/validatorMixin";

export default {
  name: "DiscussionWithAdministratorDialog",
  mixins: [dateFormatterMixin, validatorMixin],
  props: {
    isDialogShown: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    isDialogShown(newValue) {
      if (newValue) {
        this.$store.dispatch("eventModule/showLoadingOverlay");
        this.fetchMessagesLocal()
          .finally(() => {
            this.$store.dispatch("eventModule/hideLoadingOverlay");
          });
        this.startFakeWebsocket();
      } else {
        this.stopFakeWebsocket();
        this.reset();
      }
    }
  },
  components: {
    CComment,
    CDialog,
    CTextarea,
    CButtonSecondary,
    CButtonPrimary
  },
  data() {
    return {
      newMessage: "",
      threadInfo: null,
      isConfirmDeleteDialogShown: false,

      isReplyLoading: false,
      messages: [],

      fakeWebsocket: null
    };
  },
  methods: {
    scrollToLastItem() {
      setTimeout(() => {
        document.getElementById("target-last-item")?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    },
    reset() {
      this.newMessage = "";
      this.threadInfo = null;
      this.isConfirmDeleteDialogShown = false;

      this.isReplyLoading = false;
      this.messages = [];
    },
    handleCloseIssue() {
      this.isConfirmDeleteDialogShown = true;
    },
    closeIssue() {
      this.$store.dispatch("userModule/closeSupportThread", { supportThreadId: this.threadInfo.supportThreadId })
        .then(() => {
          this.$emit("close");
        });
    },
    handleSendNewMessage() {
      let isMessageValid = this.$refs.cTextareaNewMessage.validateInput();
      if (isMessageValid) {
        this.isReplyLoading = true;
        this.$store.dispatch("userModule/createThreadReply", {
          supportThreadId: this.threadInfo.supportThreadId,
          text: this.newMessage
        })
          .then(() => {
            this.newMessage = "";
          })
          .catch(() => {
            this.$store.dispatch("eventModule/showSnackbar", {
              message: this.$t("failedToPostMessage"),
              type: "error"
            });
          })
          .finally(() => {
            this.isReplyLoading = false;
            this.fetchMessagesLocal();
          });
      }
    },
    fetchMessagesLocal(scrollIntoView = true) {
      return this.$store.dispatch("userModule/fetchMessages", this.threadInfo.supportThreadId)
        .then((response) => {
          this.messages = this.messages = response.data.ThreadReplyPageList;
          if (this.messages.length && scrollIntoView) {
            this.scrollToLastItem();
          }
        })
        .catch(() => {
          this.$store.dispatch("eventModule/showSnackbar", {
            message: this.$t("failedToFetchMessages"),
            type: "error"
          });
        });
    },
    startFakeWebsocket() {
      this.fakeWebsocket = setInterval(() => {
        this.fetchMessagesLocal(false);
      }, 10000);
    },
    stopFakeWebsocket() {
      clearInterval(this.fakeWebsocket);
    }
  }
};
</script>

<style scoped>

</style>