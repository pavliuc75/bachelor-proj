import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useEffect, useRef } from "react";
import { fetchBusinessPages, fetchProducts } from "../store/searchSlice";
import CButtonSecondary from "../components/common/CButtonSecondary";
import CButtonPrimary from "../components/common/CButtonPrimary";
import ProductsGrid from "../components/products-grid/ProductsGrid";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { totalBusinessPagesPagesOnServer, businessPagesCurrentPage, businessPages, products, totalProductsOnServer } =
    useSelector((state: RootState) => state.search);

  const lastSearchQueryRef = useRef("");

  useEffect(() => {
    dispatch(
      // @ts-ignore
      fetchProducts(
        searchParams.get("keyword") || "",
        // @ts-ignore
        searchParams.get("sorting") || undefined,
        {
          category: (getSelectedCategoriesProp() || []).length ? getSelectedCategoriesProp() : undefined,
          inStock: searchParams.get("inStock") !== "false",
        },
        true
      )
    );
  }, [searchParams]);

  useEffect(() => {
    if (searchParams.get("keyword") !== lastSearchQueryRef.current) {
      // @ts-ignore
      dispatch(fetchBusinessPages(searchParams.get("keyword") || "", true));
      lastSearchQueryRef.current = searchParams.get("keyword") || "";
    }
  }, [searchParams]);

  const isLoadMoreShown = (totalBusinessPagesPagesOnServer || 0) > businessPagesCurrentPage + 1;

  const isAnyFilterSet = !!getSelectedCategoriesProp().length || searchParams.get("inStock") === "false";

  function getSelectedCategoriesProp() {
    if (searchParams.getAll("categories")) {
      if (Array.isArray(searchParams.getAll("categories"))) return searchParams.getAll("categories");
      return [searchParams.getAll("categories")];
    }
    return [];
  }

  function updateQuery(name: string, item: any) {
    setSearchParams({ ...searchParams, [name]: item });
  }

  function handleLoadMoreButtonClicked() {
    dispatch(
      // @ts-ignore
      fetchProducts(
        searchParams.get("keyword") || "",
        // @ts-ignore
        searchParams.get("sorting") || undefined,
        {
          category: (getSelectedCategoriesProp() || []).length ? getSelectedCategoriesProp() : undefined,
          inStock: searchParams.get("inStock") !== "false",
        }
      )
    );
  }

  function handleLoadMoreCompanies() {
    dispatch(
      // @ts-ignore
      fetchBusinessPages(searchParams.get("keyword") || "")
    );
  }

  return (
    <div className={"flex flex-col grow my-16"}>
      <div className={"container flex self-center flex-col mb-20 max-w-3xl"}>
        <h1>
          {t("searchResultsFor") + " '"}
          <span className="font-normal">{searchParams.get("keyword")}</span>'
        </h1>
      </div>
      {(businessPages || []).length ? (
        <div className={"container flex self-center flex-col max-w-3xl mb-20"}>
          <h3 className="mb-10">{t("companies")}</h3>
          <ul className="ml-8 flex flex-col gap-3">
            {(businessPages || []).map((businessPage) => (
              <li className={"self-start"} key={businessPage.id}>
                <Link to={"/business-page/" + businessPage.id}>
                  <CButtonSecondary
                    size={"medium"}
                    text={businessPage.businessDescription.legalName}></CButtonSecondary>
                </Link>
              </li>
            ))}
            {isLoadMoreShown && (
              <CButtonPrimary
                onClick={handleLoadMoreCompanies}
                className={"self-start mt-5"}
                text={t("loadMore")}></CButtonPrimary>
            )}
          </ul>
        </div>
      ) : (
        <></>
      )}
      {(products.length || isAnyFilterSet) && (
        <>
          <div className={"container flex self-center flex-col mb-8 max-w-3xl"}>
            <h3>{t("products")}</h3>
          </div>
          <div className="flex flex-col grow">
            <div className="border-b border-solid border-mid-gray"></div>
            <ProductsGrid
              onSortingSelected={(e) => updateQuery("sorting", e)}
              onStockSelected={(e) => updateQuery("inStock", e)}
              onCategorySelected={(e) => updateQuery("categories", e)}
              selectedSorting={searchParams.get("sorting") || ""}
              selectedStock={searchParams.get("inStock") !== "false"}
              selectedCategories={getSelectedCategoriesProp()}
              onLoadMore={handleLoadMoreButtonClicked}
              products={products || []}
              productsInTotal={totalProductsOnServer || 0}>
              <div></div>
            </ProductsGrid>
          </div>
        </>
      )}
    </div>
  );
}

export default Search;
