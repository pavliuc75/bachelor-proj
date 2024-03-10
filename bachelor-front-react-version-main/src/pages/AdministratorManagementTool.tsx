import { useTranslation } from "react-i18next";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import CButtonSecondary from "../components/common/CButtonSecondary";
import CMenu from "../components/common/CMenu";
import CButtonPrimary from "../components/common/CButtonPrimary";
import "../assets/styles/AdministratorManagementTool.scss";
import React, { useEffect } from "react";
import classNames from "classnames";

function AdministratorManagementTool() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const sideBarLinksData = [
    {
      pathName: "/administrator-management-tool/create-business-page-requests",
      text: t("createBusinessPageRequests"),
    },
    {
      pathName: "/administrator-management-tool/business-pages",
      text: t("businessPages"),
    },
    {
      pathName: "/administrator-management-tool/create-category-requests",
      text: t("createCategoryRequests"),
    },
    {
      pathName: "/administrator-management-tool/categories",
      text: t("categories"),
    },
    {
      pathName: "/administrator-management-tool/orders",
      text: t("orders"),
    },
    {
      pathName: "/administrator-management-tool/support-discussions",
      text: t("supportDiscussions"),
    },
    {
      pathName: "/administrator-management-tool/stats",
      text: t("stats"),
    },
  ];

  useEffect(() => {
    if (location.pathname === "/administrator-management-tool") {
      navigate("/administrator-management-tool/create-business-page-requests");
    }
  }, []);

  const mobileSideBarLinkData = sideBarLinksData.map((linkData) => ({
    text: linkData.text,
    selected: isCurrentRoute(linkData.pathName),
    function: () => navigate(linkData.pathName),
  }));

  function isCurrentRoute(pathName: string): boolean {
    return location.pathname.includes(pathName);
  }

  return (
    <div data-css="AdministratorManagementTool" className="flex sm:flex-row flex-col h-full">
      <aside className="w-80 border-r border-solid border-mid-gray h-full sm:flex hidden flex-col px-20 py-16">
        <h3 className="w-36">{t("administratorManagementTool")}</h3>
        <ul className="mt-10 flex flex-col gap-3">
          {sideBarLinksData.map((linkData) => (
            <li className="inline-flex" key={linkData.pathName}>
              <Link to={linkData.pathName}>
                <CButtonSecondary
                  size="medium"
                  className={classNames({
                    "text-dark-blue no-underline": isCurrentRoute(linkData.pathName),
                    "text-left": true,
                  })}
                  text={linkData.text}></CButtonSecondary>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <nav className="sm:hidden sticky top-0">
        <div className="flex flex-row items-center justify-between bg-white py-3 px-4">
          <div className="flex flex-col">
            <h4>{t("administratorManagementTool")}</h4>
          </div>
          <CMenu items={mobileSideBarLinkData} isRadio={true}>
            <CButtonPrimary className="bg-white sticky" iconStart={["fas", "bars"]} text={t("menu")}></CButtonPrimary>
          </CMenu>
        </div>
        <div className="border-b border-solid border-mid-gray"></div>
      </nav>
      <main className="flex flex-col grow py-16 sm:px-[40px] px-[16px]">
        <Outlet />
      </main>
    </div>
  );
}

export default AdministratorManagementTool;
