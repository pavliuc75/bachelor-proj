import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import CInfo from "../components/common/CInfo";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import CButtonSecondary from "../components/common/CButtonSecondary";
import CMenu from "../components/common/CMenu";
import CButtonPrimary from "../components/common/CButtonPrimary";
import "../assets/styles/BusinessManagementTool.css";
import React, { useEffect } from "react";
import { fetchCurrentUserBusinessData } from "../store/businessManagementToolSlice";

function BusinessManagementTool() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { business } = useSelector((state: RootState) => state.businessManagementTool);

  const sideBarLinksData = [
    {
      pathName: "/business-management-tool/edit-business-page",
      text: t("editBusinessPage"),
    },
    {
      pathName: "/business-management-tool/products",
      text: t("products"),
    },
    {
      pathName: "/business-management-tool/orders",
      text: t("orders"),
    },
    {
      pathName: "/business-management-tool/other",
      text: t("other"),
    },
  ];

  useEffect(() => {
    if (location.pathname === "/business-management-tool") {
      navigate("/business-management-tool/edit-business-page");
    }
  }, []);

  useEffect(() => {
    // @ts-ignore
    dispatch(fetchCurrentUserBusinessData());
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
    <div data-css="BusinessManagementTool" className="flex sm:flex-row flex-col h-full">
      <aside className="w-80 border-r border-solid border-mid-gray h-full sm:flex hidden flex-col px-20 py-16">
        {business?.businessState === "Blocked" && (
          <CInfo
            className="mb-3"
            type="error"
            size="sm"
            text={t("businessPageIsCurrentlyHiddenFromUsers") || ""}></CInfo>
        )}
        <h3 className="w-36">
          <span className="break-all">{business?.businessDescription?.legalName || "..."}</span>
          <span className="lowercase">{"\n" + t("management")}</span>
        </h3>
        <ul className="mt-10 flex flex-col gap-3">
          {sideBarLinksData.map((linkData) => (
            <li className="inline-flex" key={linkData.pathName}>
              <Link to={linkData.pathName}>
                <CButtonSecondary
                  size="medium"
                  className={isCurrentRoute(linkData.pathName) ? "text-dark-blue no-underline" : ""}
                  text={linkData.text}></CButtonSecondary>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <nav className="sm:hidden sticky top-0">
        <div className="flex flex-row items-center justify-between bg-white py-3 px-4">
          <div className="flex flex-col">
            {business?.businessState === "Blocked" && (
              <CInfo
                className="mr-1"
                type="error"
                size="sm"
                text={t("businessPageIsCurrentlyHiddenFromUsers") || ""}></CInfo>
            )}
            <h4>
              <span className="break-all">{business?.businessDescription?.legalName || "..."}</span>
              <span className="lowercase">{"\n" + t("management")}</span>
            </h4>
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

export default BusinessManagementTool;
