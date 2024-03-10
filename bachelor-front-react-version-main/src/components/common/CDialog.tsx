import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import "../../assets/styles/CDialog.css";
import { Breakpoint } from "@mui/material";
import CButtonSecondary from "./CButtonSecondary";
import CButtonPrimary from "./CButtonPrimary";

interface Props {
  isShown: boolean;
  titleText?: string;
  subtitleText?: string;
  width?: Breakpoint;
  onUpdate?: (value: boolean) => void;
  onConfirm?: () => void;
  titleSlot?: any;
  subtitleSlot?: any;
  footerSlot?: any;
  children?: any;
}

function CDialog(props: Props) {
  const { t } = useTranslation();
  const {
    isShown,
    titleText,
    subtitleText,
    width = "sm",
    onUpdate,
    onConfirm,
    titleSlot,
    subtitleSlot,
    footerSlot,
    children,
  } = props;

  return (
    <Dialog maxWidth={width} open={isShown} onClose={() => (onUpdate ? onUpdate(false) : {})}>
      {titleSlot || <span className="text-bold">{titleText}</span>}
      {subtitleSlot || (subtitleText && <span className="mt-3 c-text-14 text-mid-gray">{subtitleText}</span>)}
      {children}
      {footerSlot || (
        <div className="mt-3 flex items-center justify-end gap-x-6">
          <CButtonSecondary onClick={() => (onUpdate ? onUpdate(false) : {})} text={t("cancel")}></CButtonSecondary>
          <CButtonPrimary onClick={onConfirm} text={t("confirm")}></CButtonPrimary>
        </div>
      )}
    </Dialog>
  );
}

export default CDialog;
