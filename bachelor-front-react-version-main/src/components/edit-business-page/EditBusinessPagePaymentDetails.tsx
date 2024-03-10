import { useRef } from "react";
import EditBusinessPageStepTemplate from "./EditBusinessPageStepTemplate";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  setBusinessApplicationBank,
  setBusinessApplicationIban,
  setBusinessApplicationSwiftCode,
} from "../../store/businessManagementToolSlice";
import CInput from "../common/CInput";
import { validatorHelper } from "../../utils/validatorHelper";

interface Props {
  isDisabled: boolean;
  isEditMode: boolean;
  stepHeaderClicked: () => void;
  nextStepClicked: () => void;
  previousStepClicked: () => void;
}

function EditBusinessPagePaymentDetails(props: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { isDisabled, isEditMode, stepHeaderClicked, nextStepClicked, previousStepClicked } = props;

  const cInputIbanRef = useRef<any>(null);
  const cInputSwiftCodeRef = useRef<any>(null);
  const cInputBankRef = useRef<any>(null);

  // @ts-ignore
  const { iban, swiftCode, bank } = useSelector(
    (state: RootState) => state.businessManagementTool.businessApplication?.businessPaymentDetails
  );

  function handleSetBusinessApplicationIban(newValue: string) {
    dispatch(setBusinessApplicationIban(newValue));
  }

  function handleSetBusinessApplicationSwiftCode(newValue: string) {
    dispatch(setBusinessApplicationSwiftCode(newValue));
  }

  function handleSetBusinessApplicationBank(newValue: string) {
    dispatch(setBusinessApplicationBank(newValue));
  }

  function handleNextStepClicked(e?: any) {
    e?.preventDefault();

    let isIbanValid = cInputIbanRef.current.validateInput();
    let isBankNameValid = cInputBankRef.current.validateInput();
    let isSwiftCodeValid = cInputSwiftCodeRef.current.validateInput();

    if (isIbanValid && isBankNameValid && isSwiftCodeValid) nextStepClicked();
  }

  return (
    <EditBusinessPageStepTemplate
      stepTitle={t("paymentDetails") || ""}
      stepNumber={3}
      isDisabled={isDisabled}
      isEditMode={isEditMode}
      stepHeaderClicked={stepHeaderClicked}
      previousStepClicked={previousStepClicked}
      nextStepClicked={handleNextStepClicked}>
      <form onSubmit={handleNextStepClicked}>
        <CInput
          inputSize={"medium"}
          ref={cInputIbanRef}
          value={iban}
          labelText={t("ibanNumber") + " *"}
          validatorFunctions={[validatorHelper.validateRequired, validatorHelper.validateIsIban]}
          placeholder={t("exampleIban") || ""}
          onUpdate={handleSetBusinessApplicationIban}></CInput>
        <CInput
          inputSize={"medium"}
          ref={cInputBankRef}
          value={bank}
          className={"mt-8"}
          labelText={t("bankName") + " *"}
          validatorFunctions={[validatorHelper.validateRequired]}
          onUpdate={handleSetBusinessApplicationBank}></CInput>
        <CInput
          inputSize={"medium"}
          ref={cInputSwiftCodeRef}
          value={swiftCode}
          className={"mt-8"}
          labelText={t("swiftCode") + " *"}
          placeholder={t("exampleSwiftCode") || ""}
          validatorFunctions={[validatorHelper.validateRequired, validatorHelper.validateSwiftCode]}
          onUpdate={handleSetBusinessApplicationSwiftCode}></CInput>
      </form>
    </EditBusinessPageStepTemplate>
  );
}

export default EditBusinessPagePaymentDetails;
