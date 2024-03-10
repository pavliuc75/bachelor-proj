import { stringFormatterHelper } from "../../utils/stringFormatterHelper";
import { HTMLAttributes } from "react";
import Rating from "@mui/material/Rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

interface Props extends HTMLAttributes<HTMLDivElement> {
  value: number;
  totalRatings: number;
  isTotalRatingShown?: boolean;
  isNumericRatingShown?: boolean;
}

function CRating(props: Props) {
  const { value, totalRatings, isTotalRatingShown, isNumericRatingShown = true, ...divAttributes } = props;
  const { t } = useTranslation();

  function getFormattedValue() {
    return stringFormatterHelper.replaceDotsWithCommas(value.toString());
  }

  return (
    <div className="flex flex-col" {...divAttributes}>
      <div className="flex items-center">
        <Rating
          readOnly
          precision={0.5}
          value={value}
          icon={<FontAwesomeIcon icon={["fas", "star"]} className="text-cinder mr-1" size="2xs" />}
          emptyIcon={<FontAwesomeIcon icon={["fas", "star"]} className="text-spun-pearl mr-1" size="2xs" />}
        />
        <div>
          {isNumericRatingShown && (
            <span className="c-text-12 ml-1" style={{ verticalAlign: "text-bottom" }}>
              {getFormattedValue()}
            </span>
          )}
        </div>
      </div>
      {isTotalRatingShown && (
        <div className="c-text-12 text-mid-gray leading-1.5">
          {totalRatings} {t("ratingsInTotal").toLowerCase()}
        </div>
      )}
    </div>
  );
}

export default CRating;
