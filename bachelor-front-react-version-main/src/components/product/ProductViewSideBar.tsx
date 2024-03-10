import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "../../store";
import { stringFormatterHelper } from "../../utils/stringFormatterHelper";
import { useEffect, useRef, useState } from "react";
import keycloak from "../../authentication/keycloak";
import { fetchCurrentUserData } from "../../store/userSlice";
import useEscapeKeyHandler from "../../hooks/useEscapeKeyHandler";
import { hideLoadingOverlay, showLoadingOverlay, showSnackbar } from "../../store/eventSlice";
import { addComment, addCommentReply, fetchComments, updateRating } from "../../store/productSlice";
import { eventBus } from "../../eventBus";
import { CreateNewCommentReplyRequest, CreateNewCommentRequest } from "../../generated-sources/openapi";
import useClickOutside from "../../hooks/useClickOutside";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CRating from "../common/CRating";
import CButtonPrimary from "../common/CButtonPrimary";
import CRatingEdit from "../common/CRatingEdit";
import CButtonSecondary from "../common/CButtonSecondary";
import CComment from "../common/CComment";
import classNames from "classnames";
import CTextarea from "../common/CTextarea";
import { validatorHelper } from "../../utils/validatorHelper";

interface Props {
  onCloseClicked: () => void;
  productId: string;
}

