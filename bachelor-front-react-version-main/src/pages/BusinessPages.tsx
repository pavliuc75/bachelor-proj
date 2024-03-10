import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "../store";
import { fetchBusinessPages } from "../store/businessSlice";
import { Link } from "react-router-dom";
import CButtonSecondary from "../components/common/CButtonSecondary";
import CButtonPrimary from "../components/common/CButtonPrimary";
import { useEffect, useRef } from "react";

function BusinessPages() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { businessPages, totalBusinessPagesPagesOnServer, businessPagesCurrentPage } = useSelector(
    (state: RootState) => state.business
  );

  const loadedOnce = useRef(false);

  const isLoadMoreShown = totalBusinessPagesPagesOnServer > businessPagesCurrentPage + 1;

  useEffect(() => {
    if (!loadedOnce.current) {
      if ((businessPages || []).length === 0) {
        fetchBusinessPagesLocal();
      }
      return () => {
        loadedOnce.current = true;
      };
    }
  }, []);

  function fetchBusinessPagesLocal() {
    // @ts-ignore
    dispatch(fetchBusinessPages());
  }

  return (
    <div className="container flex self-center flex-col my-16 max-w-3xl">
      <h1 className="mb-10" data-cy="companies-header">
        {t("companies")}
      </h1>
      <ul className="ml-8 flex flex-col gap-3">
        {(businessPages || []).map((businessPage) => (
          <li key={businessPage.id}>
            <Link to={"/business-page/" + businessPage.id}>
              <CButtonSecondary size={"medium"} text={businessPage.businessDescription.legalName}></CButtonSecondary>
            </Link>
          </li>
        ))}
        {isLoadMoreShown && (
          <CButtonPrimary
            onClick={fetchBusinessPagesLocal}
            className={"self-start mt-5"}
            text={t("loadMore")}></CButtonPrimary>
        )}
      </ul>
    </div>
  );
}

export default BusinessPages;
