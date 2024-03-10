import { SupportThread, ThreadReply } from "../../generated-sources/openapi";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { hideLoadingOverlay, showLoadingOverlay, showSnackbar } from "../../store/eventSlice";
import {
  closeSupportThread,
  createThreadReply,
  fetchMessages,
  fetchThreads,
} from "../../store/administratorManagementToolSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dateFormatterHelper } from "../../utils/dateFormatterHelper";
import CButtonSecondary from "../common/CButtonSecondary";
import CDialog from "../common/CDialog";
import CComment from "../common/CComment";
import CTextarea from "../common/CTextarea";
import { validatorHelper } from "../../utils/validatorHelper";
import CButtonPrimary from "../common/CButtonPrimary";

interface Props {
  discussion: SupportThread;
}

function SupportDiscussionListItem(props: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { discussion } = props;

  const [isThreadDialogShown, setIsThreadDialogShown] = useState(false);
  const [isConfirmDeleteDialogShown, setIsConfirmDeleteDialogShown] = useState(false);
  const [messages, setMessages] = useState<ThreadReply[]>([]);
  const [isReplyLoading, setIsReplyLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [fakeWebsocket, setFakeWebsocket] = useState<any>(null);

  const cTextareaNewMessageRef = useRef(null);

  useEffect(() => {
    if (isThreadDialogShown) {
      dispatch(showLoadingOverlay({ isInstant: false }));
      fetchMessagesLocal().finally(() => dispatch(hideLoadingOverlay()));
      startFakeWebsocket();
    } else {
      stopFakeWebsocket();
      reset();
    }
  }, [isThreadDialogShown]);

  function scrollToLastItem() {
    setTimeout(() => {
      document.getElementById("target-last-item")?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }

  function handleCloseIssue() {
    setIsConfirmDeleteDialogShown(true);
  }

  function closeIssue() {
    // @ts-ignore
    dispatch(closeSupportThread({ supportThreadId: discussion.supportThreadId })).then(() => {
      setIsThreadDialogShown(false);
      // @ts-ignore
      dispatch(fetchThreads(1));
    });
  }

  function reset() {
    setNewMessage("");
    setIsConfirmDeleteDialogShown(false);
    setIsReplyLoading(false);
    setMessages([]);
  }

  function handleSendNewMessage() {
    // @ts-ignore
    let isMessageValid = cTextareaNewMessageRef.current.validateInput();
    if (isMessageValid) {
      setIsReplyLoading(true);
      dispatch(
        // @ts-ignore
        createThreadReply({
          supportThreadId: discussion.supportThreadId,
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
    return dispatch(fetchMessages(discussion.supportThreadId))
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

  return (
    <div className="min-h-14 border border-solid border-mid-gray flex flex-row items-center px-5 py-[17px] justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-x-3">
          <FontAwesomeIcon size={"xs"} icon={["fas", "calendar-days"]}></FontAwesomeIcon>
          <span className={"c-text-14 truncate"}>
            {dateFormatterHelper.getFormattedDateTime(discussion.createdDate || "")}
          </span>
        </div>
        <div className="flex flex-row items-center gap-x-3">
          <FontAwesomeIcon size={"xs"} icon={["fas", "question"]}></FontAwesomeIcon>
          <span title={discussion.threadTopic} className="c-text-14 truncate">
            {discussion.threadTopic}
          </span>
        </div>
      </div>
      <CButtonSecondary text={t("seeDetails")} onClick={() => setIsThreadDialogShown(true)} />
      <CDialog isShown={isThreadDialogShown} onUpdate={setIsThreadDialogShown} footerSlot={<div></div>}>
        <CDialog
          isShown={isConfirmDeleteDialogShown}
          onUpdate={setIsConfirmDeleteDialogShown}
          onConfirm={closeIssue}
          subtitleText={t("deleteDiscussionSubtitle") || ""}
          titleText={t("deleteDiscussion") || ""}></CDialog>
        <div className="flex flex-col">
          <div className="border-solid border-b border-mid-gray flex-col sticky top-0 bg-white">
            <CComment
              className={"px-8 mb-3"}
              isReplyEnabled={false}
              authorSlot={() => t("askedBy", { author: discussion.threadAuthorEmail })}
              textSlot={discussion.threadTopic}
              dateSlot={dateFormatterHelper.getFormattedDateTime(discussion.createdDate || "")}></CComment>
          </div>
          {messages.map((message, index) => (
            <CComment
              className={"ml-12 px-8"}
              key={message.threadReplyId}
              isReplyEnabled={false}
              messageObject={message}
              authorSlot={(author: any) =>
                author.isCreatorOfTheThread ? discussion.threadAuthorEmail : t("you")
              }></CComment>
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
                <CButtonSecondary
                  onClick={() => setIsThreadDialogShown(false)}
                  text={t("exitDialog")}></CButtonSecondary>
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
    </div>
  );
}

export default SupportDiscussionListItem;
