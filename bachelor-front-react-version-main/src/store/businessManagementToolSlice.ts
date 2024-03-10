import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "./index";
import { hideLoadingOverlay, showLoadingOverlay, showSnackbar } from "./eventSlice";
import { api } from "../service/apiClient";
import i18n from "i18next";
import {
  Business,
  BusinessApplication,
  BusinessApplicationReview,
  CreateBusinessApplicationRequest,
  CreateCategoryApplicationRequest,
  OrderStatus,
  OrderToFulfill,
  PatchOrderToFulfillProductStatusRequest,
  PatchOrderToFulfillStatusRequest,
  PatchProductRequest,
  PrivateBusinessAnalytics,
  Product,
  ProductRequest,
  UpdateBusinessApplicationRequest,
} from "../generated-sources/openapi";

export interface State {
  business: Business | undefined;
  businessApplication: BusinessApplication | undefined;
  businessApplicationReview: BusinessApplicationReview | undefined;
  products: Product[] | undefined;
  productsTotalPages: number;
  productsCurrentPage: number;
  orders: OrderToFulfill[] | undefined;
  ordersTotalPages: number;
  ordersCurrentPage: number;
  ordersCurrentFilter: OrderStatus | "ALL";
  businessAnalytics: PrivateBusinessAnalytics | undefined;
}

const initialState: State = {
  business: undefined,
  businessApplication: undefined,
  businessApplicationReview: undefined,
  products: [],
  productsTotalPages: 1,
  productsCurrentPage: 1,
  orders: [],
  ordersTotalPages: 1,
  ordersCurrentPage: 1,
  ordersCurrentFilter: "ALL",
  businessAnalytics: undefined,
};

