import { useTranslation } from "react-i18next";

function PageNotFound() {
  const { t } = useTranslation();
  return (
    <div className="container flex self-center flex-col my-16">
      <h3>{t("pageNotFound")}</h3>
      <p className="mt-4">{t("sorryWeCannotFindThePage")}</p>
    </div>
  );
}

export default PageNotFound;
