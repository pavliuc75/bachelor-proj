import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useEffect } from "react";
import CPagination from "../components/common/CPagination";
import { fetchCreateBusinessPageRequests } from "../store/administratorManagementToolSlice";
import CreateBusinessPageRequestListItem from "../components/administrator-management-tool/CreateBusinessPageRequestListItem";

function AdministratorManagementToolCreateBusinessPageRequests() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { createBusinessPageRequests, createBusinessPageRequestsTotalPages, createBusinessPageRequestsCurrentPage } =
    useSelector((state: RootState) => state.administratorManagementTool);

  useEffect(() => {
    if (!createBusinessPageRequests?.length) {
      fetchCreateBusinessPageRequestsLocal(1);
    }
  }, []);

  function handlePageChange(page: number) {
    fetchCreateBusinessPageRequestsLocal(page);
  }

  function fetchCreateBusinessPageRequestsLocal(page: number) {
    // @ts-ignore
    dispatch(fetchCreateBusinessPageRequests(page));
  }

  return (
    <div className="flex flex-col grow">
      <h2 className={"mb-10"}>{t("createBusinessPageRequests")}</h2>
      {!createBusinessPageRequests?.length ? (
        <div className={"flex flex-col grow items-center justify-center"}>
          <h4 className="text-spun-pearl">{t("empty")}</h4>
        </div>
      ) : (
        <div className={"flex flex-col"}>
          <div className="flex flex-col gap-y-3">
            {(createBusinessPageRequests || []).map((request) => (
              <CreateBusinessPageRequestListItem request={request} key={request.id}></CreateBusinessPageRequestListItem>
            ))}
          </div>
          {createBusinessPageRequestsTotalPages > 1 && (
            <CPagination
              className={"mt-8 self-center"}
              onCurrentPageChanged={handlePageChange}
              currentPage={createBusinessPageRequestsCurrentPage}
              totalPages={createBusinessPageRequestsTotalPages}></CPagination>
          )}
        </div>
      )}
    </div>
  );
}

export default AdministratorManagementToolCreateBusinessPageRequests;
