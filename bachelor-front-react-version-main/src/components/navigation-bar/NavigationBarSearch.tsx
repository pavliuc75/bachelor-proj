import { HTMLAttributes, useRef, useState } from "react";
import "../../assets/styles/NavigationBarSearch.scss";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "../../store";
import { searchMini, setKeyword } from "../../store/searchSlice";
import useEscapeKeyHandler from "../../hooks/useEscapeKeyHandler";
import debounce from "lodash/debounce";
import { useNavigate } from "react-router-dom";
import { stringFormatterHelper } from "../../utils/stringFormatterHelper";
import CInput from "../common/CInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AutocompleteProductResponseInner } from "../../generated-sources/openapi";
import CImageWithFallback from "../common/CImageWithFallback";
import CButtonSecondary from "../common/CButtonSecondary";

interface Props extends HTMLAttributes<HTMLDivElement> {
  onCloseSidebar?: () => void;
}

function NavigationBarSearch(props: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { onCloseSidebar, ...divProps } = props;

  const { keyword, miniSearchResults } = useSelector((state: RootState) => state.search);

  const cInputSearchRef = useRef(null);

  const [isMiniSearchShown, setIsMiniSearchShown] = useState(false);

  useEscapeKeyHandler(handleClickOutside);

  function setKeywordLocal(keyword: string) {
    dispatch(setKeyword(keyword));
    searchMiniLocalWithDebounce();
  }

  function searchMiniLocalWithDebounce() {
    debounce(function () {
      // @ts-ignore
      dispatch(searchMini());
    }, 200)();
  }

  function handleInputClick() {
    setIsMiniSearchShown(true);
  }

  function handleClickOutside() {
    setIsMiniSearchShown(false);
    blurSearchInput();
  }

  function handleSearchResultClick(e: any, result: AutocompleteProductResponseInner) {
    e.preventDefault();
    e.stopPropagation();

    onCloseSidebar && onCloseSidebar();
    handleClickOutside();
    navigate("/product/" + result.id);
  }

  function getFormattedPrice(price: number) {
    return stringFormatterHelper.getFormattedPrice(price);
  }

  function handleNavigateToSearchPage() {
    if (keyword) {
      onCloseSidebar && onCloseSidebar();
      setIsMiniSearchShown(false);
      blurSearchInput();
      navigate({ pathname: "/search", search: new URLSearchParams({ keyword: keyword ?? "" }).toString() });
    }
  }

  function focusOnSearchInput() {
    // @ts-ignore
    cInputSearchRef?.current?.forceFocus();
  }

  function blurSearchInput() {
    // @ts-ignore
    cInputSearchRef?.current?.forceBlur();
  }

  return (
    <div {...divProps} data-css="NavigationBarSearch">
      <CInput
        onEnterKey={handleNavigateToSearchPage}
        ref={cInputSearchRef}
        className={"bg-white relative z-10"}
        onClick={handleInputClick}
        extraPaddingForInputAfterSlot={true}
        inputSize={"large"}
        placeholder={t("searchProduct") || ""}
        value={keyword}
        onUpdate={setKeywordLocal}
        inputAfterSlot={
          <>
            <div className="c-invisible-wrapper border-mid-gray border-l">
              <div
                style={{ borderLeftWidth: "inherit" }}
                className={"h-14 border-solid absolute right-14 border-inherit"}></div>
            </div>
            <div className="c-invisible-wrapper text-mid-gray">
              <div
                onClick={focusOnSearchInput}
                className={"flex flex-none h-14 w-14 items-center justify-center absolute right-px"}>
                <FontAwesomeIcon icon={["fas", "magnifying-glass"]}></FontAwesomeIcon>
              </div>
            </div>
          </>
        }></CInput>
      {isMiniSearchShown && keyword && (
        <div className={"relative top-1 h-0 z-10"}>
          <ul className="flex flex-col shrink-0 bg-white border border-solid border-mid-gray">
            {miniSearchResults.map((result) => (
              <li
                key={result.id}
                onClick={(e) => handleSearchResultClick(e, result)}
                className={
                  "flex flex-row items-center shrink-0 min-h-[72px] border-b border-solid border-mid-gray px-4 py-0.5"
                }>
                <CImageWithFallback
                  className={"rounded-lg w-12 h-12 aspect-square object-cover self-center mr-4"}
                  src={result?.mainImage?.imageUrl}></CImageWithFallback>
                <div className="flex flex-row grow self-start justify-space-between mt-[9px] min-w-0">
                  <div className="flex flex-col min-w-0">
                    <p className="text-cinder truncate">{result.name}</p>
                    <p className="c-text-12 mt-px truncate">
                      {(result as AutocompleteProductResponseInner & { description: string }).description}
                    </p>
                  </div>
                  <span className="block font-bold c-text-14 shrink-0 ml-2">
                    {getFormattedPrice(result.price || 0)}
                  </span>
                </div>
              </li>
            ))}
            <li className="h-9 flex flex-row items-center justify-center">
              <CButtonSecondary
                text={t("viewAllResults")}
                onClick={handleNavigateToSearchPage}
                type={"button"}
                iconEnd={"arrow-up-right-from-square"}></CButtonSecondary>
            </li>
          </ul>
        </div>
      )}
      {isMiniSearchShown && <div onClick={handleClickOutside} className={"fixed bottom-0 right-0 top-0 left-0"}></div>}
    </div>
  );
}

export default NavigationBarSearch;
