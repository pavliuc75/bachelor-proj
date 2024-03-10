import { Category, Product } from "../../generated-sources/openapi";
import { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import useScreenInnerWidthChangeHandler from "../../hooks/useScreenInnerWidthChangeHandler";
import { fetchCategories } from "../../store/productSlice";
import CMenu from "../common/CMenu";
import CButtonPrimary from "../common/CButtonPrimary";
import CButtonSecondary from "../common/CButtonSecondary";
import ProductsShelf from "./ProductsShelf";
import "../../assets/styles/ProductsGrid.scss";

interface Props {
  className?: string;
  isToolBarShown?: boolean;
  onLoadMore?: () => void;
  products: Product[];
  loading?: boolean;
  productsInTotal: number;
  children?: ReactNode;
  selectedSorting?: string;
  selectedStock?: boolean;
  selectedCategories?: any;
  onCategorySelected?: (categories: any[]) => void;
  onStockSelected?: (newValue: boolean) => void;
  onSortingSelected?: (newValue: string) => void;
}

function ProductsGrid(props: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    className = "",
    isToolBarShown = true,
    onLoadMore,
    products,
    loading = false,
    productsInTotal,
    children,
    selectedSorting = "",
    selectedStock = true,
    selectedCategories = [],
    onCategorySelected,
    onStockSelected,
    onSortingSelected,
  } = props;

  const { categories } = useSelector((state: RootState) => state.product);

  const screenInnerWidth = useScreenInnerWidthChangeHandler();

  useEffect(() => {
    if (categories.length === 0) {
      // @ts-ignore
      dispatch(fetchCategories());
    }
  }, []);

  const formattedSelectedCategories = categories.filter((category) => selectedCategories.includes(category.id));

  const stockOptions = [
    {
      text: t("inStock"),
      value: true,
      selected: selectedStock,
      function: () => onStockSelected && onStockSelected(true),
    },
    {
      text: t("outOfStock"),
      value: false,
      selected: !selectedStock,
      function: () => onStockSelected && onStockSelected(false),
    },
  ];

  function getCategories() {
    return categories.map((category) => {
      return {
        text: t(category.category || ""),
        selected: selectedCategories.includes(category.id),
        function: () => {
          if (selectedCategories.includes(category.id)) {
            let selectedCategoriesCopy = [...selectedCategories];
            selectedCategoriesCopy.splice(selectedCategoriesCopy.indexOf(category.id), 1);
            onCategorySelected && onCategorySelected(selectedCategoriesCopy);
          } else {
            onCategorySelected && onCategorySelected([...selectedCategories, category.id]);
          }
        },
      };
    });
  }

  function getSortingOptions() {
    let sortingOptions = [
      {
        text: t("bestMatch"),
        value: "",
      },
      {
        text: t("lowestPrice"),
        value: "PRICE_ASC",
      },
      {
        text: t("highestPrice"),
        value: "PRICE_DSC",
      },
      {
        text: t("nameAZ"),
        value: "NAME_ASC",
      },
      {
        text: t("nameZA"),
        value: "NAME_DSC",
      },
      {
        text: t("leastSold"),
        value: "TOTAL_SOLD_ASC",
      },
      {
        text: t("mostSold"),
        value: "TOTAL_SOLD_DSC",
      },
      {
        text: t("worstRating"),
        value: "RATING_ASC",
      },
      {
        text: t("bestRating"),
        value: "RATING_DSC",
      },
    ];
    return sortingOptions.map((option) => {
      return {
        text: option.text,
        selected: option.value === selectedSorting,
        function: () => onSortingSelected && onSortingSelected(option.value),
      };
    });
  }

  function getProductsPerShelf() {
    if (screenInnerWidth < 414) {
      return 1;
    } else if (screenInnerWidth < 764) {
      return 2;
    } else if (screenInnerWidth < 1280) {
      return 3;
    } else {
      return 4;
    }
  }

  function removeCategory(category: Category) {
    let selectedCategoriesCopy = [...selectedCategories];
    selectedCategoriesCopy.splice(selectedCategoriesCopy.indexOf(category.id), 1);
    onCategorySelected && onCategorySelected(selectedCategoriesCopy);
  }

  return (
    <>
      {!loading && (
        <div className={"flex flex-col grow"} data-css="ProductsGrid">
          {isToolBarShown && (
            <div className={"flex flex-col sticky top-0 bg-white"}>
              <div className="flex flex-row container self-center justify-between flex-wrap">
                {children}
                <div className="flex flex-row gap-x-2.5 my-5 flex-wrap">
                  <div className="inline-block">
                    <CMenu isRadio={true} items={stockOptions}>
                      <CButtonPrimary
                        iconStart={!selectedStock ? ["fas", "circle"] : undefined}
                        iconEnd={["fas", "chevron-down"]}
                        type="button"
                        text={t("stock")}></CButtonPrimary>
                    </CMenu>
                  </div>
                  {categories.length && (
                    <div className={"inline-block"}>
                      <CMenu isCheckbox={true} items={getCategories()}>
                        <CButtonPrimary
                          iconStart={selectedCategories.length ? ["fas", "circle"] : undefined}
                          iconEnd={["fas", "chevron-down"]}
                          type="button"
                          text={t("category")}></CButtonPrimary>
                      </CMenu>
                    </div>
                  )}
                  <div className={"inline-block"}>
                    <CMenu isRadio={true} items={getSortingOptions()}>
                      <CButtonPrimary
                        iconStart={selectedSorting !== "" ? ["fas", "circle"] : undefined}
                        iconEnd={["fas", "chevron-down"]}
                        type="button"
                        text={t("sort")}></CButtonPrimary>
                    </CMenu>
                  </div>
                </div>
              </div>
              <div className={"border-b border-mid-gray border-solid"}></div>
            </div>
          )}
          {(selectedCategories.length || !selectedStock) && isToolBarShown && (
            <div className={"container self-center mt-5 gap-2.5 flex flex-row flex-wrap"}>
              {formattedSelectedCategories.map((category) => (
                <CButtonSecondary
                  onClick={() => removeCategory(category)}
                  type="button"
                  key={category.id}
                  iconStart={["fas", "remove"]}
                  text={t(category?.category || "")}></CButtonSecondary>
              ))}
              {!selectedStock && (
                <CButtonSecondary
                  iconStart={["fas", "remove"]}
                  text={t("outOfStock")}
                  type="button"
                  onClick={() => (onStockSelected ? onStockSelected(true) : {})}></CButtonSecondary>
              )}
            </div>
          )}
          {products.length ? (
            <div>
              {/*@ts-ignore*/}
              {[...Array(Math.ceil(products.length / getProductsPerShelf())).keys()].map((index) => (
                <ProductsShelf
                  key={index}
                  products={products.slice(index * getProductsPerShelf(), (index + 1) * getProductsPerShelf())}
                  productsPerShelf={getProductsPerShelf()}></ProductsShelf>
              ))}
              <div className="flex flex-col items-center pt-10">
                {productsInTotal !== -1 ? (
                  <span className={"c-text-12 mb-4"}>
                    {t("showingOutOf", {
                      amount: products.length,
                      total: productsInTotal,
                    })}
                  </span>
                ) : (
                  <span className="c-text-12 mb-4">...</span>
                )}
                {products.length < productsInTotal && (
                  <CButtonPrimary text={t("loadMore")} onClick={onLoadMore} type="button"></CButtonPrimary>
                )}
              </div>
            </div>
          ) : (
            <div className={"flex flex-col grow min-h-[144px] items-center justify-center"}>
              {!loading && <h4 className={"text-spun-pearl"}>{t("empty")}</h4>}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ProductsGrid;

//todo css
