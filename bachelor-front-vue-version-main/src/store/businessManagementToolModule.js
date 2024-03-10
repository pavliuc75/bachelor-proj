import { api } from "@/service/apiClient";
import i18n from "@/translations/i18n";

const state = {
  business: null, businessApplication: null, businessApplicationReview: null,
  products: [], productsTotalPages: 1, productsCurrentPage: 1,

  orders: [], ordersTotalPages: 1, ordersCurrentPage: 1, ordersCurrentFilter: "ALL",

  businessAnalytics: null,
};

const getters = {};

const actions = {
  fetchOrders({ commit, dispatch, state }, page) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi.getOrderToFulfillList(6, page - 1, state.ordersCurrentFilter === "ALL" ? undefined : state.ordersCurrentFilter)
      .then(response => {
        commit("setOrders", response.data.orderList);
        commit("setOrdersCurrentPage", page);
        commit("setOrdersTotalPages", response.data.totalAmountOfPages);
      })
      .catch(() => dispatch("eventModule/showSnackbar", {
        message: i18n.t("failedToLoadOrders"), type: "error"
      }, { root: true }))
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  },
  updateOrderStatus({ commit, dispatch, state }, patchOrderToFulfillStatusRequest) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi.patchOrderToFulfillStatus(patchOrderToFulfillStatusRequest)
      .then((response) => commit("updateOrderInOrders", response.data))
      .catch(() => dispatch("eventModule/showSnackbar", {
        message: i18n.t("failedToUpdateOrderStatus"),
        type: "error"
      }, { root: true }))
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  },
  updateProductStatus({ commit, dispatch, state }, patchOrderToFulfillProductStatusRequest) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi.patchOrderToFulfillProductStatus(patchOrderToFulfillProductStatusRequest)
      .then((response) => commit("updateOrderInOrders", response.data))
      .catch(() => dispatch("eventModule/showSnackbar", {
        message: i18n.t("failedToUpdateProductStatus"),
        type: "error"
      }, { root: true }))
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  },
  sendCreateCategoryRequest({ dispatch }, createCategoryApplicationRequest) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi.createCategoryApplication(createCategoryApplicationRequest)
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  },
  uploadCompanyLogo({ commit, dispatch }, logo) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi.uploadCompanyLogo(logo)
      .then((response) => {
        commit("setBusinessApplicationLogoKey", response.data.logoKey);
        commit("setBusinessApplicationLogoFileUrl", response.data.logoFileUrl);
      })
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  }, uploadLegalDocuments({ commit }, { registrationCertificate, bankStatement }) {
    return api.privateApi.uploadLegalDocuments(registrationCertificate, bankStatement);
  }, createBusinessApplication({ commit, dispatch }, createBusinessApplicationRequest) {
    return api.privateApi.createBusinessApplication(createBusinessApplicationRequest);
  }, fetchCurrentUserBusinessData({ commit, dispatch }) {
    return api.privateApi.getCurrentUserBusinessInfo()
      .then((response) => {
        commit("setBusiness", response.data.business);
        commit("setBusinessApplication", response.data.businessApplication);
        commit("setBusinessApplicationPhoneNumber", "0" + response.data.businessApplication.businessContacts.phoneNumber);
        commit("setBusinessApplicationReview", response.data.businessApplicationReview);
      })
      .catch(() => {
        dispatch("eventModule/showSnackbar", {
          message: i18n.t("somethingWentWrong"), type: "error"
        }, { root: true });
        throw {};
      })
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  },
  updateBusinessApplication({ commit, dispatch }, updateBusinessApplicationRequest) {
    return api.privateApi.updateBusinessApplication(updateBusinessApplicationRequest)
      .then((response) => commit("setBusinessApplication", response.data));
  }, fetchProducts({ commit, dispatch, state }, page) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi
      .getProductsByBusiness(6, page - 1, state.business.id)
      .then((response) => {
        commit("setProductsCurrentPage", page);
        commit("setProductsTotalPages", response.data.totalAmountOfPages);
        commit("setProducts", response.data.productList);
      })
      .catch(() => dispatch("eventModule/showSnackbar", {
        message: i18n.t("somethingWentWrong"), type: "error"
      }, { root: true }))
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  }, uploadProductImage({ dispatch }, file) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi.uploadProductImage(file)
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  }, createProduct({ dispatch }, productRequest) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi.createProduct(productRequest)
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  }, updateProduct({ dispatch }, patchProductRequest) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi.patchProduct(patchProductRequest)
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  },
  deleteProduct({ dispatch }, productId) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi.deleteProductById(productId)
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  },
  fetchBusinessAnalytics({ commit, dispatch, state }) {
    return api.privateApi.getPrivateBusinessAnalytics()
      .then((response) => commit("setBusinessAnalytics", response.data))
      .catch(() => dispatch("eventModule/showSnackbar", {
        message: i18n.t("failedToLoadBusinessAnalytics"), type: "error"
      }, { root: true }))
  }
};

