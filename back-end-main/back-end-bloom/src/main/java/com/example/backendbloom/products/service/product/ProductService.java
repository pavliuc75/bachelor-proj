package com.example.backendbloom.products.service.product;

import com.backendbloom.openapi.model.FilterProductBy;
import com.backendbloom.openapi.model.SortProductBy;
import com.example.backendbloom.products.model.product.ProductModel;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collection;
import java.util.List;

public interface ProductService {
    String[] uploadProductImage(MultipartFile image) throws Exception;

    Page<ProductModel> getProductList(int pageSize, int pageNumber, String businessName);
    List<ProductModel> getProductsByBusinessId(String businessId);

    ProductModel createProduct(ProductModel productModelRequest) throws Exception;

    ProductModel patchProduct(ProductModel productRequest) throws Exception;
    ProductModel findProductById(String id);

    String deleteProductById(String productId);

    List<ProductModel> searchAutocompleteProduct(String text, int limitResults);

    List<ProductModel> searchProduct(String text, SortProductBy sort_product, FilterProductBy filterBy);

    ProductModel getProductById(String id);
    void decreaseProductStockAmount(String productId, int amountToDecrease);

    ProductModel updateProduct(ProductModel productModel);

    List<ProductModel> getAllProducts();
}
