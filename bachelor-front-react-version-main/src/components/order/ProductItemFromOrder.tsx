import { OrderStatus, ProductInOrder } from "../../generated-sources/openapi";
import { stringFormatterHelper } from "../../utils/stringFormatterHelper";
import { useTranslation } from "react-i18next";
import "../../assets/styles/ProductItemFromOrder.scss";
import CImageWithFallback from "../common/CImageWithFallback";
import { Link } from "react-router-dom";
import CButtonSecondary from "../common/CButtonSecondary";

interface Props {
  children?: any;
  product: ProductInOrder;
  orderStatus?: OrderStatus;
}

function ProductItemFromOrder(props: Props) {
  const { t } = useTranslation();

  const { product, children, orderStatus } = props;

  const formattedStatus = t(stringFormatterHelper.underscoreToCamelCase((orderStatus || "").toLowerCase()));
  const formattedPrice = stringFormatterHelper.getFormattedPrice(product.price || 0);
  const fullFormattedPrice = stringFormatterHelper.getFormattedPrice((product.price || 0) * (product.amount || 0));

  return (
    <div
      data-css="ProductItemFromOrder"
      className="border border-solid border-mid-gray px-3 py-3 gap-4 flex flex-col sm:flex-row min-w-0">
      <CImageWithFallback
        src={product.mainImage?.imageUrl}
        className={"rounded-lg w-12 h-12 aspect-square object-cover self-start"}></CImageWithFallback>
      <table className="min-w-0">
        <tbody>
          <tr>
            <td>
              <p>{t("name")}</p>
            </td>
            <td>
              <Link target="_blank" className={"block cursor-default"} to={"/product/" + product.id}>
                <CButtonSecondary size="medium" text={product.name || ""}></CButtonSecondary>
              </Link>
            </td>
          </tr>
          <tr>
            <td>
              <p>{t("status")}</p>
            </td>
            <td>
              <span className="label block">{children || <>{formattedStatus}</>}</span>
            </td>
          </tr>
          <tr>
            <td>
              <p>{t("price")}</p>
            </td>
            <td>
              <span className="label block">{formattedPrice}</span>
            </td>
          </tr>
          <tr>
            <td>
              <p>{t("amount")}</p>
            </td>
            <td>
              <span className="label block">{product.amount}</span>
            </td>
          </tr>
          <tr>
            <td className="mr-2">
              <p>{t("totalPrice")}</p>
            </td>
            <td>
              <span className="label block">{fullFormattedPrice}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ProductItemFromOrder;
