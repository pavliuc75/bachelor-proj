import "../assets/styles/AdministratorManagementToolStats.scss";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "../store";
import { fetchGeneralStats } from "../store/administratorManagementToolSlice";

function AdministratorManagementToolStats() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { generalStats, isGeneralStatsLoading } = useSelector((state: RootState) => state.administratorManagementTool);

  if (!generalStats) {
    // @ts-ignore
    dispatch(fetchGeneralStats());
  }

  return (
    <div className={"flex flex-col grow"} data-css="AdministratorManagementToolStats">
      <h2 className="mb-10">{t("stats")}</h2>
      {isGeneralStatsLoading ? (
        <div className={"flex flex-col grow items-center justify-center"}>
          <h4 className="text-spun-pearl">{t("loading")}...</h4>
        </div>
      ) : generalStats ? (
        <table className={"max-w-sm"}>
          <tbody>
            <tr>
              <td>
                <p>{t("totalRevenue")}</p>
              </td>
              <td>
                <span className="label block">{generalStats.totalRevenue}</span>
              </td>
            </tr>
            <tr>
              <td>
                <p>{t("totalNumberOfOrders")}</p>
              </td>
              <td>
                <span className="label block">{generalStats.totalNumberOfOrders}</span>
              </td>
            </tr>
            <tr>
              <td>
                <p>{t("totalNumberOfCompletedOrders")}</p>
              </td>
              <td>
                <span className="label block">{generalStats.totalNumberOfCompletedOrders}</span>
              </td>
            </tr>
            <tr>
              <td>
                <p>{t("totalNumberOfInProgressOrders")}</p>
              </td>
              <td>
                <span className="label block">{generalStats.totalNumberOfInProgressOrders}</span>
              </td>
            </tr>
            <tr>
              <td>
                <p>{t("totalNumberOfProducts")}</p>
              </td>
              <td>
                <span className="label block">{generalStats.totalNumberOfProducts}</span>
              </td>
            </tr>
            <tr>
              <td>
                <p>{t("totalNumberOfCustomers")}</p>
              </td>
              <td>
                <span className="label block">{generalStats.totalNumberOfCustomers}</span>
              </td>
            </tr>
            <tr>
              <td>
                <p>{t("totalNumberOfBusinesses")}</p>
              </td>
              <td>
                <span className="label block">{generalStats.totalNumberOfBusinesses}</span>
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default AdministratorManagementToolStats;
