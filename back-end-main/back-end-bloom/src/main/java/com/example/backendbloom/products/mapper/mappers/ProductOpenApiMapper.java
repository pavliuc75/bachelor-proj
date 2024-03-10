package com.example.backendbloom.products.mapper.mappers;

import com.backendbloom.openapi.model.*;
import com.example.backendbloom.products.model.product.ProductImageModel;
import com.example.backendbloom.products.model.product.ProductModel;
import com.example.backendbloom.products.model.product.ProductRatingModel;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper
public interface ProductOpenApiMapper {

    Product productModelToProduct(ProductModel productModel);

    ProductModel productToProductModel(Product product);

    List<Product> productModelListToProductList(List<ProductModel> productImageList);

    ProductModel productRequestToProductModel(ProductRequest productRequest);

    ProductModel patchProductRequestToProductModel(PatchProductRequest patchProductRequest);

    ProductImage productImageModelToProductImage(ProductImageModel productImageModel);

    ProductImageModel productImageToProductImageModel(ProductImage productImage);

    List<ProductImage> productImageModelListToProductImageList(List<ProductImageModel> productImageModelList);

    List<ProductImageModel> productImageListToProductImageModelList(List<ProductImage> productImageList);

    List<AutocompleteProductResponseInner> productModelListToAutocompleteProductResponseInner(List<ProductModel> productImageList);

    ProductRating productRatingModelToProductRating(ProductRatingModel productRatingModel);
    ProductRatingModel productRatingToProductRatingModel(ProductRating productRating);
}