export const businessManagementToolSlice = createSlice({
  name: "businessManagementTool",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<OrderToFulfill[] | undefined>) => {
      state.orders = action.payload;
    },
    setOrdersTotalPages: (state, action: PayloadAction<number | undefined>) => {
      state.ordersTotalPages = action.payload || 1;
    },
    setOrdersCurrentPage: (state, action: PayloadAction<number>) => {
      state.ordersCurrentPage = action.payload;
    },
    setOrdersCurrentFilter: (state, action: PayloadAction<OrderStatus | "ALL">) => {
      state.ordersCurrentFilter = action.payload;
    },
    updateOrderInOrders: (state, action: PayloadAction<OrderToFulfill>) => {
      const order = action.payload;
      let index = state.orders?.findIndex((o) => o.id === order.id);
      if (index !== -1) {
        // @ts-ignore
        state.orders?.splice(index, 1, order);
      }
    },

    setBusinessAnalytics: (state, action: PayloadAction<PrivateBusinessAnalytics | undefined>) => {
      state.businessAnalytics = action.payload;
    },

    setProducts: (state, action: PayloadAction<Product[] | undefined>) => {
      state.products = action.payload;
    },

    setProductsTotalPages: (state, action: PayloadAction<number | undefined>) => {
      state.productsTotalPages = action.payload || 1;
    },
    setProductsCurrentPage: (state, action: PayloadAction<number>) => {
      state.productsCurrentPage = action.payload;
    },

    setBusinessApplicationLegalName: (state, action: PayloadAction<string>) => {
      // @ts-ignore
      state.businessApplication.businessDescription.legalName = action.payload;
    },
    setBusinessApplicationBusinessEntityType: (state, action: PayloadAction<string>) => {
      // @ts-ignore
      state.businessApplication.businessDescription.businessEntityType = action.payload;
    },
    setBusinessApplicationUniqueIdentificationCode: (state, action: PayloadAction<string>) => {
      // @ts-ignore
      state.businessApplication.businessDescription.uniqueIdentificationCode = action.payload;
    },
    setBusinessApplicationTvaNumber: (state, action: PayloadAction<string>) => {
      // @ts-ignore
      state.businessApplication.businessDescription.tvaNumber = action.payload;
    },
    setBusinessApplicationCompanyDescription: (state, action: PayloadAction<string>) => {
      // @ts-ignore
      state.businessApplication.businessDescription.companyDescription = action.payload;
    },
    setBusinessApplicationIban: (state, action: PayloadAction<string>) => {
      // @ts-ignore
      state.businessApplication.businessPaymentDetails.iban = action.payload;
    },
    setBusinessApplicationBank: (state, action: PayloadAction<string>) => {
      // @ts-ignore
      state.businessApplication.businessPaymentDetails.bank = action.payload;
    },
    setBusinessApplicationSwiftCode: (state, action: PayloadAction<string>) => {
      // @ts-ignore
      state.businessApplication.businessPaymentDetails.swiftCode = action.payload;
    },
    setBusinessApplicationRegistrationCertificateKey: (state, action: PayloadAction<string>) => {
      // @ts-ignore
      state.businessApplication.businessLegalDocuments.registrationCertificateKey = action.payload;
    },
    setBusinessApplicationRegistrationCertificateFileUrl: (state, action: PayloadAction<string>) => {
      // @ts-ignore
      state.businessApplication.businessLegalDocuments.registrationCertificateFileUrl = action.payload;
    },
    setBusinessApplicationBankStatementFileKey: (state, action: PayloadAction<string>) => {
      // @ts-ignore
      state.businessApplication.businessLegalDocuments.bankStatementFileKey = action.payload;
    },
    setBusinessApplicationBankStatementFileUrl: (state, action: PayloadAction<string>) => {
      // @ts-ignore
      state.businessApplication.businessLegalDocuments.bankStatementFileUrl = action.payload;
    },
    setBankStatementFileUrl: (state, action: PayloadAction<string>) => {
      // @ts-ignore
      state.businessApplication.businessLegalDocuments.bankStatementFileUrl = action.payload;
    },
    setBusinessApplicationPhoneNumber: (state, action: PayloadAction<string>) => {
      // @ts-ignore
      state.businessApplication.businessContacts.phoneNumber = action.payload;
    },
    setBusinessApplicationEmail: (state, action: PayloadAction<string>) => {
      // @ts-ignore
      state.businessApplication.businessContacts.email = action.payload;
    },
    setBusinessApplicationAddress: (state, action: PayloadAction<string>) => {
      // @ts-ignore
      state.businessApplication.businessContacts.address = action.payload;
    },
    setBusinessApplicationWebsite: (state, action: PayloadAction<string>) => {
      // @ts-ignore
      state.businessApplication.businessContacts.website = action.payload;
    },
    setBusinessApplicationFacebook: (state, action: PayloadAction<string>) => {
      // @ts-ignore
      state.businessApplication.businessContacts.facebook = action.payload;
    },
    setBusinessApplicationInstagram: (state, action: PayloadAction<string>) => {
      // @ts-ignore
      state.businessApplication.businessContacts.instagram = action.payload;
    },
    setBusinessApplicationLogoKey: (state, action: PayloadAction<string>) => {
      // @ts-ignore
      state.businessApplication.businessLogo.logoKey = action.payload;
    },
    setBusinessApplicationLogoFileUrl: (state, action: PayloadAction<string>) => {
      // @ts-ignore
      state.businessApplication.businessLogo.logoFileUrl = action.payload;
    },
    setBusinessApplicationLogoFileKey: (state, action: PayloadAction<any>) => {
      state.business = action.payload;
    },
    setBusiness: (state, action: PayloadAction<Business | undefined>) => {
      state.business = action.payload;
    },
    setBusinessApplication: (state, action: PayloadAction<BusinessApplication | undefined>) => {
      state.businessApplication = action.payload;
    },
    setBusinessApplicationReview: (state, action: PayloadAction<BusinessApplicationReview | undefined>) => {
      state.businessApplicationReview = action.payload;
    },
    setDefaultBusinessApplicationProperties: (state) => {
      // @ts-ignore
      state.businessApplication = {
        businessDescription: {
          legalName: "",
          businessEntityType: "SRL",
          uniqueIdentificationCode: -1,
          tvaNumber: -1,
          companyDescription: undefined,
        },
        businessPaymentDetails: {
          iban: "",
          bank: "",
          swiftCode: "",
        },
        businessLegalDocuments: {
          registrationCertificateKey: "",
          registrationCertificateFileUrl: "",
          bankStatementFileKey: "",
          bankStatementFileUrl: "",
        },
        businessContacts: {
          phoneNumber: undefined,
          email: undefined,
          address: undefined,
          website: undefined,
          facebook: undefined,
          instagram: undefined,
        },
        businessLogo: {
          logoKey: "",
          logoFileUrl: "",
        },
      };
    },
  },
});

