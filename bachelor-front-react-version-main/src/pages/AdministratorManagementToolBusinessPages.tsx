import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useEffect } from "react";
import CPagination from "../components/common/CPagination";
import { fetchBusinessPages } from "../store/administratorManagementToolSlice";
import BusinessPageListItem from "../components/administrator-management-tool/BusinessPageListItem";

function AdministratorManagementToolBusinessPages() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { businessPages, businessPagesTotalPages, businessPagesCurrentPage } = useSelector(
    (state: RootState) => state.administratorManagementTool
  );

  useEffect(() => {
    if (!businessPages?.length) {
      fetchBusinessPagesLocal(1);
    }
  }, []);

  function handlePageChange(page: number) {
    fetchBusinessPagesLocal(page);
  }

  function fetchBusinessPagesLocal(page: number) {
    // @ts-ignore
    dispatch(fetchBusinessPages(page));
  }

  return (
    <div className="flex flex-col grow">
      <h2 className={"mb-10"}>{t("businessPages")}</h2>
      {!businessPages?.length ? (
        <div className={"flex flex-col grow items-center justify-center"}>
          <h4 className="text-spun-pearl">{t("empty")}</h4>
        </div>
      ) : (
        <div className={"flex flex-col"}>
          <div className="flex flex-col gap-y-3">
            {(businessPages || []).map((businessPage) => (
              <BusinessPageListItem businessPage={businessPage} key={businessPage.id}></BusinessPageListItem>
            ))}
          </div>
          {businessPagesTotalPages > 1 && (
            <CPagination
              className={"mt-8 self-center"}
              onCurrentPageChanged={handlePageChange}
              currentPage={businessPagesCurrentPage}
              totalPages={businessPagesTotalPages}></CPagination>
          )}
        </div>
      )}
    </div>
  );
}

export default AdministratorManagementToolBusinessPages;
