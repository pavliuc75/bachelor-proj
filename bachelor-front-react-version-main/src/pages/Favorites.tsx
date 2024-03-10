import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useTranslation } from "react-i18next";
import ProductsListItem from "../components/products-list/ProductsListItem";

function Favorites() {
  const { t } = useTranslation();

  const { isFavoritesLoading, favorites } = useSelector((state: RootState) => state.favorites);

  return (
    <>
      {!isFavoritesLoading && (
        <div className="container flex self-center flex-col my-16 max-w-3xl grow">
          <h1 className="mb-20" data-cy="favorites-page-header">
            {t("yourFavorites")}
          </h1>
          {favorites?.length ? (
            <ul className={"flex flex-col gap-y-10"}>
              {favorites?.map((favorite, index) => (
                <li
                  key={favorite.id}
                  className={favorites.length !== index + 1 ? "pb-10 border-b border-solid border-mid-gray" : ""}>
                  <ProductsListItem product={favorite} mode={"favorite"}></ProductsListItem>
                </li>
              ))}
            </ul>
          ) : (
            <div className={"items-center justify-center flex flex-col grow"}>
              <h4 className="text-spun-pearl">{t("empty")}</h4>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Favorites;