function ProductViewSideBar(props: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { onCloseClicked, productId } = props;

  const { product, comments, isCommentsLoading } = useSelector((state: RootState) => state.product);
  const { ratedProducts } = useSelector((state: RootState) => state.user);

  const [isNewCommentShown, setIsNewCommentShown] = useState(false);
  const [isNewCommentLoading, setIsNewCommentLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isReplyLoading, setIsReplyLoading] = useState(false);
  const [isReplyEnabled, setIsReplyEnabled] = useState(keycloak?.authenticated);
  const [isEditRating, setIsEditRating] = useState(false);
  const [isRateProductButtonEnabled, setIsRateProductButtonEnabled] = useState(false);
  const [ratingSetByCurrentUser, setRatingSetByCurrentUser] = useState(0);

  const cTextareaNewCommentRef = useRef(null);
  const sideBarRef = useRef(null);

  useEscapeKeyHandler(handleClickOutside);

  useClickOutside(sideBarRef, handleClickOutside);

  useEffect(() => {
    if (keycloak.authenticated) {
      // @ts-ignore
      dispatch(fetchCurrentUserData());
    }

    if (!comments?.some((c) => c.productId === product?.id)) {
      dispatch(showLoadingOverlay({ isInstant: false }));
      // @ts-ignore
      dispatch(fetchComments(true)).finally(() => dispatch(hideLoadingOverlay()));
    }
  }, []);

  useEffect(() => {
    eventBus.on("close-reply-section", handleCloseReplySection);
    return () => eventBus.off("close-reply-section", handleCloseReplySection);
  }, []);

  useEffect(() => {
    verifyAndSetRatingSetByCurrentUser();
  }, [ratedProducts]);

  const formattedRating = stringFormatterHelper.replaceDotsWithCommas((product?.rating?.overallRating || 0).toString());

  function handleUpdateRating() {
    // @ts-ignore
    dispatch(updateRating(ratingSetByCurrentUser)).then(() => setIsEditRating(false));
  }

  function verifyAndSetRatingSetByCurrentUser() {
    let currentUserRatingForCurrentProduct = ratedProducts.find((rating) => rating.ratedProductId === productId);
    setRatingSetByCurrentUser(currentUserRatingForCurrentProduct?.rating || 0);
  }

  function scrollToEnd() {
    setTimeout(() => {
      document.getElementById("target-new-comment-section")?.scrollIntoView({ behavior: "smooth", inline: "end" });
    }, 0);
  }

  function handleShowPostNewComment() {
    if (keycloak.authenticated) {
      eventBus.emit("close-reply-section");
      setIsNewCommentShown(true);
      scrollToEnd();
    } else {
      keycloak.login({
        // eslint-disable-next-line no-restricted-globals
        redirectUri: process.env.REACT_APP_URL + location.pathname,
      });
    }
  }

  function handleRateProduct() {
    if (keycloak.authenticated) {
      setIsEditRating(true);
    } else {
      keycloak.login({
        // eslint-disable-next-line no-restricted-globals
        redirectUri: process.env.REACT_APP_URL + location.pathname,
      });
    }
  }

  function postNewComment() {
    // @ts-ignore
    let isCommentValid = cTextareaNewCommentRef?.current?.validateInput();
    if (isCommentValid) {
      let createNewCommentRequest: Required<CreateNewCommentRequest> = {
        productId: product?.id || "",
        text: newComment,
      };
      setIsNewCommentLoading(true);
      // @ts-ignore
      dispatch(addComment(createNewCommentRequest))
        .then(() => {
          setIsNewCommentShown(false);
          setNewComment("");
          // @ts-ignore
          dispatch(fetchComments()).then(() => scrollToEnd());
        })
        .catch(() =>
          dispatch(
            showSnackbar({
              message: t("failedToPostTheComment"),
              type: "error",
            })
          )
        )
        .finally(() => setIsNewCommentLoading(false));
    }
  }

  function postNewCommentReply(partOfReply: Pick<CreateNewCommentReplyRequest, "targetCommentId" | "text">) {
    let createNewCommentReplyRequest: CreateNewCommentReplyRequest = {
      ...partOfReply,
      productId: product?.id || "",
    };
    setIsReplyLoading(true);
    // @ts-ignore
    dispatch(addCommentReply(createNewCommentReplyRequest))
      // @ts-ignore
      .then(() => dispatch(fetchComments()))
      .catch(() =>
        dispatch(
          showSnackbar({
            message: t("failedToPostTheComment"),
            type: "error",
          })
        )
      )
      .finally(() => setIsReplyLoading(false));
  }

  function handleClickOutside() {
    onCloseClicked();
  }

  function handleCloseReplySection() {
    setIsNewCommentShown(false);
  }

  function handleNewRatingSelected(newRating: number) {
    setRatingSetByCurrentUser(newRating);
  }

  function handleCloseEditRating() {
    setIsEditRating(false);
  }

  return (
    <div className="w-screen h-screen fixed bg-background z-50 top-0 left-0 flex flex-row justify-end">
      <div
        className={"sm:w-[480px] w-full flex flex-col h-full bg-white sm:border-l border-mid-gray border-solid"}
        ref={sideBarRef}>
        <nav
          className={
            "sm:pr-20 px-[16px] h-24 flex flex-row items-center justify-end border-b border-mid-gray border-solid shrink-0"
          }>
          <FontAwesomeIcon
            className={"text-dark-blue cursor-pointer"}
            size="xl"
            onClick={onCloseClicked}
            title={t("goBack") || ""}
            icon={["fas", "close"]}></FontAwesomeIcon>
        </nav>
        <main className="sm:p-10 px-[16px] py-[40px] overflow-y-auto flex flex-col grow">
          <h3>{t("reviews")}</h3>
          {!isEditRating ? (
            <div className={"flex flex-col"}>
              <h1 className="mt-10">{formattedRating}</h1>
              <CRating
                isTotalRatingShown={true}
                isNumericRatingShown={false}
                value={product?.rating?.overallRating || 0}
                totalRatings={product?.rating?.totalRatings || 0}></CRating>
              <CButtonPrimary
                className={"mt-5 self-start"}
                text={t("rateProduct")}
                onClick={handleRateProduct}></CButtonPrimary>
            </div>
          ) : (
            <div className={"flex flex-col"}>
              <p className="font-bold mt-7">{t("rateProduct")}</p>
              <CRatingEdit
                className={"mt-10 px-6"}
                value={ratingSetByCurrentUser}
                onUpdate={handleNewRatingSelected}></CRatingEdit>
              <div className="flex flex-row justify-end mt-10 gap-4">
                <CButtonSecondary text={t("cancel")} onClick={handleCloseEditRating}></CButtonSecondary>
                <CButtonPrimary
                  className={"self-end"}
                  iconEnd={["fas", "paper-plane"]}
                  text={t("rate")}
                  onClick={handleUpdateRating}></CButtonPrimary>
              </div>
            </div>
          )}
          <p className="font-bold mt-10">{t("comments")}</p>
          <div className="flex flex-col grow">
            {!comments?.length && !isCommentsLoading && (
              <div className={"flex flex-col grow items-center justify-center"}>
                <h4 className="text-spun-pearl">{t("noComments")}</h4>
              </div>
            )}
            <div className="flex flex-col mb-3">
              {comments?.map((comment) => (
                <CComment
                  isCommentLoading={isReplyLoading}
                  onPostNewComment={postNewCommentReply}
                  isReplyEnabled={isReplyEnabled}
                  key={comment.commentNodeId}
                  messageObject={comment}></CComment>
              ))}
            </div>
            <div
              className={classNames({
                grow: comments?.length,
                "flex flex-col justify-end": true,
              })}>
              <div
                className={classNames({
                  hidden: !isNewCommentShown,
                  "flex flex-col mt-10": true,
                })}>
                <CTextarea
                  ref={cTextareaNewCommentRef}
                  isDisabled={isNewCommentLoading}
                  grow={true}
                  size="small"
                  value={newComment}
                  onUpdate={setNewComment}
                  rows={2}
                  validateOnBlur={false}
                  validatorFunctions={[validatorHelper.validateRequired]}
                  placeholder={t("typeANewComment") || ""}></CTextarea>
                <div className="flex flex-row mt-3 gap-4 justify-end">
                  <CButtonSecondary text={t("cancel")} onClick={handleCloseReplySection}></CButtonSecondary>
                  <CButtonPrimary
                    isDisabled={isNewCommentLoading}
                    iconEnd={["fas", "paper-plane"]}
                    className={"self-end"}
                    onClick={postNewComment}
                    text={t("post")}></CButtonPrimary>
                </div>
              </div>
              <div id="target-new-comment-section"></div>
            </div>
            {!isNewCommentShown && (
              <CButtonPrimary
                className={"self-end sticky bottom-0 bg-white"}
                onClick={handleShowPostNewComment}
                iconEnd={["fas", "pen"]}
                text={t("writeAComment")}></CButtonPrimary>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default ProductViewSideBar;
