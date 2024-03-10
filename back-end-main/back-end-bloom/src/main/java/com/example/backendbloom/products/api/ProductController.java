package com.example.backendbloom.products.api;

import com.backendbloom.openapi.api.ProductsApi;
import com.backendbloom.openapi.model.*;
import com.example.backendbloom.business.exception_handler.exception.FileValidation;
import com.example.backendbloom.commons.exception_handler.exception.DefaultServerException;
import com.example.backendbloom.commons.exception_handler.exception.ObjectNotFound;
import com.example.backendbloom.commons.exception_handler.exception.ValueNotPositive;
import com.example.backendbloom.commons.util.Pagination;
import com.example.backendbloom.products.exception_handler.exception.*;
import com.example.backendbloom.commons.exception_handler.exception.ValueNotGreaterThanZero;
import com.example.backendbloom.products.mapper.mappers.ProductOpenApiMapper;
import com.example.backendbloom.products.model.product.ProductModel;
import com.example.backendbloom.products.service.product.ProductService;
import com.example.backendbloom.products.service.product.RateProductService;
import com.example.backendbloom.user.exception_handler.exception.UserNotHaveBusiness;
import com.example.backendbloom.user.mapper.AppUserToOpenApiAppUserMapper;
import com.example.backendbloom.user.model.AppUserModel;
import com.example.backendbloom.user.model.AppUserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.security.RolesAllowed;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ProductController implements ProductsApi {
    private final ProductService productService;
    private final ProductOpenApiMapper productOpenApiMapper;
    private final RateProductService rateProductService;
    private final AppUserToOpenApiAppUserMapper appUserToOpenApiAppUserMapper;

    @Override
    @RolesAllowed({AppUserRole.Names.CUSTOMER, AppUserRole.Names.BUSINESS_OWNER})
    public ResponseEntity<Product> rateProduct(RateProductRequest rateProductRequest) {
        try {
            ProductModel productModel = rateProductService.rateProduct(rateProductRequest.getProductId(), rateProductRequest.getRating());
            return new ResponseEntity<>(productOpenApiMapper.productModelToProduct(productModel),
                    HttpStatus.CREATED);
        } catch (ProductAlreadyRated | ProductNotMeetsRatingCriteria | ObjectNotFound | ProductImageNotFound | CategoryNotFound |
                 ValueNotGreaterThanZero |
                 UserNotHaveBusiness |
                 DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @RolesAllowed({AppUserRole.Names.BUSINESS_OWNER})
    @Override
    public ResponseEntity<Product> createProduct(ProductRequest productRequest) {
        try {
            ProductModel productModelRequest = productOpenApiMapper.productRequestToProductModel(productRequest);
            ProductModel productModel = productService.createProduct(productModelRequest);
            return new ResponseEntity<>(productOpenApiMapper.productModelToProduct(productModel),
                    HttpStatus.CREATED);
        } catch (NullImageKey | ProductImageNotFound | CategoryNotFound | ValueNotGreaterThanZero |
                 UserNotHaveBusiness |
                 DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @RolesAllowed({AppUserRole.Names.BUSINESS_OWNER})
    @Override
    public ResponseEntity<ProductImage> uploadProductImage(MultipartFile image) {
        try {
            String[] keyUrlList = productService.uploadProductImage(image);
            ProductImage upload = new ProductImage();
            upload.setImageKey(keyUrlList[0]);
            upload.setImageUrl(keyUrlList[1]);
            return new ResponseEntity<>(upload,
                    HttpStatus.CREATED);
        } catch (FileValidation | DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }


    @Override
    public ResponseEntity<ProductListResponse> getProductsByBusiness(Integer pageSize, Integer pageNumber, String businessName) {
        try {
            Page<ProductModel> productListResponsePage = productService.getProductList(pageSize, pageNumber, businessName);

            ProductListResponse productListResponse = mapProductModelToProductListResponse(productListResponsePage);
            return new ResponseEntity<>(productListResponse, HttpStatus.OK);
        } catch (ValueNotGreaterThanZero | ValueNotPositive | DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    public ResponseEntity<List<AutocompleteProductResponseInner>> searchAutocompleteProduct(String text, Integer limitResults) {
        try {
            List<ProductModel> productModels = productService.searchAutocompleteProduct(text, limitResults);
            List<AutocompleteProductResponseInner> productList = productOpenApiMapper.productModelListToAutocompleteProductResponseInner(productModels);
            return new ResponseEntity<>(productList, HttpStatus.OK);
        } catch (DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    public ResponseEntity<ProductListResponse> searchProduct(String text, Integer pageSize, Integer pageNumber, SortProductBy sortBy, FilterProductBy filterBy) {
        try {
            List<ProductModel> productList = productService.searchProduct(text, sortBy, filterBy);
            Page<ProductModel> paginatedProductList = Pagination.paginateList(productList, pageNumber, pageSize);
            ProductListResponse productListResponse = mapProductModelToProductListResponse(paginatedProductList);
            return new ResponseEntity<>(productListResponse, HttpStatus.OK);
        } catch (ValueNotGreaterThanZero | ValueNotPositive | DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.BUSINESS_OWNER})
    public ResponseEntity<Product> patchProduct(PatchProductRequest patchProductRequest) {
        try {
            ProductModel productModelRequest = productOpenApiMapper.patchProductRequestToProductModel(patchProductRequest);
            ProductModel productModel = productService.patchProduct(productModelRequest);
            return new ResponseEntity<>(productOpenApiMapper.productModelToProduct(productModel),
                    HttpStatus.OK);
        } catch (ObjectNotFound | ProductImageNotFound | CategoryNotFound | ValueNotGreaterThanZero |
                 UserNotHaveBusiness |
                 DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    public ResponseEntity<Product> getProductById(String productId) {
        try {
            ProductModel productModel = productService.findProductById(productId);
            return new ResponseEntity<>(productOpenApiMapper.productModelToProduct(productModel),
                    HttpStatus.CREATED);
        } catch (ObjectNotFound | DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.ADMIN, AppUserRole.Names.BUSINESS_OWNER})
    public ResponseEntity<String> deleteProductById(String productId) {
        try {
            String deletedId = productService.deleteProductById(productId);
            return new ResponseEntity<>(deletedId,
                    HttpStatus.OK);
        } catch (ObjectNotFound | DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    private ProductListResponse mapProductModelToProductListResponse(Page<ProductModel> page) {
        List<Product> productList = productOpenApiMapper.productModelListToProductList(page.getContent());
        //      Response return
        ProductListResponse productListResponse = new ProductListResponse();
        productListResponse.setProductList(productList);
        productListResponse.setTotalAmountOfPages(page.getTotalPages());
        productListResponse.setTotalAmountOfElements(page.getTotalElements());
        return productListResponse;
    }
}
