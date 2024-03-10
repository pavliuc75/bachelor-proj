import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "../store";
import { fetchCategories } from "../store/productSlice";
import { Link } from "react-router-dom";
import CButtonSecondary from "../components/common/CButtonSecondary";
import { useEffect, useRef } from "react";

function Categories() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { categories } = useSelector((state: RootState) => state.product);

  const loadedOnce = useRef(false);

  useEffect(() => {
    if (!loadedOnce.current) {
      if ((categories || []).length === 0) {
        // @ts-ignore
        dispatch(fetchCategories());
      }
      return () => {
        loadedOnce.current = true;
      };
    }
  }, []);

  return (
    <div className="container flex self-center flex-col my-16 max-w-3xl">
      <h1 className="mb-10" data-cy="companies-header">
        {t("categories")}
      </h1>
      <ul className="ml-8 flex flex-col gap-3">
        <li key={-1}>
          <Link to={"/"}>
            <CButtonSecondary size={"medium"} text={t("allProducts")}></CButtonSecondary>
          </Link>
        </li>
        {(categories || []).map((category) => (
          <li key={category.id}>
            <Link
              to={{
                pathname: "/",
                search: new URLSearchParams({ categories: category.id ?? "" }).toString(),
              }}>
              <CButtonSecondary size={"medium"} text={t(category.category || "")?.toLowerCase()}></CButtonSecondary>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Categories;
