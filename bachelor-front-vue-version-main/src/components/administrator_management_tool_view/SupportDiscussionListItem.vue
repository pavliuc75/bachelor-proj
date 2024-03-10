<template>
  <div class="min-h-14 border border-solid border-mid-gray flex flex-row items-center px-5 py-[17px] justify-between">
    <div class="flex flex-col gap-1">
      <div class="flex flex-row items-center gap-x-3">
        <font-awesome-icon size="xs" icon="fa-solid fa-calendar-days"></font-awesome-icon>
        <span class="c-text-14 truncate">{{ getFormattedDateTime(discussion.createdDate) }}</span>
      </div>
      <div class="flex flex-row items-center gap-x-3">
        <font-awesome-icon size="xs" icon="fa-solid fa-question"></font-awesome-icon>
        <span :title="discussion.threadTopic" class="c-text-14 truncate">{{ discussion.threadTopic }}</span>
      </div>
    </div>
    <c-button-secondary @click="isThreadDialogShown = true" :text="$t('seeDetails')"></c-button-secondary>
    <c-dialog v-model="isThreadDialogShown" width="644"
              content-class-overwrite="border border-mid-gray border-solid bg-white focus-visible:outline-none flex flex-col">
      <template #body>
        <c-dialog :title="$t('deleteDiscussion')"
                  @confirm="closeIssue()" :subtitle-text="$t('deleteDiscussionSubtitle')"
                  v-model="isConfirmDeleteDialogShown"></c-dialog>
        <div class="flex flex-col">
          <div class="border-solid border-b border-mid-gray flex-col sticky top-0 bg-white">
            <c-comment class="px-8 mb-3" :is-reply-enabled="false">
              <template #author>
                {{ $t("askedBy", { author: discussion.threadAuthorEmail }) }}
              </template>
              <template #date>
                {{ getFormattedDateTime(discussion.createdDate) }}
              </template>
              <template #text>
                {{ discussion.threadTopic }}
              </template>
            </c-comment>
          </div>
          <c-comment class="ml-12 px-8" v-for="(message) in messages" :key="message.threadReplyId"
                     :is-reply-enabled="false"
                     :message-object="message">
            <template #author="{author}">
              {{ author.isCreatorOfTheThread ? discussion.threadAuthorEmail : $t("you") }}
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
                          :validate-on-blur="false" :validator-functions="[validateRequired]"
                          :placeholder="$t('typeANewMessage')"></c-textarea>
              <div class="flex flex-row justify-end gap-6 mt-3 items-center flex-wrap">
                <c-button-secondary @click="handleCloseIssue()" :text="$t('closeIssue')"></c-button-secondary>
                <c-button-secondary @click="isThreadDialogShown = false" :text="$t('exitDialog')"></c-button-secondary>
                <c-button-primary :is-disabled="isReplyLoading" @click="handleSendNewMessage()"
                                  icon-end="fa-solid fa-paper-plane"
                                  class="self-end"
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
  </div>
</template>

<script>
import dateFormatterMixin from "@/util/dateFormatterMixin";
import CButtonSecondary from "@/components/common/CButtonSecondary.vue";
import CDialog from "@/components/common/CDialog.vue";
import CComment from "@/components/common/CComment.vue";
import CTextarea from "@/components/common/CTextarea.vue";
import CButtonPrimary from "@/components/common/CButtonPrimary.vue";
import validatorMixin from "@/util/validatorMixin";

export default {
  name: "SupportDiscussionListItem",
  mixins: [dateFormatterMixin, validatorMixin],
  props: {
    discussion: {
      type: Object,
      required: true
    }
  },
  components: {
    CButtonSecondary,
    CDialog,
    CComment,
    CTextarea,
    CButtonPrimary
  },
  watch: {
    isThreadDialogShown(newValue) {
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
  data() {
    return {
      isThreadDialogShown: false,
      isConfirmDeleteDialogShown: false,

      messages: [],
      isReplyLoading: false,
      newMessage: "",

      fakeWebsocket: null
    };
  },
  methods: {
    scrollToLastItem() {
      setTimeout(() => {
        document.getElementById("target-last-item")?.scrollIntoView({behavior: 'smooth'});
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
      this.$store.dispatch("administratorManagementToolModule/closeSupportThread", { supportThreadId: this.discussion.supportThreadId })
        .then(() => {
          this.isThreadDialogShown = false;
          this.$store.dispatch(
            "administratorManagementToolModule/fetchThreads", 1
          );
        });
    },
    handleSendNewMessage() {
      let isMessageValid = this.$refs.cTextareaNewMessage.validateInput();
      if (isMessageValid) {
        this.isReplyLoading = true;
        this.$store.dispatch("administratorManagementToolModule/createThreadReply", {
          supportThreadId: this.discussion.supportThreadId,
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
      return this.$store.dispatch("administratorManagementToolModule/fetchMessages", this.discussion.supportThreadId)
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