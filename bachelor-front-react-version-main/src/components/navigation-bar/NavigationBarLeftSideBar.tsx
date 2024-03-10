import { useEffect, useRef, useState } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import NavigationBarSearch from "./NavigationBarSearch";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { fetchBusinessPages } from "../../store/businessSlice";
import { fetchCategories } from "../../store/productSlice";
import CButtonSecondary from "../common/CButtonSecondary";
import CButtonPrimary from "../common/CButtonPrimary";

interface Props {
  onCloseClick: () => void;
  isCurrentRoute: (pathname: string) => boolean;
  isBusinessManagementToolShown: boolean;
  isAdministratorManagementToolShown: boolean;
}

function NavigationBarLeftSideBar(props: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { onCloseClick, isCurrentRoute, isBusinessManagementToolShown, isAdministratorManagementToolShown } = props;

  const { totalBusinessPagesPagesOnServer, businessPagesCurrentPage, businessPages } = useSelector(
    (state: RootState) => state.business
  );
  const { categories } = useSelector((state: RootState) => state.product);

  const sideBarRef = useRef(null);
  const [categoriesShownAtOnce, setCategoriesShownAtOnce] = useState<number>(4);

  useClickOutside(sideBarRef, handleOutsideClick);

  const isLoadMoreShownForBusinessPages = totalBusinessPagesPagesOnServer > businessPagesCurrentPage + 1;
  const isLoadMoreShownForCategories = categoriesShownAtOnce < categories.length;

  useEffect(() => {
    document.addEventListener("keyup", handleEscapeKeyReleased);
    return () => {
      document.removeEventListener("keyup", handleEscapeKeyReleased);
    };
  }, []);

  const isFetchedOnce = useRef(false);
  useEffect(() => {
    if (!isFetchedOnce.current) {
      if (!businessPages?.length) {
        // @ts-ignore
        dispatch(fetchBusinessPages());
      }

      if (!categories?.length) {
        // @ts-ignore
        dispatch(fetchCategories());
      }

      isFetchedOnce.current = true;
    }
  }, []);

  function handleOutsideClick() {
    onCloseClick();
  }

  function handleEscapeKeyReleased(e: any) {
    if (e.key === "Escape") {
      handleOutsideClick();
    }
  }

  function handleLoadMoreCategories() {
    setCategoriesShownAtOnce(categoriesShownAtOnce + 10);
  }

  function handleFetchBusinessPages() {
    // @ts-ignore
    dispatch(fetchBusinessPages());
  }

  return (
    <div className="w-screen h-screen fixed bg-background z-50">
      <div
        ref={sideBarRef}
        className="sm:w-[480px] w-full flex flex-col h-full bg-white sm:border-r sm:border-mid-gray sm:border-solid">
        <nav className="sm:pl-20 px-[16px] h-24 flex flex-row items-center border-b border-mid-gray border-solid shrink-0">
          <FontAwesomeIcon
            title={t("goBack") + ""}
            onClick={handleOutsideClick}
            size="xl"
            className="text-dark-blue mr-8 cursor-pointer"
            icon={["fas", "arrow-left"]}></FontAwesomeIcon>
          <Link to="/" title={t("frontPage") + ""}>
            <img src={require("../../assets/images/logo.png")} className="w-20" alt="" />
          </Link>
        </nav>
        <main className="sm:pl-20 px-[16px] py-6 overflow-y-auto">
          <div className="sm:hidden">
            <NavigationBarSearch onCloseSidebar={handleOutsideClick} className="mt-10"></NavigationBarSearch>
            <ul className="mt-10 ml-8 flex flex-col gap-3">
              <li className="inline-flex">
                <Link to="/cart">
                  <CButtonSecondary
                    className={isCurrentRoute("/cart") ? "text-dark-blue no-underline" : ""}
                    onClick={handleOutsideClick}
                    iconEnd={["fas", "shopping-cart"]}
                    size="medium"
                    text={t("cart")}></CButtonSecondary>
                </Link>
              </li>
              <li className="inline-flex">
                <Link to="/favorites">
                  <CButtonSecondary
                    className={isCurrentRoute("/favorites") ? "text-dark-blue no-underline" : ""}
                    onClick={handleOutsideClick}
                    iconEnd={["fas", "heart"]}
                    size="medium"
                    text={t("favorites")}></CButtonSecondary>
                </Link>
              </li>
              {isBusinessManagementToolShown && (
                <li className="inline-flex">
                  <Link to="/business-management-tool">
                    <CButtonSecondary
                      className={isCurrentRoute("/business-management-tool") ? "text-dark-blue no-underline" : ""}
                      onClick={handleOutsideClick}
                      iconEnd={["fas", "briefcase"]}
                      size="medium"
                      text={t("businessManagementTool")}></CButtonSecondary>
                  </Link>
                </li>
              )}
              {isAdministratorManagementToolShown && (
                <li className="inline-flex">
                  <Link to="/administrator-management-tool">
                    <CButtonSecondary
                      className={isCurrentRoute("/administrator-management-tool") ? "text-dark-blue no-underline" : ""}
                      onClick={handleOutsideClick}
                      iconEnd={["fas", "solar-panel"]}
                      size="medium"
                      text={t("administratorManagementTool")}></CButtonSecondary>
                  </Link>
                </li>
              )}
              <li className="inline-flex">
                <Link to="/account">
                  <CButtonSecondary
                    className={isCurrentRoute("/account") ? "text-dark-blue no-underline" : ""}
                    onClick={handleOutsideClick}
                    iconEnd={["fas", "user"]}
                    size="medium"
                    text={t("account")}></CButtonSecondary>
                </Link>
              </li>
            </ul>
          </div>
          <div className="mt-10">
            <Link to="/categories">
              <h3 onClick={handleOutsideClick} className="underline hover:no-underline hover:text-dark-blue">
                {t("allCategories")}
              </h3>
            </Link>
            <ul className="mt-10 ml-8 flex flex-col gap-3">
              <li key={-1}>
                <Link to="/">
                  <CButtonSecondary
                    onClick={handleOutsideClick}
                    size="medium"
                    text={t("allProducts")}></CButtonSecondary>
                </Link>
              </li>
              {categories.slice(0, categoriesShownAtOnce).map((category, index) => (
                <li key={category.id}>
                  <Link
                    to={{
                      pathname: "/",
                      search: new URLSearchParams({ categories: category.id ?? "" }).toString(),
                    }}>
                    <CButtonSecondary
                      onClick={handleOutsideClick}
                      size="medium"
                      text={t(category.category?.toLowerCase() || "")}></CButtonSecondary>
                  </Link>
                </li>
              ))}
              {isLoadMoreShownForCategories && (
                <CButtonPrimary
                  onClick={handleLoadMoreCategories}
                  className="self-start mt-5"
                  text={t("loadMore")}></CButtonPrimary>
              )}
            </ul>
          </div>
          <div className="mt-10">
            <Link to="/business-pages">
              <h3 onClick={handleOutsideClick} className="underline hover:no-underline hover:text-dark-blue">
                {t("companies")}
              </h3>
            </Link>
            <ul className="mt-10 ml-8 flex flex-col gap-3">
              {(businessPages || []).map((businessPage, index) => (
                <li key={businessPage.id}>
                  <Link to={"/business-page/" + businessPage.id}>
                    <CButtonSecondary
                      onClick={handleOutsideClick}
                      size="medium"
                      text={businessPage.businessDescription.legalName}></CButtonSecondary>
                  </Link>
                </li>
              ))}
              {isLoadMoreShownForBusinessPages && (
                <CButtonPrimary
                  onClick={handleFetchBusinessPages}
                  className="self-start mt-5"
                  text={t("loadMore")}></CButtonPrimary>
              )}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}

export default NavigationBarLeftSideBar;
