import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useEffect } from "react";
import CPagination from "../components/common/CPagination";
import { fetchCreateCategoryRequests } from "../store/administratorManagementToolSlice";
import CreateCategoryRequestListItem from "../components/administrator-management-tool/CreateCategoryRequestListItem";

function AdministratorManagementToolCreateCategoryRequests() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { createCategoryRequests, createCategoryRequestsTotalPages, createCategoryRequestsCurrentPage } = useSelector(
    (state: RootState) => state.administratorManagementTool
  );

  useEffect(() => {
    if (!createCategoryRequests?.length) {
      fetchCreateCategoryRequestsLocal(1);
    }
  }, []);

  function handlePageChange(page: number) {
    fetchCreateCategoryRequestsLocal(page);
  }

  function fetchCreateCategoryRequestsLocal(page: number) {
    // @ts-ignore
    dispatch(fetchCreateCategoryRequests(page));
  }

  return (
    <div className="flex flex-col grow">
      <h2 className={"mb-10"}>{t("createCategoryRequests")}</h2>
      {!createCategoryRequests?.length ? (
        <div className={"flex flex-col grow items-center justify-center"}>
          <h4 className="text-spun-pearl">{t("empty")}</h4>
        </div>
      ) : (
        <div className={"flex flex-col"}>
          <div className="flex flex-col gap-y-3">
            {(createCategoryRequests || []).map((request) => (
              <CreateCategoryRequestListItem category={request} key={request.id}></CreateCategoryRequestListItem>
            ))}
          </div>
          {createCategoryRequestsTotalPages > 1 && (
            <CPagination
              className={"mt-8 self-center"}
              onCurrentPageChanged={handlePageChange}
              currentPage={createCategoryRequestsCurrentPage}
              totalPages={createCategoryRequestsTotalPages}></CPagination>
          )}
        </div>
      )}
    </div>
  );
}

export default AdministratorManagementToolCreateCategoryRequests;
