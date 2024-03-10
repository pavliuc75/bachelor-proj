import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useEffect } from "react";
import CPagination from "../components/common/CPagination";
import { fetchThreads } from "../store/administratorManagementToolSlice";
import SupportDiscussionListItem from "../components/administrator-management-tool/SupportDiscussionListItem";

function AdministratorManagementToolSupportDiscussions() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { threads, threadsTotalPages, threadsCurrentPage } = useSelector(
    (state: RootState) => state.administratorManagementTool
  );

  useEffect(() => {
    if (!threads?.length) {
      fetchThreadsLocal(1);
    }
  }, []);

  function handlePageChange(page: number) {
    fetchThreadsLocal(page);
  }

  function fetchThreadsLocal(page: number) {
    // @ts-ignore
    dispatch(fetchThreads(page));
  }

  return (
    <div className="flex flex-col grow">
      <h2 className={"mb-10"}>{t("supportDiscussions")}</h2>
      {!threads?.length ? (
        <div className={"flex flex-col grow items-center justify-center"}>
          <h4 className="text-spun-pearl">{t("empty")}</h4>
        </div>
      ) : (
        <div className={"flex flex-col"}>
          <div className="flex flex-col gap-y-3">
            {(threads || []).map((thread) => (
              <SupportDiscussionListItem discussion={thread} key={thread.supportThreadId}></SupportDiscussionListItem>
            ))}
          </div>
          {threadsTotalPages > 1 && (
            <CPagination
              className={"mt-8 self-center"}
              onCurrentPageChanged={handlePageChange}
              currentPage={threadsCurrentPage}
              totalPages={threadsTotalPages}></CPagination>
          )}
        </div>
      )}
    </div>
  );
}

export default AdministratorManagementToolSupportDiscussions;
