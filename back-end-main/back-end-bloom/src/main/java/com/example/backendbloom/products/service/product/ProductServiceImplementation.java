package com.example.backendbloom.products.service.product;

import com.backendbloom.openapi.model.FilterProductBy;
import com.backendbloom.openapi.model.SortProductBy;
import com.example.backendbloom.business.service.aw3s.AWSFileService;
import com.example.backendbloom.commons.configuration.aws.ProductsS3BucketStructure;
import com.example.backendbloom.commons.configuration_propereties.cloud.AWSS3Buckets;
import com.example.backendbloom.commons.exception_handler.exception.ObjectNotFound;
import com.example.backendbloom.commons.exception_handler.exception.ValueNotPositive;
import com.example.backendbloom.commons.util.ValidationUtil;
import com.example.backendbloom.products.exception_handler.exception.NullImageKey;
import com.example.backendbloom.products.exception_handler.exception.ProductImageNotFound;
import com.example.backendbloom.commons.exception_handler.exception.ValueNotGreaterThanZero;
import com.example.backendbloom.products.model.product.ProductImageModel;
import com.example.backendbloom.products.model.product.ProductModel;
import com.example.backendbloom.products.model.product.ProductRatingModel;
import com.example.backendbloom.products.repository.ProductRatingRepository;
import com.example.backendbloom.products.repository.ProductRepository;
import com.example.backendbloom.products.repository.SearchProductRepository;
import com.example.backendbloom.products.service.category.CategoryService;
import com.example.backendbloom.user.exception_handler.exception.UserNotHaveBusiness;
import com.example.backendbloom.user.model.AppUserModel;
import com.example.backendbloom.user.model.AppUserRole;
import com.example.backendbloom.user.service.user.AppUserService;
import com.example.backendbloom.user.service.user.UserBusinessService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImplementation implements ProductService {
    private final AppUserService appUserService;

    private final AWSFileService fileService;
    private final AWSS3Buckets awss3Bucket;
    private final ProductRepository productRepository;
    private final UserBusinessService userBusinessService;
    private final CategoryService categoryService;
    private final SearchProductRepository searchProductRepository;
    private final ProductRatingRepository productRatingRepository;

    @Override

    public String[] uploadProductImage(MultipartFile image) throws Exception {
        AppUserModel currentUser = appUserService.getCurrentUser();
        String userUsername = currentUser.getEmail();
        ProductsS3BucketStructure awss3BucketStructure = awss3Bucket.getProductsS3BucketStructure();
        String s3BucketFolderName = awss3BucketStructure.buildProductsPath(userUsername);
            return fileService.uploadFile(awss3Bucket.getProduct(),
                    s3BucketFolderName,
                    UUID.randomUUID().toString(), image);


    }

    @Override
    public Page<ProductModel> getProductList(int pageSize, int pageNumber, String businessId) throws ValueNotPositive, ValueNotGreaterThanZero {
        ValidationUtil.validatePagination(pageSize, pageNumber);
        if (businessId == null || businessId.length() == 0) {
            return productRepository.findBy(PageRequest.of(pageNumber, pageSize));
        }
        return productRepository.findBy(businessId, PageRequest.of(pageNumber, pageSize));
    }

    public List<ProductModel> getProductsByBusinessId(String businessId) {
        return productRepository.findBy(businessId);
    }

    @Override
    public ProductModel createProduct(ProductModel productModel) throws Exception {
        String userBusinessId = userBusinessService.getUserBusinessId();
        productModel.setBelongsToBusinessId(userBusinessId);
        validateProduct(productModel);
        if (productModel.getAdditionalImages() == null) {
            productModel.setAdditionalImages(new ArrayList<>());
        }
        productModel.setRating(productRatingRepository.save(new ProductRatingModel()));
        return productRepository.save(productModel);
    }

    @Override
    public ProductModel patchProduct(ProductModel product) throws Exception, UserNotHaveBusiness, ObjectNotFound {
//        Validate product ownership(if it belongs to the user's business)
        validateProductBelongsToUserBusiness(product);
        ProductModel productModel = findProductById(product.getId());
        productModel.setName(product.getName());
        productModel.setPrice(product.getPrice());
        productModel.setCategoryId(product.getCategoryId());
        productModel.setDescription(product.getDescription());
        productModel.setStockAmount(product.getStockAmount());
        productModel.setMainImage(product.getMainImage());
        productModel.setAdditionalImages(product.getAdditionalImages());
        validateProduct(productModel);
        return productRepository.save(productModel);
    }

    private void validateProductBelongsToUserBusiness(ProductModel product) throws ObjectNotFound {
        String userBusinessId = userBusinessService.getUserBusinessId();
        List<ProductModel> fetchedProductList = getProductsByBusinessId(userBusinessId);
        if (fetchedProductList.isEmpty()) {
            throw new ObjectNotFound("Product", product.getId());
        }
        boolean productFound = false;
        for (ProductModel fetchedProduct : fetchedProductList) {
            if (fetchedProduct.getId().equals(product.getId())) {
                productFound = true;
                break;
            }
        }
        if (!productFound) {
            throw new ObjectNotFound("Product", product.getId());
        }
    }

    @Override
    public ProductModel findProductById(String id) {
        Optional<ProductModel> foundProduct = productRepository.findById(id);
        if (foundProduct.isPresent())
            return foundProduct.get();
        else throw new ObjectNotFound("Product", id);
    }

    @Override
    public String deleteProductById(String productId) throws ObjectNotFound {
        ProductModel foundProduct = findProductById(productId);
        Set<String> userRoles = appUserService.getCurrentUserRoles();
        boolean userIsAdmin = false;
        for (String userRole : userRoles) {
            if (userRole.equals(AppUserRole.Names.ADMIN)) {
                userIsAdmin = true;
                break;
            }
        }
        if (!userIsAdmin) {
            validateProductBelongsToUserBusiness(foundProduct);
        }
        productRepository.delete(foundProduct);
        return productId;
    }

    @Override
    public List<ProductModel> searchAutocompleteProduct(String text, int limitResults) {
        return searchProductRepository.autocompleteByProductName(text, limitResults);
    }

    /**
     * Search products by texts(name, business name, category name, description)
     *
     * @param text
     * @param filterBy
     * @return
     */
    @Override
    public List<ProductModel> searchProduct(String text, SortProductBy sort_product, FilterProductBy filterBy) {
        List<ProductModel> foundProd = searchProductRepository.searchProductsByNameOrDescription(text);
        if (sort_product != null) {
            sortProducts(foundProd, sort_product);
        }
        if (filterBy != null) {
            foundProd = filterProducts(foundProd, filterBy);
        }
        return foundProd;
    }

    @Override
    public ProductModel getProductById(String id) throws ObjectNotFound {
        Optional<ProductModel> productModel = productRepository.findById(id);
        if (productModel.isPresent())
            return productModel.get();
        else throw new ObjectNotFound("Product", id);
    }

    @Override
    public void decreaseProductStockAmount(String productId, int amountToDecrease) {
        ProductModel fetchedProduct = getProductById(productId);
        int newStockAmount = fetchedProduct.getStockAmount() - amountToDecrease;
        fetchedProduct.setStockAmount(newStockAmount);
        productRepository.save(fetchedProduct);
    }

    @Override
    public ProductModel updateProduct(ProductModel productModel) {
        return productRepository.save(productModel);
    }

    @Override
    public List<ProductModel> getAllProducts() {
        return productRepository.findAll();
    }

    private List<ProductModel> filterProducts(List<ProductModel> foundProd, FilterProductBy filterBy) {
        List<ProductModel> listToFilter = new ArrayList<>(foundProd);
        List<ProductModel> filteredListToReturn = new ArrayList<>();
//        Filter by category
        if (filterBy.getCategory() != null) {
            for (String categoryId : filterBy.getCategory()) {
                Predicate<ProductModel> filterCategory = e -> e.getCategoryId().equals(categoryId);
                filteredListToReturn.addAll(listToFilter.stream()
                        .filter(filterCategory)
                        .collect(Collectors.toList()));
            }
        }
//        use already filtered list for following filter stages
        if (!filteredListToReturn.isEmpty()) {
            listToFilter = new ArrayList<>(filteredListToReturn);
        }
        //        Filter by stock

        if (filterBy.getInStock() != null) {
            if (filterBy.getInStock()) {
                Predicate<ProductModel> productInStock = e -> e.getStockAmount() > 0;
                filteredListToReturn = (listToFilter.stream()
                        .filter(productInStock)
                        .collect(Collectors.toList()));
            } else {
                Predicate<ProductModel> productOutOfStock = e -> e.getStockAmount() == 0;
                filteredListToReturn = (listToFilter.stream()
                        .filter(productOutOfStock)
                        .collect(Collectors.toList()));
            }
        }
        return filteredListToReturn;
    }

    private List<ProductModel> sortProducts(List<ProductModel> foundProd, SortProductBy sort_product) {
        switch (sort_product) {
            case PRICE_ASC:
                foundProd.sort(Comparator.comparing(ProductModel::getPrice));
                break;
            case PRICE_DSC:
                foundProd.sort(Comparator.comparing(ProductModel::getPrice).reversed());
                break;
            case NAME_ASC:
                foundProd.sort(Comparator.comparing(ProductModel::getName));
                break;
            case NAME_DSC:
                foundProd.sort(Comparator.comparing(ProductModel::getName).reversed());
                break;
            case TOTAL_SOLD_ASC:
                foundProd.sort(Comparator.comparing(ProductModel::getTotalSold));
                break;
            case TOTAL_SOLD_DSC:
                foundProd.sort(Comparator.comparing(ProductModel::getTotalSold).reversed());
                break;
            case RATING_ASC:
                Comparator<ProductModel> compareRatingAsc
                        = Comparator.comparing(ProductModel -> ProductModel.getRating().getOverallRating());
                foundProd.sort(compareRatingAsc);
                break;
            case RATING_DSC:
                Comparator<ProductModel> compareRatingDsc
                        = Comparator.comparing(ProductModel -> ProductModel.getRating().getOverallRating());
                foundProd.sort(compareRatingDsc.reversed());
                break;
        }
        return foundProd;
    }

    private void validateProduct(ProductModel productModel) throws Exception, NullImageKey {
        // TODO: Validate business status
        if (productModel.getStockAmount() <= 0) {
            throw new ValueNotGreaterThanZero("Stock Amount");
        }
//        check if price is greater then zero
        if (productModel.getPrice().signum() != 1) {
            throw new ValueNotGreaterThanZero("Price");
        }
// validate category existence
        categoryService.getCategoryById(productModel.getCategoryId());
//        Validate image existence
        validateImage(productModel.getMainImage());
        if (productModel.getAdditionalImages() != null) {
            for (ProductImageModel image : productModel.getAdditionalImages()) {
                validateImage(image);
            }
        }
    }

    /**
     * Validated if image is present in S3 bucket
     *
     * @param image
     * @throws Exception
     */
    private void validateImage(ProductImageModel image) throws Exception, NullImageKey {
        if (image.getImageKey() == null) {
            throw new NullImageKey();
        }
        String imageKey = image.getImageKey();
        boolean isObjectExist = fileService.doesObjectExist(awss3Bucket.getProduct(), imageKey);
        if (!isObjectExist) {
            throw new ProductImageNotFound(imageKey);
        }
    }
}