export const {
  setOrders,
  setOrdersTotalPages,
  setOrdersCurrentPage,
  setOrdersCurrentFilter,
  updateOrderInOrders,
  setBusinessAnalytics,
  setProducts,
  setProductsTotalPages,
  setProductsCurrentPage,
  setBusinessApplicationLegalName,
  setBusinessApplicationBusinessEntityType,
  setBusinessApplicationUniqueIdentificationCode,
  setBusinessApplicationTvaNumber,
  setBusinessApplicationCompanyDescription,
  setBusinessApplicationIban,
  setBusinessApplicationBank,
  setBusinessApplicationSwiftCode,
  setBusinessApplicationRegistrationCertificateKey,
  setBusinessApplicationRegistrationCertificateFileUrl,
  setBusinessApplicationBankStatementFileKey,
  setBusinessApplicationBankStatementFileUrl,
  setBankStatementFileUrl,
  setBusinessApplicationPhoneNumber,
  setBusinessApplicationEmail,
  setBusinessApplicationAddress,
  setBusinessApplicationWebsite,
  setBusinessApplicationFacebook,
  setBusinessApplicationInstagram,
  setBusinessApplicationLogoKey,
  setBusinessApplicationLogoFileUrl,
  setBusinessApplicationLogoFileKey,
  setBusiness,
  setBusinessApplication,
  setBusinessApplicationReview,
  setDefaultBusinessApplicationProperties,
} = businessManagementToolSlice.actions;

export default businessManagementToolSlice.reducer;

export const fetchOrders = (page: number) => (dispatch: AppDispatch, state: () => RootState) => {
  dispatch(showLoadingOverlay({ isInstant: true }));
  return api.privateApi
    .getOrderToFulfillList(
      6,
      page - 1,
      // @ts-ignore
      state().businessManagementTool.ordersCurrentFilter === "ALL"
        ? undefined
        : state().businessManagementTool.ordersCurrentFilter
    )
    .then((response) => {
      dispatch(setOrders(response.data.orderList));
      dispatch(setOrdersCurrentPage(page));
      dispatch(setOrdersTotalPages(response.data.totalAmountOfPages));
    })
    .catch(() =>
      dispatch(
        showSnackbar({
          message: i18n.t("failedToLoadOrders"),
          type: "error",
        })
      )
    )
    .finally(() => dispatch(hideLoadingOverlay()));
};

export const updateOrderStatus =
  (patchOrderToFulfillStatusRequest: PatchOrderToFulfillStatusRequest) =>
  (dispatch: AppDispatch, state: () => RootState) => {
    dispatch(showLoadingOverlay({ isInstant: true }));
    return api.privateApi
      .patchOrderToFulfillStatus(patchOrderToFulfillStatusRequest)
      .then((response) => dispatch(updateOrderInOrders(response.data)))
      .catch(() =>
        dispatch(
          showSnackbar({
            message: i18n.t("failedToUpdateOrderStatus"),
            type: "error",
          })
        )
      )
      .finally(() => dispatch(hideLoadingOverlay()));
  };

export const updateProductStatus =
  (patchOrderToFulfillProductStatusRequest: PatchOrderToFulfillProductStatusRequest) =>
  (dispatch: AppDispatch, state: () => RootState) => {
    dispatch(showLoadingOverlay({ isInstant: true }));
    return api.privateApi
      .patchOrderToFulfillProductStatus(patchOrderToFulfillProductStatusRequest)
      .then((response) => dispatch(updateOrderInOrders(response.data)))
      .catch(() =>
        dispatch(
          showSnackbar({
            message: i18n.t("failedToUpdateProductStatus"),
            type: "error",
          })
        )
      )
      .finally(() => dispatch(hideLoadingOverlay()));
  };

export const sendCreateCategoryRequest =
  (createCategoryApplicationRequest: CreateCategoryApplicationRequest) => (dispatch: AppDispatch) => {
    dispatch(showLoadingOverlay({ isInstant: true }));
    return api.privateApi
      .createCategoryApplication(createCategoryApplicationRequest)
      .finally(() => dispatch(hideLoadingOverlay()));
  };

