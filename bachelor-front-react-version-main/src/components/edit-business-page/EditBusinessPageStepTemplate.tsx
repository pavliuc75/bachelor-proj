import classNames from "classnames";
import { ReactNode } from "react";
import CButtonSecondary from "../common/CButtonSecondary";
import { useTranslation } from "react-i18next";
import "../../assets/styles/EditBusinessPageStepTemplate.scss";

interface Props {
  isDisabled: boolean;
  isEditMode: boolean;
  stepNumber: number;
  stepTitle: string;
  stepHeaderClicked?: () => void;
  previousStepClicked?: () => void;
  nextStepClicked?: () => void;
  children?: ReactNode;
  actionsEndSlot?: ReactNode;
}

function EditBusinessPageStepTemplate(props: Props) {
  const { t } = useTranslation();

  const {
    isDisabled,
    isEditMode,
    stepNumber,
    stepTitle,
    stepHeaderClicked,
    previousStepClicked,
    nextStepClicked,
    children,
    actionsEndSlot,
  } = props;

  return (
    <div className="flex flex-col" data-css="EditBusinessPageStepTemplate">
      {!isEditMode && (
        <button
          type="button"
          className={classNames({
            "hover-border-blue hover:text-dark-blue border-mid-gray hover:border-dark-blue": !isDisabled,
            "border-spun-pearl text-spun-pearl": isDisabled,
            "flex self-start flex-row items-center tracking-[unset] hover-no-underline": true,
          })}
          onClick={stepHeaderClicked}
          disabled={isDisabled}>
          <div
            style={{ borderColor: "inherit !important" }}
            className={"w-8 h-8 shrink-0 flex items-center justify-center border border-solid rounded-full"}>
            <h4>{stepNumber}</h4>
          </div>
          <h4
            className={classNames({
              underline: !isDisabled,
              "text-spun-pearl": isDisabled,
              "ml-10 text-left": true,
            })}>
            {stepTitle}
          </h4>
        </button>
      )}
      {isEditMode && (
        <div>
          <header className="flex flex-row items-center gap-x-10 mb-10">
            <div className="w-8 h-8 shrink-0 flex items-center justify-center border border-solid rounded-full border-dark-blue text-dark-blue">
              <h4>{stepNumber}</h4>
            </div>
            <h3>{stepTitle}</h3>
          </header>
          <div className="sm:ml-[72px]">
            {children}
            {actionsEndSlot || (
              <div className="flex flex-row items-center gap-x-8 mt-8 mb-6">
                <CButtonSecondary
                  onClick={previousStepClicked}
                  iconStart={["fas", "arrow-left"]}
                  text={t("goBack")}></CButtonSecondary>
                <CButtonSecondary
                  size="medium"
                  onClick={nextStepClicked}
                  iconStart={["fas", "arrow-right"]}
                  text={t("continue")}></CButtonSecondary>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EditBusinessPageStepTemplate;
