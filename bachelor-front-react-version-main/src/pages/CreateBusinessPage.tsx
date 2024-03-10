import { useTranslation } from "react-i18next";
import EditBusinessPage from "../components/edit-business-page/EditBusinessPage";

function CreateBusinessPage() {
  const { t } = useTranslation();
  return (
    <main className={"container flex self-center flex-col my-16 max-w-3xl"}>
      <h1 className="mb-10">{t("createBusinessPage")}</h1>
      <EditBusinessPage isCreate={true}></EditBusinessPage>
    </main>
  );
}

export default CreateBusinessPage;