export const uploadCompanyLogo = (logo: File) => (dispatch: AppDispatch) => {
  dispatch(showLoadingOverlay({ isInstant: true }));
  return api.privateApi
    .uploadCompanyLogo(logo)
    .then((response) => {
      dispatch(setBusinessApplicationLogoKey(response.data.logoKey));
      dispatch(setBusinessApplicationLogoFileUrl(response.data.logoFileUrl));
    })
    .finally(() => dispatch(hideLoadingOverlay()));
};

export const uploadLegalDocuments = (registrationCertificate: File, bankStatement: File) => (dispatch: AppDispatch) => {
  return api.privateApi.uploadLegalDocuments(registrationCertificate, bankStatement);
};

export const createBusinessApplication =
  (createBusinessApplicationRequest: CreateBusinessApplicationRequest) =>
  (dispatch: AppDispatch, state: () => RootState) => {
    return api.privateApi.createBusinessApplication(createBusinessApplicationRequest);
  };

export const fetchCurrentUserBusinessData = () => (dispatch: AppDispatch) => {
  return api.privateApi
    .getCurrentUserBusinessInfo()
    .then((response) => {
      dispatch(setBusiness(response.data.business));
      dispatch(setBusinessApplication(response.data.businessApplication));
      dispatch(setBusinessApplicationReview(response.data.businessApplicationReview));
      // @ts-ignore
      dispatch(setBusinessApplicationPhoneNumber("0" + response.data.businessApplication.businessContacts.phoneNumber));
    })
    .catch(() => {
      dispatch(
        showSnackbar({
          message: i18n.t("somethingWentWrong"),
          type: "error",
        })
      );
      throw {};
    })
    .finally(() => dispatch(hideLoadingOverlay()));
};

export const updateBusinessApplication =
  (updateBusinessApplicationRequest: UpdateBusinessApplicationRequest) => (dispatch: AppDispatch) => {
    return api.privateApi
      .updateBusinessApplication(updateBusinessApplicationRequest)
      .then((response) => dispatch(setBusinessApplication(response.data)));
  };

export const fetchProducts = (page: number) => (dispatch: AppDispatch, state: () => RootState) => {
  dispatch(showLoadingOverlay({ isInstant: true }));
  return (
    api.privateApi
      // @ts-ignore
      .getProductsByBusiness(6, page - 1, state().businessManagementTool.business.id)
      .then((response) => {
        dispatch(setProductsCurrentPage(page));
        dispatch(setProductsTotalPages(response.data.totalAmountOfPages));
        dispatch(setProducts(response.data.productList));
      })
      .catch(() =>
        dispatch(
          showSnackbar({
            message: i18n.t("somethingWentWrong"),
            type: "error",
          })
        )
      )
      .finally(() => dispatch(hideLoadingOverlay()))
  );
};

export const uploadProductImage = (file: File) => (dispatch: AppDispatch) => {
  dispatch(showLoadingOverlay({ isInstant: true }));
  return api.privateApi.uploadProductImage(file).finally(() => dispatch(hideLoadingOverlay()));
};

export const createProduct = (productRequest: ProductRequest) => (dispatch: AppDispatch) => {
  dispatch(showLoadingOverlay({ isInstant: true }));
  return api.privateApi.createProduct(productRequest).finally(() => dispatch(hideLoadingOverlay()));
};

export const updateProduct = (patchProductRequest: PatchProductRequest) => (dispatch: AppDispatch) => {
  dispatch(showLoadingOverlay({ isInstant: true }));
  return api.privateApi.patchProduct(patchProductRequest).finally(() => dispatch(hideLoadingOverlay()));
};

export const deleteProduct = (productId: string) => (dispatch: AppDispatch) => {
  dispatch(showLoadingOverlay({ isInstant: true }));
  return api.privateApi.deleteProductById(productId).finally(() => dispatch(hideLoadingOverlay()));
};

export const fetchBusinessAnalytics = () => (dispatch: AppDispatch) => {
  return api.privateApi
    .getPrivateBusinessAnalytics()
    .then((response) => dispatch(setBusinessAnalytics(response.data)))
    .catch(() =>
      dispatch(
        showSnackbar({
          message: i18n.t("failedToLoadBusinessAnalytics"),
          type: "error",
        })
      )
    );
};
