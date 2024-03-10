import { Product } from "../../generated-sources/openapi";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { stringFormatterHelper } from "../../utils/stringFormatterHelper";
import { handleProductCartAction } from "../../store/cartSlice";
import { handleProductFavoriteAction } from "../../store/favoritesSlice";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import CImageWithFallback from "../common/CImageWithFallback";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../assets/styles/ProductsShelfItem.scss";

interface Props {
  product: Product;
}

function ProductsShelfItem(props: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { product } = props;

  const { products } = useSelector((state: RootState) => state.cart);
  const { favorites } = useSelector((state: RootState) => state.favorites);

  const [isProductInCartLocal, setIsProductInCartLocal] = useState(false);
  const [isProductInFavoritesLocal, setIsProductInFavoritesLocal] = useState(false);

  useEffect(() => {
    setIsProductInCartLocal((products || []).some((p) => p.product?.id === product.id));
  }, [products]);

  useEffect(() => {
    setIsProductInFavoritesLocal((favorites || []).some((p) => p.id === product.id));
  }, [favorites]);

  const formattedPrice = stringFormatterHelper.getFormattedPrice(product.price || 0);

  function handleProductCartActionLocal() {
    setIsProductInCartLocal(!isProductInCartLocal);
    // @ts-ignore
    dispatch(handleProductCartAction(product.id))?.catch(() =>
      setIsProductInCartLocal((products || []).some((p) => p.product?.id === product.id))
    );
  }

  function handleProductFavoriteActionLocal() {
    setIsProductInFavoritesLocal(!isProductInFavoritesLocal);
    // @ts-ignore
    dispatch(handleProductFavoriteAction(product.id))?.catch(() =>
      setIsProductInFavoritesLocal((favorites || []).some((p) => p.id === product.id))
    );
  }

  return (
    <div data-css="ProductsShelfItem">
      <Link to={"/product/" + product.id}>
        <CImageWithFallback
          className={"rounded-lg aspect-square w-full object-cover mb-8"}
          src={product?.mainImage?.imageUrl}></CImageWithFallback>
      </Link>
      <div className="flex flex-row justify-space-between items-center">
        <Link
          to={"/product/" + product.id}
          title={product.name}
          className={"block c-text-14 font-bold cursor-default truncate mr-2"}>
          {product.name}
        </Link>
        <div className="flex flex-row gap-x-3">
          <FontAwesomeIcon
            className={isProductInCartLocal ? "text-dark-blue" : "text-mid-gray"}
            title={isProductInCartLocal ? t("removeFromCart") || "" : t("addToCart") || ""}
            onClick={handleProductCartActionLocal}
            size={"sm"}
            icon={["fas", "cart-shopping"]}></FontAwesomeIcon>
          <FontAwesomeIcon
            className={isProductInFavoritesLocal ? "text-dark-blue" : "text-mid-gray"}
            title={isProductInFavoritesLocal ? t("removeFromFavorites") || "" : t("addToFavorites") || ""}
            onClick={handleProductFavoriteActionLocal}
            size={"sm"}
            icon={["fas", "heart"]}></FontAwesomeIcon>
        </div>
      </div>
      <Link to={"/product/" + product.id}>
        <p className="text-cinder" title={product.description}>
          {product.description}
        </p>
      </Link>
      <span className="block mt-2 font-bold text-[22px] leading-145">{formattedPrice}</span>
    </div>
  );
}

export default ProductsShelfItem;
