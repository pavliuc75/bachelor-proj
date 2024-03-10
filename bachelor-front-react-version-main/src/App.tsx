import React, { useEffect } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import Base from "./pages/Base";
import Account from "./pages/Account";
import CreateAccount from "./pages/CreateAccount";
import PageNotFound from "./pages/PageNotFound";
import NavigationBar from "./components/navigation-bar/NavigationBar";
import keycloak from "./authentication/keycloak";
import CLoadingOverlay from "./components/common/CLoadingOverlay";
import CSnackbar from "./components/common/CSnackbar";
import { useDispatch } from "react-redux";
import { fetchCurrentUserData, tryCreateSocialUser } from "./store/userSlice";
import BusinessManagementTool from "./pages/BusinessManagementTool";
import BusinessManagementToolEditBusinessPage from "./pages/BusinessManagementToolEditBusinessPage";
import BusinessManagementToolProducts from "./pages/BusinessManagementToolProducts";
import BusinessManagementToolOrders from "./pages/BusinessManagementToolOrders";
import BusinessManagementToolOther from "./pages/BusinessManagementToolOther";
import CreateBusinessPage from "./pages/CreateBusinessPage";
import AdministratorManagementTool from "./pages/AdministratorManagementTool";
import AdministratorManagementToolBusinessPages from "./pages/AdministratorManagementToolBusinessPages";
import AdministratorManagementToolCategories from "./pages/AdministratorManagementToolCategories";
import AdministratorManagementToolCreateBusinessPageRequests from "./pages/AdministratorManagementToolCreateBusinessPageRequests";
import AdministratorManagementToolCreateCategoryRequests from "./pages/AdministratorManagementToolCreateCategoryRequests";
import AdministratorManagementToolOrders from "./pages/AdministratorManagementToolOrders";
import AdministratorManagementToolStats from "./pages/AdministratorManagementToolStats";
import AdministratorManagementToolSupportDiscussions from "./pages/AdministratorManagementToolSupportDiscussions";
import Categories from "./pages/Categories";
import BusinessPages from "./pages/BusinessPages";
import BusinessPage from "./pages/BusinessPage";
import Search from "./pages/Search";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";
import Orders from "./pages/Orders";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Base />} />
        <Route
          path="/account"
          element={
            <RequireAuth>
              <Account />
            </RequireAuth>
          }
        />
        <Route
          path="/create-business-page"
          element={
            <RequireAuth>
              <CreateBusinessPage />
            </RequireAuth>
          }
        />
        <Route
          path="/cart"
          element={
            <RequireAuth>
              <Cart />
            </RequireAuth>
          }
        />
        <Route
          path="/favorites"
          element={
            <RequireAuth>
              <Favorites />
            </RequireAuth>
          }
        />
        <Route
          path="/orders"
          element={
            <RequireAuth>
              <Orders />
            </RequireAuth>
          }
        />
        <Route path="/categories" element={<Categories />}></Route>
        <Route path="/search" element={<Search />}></Route>
        <Route path="/business-pages" element={<BusinessPages />}></Route>
        <Route path="/business-page/:id" element={<BusinessPage />}></Route>
        <Route path="/product/:id" element={<Product />}></Route>
        <Route
          path="administrator-management-tool"
          element={
            <RequireAuth>
              <AdministratorManagementTool />
            </RequireAuth>
          }>
          <Route
            path="/administrator-management-tool/business-pages"
            element={<AdministratorManagementToolBusinessPages />}></Route>
          <Route
            path="/administrator-management-tool/categories"
            element={<AdministratorManagementToolCategories />}></Route>
          <Route
            path="/administrator-management-tool/create-business-page-requests"
            element={<AdministratorManagementToolCreateBusinessPageRequests />}></Route>
          <Route
            path="/administrator-management-tool/create-category-requests"
            element={<AdministratorManagementToolCreateCategoryRequests />}></Route>
          <Route path="/administrator-management-tool/orders" element={<AdministratorManagementToolOrders />}></Route>
          <Route path="/administrator-management-tool/stats" element={<AdministratorManagementToolStats />}></Route>
          <Route
            path="/administrator-management-tool/support-discussions"
            element={<AdministratorManagementToolSupportDiscussions />}></Route>
        </Route>
        <Route
          path="/business-management-tool"
          element={
            <RequireAuth>
              <BusinessManagementTool />
            </RequireAuth>
          }>
          <Route
            path="/business-management-tool/edit-business-page"
            element={<BusinessManagementToolEditBusinessPage />}></Route>
          <Route path="/business-management-tool/products" element={<BusinessManagementToolProducts />}></Route>
          <Route path="/business-management-tool/orders" element={<BusinessManagementToolOrders />}></Route>
          <Route path="/business-management-tool/other" element={<BusinessManagementToolOther />}></Route>
        </Route>
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  const dispatch = useDispatch();
  useEffect(() => {
    // @ts-ignore
    dispatch(fetchCurrentUserData());
  }, []);

  return (
    <div className="flex flex-col min-h-[100vh] max-w-full relative" id="app-wrapper">
      <CLoadingOverlay></CLoadingOverlay>
      <CSnackbar></CSnackbar>
      <NavigationBar />
      <Outlet />
    </div>
  );
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const dispatch = useDispatch();

  if (!keycloak.authenticated) {
    keycloak.login({
      // eslint-disable-next-line no-restricted-globals
      redirectUri: process.env.REACT_APP_URL + location.pathname,
    });
  } else {
    // @ts-ignore
    dispatch(tryCreateSocialUser());
    keycloak
      .updateToken(3000)
      .then(() => {
        return children;
      })
      .catch(() => {
        keycloak.login({
          // eslint-disable-next-line no-restricted-globals
          redirectUri: process.env.REACT_APP_URL + location.pathname,
        });
      });
  }

  return children;
}

export default App;
export const routePathsRequiringLimitedNavigationBar = ["/create-account"];
