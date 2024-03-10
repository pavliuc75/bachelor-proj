import { forwardRef, HTMLProps, useImperativeHandle, useRef, useState } from "react";
import { stringGeneratorHelper } from "../../utils/stringGeneratorHelper";
import { useTranslation } from "react-i18next";
import CButtonPrimary from "./CButtonPrimary";

interface Props extends HTMLProps<HTMLInputElement> {
  labelText?: string;
  descriptionText?: string;
  nonNativeFileName?: string;
  onFileSelected?: (file: File) => void;
  className?: string;
}

function CFileInput(props: Props, ref: any) {
  const { labelText, descriptionText, nonNativeFileName, onFileSelected, className = "", ...inputProps } = props;
  const { t } = useTranslation();
  const reader = new FileReader();

  const inputId = useRef(`input-${stringGeneratorHelper.getRandomString(5)}`);
  const [fileName, setFileName] = useState("");
  const [errorText, setErrorText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useImperativeHandle(ref, () => ({ validateInput, reset }));

  function handleChooseFileClick() {
    document.getElementById(inputId.current)?.click();
  }

  function handleFileInputChange(event: any) {
    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        setFile(event.target.files[0]);
        setFileName(event.target.files[0].name);
        onFileSelected && onFileSelected(event.target.files[0]);
        setErrorText("");
      };
      reader.onerror = () => {
        setFile(null);
        setFileName("");
        setErrorText(t("somethingWentWrongWhileReadingTheFile") || "");
      };
    }
  }

  function validateInput() {
    if (!file) {
      setErrorText(t("pleaseUploadAFile") || "");
      return false;
    }
    return true;
  }

  function reset() {
    setFileName("");
    setErrorText("");
    setFile(null);
    const inputElement = document.getElementById(inputId.current) as HTMLInputElement;
    if (inputId.current && inputElement) {
      inputElement.value = "";
    }
  }

  return (
    <div className={className + " flex flex-col w-full"} style={{ maxWidth: "calc(96px * 4)" }}>
      {labelText && (
        <label htmlFor={inputId.current} className="c-text-14 mb-2 inline-block self-start">
          {labelText}
        </label>
      )}
      <div className="flex flex-row items-center gap-x-8">
        <CButtonPrimary
          text={t("chooseFile")}
          type="button"
          onClick={handleChooseFileClick}
          iconEnd={["fas", "upload"]}></CButtonPrimary>
        {(fileName || nonNativeFileName) && <span className="c-text-12">{fileName || nonNativeFileName}</span>}
        {errorText && <span className="c-text-12 text-error">{errorText}</span>}
      </div>
      {descriptionText && <p className="mt-2">{descriptionText}</p>}
      <input {...inputProps} className="hidden" type="file" id={inputId.current} onChange={handleFileInputChange} />
    </div>
  );
}

export default forwardRef(CFileInput);
