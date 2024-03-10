import "../assets/styles/Product.scss";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { RootState } from "../store";
import { stringFormatterHelper } from "../utils/stringFormatterHelper";
import { handleProductCartAction } from "../store/cartSlice";
import { handleProductFavoriteAction } from "../store/favoritesSlice";
import { fetchCategories, fetchProduct, setProduct } from "../store/productSlice";
import { fetchBusinessPages } from "../store/businessSlice";
import CPathRepresentation from "../components/common/CPathRepresentation";
import classNames from "classnames";
import CImageWithFallback from "../components/common/CImageWithFallback";
import CRating from "../components/common/CRating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CButtonSecondary from "../components/common/CButtonSecondary";
import CButtonPrimary from "../components/common/CButtonPrimary";
import ProductViewSideBar from "../components/product/ProductViewSideBar";

function Product() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { id } = useParams();

  const { products: productsFromCartSlice } = useSelector((state: RootState) => state.cart);
  const { favorites } = useSelector((state: RootState) => state.favorites);
  const { product, categories, products: productsFromProductSlice } = useSelector((state: RootState) => state.product);
  const { products: productsFromSearchSlice } = useSelector((state: RootState) => state.search);
  const { businessPages } = useSelector((state: RootState) => state.business);

  const [isProductInCartLocal, setIsProductInCartLocal] = useState(false);
  const [isProductInFavoritesLocal, setIsProductInFavoritesLocal] = useState(false);
  const [isLeftSideBarShown, setIsLeftSideBarShown] = useState(false);

  useEffect(() => {
    doOnCreate();
  }, [id]);

  useEffect(() => {
    setIsProductInCartLocal((productsFromCartSlice || []).some((p) => p.product?.id === id));
  }, [productsFromCartSlice]);

  useEffect(() => {
    setIsProductInFavoritesLocal((favorites || []).some((p) => p.id === id));
  }, [favorites]);

  const business = businessPages?.find((business) => business.id === product?.belongsToBusinessId);

  const category = categories.find((category) => category.id === product?.categoryId);

  const formattedPrice = stringFormatterHelper.getFormattedPrice(product?.price || 0);

  function getCPathRepresentationData() {
    if (product?.id && category) {
      return [
        {
          name: t("categories") || "",
          route: "/categories",
        },
        {
          name: t(category?.category?.toLowerCase() || "") || "",
          route: "/?categories=" + category?.id,
        },
        {
          name: product?.name,
        },
      ];
    }
    return [];
  }

  function fetchCategoriesIfNecessary() {
    if (!categories.length) {
      // @ts-ignore
      dispatch(fetchCategories());
    }
  }

  function fetchBusinessesIfNecessary() {
    if (!businessPages?.find((business) => business.id === product?.belongsToBusinessId)) {
      // @ts-ignore
      dispatch(fetchBusinessPages(999));
    }
  }

  function handleProductCartActionLocal() {
    setIsProductInCartLocal(!isProductInCartLocal);
    // @ts-ignore
    dispatch(handleProductCartAction(id))?.catch(() =>
      setIsProductInCartLocal((productsFromCartSlice || []).some((p) => p.product?.id === id))
    );
  }

  function handleProductFavoritesActionLocal() {
    setIsProductInFavoritesLocal(!isProductInFavoritesLocal);
    // @ts-ignore
    dispatch(handleProductFavoriteAction(id))?.catch(() =>
      setIsProductInFavoritesLocal((favorites || []).some((p) => p.id === id))
    );
  }

  function handleOpenLeftSideBar() {
    setIsLeftSideBarShown(true);
  }

  function handleCloseLeftSideBar() {
    setIsLeftSideBarShown(false);
  }

  function doOnCreate() {
    fetchCategoriesIfNecessary();
    if (product?.id !== id) {
      let foundProductInProductSlice = productsFromProductSlice?.find((product) => product.id === id);
      if (foundProductInProductSlice) {
        dispatch(setProduct(foundProductInProductSlice));
        fetchBusinessesIfNecessary();
        return;
      }
      let foundProductInSearchSlice = productsFromSearchSlice.find((product) => product.id === id);
      if (foundProductInSearchSlice) {
        dispatch(setProduct(foundProductInProductSlice));
        fetchBusinessesIfNecessary();
        return;
      }
      // @ts-ignore
      dispatch(fetchProduct(id)).then(() => fetchBusinessesIfNecessary());
    } else {
      fetchBusinessesIfNecessary();
    }
  }

  return (
    <>
      {product?.id === id && (
        <div data-css="Product" className={"container flex flex-col sm:flex-row self-center gap-x-10 grow"}>
          <div className={"container flex flex-col sm:flex-row self-center gap-x-10 grow"}>
            <div className="flex basis-2/3 flex-col sm:grow sm:pr-10 sm:border-r sm:border-solid sm:border-mid-gray">
              <CPathRepresentation
                // @ts-ignore
                directories={getCPathRepresentationData()}
                className={"mt-3 min-h-[18px]"}></CPathRepresentation>
              <div
                className={classNames({
                  "grid-cols-1": product?.additionalImages?.length,
                  "grid-cols-2": !product?.additionalImages?.length,
                  "grid mt-[40px] sm:mt-16 gap-4 sm:gap-10 sm:pb-16": true,
                })}>
                <CImageWithFallback
                  src={product?.mainImage?.imageUrl}
                  className={"rounded-lg aspect-square w-full h-full object-cover"}></CImageWithFallback>
                {product?.additionalImages?.map((image) => (
                  <CImageWithFallback
                    src={image.imageUrl}
                    className={"rounded-lg aspect-square w-full h-full object-cover"}
                    key={image.imageKey}></CImageWithFallback>
                ))}
              </div>
            </div>
          </div>
          <div className={"flex flex-col basis-1/3 leading-145 pb-10 sm:sticky sm:top-0 self-start"}>
            <span className="block font-bold mt-[40px] sm:mt-[94px]">{product?.name}</span>
            <p className="text-cinder">{product?.description}</p>
            <span className="block mt-2 font-bold text-[22px] leading-145">{formattedPrice}</span>
            <div
              onClick={handleOpenLeftSideBar}
              className={"flex flex-row items-center justify-between mt-8 cursor-pointer reviews-wrapper"}>
              <div className="flex flex-col gap-2">
                <span className="block c-text-14 font-bold target-hover-heading">{t("reviews")}</span>
                <CRating
                  isTotalRatingShown={true}
                  value={product?.rating?.overallRating || 0}
                  totalRatings={product?.rating?.totalRatings || 0}></CRating>
              </div>
              <FontAwesomeIcon
                className={"text-mid-gray target-hover-icon"}
                size={"sm"}
                title={t("viewAllReviews") || ""}
                icon={["fas", "chevron-right"]}></FontAwesomeIcon>
            </div>
            <div className="border-b border-solid border-spun-pearl mt-4"></div>
            {category && (
              <Link className={"mt-10"} to={"/?categories=" + category.id} title={t("category") || ""}>
                <CButtonSecondary
                  size="medium"
                  iconStart={["fas", "cubes"]}
                  text={t((category?.category || "").toLowerCase())}></CButtonSecondary>
              </Link>
            )}
            {business && (
              <div className={"flex flex-row items-center mt-1"}>
                <span className="block c-text-14">{t("soldBy")}&nbsp;</span>
                <Link to={"/business-page/" + business.id}>
                  <CButtonSecondary size="medium" text={business.businessDescription.legalName}></CButtonSecondary>
                </Link>
              </div>
            )}
            <div className="flex flex-row mt-6 items-center">
              <FontAwesomeIcon icon={["fas", "warehouse"]} size="xs" className={"mb-px"}></FontAwesomeIcon>
              <span className="block c-text-14 ml-2.5">
                {product?.stockAmount + " " + t("productsInStock", { count: product?.stockAmount })}
              </span>
            </div>
            <div className="flex flex-row items-center">
              <FontAwesomeIcon icon={["fas", "hand-holding-dollar"]} size="xs" className={"mb-px"}></FontAwesomeIcon>
              <span className="block c-text-14 ml-3">{(product?.totalSold || 0) + " " + t("soldInTotal")}</span>
            </div>
            <div className="flex flex-row items-center gap-8 mt-12 flex-wrap">
              {isProductInCartLocal ? (
                <CButtonSecondary
                  onClick={handleProductCartActionLocal}
                  text={t("removeFromCart")}
                  iconEnd={["fas", "xmark"]}
                  size="medium"></CButtonSecondary>
              ) : (
                <CButtonPrimary
                  onClick={handleProductCartActionLocal}
                  text={t("addToCart")}
                  iconEnd={["fas", "cart-shopping"]}
                  size="medium"></CButtonPrimary>
              )}
              {isProductInFavoritesLocal ? (
                <CButtonSecondary
                  onClick={handleProductFavoritesActionLocal}
                  text={t("removeFromFavorites")}
                  iconEnd={["fas", "xmark"]}
                  size="medium"></CButtonSecondary>
              ) : (
                <CButtonSecondary
                  onClick={handleProductFavoritesActionLocal}
                  text={t("addToFavorites")}
                  iconEnd={["fas", "heart"]}
                  size="medium"></CButtonSecondary>
              )}
            </div>
          </div>
          {isLeftSideBarShown && (
            <ProductViewSideBar productId={id || ""} onCloseClicked={handleCloseLeftSideBar}></ProductViewSideBar>
          )}
        </div>
      )}
    </>
  );
}

export default Product;
