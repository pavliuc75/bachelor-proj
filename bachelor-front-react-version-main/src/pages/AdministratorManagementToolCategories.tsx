import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useEffect } from "react";
import CPagination from "../components/common/CPagination";
import { fetchCategories } from "../store/administratorManagementToolSlice";
import CategoryListItem from "../components/administrator-management-tool/CategoryListItem";

function AdministratorManagementToolCategories() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { categories, categoriesTotalPages, categoriesCurrentPage } = useSelector(
    (state: RootState) => state.administratorManagementTool
  );

  useEffect(() => {
    if (!categories?.length) {
      fetchCategoriesLocal(1);
    }
  }, []);

  function handlePageChange(page: number) {
    fetchCategoriesLocal(page);
  }

  function fetchCategoriesLocal(page: number) {
    // @ts-ignore
    dispatch(fetchCategories(page));
  }

  return (
    <div className="flex flex-col grow">
      <h2 className={"mb-10"}>{t("categories")}</h2>
      {!categories?.length ? (
        <div className={"flex flex-col grow items-center justify-center"}>
          <h4 className="text-spun-pearl">{t("empty")}</h4>
        </div>
      ) : (
        <div className={"flex flex-col"}>
          <div className="flex flex-col gap-y-3">
            {(categories || []).map((category) => (
              <CategoryListItem category={category} key={category.id}></CategoryListItem>
            ))}
          </div>
          {categoriesTotalPages > 1 && (
            <CPagination
              className={"mt-8 self-center"}
              onCurrentPageChanged={handlePageChange}
              currentPage={categoriesCurrentPage}
              totalPages={categoriesTotalPages}></CPagination>
          )}
        </div>
      )}
    </div>
  );
}

export default AdministratorManagementToolCategories;
