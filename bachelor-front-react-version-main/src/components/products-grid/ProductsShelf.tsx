import { Product } from "../../generated-sources/openapi";
import ProductsShelfItem from "./ProductsShelfItem";

interface Props {
  products: Product[];
  productsPerShelf: number;
}

function ProductsShelf(props: Props) {
  const { products, productsPerShelf } = props;
  return (
    <div className={"flex flex-col"}>
      <div
        className={"grid gap-x-20 container self-center"}
        style={{ gridTemplateColumns: `repeat(${productsPerShelf}, minmax(0, 1fr))` }}>
        {products.map((product) => (
          <ProductsShelfItem key={product.id} product={product}></ProductsShelfItem>
        ))}
      </div>
      <div className="border-b border-solid border-mid-gray container self-center"></div>
    </div>
  );
}

export default ProductsShelf;
