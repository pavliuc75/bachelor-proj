import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import NavigationBarSearch from "./NavigationBarSearch";
import classNames from "classnames";
import NavigationBarLeftSideBar from "./NavigationBarLeftSideBar";
import keycloak from "../../authentication/keycloak";
import { useLocation } from "react-router-dom";
import { routePathsRequiringLimitedNavigationBar } from "../../App";

function NavigationBar() {
  const { t } = useTranslation();
  const location = useLocation();

  const [isLeftSideBarShown, setIsLeftSideBarShown] = useState(false);

  const isLimitedNavigationBar = routePathsRequiringLimitedNavigationBar
    .map((routepath) => isCurrentRoute(routepath))
    .includes(true);
  const isBusinessManagementToolShown = keycloak?.realmAccess?.roles?.includes("BUSINESS_OWNER") || false;
  const isAdministratorManagementToolShown = keycloak?.realmAccess?.roles?.includes("ADMIN") || false;

  function isCurrentRoute(pathname: string): boolean {
    return location.pathname.includes(pathname);
  }

  function handleShowLeftSideBarClick() {
    setIsLeftSideBarShown(true);
  }

  function handleHideLeftSideBarClick() {
    setIsLeftSideBarShown(false);
  }

  return (
    <nav className="h-24 flex flex-shrink-0 border-b border-mid-gray border-solid justify-center">
      <div className="container flex flex-shrink-0 items-center">
        {isLimitedNavigationBar ? (
          <Link to="/" className="mr-8">
            <FontAwesomeIcon
              title={t("goBack") + ""}
              size="xl"
              className="text-dark-blue"
              icon={["fas", "arrow-left"]}></FontAwesomeIcon>
          </Link>
        ) : (
          <FontAwesomeIcon
            title={t("menu") + ""}
            className="text-dark-blue mr-8 cursor-pointer"
            size="xl"
            onClick={handleShowLeftSideBarClick}
            icon={["fas", "bars"]}></FontAwesomeIcon>
        )}
        <Link to="/" title={t("frontPage") + ""}>
          <img src={require("../../assets/images/logo.png")} className="w-20" alt="" />
        </Link>
        {!isLimitedNavigationBar && (
          <div className="hidden flex-row grow items-center sm:flex ml-8">
            <div className="flex grow"></div>
            <div className="flex grow flex-col mr-7" style={{ maxWidth: "calc(96px * 4)" }}>
              <NavigationBarSearch></NavigationBarSearch>
            </div>
            <Link to="/cart" className="mr-8" title={t("cart") + ""}>
              <FontAwesomeIcon
                icon={["fas", "cart-shopping"]}
                className={classNames({
                  "hover:text-dark-blue": true,
                  "text-dark-blue": isCurrentRoute("/cart"),
                  "text-mid-gray": !isCurrentRoute("/cart"),
                })}></FontAwesomeIcon>
            </Link>
            <Link to="/favorites" className="mr-8" title={t("favorites") + ""}>
              <FontAwesomeIcon
                icon={["fas", "heart"]}
                className={classNames({
                  "hover:text-dark-blue": true,
                  "text-dark-blue": isCurrentRoute("/favorites"),
                  "text-mid-gray": !isCurrentRoute("/favorites"),
                })}></FontAwesomeIcon>
            </Link>
            {isBusinessManagementToolShown && (
              <Link to="/business-management-tool" className="mr-8" title={t("businessManagementTool") + ""}>
                <FontAwesomeIcon
                  icon={["fas", "briefcase"]}
                  className={classNames({
                    "hover:text-dark-blue": true,
                    "text-dark-blue": isCurrentRoute("/businessManagementTool"),
                    "text-mid-gray": !isCurrentRoute("/businessManagementTool"),
                  })}></FontAwesomeIcon>
              </Link>
            )}
            {isAdministratorManagementToolShown && (
              <Link to="/administrator-management-tool" className="mr-8" title={t("administratorManagementTool") + ""}>
                <FontAwesomeIcon
                  icon={["fas", "solar-panel"]}
                  className={classNames({
                    "hover:text-dark-blue": true,
                    "text-dark-blue": isCurrentRoute("/administratorManagementTool"),
                    "text-mid-gray": !isCurrentRoute("/administratorManagementTool"),
                  })}></FontAwesomeIcon>
              </Link>
            )}
            <Link to="/account" className="mr-8" title={t("account") + ""}>
              <FontAwesomeIcon
                icon={["fas", "user"]}
                className={classNames({
                  "hover:text-dark-blue": true,
                  "text-dark-blue": isCurrentRoute("/account"),
                  "text-mid-gray": !isCurrentRoute("/account"),
                })}></FontAwesomeIcon>
            </Link>
          </div>
        )}
      </div>
      {isLeftSideBarShown && (
        <NavigationBarLeftSideBar
          onCloseClick={handleHideLeftSideBarClick}
          isAdministratorManagementToolShown={isAdministratorManagementToolShown}
          isBusinessManagementToolShown={isBusinessManagementToolShown}
          isCurrentRoute={isCurrentRoute}></NavigationBarLeftSideBar>
      )}
    </nav>
  );
}

export default NavigationBar;