const mutations = {
  setOrders: (state, orders) => state.orders = orders,
  setOrdersTotalPages: (state, totalPages) => state.ordersTotalPages = totalPages,
  setOrdersCurrentPage: (state, currentPage) => state.ordersCurrentPage = currentPage,
  setOrdersCurrentFilter: (state, currentFilter) => state.ordersCurrentFilter = currentFilter,
  updateOrderInOrders: (state, order) => {
    let index = state.orders.findIndex(o => o.id === order.id);
    if (index !== -1) {
      state.orders.splice(index, 1, order);
    }
  },
  setBusinessAnalytics: (state, businessAnalytics) => state.businessAnalytics = businessAnalytics,

  setProducts: (state, products) => state.products = products,
  setProductsTotalPages: (state, totalPages) => state.productsTotalPages = totalPages,
  setProductsCurrentPage: (state, currentPage) => state.productsCurrentPage = currentPage,

  setBusinessApplicationLegalName: (state, legalName) => (state.businessApplication.businessDescription.legalName = legalName),
  setBusinessApplicationBusinessEntityType: (state, businessEntityType) => (state.businessApplication.businessDescription.businessEntityType = businessEntityType),
  setBusinessApplicationUniqueIdentificationCode: (state, uniqueIdentificationCode) => (state.businessApplication.businessDescription.uniqueIdentificationCode = uniqueIdentificationCode),
  setBusinessApplicationTvaNumber: (state, tvaNumber) => (state.businessApplication.businessDescription.tvaNumber = tvaNumber),
  setBusinessApplicationCompanyDescription: (state, companyDescription) => (state.businessApplication.businessDescription.companyDescription = companyDescription),
  setBusinessApplicationIban: (state, iban) => (state.businessApplication.businessPaymentDetails.iban = iban),
  setBusinessApplicationBank: (state, bank) => (state.businessApplication.businessPaymentDetails.bank = bank),
  setBusinessApplicationSwiftCode: (state, swiftCode) => (state.businessApplication.businessPaymentDetails.swiftCode = swiftCode),
  setBusinessApplicationRegistrationCertificateKey: (state, registrationCertificateKey) => (state.businessApplication.businessLegalDocuments.registrationCertificateKey = registrationCertificateKey),
  setBusinessApplicationRegistrationCertificateFileUrl: (state, registrationCertificateFileUrl) => (state.businessApplication.businessLegalDocuments.registrationCertificateFileUrl = registrationCertificateFileUrl),
  setBusinessApplicationBankStatementFileKey: (state, bankStatementFileKey) => (state.businessApplication.businessLegalDocuments.bankStatementFileKey = bankStatementFileKey),
  setBusinessApplicationBankStatementFileUrl: (state, bankStatementFileUrl) => (state.businessApplication.businessLegalDocuments.bankStatementFileUrl = bankStatementFileUrl),
  setBusinessApplicationPhoneNumber: (state, phoneNumber) => (state.businessApplication.businessContacts.phoneNumber = phoneNumber),
  setBusinessApplicationEmail: (state, email) => (state.businessApplication.businessContacts.email = email),
  setBusinessApplicationAddress: (state, address) => (state.businessApplication.businessContacts.address = address),
  setBusinessApplicationWebsite: (state, website) => (state.businessApplication.businessContacts.website = website),
  setBusinessApplicationFacebook: (state, facebook) => (state.businessApplication.businessContacts.facebook = facebook),
  setBusinessApplicationInstagram: (state, instagram) => (state.businessApplication.businessContacts.instagram = instagram),
  setBusinessApplicationLogoKey: (state, logoKey) => (state.businessApplication.businessLogo.logoKey = logoKey),
  setBusinessApplicationLogoFileUrl: (state, logoFileUrl) => (state.businessApplication.businessLogo.logoFileUrl = logoFileUrl),
  setBusiness: (state, business) => (state.business = business),
  setBusinessApplication: (state, businessApplication) => (state.businessApplication = businessApplication),
  setBusinessApplicationReview: (state, businessApplicationReview) => (state.businessApplicationReview = businessApplicationReview),
  setDefaultBusinessApplicationProperties: (state) => {
    state.businessApplication = {
      businessDescription: {
        legalName: null,
        businessEntityType: "SRL",
        uniqueIdentificationCode: null,
        tvaNumber: null,
        companyDescription: null
      }, businessPaymentDetails: {
        iban: null, bank: null, swiftCode: null
      }, businessLegalDocuments: {
        registrationCertificateKey: null,
        registrationCertificateFileUrl: null,
        bankStatementFileKey: null,
        bankStatementFileUrl: null
      }, businessContacts: {
        phoneNumber: null, email: null, address: null, website: null, facebook: null, instagram: null
      }, businessLogo: {
        logoKey: null, logoFileUrl: null
      }
    };
  }
};

export default {
  namespaced: true, state, getters, actions, mutations
};
