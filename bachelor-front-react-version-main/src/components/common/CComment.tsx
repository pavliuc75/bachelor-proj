import { Fragment, useEffect, useRef, useState } from "react";
import { eventBus } from "../../eventBus";
import { useTranslation } from "react-i18next";
import { dateFormatterHelper } from "../../utils/dateFormatterHelper";
import CButtonSecondary from "./CButtonSecondary";
import CTextarea from "./CTextarea";
import { validatorHelper } from "../../utils/validatorHelper";
import CButtonPrimary from "./CButtonPrimary";

interface Props {
  isReplyEnabled?: boolean;
  messageObject?: any;
  isCommentLoading?: boolean;
  depth?: number;
  onPostNewComment?: (commentObj: { targetCommentId: string; text: string }) => void;
  authorSlot?: any;
  dateSlot?: any;
  textSlot?: any;
  className?: string;
}

function CComment(props: Props) {
  const { t } = useTranslation();

  const {
    isReplyEnabled = true,
    messageObject = {},
    isCommentLoading = false,
    depth = 0,
    onPostNewComment,
    authorSlot,
    dateSlot,
    textSlot,
    className = "",
  } = props;

  const [reply, setReply] = useState("");
  const [isReplyShown, setIsReplyShown] = useState(false);
  const cTextareaRef = useRef<any>(null);

  useEffect(() => {
    if (!isCommentLoading) {
      setReply("");
      setIsReplyShown(false);
    }
  }, [isCommentLoading]);

  useEffect(() => {
    eventBus.on("close-reply-section", handleReplySectionClose);
    return () => eventBus.off("close-reply-section", handleReplySectionClose);
  }, []);

  function handleReplySectionClose() {
    setIsReplyShown(false);
  }

  function handleSendNewMessage() {
    let isMessageValid = cTextareaRef.current?.validateInput();
    if (isMessageValid) {
      onPostNewComment?.({ targetCommentId: messageObject.commentNodeId, text: reply });
    }
  }

  function handleOpenReplyTextarea() {
    eventBus.emit("close-reply-section");
    handleCloseReplyTextarea();
  }

  function handleCloseReplyTextarea() {
    setIsReplyShown(!isReplyShown);
    setReply("");
  }

  return (
    <div className={className + " flex flex-col mt-7"}>
      <div className="flex flex-row justify-space-between">
        <span className="block ml-4 font-bold c-text-14 mb-2">
          {authorSlot?.(messageObject.author) || (
            <Fragment>
              {messageObject.author?.email + ""}
              {messageObject.author?.isProductOwner ? " (" + t("owner") + ")" : ""}
            </Fragment>
          )}
        </span>
        <span className="block c-text-12">
          {dateSlot ? (
            dateSlot
          ) : (
            <Fragment>{dateFormatterHelper.getFormattedDateTime(messageObject.createdDate)}</Fragment>
          )}
        </span>
      </div>
      <p className="text-cinder">{textSlot ? textSlot : <Fragment>{messageObject.text}</Fragment>}</p>
      {isReplyEnabled && (
        <div className="flex flex-row justify-end grow">
          {isReplyShown ? (
            <div className="flex flex-col grow">
              <CTextarea
                isDisabled={isCommentLoading}
                validateOnBlur={false}
                ref={cTextareaRef}
                size={"small"}
                value={reply}
                onUpdate={(newValue: string) => setReply(newValue)}
                rows={3}
                validatorFunctions={[validatorHelper.validateRequired]}
                placeholder={t("typeYourQuestionHere") || undefined}
                className="mt-4 self-end"></CTextarea>
              <div className="flex flex-row justify-end gap-5 mt-3">
                <CButtonSecondary
                  isDisabled={isCommentLoading}
                  onClick={handleCloseReplyTextarea}
                  text={t("cancel")}></CButtonSecondary>
                <CButtonPrimary
                  isDisabled={isCommentLoading}
                  iconEnd={["fas", "paper-plane"]}
                  onClick={handleSendNewMessage}
                  text={t("send")}></CButtonPrimary>
              </div>
            </div>
          ) : (
            <CButtonSecondary onClick={handleOpenReplyTextarea} text={t("reply")} />
          )}
        </div>
      )}
      {depth < 3 && (
        <div className="flex flex-col">
          {messageObject?.children?.map((comment: any) => (
            <div className="ml-6">
              <CComment
                depth={depth + 1}
                isCommentLoading={isCommentLoading}
                isReplyEnabled={isReplyEnabled && depth < 2}
                onPostNewComment={onPostNewComment}
                messageObject={comment}
                key={comment.commentNodeId}></CComment>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CComment;
