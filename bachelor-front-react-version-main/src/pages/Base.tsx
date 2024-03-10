import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/productSlice";
import { RootState } from "../store";
import ProductsGrid from "../components/products-grid/ProductsGrid";
import CPathRepresentation from "../components/common/CPathRepresentation";

function Base() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { categories, isProductsLoading, products, totalProductsOnServer } = useSelector(
    (state: RootState) => state.product
  );

  useEffect(() => {
    dispatch(
      // @ts-ignore
      fetchProducts(
        // @ts-ignore
        searchParams.get("sorting") || "",
        {
          category: (getSelectedCategoriesProp() || []).length ? getSelectedCategoriesProp() : undefined,
          inStock: searchParams.get("inStock") !== "false",
        },
        true,
        false
      )
    );
  }, [searchParams]);

  const cPathRepresentationData = [
    {
      route: "/categories",
      name: t("categories") || "",
    },
    {
      name: getCurrentCategory() || "",
    },
  ];

  function getSelectedCategoriesProp() {
    if (searchParams.getAll("categories")) {
      if (Array.isArray(searchParams.getAll("categories"))) return searchParams.getAll("categories");
      return [searchParams.getAll("categories")];
    }
    return [];
  }

  function getCurrentCategory() {
    if ((getSelectedCategoriesProp() || []).length === 0) {
      return t("allProducts");
    } else if ((getSelectedCategoriesProp() || []).length === 1) {
      // @ts-ignore
      let result = categories.find((category) => category?.id === getSelectedCategoriesProp().at(0))?.category;
      if (result) {
        return t(result.toLowerCase());
      }
    }
    return "";
  }

  function updateQuery(name: string, item: any) {
    setSearchParams({ ...searchParams, [name]: item });
  }

  function handleLoadMoreButtonClicked() {
    dispatch(
      // @ts-ignore
      fetchProducts(
        // @ts-ignore
        searchParams.get("sorting") || "",
        {
          category: (getSelectedCategoriesProp() || []).length ? getSelectedCategoriesProp() : undefined,
          inStock: searchParams.get("inStock") !== "false",
        },
        false,
        true
      )
    );
  }

  return (
    <div className={"flex flex-col grow mb-16"}>
      <ProductsGrid
        loading={isProductsLoading}
        onSortingSelected={(e) => updateQuery("sorting", e)}
        onStockSelected={(e) => updateQuery("inStock", e)}
        onCategorySelected={(e) => updateQuery("categories", e)}
        selectedSorting={searchParams.get("sorting") || ""}
        selectedStock={searchParams.get("inStock") !== "false"}
        selectedCategories={getSelectedCategoriesProp()}
        onLoadMore={handleLoadMoreButtonClicked}
        products={products || []}
        productsInTotal={totalProductsOnServer || 0}>
        {categories.length && (
          <CPathRepresentation
            className={"self-start mt-3"}
            directories={cPathRepresentationData}></CPathRepresentation>
        )}
      </ProductsGrid>
    </div>
  );
}

export default Base;
