import { Product } from "../../generated-sources/openapi";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { stringFormatterHelper } from "../../utils/stringFormatterHelper";
import { addProductToCart, removeProductFromCart, updateProductAmountInCart } from "../../store/cartSlice";
import { addProductToFavorites, removeProductFromFavorites } from "../../store/favoritesSlice";
import "../../assets/styles/ProductsListItem.scss";
import { Link } from "react-router-dom";
import CImageWithFallback from "../common/CImageWithFallback";
import CButtonSecondary from "../common/CButtonSecondary";
import { RootState } from "../../store";
import CMenu from "../common/CMenu";
import CButtonPrimary from "../common/CButtonPrimary";

interface Props {
  mode: "cart" | "favorite";
  amount?: number;
  product?: Product;
}

function ProductsListItem(props: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { mode, amount = 0, product } = props;

  const { products } = useSelector((state: RootState) => state.cart);
  const { favorites } = useSelector((state: RootState) => state.favorites);

  function getFormattedPrice() {
    if (mode === "cart") {
      return stringFormatterHelper.getFormattedPrice((product?.price || 0) * amount);
    } else {
      return stringFormatterHelper.getFormattedPrice(product?.price || 0);
    }
  }

  function getQuantityValues() {
    if (mode === "cart") {
      return Array.from({ length: 20 }, (_, i) => i + 1).map((value) => ({
        text: value.toString(),
        selected: value.toString() === amount.toString(),
        function: () => handleQuantityChange(value),
      }));
    }
    return [];
  }

  function handleRemoveItemFromCart() {
    // @ts-ignore
    dispatch(removeProductFromCart(product?.id, true));
  }

  function handleQuantityChange(value: number) {
    // @ts-ignore
    dispatch(updateProductAmountInCart(product?.id, value));
  }

  function handleMoveToFavorites() {
    // @ts-ignore
    dispatch(addProductToFavorites(product?.id));
    // @ts-ignore
    dispatch(removeProductFromCart(product?.id, true));
  }

  function handleMoveItemToCart() {
    // @ts-ignore
    dispatch(addProductToCart(product?.id));
    // @ts-ignore
    dispatch(removeProductFromFavorites(product?.id, true));
  }

  function handleRemoveItemFromFavorites() {
    // @ts-ignore
    dispatch(removeProductFromFavorites(product?.id, true));
  }

  function isProductInCart(id: string) {
    return (products || []).some((p) => p.product?.id === id);
  }

  function isProductInFavorites(id: string) {
    return (favorites || []).some((p) => p.id === id);
  }

  return (
    <div data-css="ProductsListItem" className="flex flex-row gap-6">
      <Link to={"/product/" + product?.id} className={"shrink-0"}>
        <CImageWithFallback
          className={"rounded-lg aspect-square w-[96px] sm:w-[144px] self-start object-cover"}
          src={product?.mainImage?.imageUrl}></CImageWithFallback>
      </Link>
      <div className="flex flex-col grow min-w-0">
        <div className="flex flex-row justify-space-between">
          <Link to={"/product/" + product?.id} className={"block font-bold cursor-default truncate"}>
            <span title={product?.name}>{product?.name}</span>
          </Link>
          <span className="block font-bold shrink-0 ml-2">{getFormattedPrice()}</span>
        </div>
        <Link to={"/product/" + product?.id}>
          <p className={"text-cinder break-words"} title={product?.description}>
            {product?.description}
          </p>
        </Link>
        {mode === "favorite" ? (
          <div className={"mt-7 flex flex-row gap-5"}>
            {!isProductInCart(product?.id || "") && (
              <CButtonSecondary type="button" text={t("moveToCart")} onClick={handleMoveItemToCart}></CButtonSecondary>
            )}
            <CButtonSecondary
              type="button"
              onClick={handleRemoveItemFromFavorites}
              text={t("remove")}></CButtonSecondary>
          </div>
        ) : (
          <div className={"mt-7 flex flex-row gap-5 flex-wrap"}>
            <CMenu isRadio={true} items={getQuantityValues()}>
              <CButtonPrimary type="button" text={amount.toString()} iconEnd={["fas", "chevron-down"]}></CButtonPrimary>
            </CMenu>
            {!isProductInFavorites(product?.id || "") && (
              <CButtonSecondary
                onClick={handleMoveToFavorites}
                type={"button"}
                text={t("moveToFavorites")}></CButtonSecondary>
            )}
            <CButtonSecondary type="button" text={t("remove")} onClick={handleRemoveItemFromCart}></CButtonSecondary>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductsListItem;
