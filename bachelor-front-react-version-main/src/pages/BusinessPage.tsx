import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { RootState } from "../store";
import "../assets/styles/BusinessPage.scss";
import {
  fetchBusinessPage,
  fetchBusinessProducts,
  fetchPublicBusinessAnalytics,
  setBusinessPage,
} from "../store/businessSlice";
import CPathRepresentation from "../components/common/CPathRepresentation";
import CImageWithFallback from "../components/common/CImageWithFallback";
import CButtonSecondary from "../components/common/CButtonSecondary";
import { dateFormatterHelper } from "../utils/dateFormatterHelper";
import ProductsGrid from "../components/products-grid/ProductsGrid";

function BusinessPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { id } = useParams();

  const {
    businessPage,
    businessPages,
    businessProducts,
    businessAnalytics,
    isBusinessProductsLoading,
    totalBusinessProductsOnServer,
  } = useSelector((state: RootState) => state.business);

  const cPathRepresentationData = [
    {
      route: "/business-pages",
      name: t("allCompanies") || "",
    },
    {
      name: businessPage?.businessDescription.legalName || "",
    },
  ];

  useEffect(() => {
    doOnCreate();
  }, [id]);

  function doOnCreate() {
    if (id !== businessPage?.id) {
      let businessPageFromBusinessPages = (businessPages || []).find((businessPage) => businessPage.id === id);
      if (businessPageFromBusinessPages) {
        dispatch(setBusinessPage(businessPageFromBusinessPages));
        fetchBusinessProductsIfNecessary();
      } else {
        // @ts-ignore
        dispatch(fetchBusinessPage(id)).then(() => fetchBusinessProductsIfNecessary());
      }
    } else {
      fetchBusinessProductsIfNecessary();
    }
    fetchBusinessAnalyticsIfNecessary();
  }

  function fetchBusinessProductsIfNecessary() {
    if ((businessProducts || []).some((product) => product.belongsToBusinessId === businessPage?.id)) {
      return;
    }
    // @ts-ignore
    dispatch(fetchBusinessProducts(true));
  }

  function fetchBusinessAnalyticsIfNecessary() {
    if (businessAnalytics?.belongsToBusinessId !== id) {
      // @ts-ignore
      dispatch(fetchPublicBusinessAnalytics(id));
    }
  }

  function handleLoadMoreButtonClicked() {
    // @ts-ignore
    dispatch(fetchBusinessProducts(false));
  }

  return (
    <>
      {businessPage?.id === id && (
        <div data-css="BusinessPage" className={"flex flex-col grow"}>
          <div className={"container flex self-center"}>
            <CPathRepresentation className={"mt-3"} directories={cPathRepresentationData}></CPathRepresentation>
          </div>
          <div className="border-b border-mid-gray border-solid mt-3"></div>
          <div className="container flex self-center flex-col my-16">
            <CImageWithFallback
              src={businessPage?.businessLogo?.logoFileUrl}
              className={"w-[144px] object-cover rounded-lg aspect-square"}></CImageWithFallback>
            <h1 className="mt-10" data-cy="company-header">
              {businessPage?.businessDescription.legalName}
            </h1>
          </div>
          <div className="container flex self-center flex-col sm:flex-row mb-20 gap-x-20 gap-y-16">
            <div className="flex basis-2/3 flex-col">
              {businessPage?.businessDescription.companyDescription && (
                <h4 className={"mb-4"}>{t("aboutTheCompany")}</h4>
              )}
              {businessPage?.businessDescription.companyDescription && (
                <p className={"mb-16"}>{businessPage.businessDescription.companyDescription}</p>
              )}
              {(businessPage?.businessContacts?.website ||
                businessPage?.businessContacts?.facebook ||
                businessPage?.businessContacts?.instagram) && <h4 className={"mb-4"}>{t("socialMedia")}</h4>}
              {(businessPage?.businessContacts?.website ||
                businessPage?.businessContacts?.facebook ||
                businessPage?.businessContacts?.instagram) && (
                <ul className={"mb-16 flex flex-col self-start gap-2"}>
                  {businessPage.businessContacts?.website && (
                    <li>
                      <a href={businessPage.businessContacts?.website} target="_blank" rel="noreferrer">
                        <CButtonSecondary text={t("website")} size={"medium"}></CButtonSecondary>
                      </a>
                    </li>
                  )}
                  {businessPage.businessContacts?.facebook && (
                    <li>
                      <a href={businessPage.businessContacts?.facebook} target="_blank" rel="noreferrer">
                        <CButtonSecondary text={t("facebook")} size={"medium"}></CButtonSecondary>
                      </a>
                    </li>
                  )}
                  {businessPage.businessContacts?.instagram && (
                    <li>
                      <a href={businessPage.businessContacts?.instagram} target="_blank" rel="noreferrer">
                        <CButtonSecondary text={t("instagram")} size={"medium"}></CButtonSecondary>
                      </a>
                    </li>
                  )}
                </ul>
              )}
              <h4 className="mb-4">{t("contact")}</h4>
              <div className="flex flex-start">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <p>{t("phoneNumber")}</p>
                      </td>
                      <td>
                        <a href={`tel:0${businessPage?.businessContacts?.phoneNumber}`}>
                          <CButtonSecondary
                            text={"0" + businessPage?.businessContacts?.phoneNumber}
                            size={"medium"}></CButtonSecondary>
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>{t("email")}</p>
                      </td>
                      <td>
                        <a href={`mailto:${businessPage?.businessContacts?.email}`}>
                          <CButtonSecondary
                            text={businessPage?.businessContacts?.email || ""}
                            size={"medium"}></CButtonSecondary>
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>{t("address")}</p>
                      </td>
                      <td>
                        <a
                          href={"https://maps.google.com/?q=" + businessPage?.businessContacts?.address}
                          target="_blank"
                          rel="noreferrer">
                          <CButtonSecondary
                            text={businessPage?.businessContacts?.address || ""}
                            size={"medium"}
                            className={"text-start"}></CButtonSecondary>
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {businessAnalytics && (
              <div className={"flex flex-col basis-1/3"}>
                <h4 className="mb-4">{t("details")}</h4>
                <ul className="flex flex-col gap-2">
                  {businessPage?.createdDate && (
                    <li>
                      <p>
                        {t("joined")}
                        {dateFormatterHelper.getDatePartOfDateAsString(businessPage.createdDate)}
                      </p>
                    </li>
                  )}
                  <li>
                    <p>
                      {t("soldNProductsInTotal", {
                        n: businessAnalytics.soldProductsTotal,
                      })}
                    </p>
                  </li>
                  <li>
                    <p>
                      {t("averageProductRatingIs")}
                      {businessAnalytics.averageProductRating}
                    </p>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="container self-center mb-8">
            <h3>{t("companyProducts")}</h3>
          </div>
          <div className="border-b border-solid border-mid-gray"></div>
          <ProductsGrid
            className={"mb-16"}
            isToolBarShown={false}
            onLoadMore={handleLoadMoreButtonClicked}
            products={businessProducts || []}
            loading={isBusinessProductsLoading}
            productsInTotal={totalBusinessProductsOnServer}>
            <div></div>
          </ProductsGrid>
        </div>
      )}
    </>
  );
}

export default BusinessPage;
