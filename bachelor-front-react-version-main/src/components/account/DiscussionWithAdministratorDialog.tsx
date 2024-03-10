import { useEffect, useRef, useState } from "react";
import { SupportThread, ThreadReply } from "../../generated-sources/openapi";
import { hideLoadingOverlay, showLoadingOverlay, showSnackbar } from "../../store/eventSlice";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { closeSupportThread, createThreadReply, fetchMessages } from "../../store/userSlice";
import CDialog from "../common/CDialog";
import CComment from "../common/CComment";
import { dateFormatterHelper } from "../../utils/dateFormatterHelper";
import CTextarea from "../common/CTextarea";
import { validatorHelper } from "../../utils/validatorHelper";
import CButtonSecondary from "../common/CButtonSecondary";
import CButtonPrimary from "../common/CButtonPrimary";

interface Props {
  isDialogShown: boolean;
  onClose: () => void;
  discussionWithAdministratorDialogThreadInfo: SupportThread | null;
}

function DiscussionWithAdministratorDialog(props: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { isDialogShown, onClose, discussionWithAdministratorDialogThreadInfo } = props;

  const [newMessage, setNewMessage] = useState("");
  const [isConfirmDeleteDialogShown, setIsConfirmDeleteDialogShown] = useState(false);
  const [isReplyLoading, setIsReplyLoading] = useState(false);

  const [messages, setMessages] = useState<ThreadReply[]>([]);
  const [fakeWebsocket, setFakeWebsocket] = useState<any>(null);

  const cTextareaNewMessageRef = useRef(null);

  useEffect(() => {
    if (isDialogShown) {
      dispatch(showLoadingOverlay({ isInstant: false }));
      fetchMessagesLocal().finally(() => dispatch(hideLoadingOverlay()));
      startFakeWebsocket();
    } else {
      stopFakeWebsocket();
      reset();
    }
  }, [isDialogShown]);

  function scrollToLastItem() {
    setTimeout(() => {
      document.getElementById("target-last-item")?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }

  function reset() {
    setNewMessage("");
    setIsConfirmDeleteDialogShown(false);
    setIsReplyLoading(false);
    setMessages([]);
    setFakeWebsocket(null);
  }

  function handleCloseIssue() {
    setIsConfirmDeleteDialogShown(true);
  }

  function closeIssue() {
    // @ts-ignore
    dispatch(closeSupportThread({ supportThreadId: discussionWithAdministratorDialogThreadInfo.supportThreadId })).then(
      () => onClose()
    );
  }

  function startFakeWebsocket() {
    setFakeWebsocket(
      setInterval(() => {
        fetchMessagesLocal(false);
      }, 10000)
    );
  }

  function stopFakeWebsocket() {
    clearInterval(fakeWebsocket);
  }

  function handleSendNewMessage() {
    // @ts-ignore
    let isMessageValid = cTextareaNewMessageRef.current.validateInput();
    if (isMessageValid) {
      setIsReplyLoading(true);
      dispatch(
        // @ts-ignore
        createThreadReply({
          // @ts-ignore
          supportThreadId: discussionWithAdministratorDialogThreadInfo.supportThreadId,
          text: newMessage,
        })
      )
        .then(() => setNewMessage(""))
        .catch(() =>
          dispatch(
            showSnackbar({
              message: t("failedToPostMessage"),
              type: "error",
            })
          )
        )
        .finally(() => {
          setIsReplyLoading(false);
          fetchMessagesLocal();
        });
    }
  }

  function fetchMessagesLocal(scrollIntoView = true) {
    // @ts-ignore
    return dispatch(fetchMessages(discussionWithAdministratorDialogThreadInfo.supportThreadId))
      .then((response: any) => {
        setMessages(response.data.ThreadReplyPageList);
        if (messages.length && scrollIntoView) {
          scrollToLastItem();
        }
      })
      .catch(() => {
        dispatch(
          showSnackbar({
            message: t("failedToFetchMessages"),
            type: "error",
          })
        );
      });
  }

  return (
    <CDialog isShown={isDialogShown} onUpdate={(val) => (val ? {} : onClose)} footerSlot={<div></div>}>
      <CDialog
        isShown={isConfirmDeleteDialogShown}
        onUpdate={setIsConfirmDeleteDialogShown}
        onConfirm={closeIssue}
        subtitleText={t("deleteDiscussionSubtitle") || ""}
        titleText={t("deleteDiscussion") || ""}></CDialog>
      <div className="flex flex-col">
        <div className="border-solid border-b border-mid-gray flex-col sticky top-0 bg-white">
          {discussionWithAdministratorDialogThreadInfo && (
            <CComment
              className={"px-8 mb-3"}
              isReplyEnabled={false}
              authorSlot={() => t("askedByYou")}
              textSlot={discussionWithAdministratorDialogThreadInfo.threadTopic}
              dateSlot={dateFormatterHelper.getFormattedDateTime(
                discussionWithAdministratorDialogThreadInfo.createdDate || ""
              )}></CComment>
          )}
        </div>
        {messages.map((message, index) => (
          <CComment
            className={"ml-12 px-8"}
            key={message.threadReplyId}
            isReplyEnabled={false}
            messageObject={message}
            authorSlot={(author: any) => (author.isCreatorOfTheThread ? t("you") : t("administrator"))}></CComment>
        ))}
        {!messages.length && (
          <div className={"flex flex-col grow min-h-[144px] items-center justify-center mt-6"}>
            <h4 className="text-spun-pearl">{t("noMessages")}</h4>
          </div>
        )}
        <div id="target-last-item"></div>
        <div className="pb-4 sticky bottom-0 bg-white mt-6 pt-3 border-t border-solid border-mid-gray">
          <div className="ml-12 flex flex-col px-8">
            <CTextarea
              isDisabled={isReplyLoading}
              grow={true}
              ref={cTextareaNewMessageRef}
              value={newMessage}
              onUpdate={setNewMessage}
              rows={2}
              validateOnBlur={false}
              validatorFunctions={[validatorHelper.validateRequired]}
              placeholder={t("typeANewMessage") || ""}
              size={"small"}></CTextarea>
            <div className="flex flex-row justify-end gap-6 mt-3 items-center flex-wrap">
              <CButtonSecondary onClick={handleCloseIssue} text={t("closeIssue")}></CButtonSecondary>
              <CButtonSecondary onClick={onClose} text={t("exitDialog")}></CButtonSecondary>
              <CButtonPrimary
                iconEnd={["fas", "paper-plane"]}
                className={"self-end"}
                onClick={handleSendNewMessage}
                text={t("send")}
                isDisabled={isReplyLoading}></CButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    </CDialog>
  );
}

export default DiscussionWithAdministratorDialog;
