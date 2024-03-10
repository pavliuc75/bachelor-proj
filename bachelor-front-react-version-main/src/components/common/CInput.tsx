import {
  ChangeEvent,
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { stringGeneratorHelper } from "../../utils/stringGeneratorHelper";
import classNames from "classnames";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  inputSize?: "small" | "medium" | "large";
  labelText?: string;
  extraPaddingForInputAfterSlot?: boolean;
  value?: string;
  errorText?: string;
  lazyValidation?: boolean;
  validateOnBlur?: boolean;
  validatorFunctions?: ((value: string) => { isValid: boolean; errorText: string })[];
  descriptionText?: string;
  isDisabled?: boolean;
  onUpdate: (value: string) => void;
  inputAfterSlot?: ReactNode;
  className?: string;
  onEnterKey?: () => void;
}

function CInput(props: Props, ref: any) {
  const {
    inputSize = "small",
    inputAfterSlot,
    labelText,
    extraPaddingForInputAfterSlot,
    value,
    errorText,
    lazyValidation,
    validateOnBlur = true,
    validatorFunctions = [],
    descriptionText,
    isDisabled,
    onUpdate,
    className,
    onEnterKey,
    ...inputProps
  } = props;

  const inputId = useRef(`input-${stringGeneratorHelper.getRandomString(5)}`);
  const inputRef = useRef<HTMLInputElement>(null);
  const [errorTextLocal, setErrorTextLocal] = useState(errorText);

  useImperativeHandle(ref, () => ({ forceFocus, validateInput, forceBlur }));

  useEffect(() => {
    setErrorTextLocal(errorText);
  }, [errorText]);

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    if (!lazyValidation) {
      validateInput(e.target.value);
    }
    onUpdate(e.target.value);
  }

  function handleBlur() {
    if (validateOnBlur) {
      validateInput();
    }
  }

  function forceFocus() {
    inputRef.current?.focus();
  }

  function forceBlur() {
    inputRef.current?.blur();
  }

  function validateInput(input = value) {
    for (const validatorFunction of validatorFunctions) {
      let result = validatorFunction(input || "");
      if (!result.isValid) {
        setErrorTextLocal(result.errorText);
        break;
      } else {
        setErrorTextLocal(undefined);
      }
    }
    return errorTextLocal == null;
  }

  function handleInputKeyDown(e: any) {
    if (e.keyCode === 13) {
      props.onEnterKey && props.onEnterKey();
    }
  }

  return (
    <div className={className + " flex flex-none flex-col w-full"} style={{ maxWidth: "calc(96px * 4)" }}>
      {labelText && (
        <label
          htmlFor={inputId.current}
          className={classNames({
            "c-text-12 mb-0.5": inputSize === "small",
            "c-text-14 mb-0.5": inputSize === "medium",
            "c-text-14 mb-1": inputSize === "large",
            "inline-block": true,
          })}>
          {labelText}
        </label>
      )}
      <div className="flex flex-none">
        <input
          type="text"
          {...inputProps}
          onKeyDown={handleInputKeyDown}
          onInput={handleInput}
          onBlur={handleBlur}
          value={value}
          ref={inputRef}
          id={inputId.current}
          className={classNames({
            "h-10 px-3 c-text-14": inputSize === "small",
            "h-12 px-4": inputSize === "medium",
            "h-14 pl-6 pr-6": inputSize === "large",
            "border-error focus-visible:border-error": errorTextLocal != null,
            "focus-visible:border-dark-blue": errorTextLocal == null,
            "c-input w-full tracking-[unset] border border-solid border-mid-gray rounded-lg focus-visible:outline-none focus-visible:border-2 placeholder:text-spun-pearl":
              true,
          })}
          style={{ paddingRight: extraPaddingForInputAfterSlot ? "80px !important" : "unset" }}
        />
        {props.inputAfterSlot}
      </div>
      {errorTextLocal && (
        <span
          className={classNames({
            "ml-3": inputSize === "small",
            "ml-4": inputSize === "medium",
            "ml-6": inputSize === "large",
            "block c-text-12 mt-1 text-error ml-4": true,
          })}>
          {errorTextLocal}
        </span>
      )}
      {descriptionText && <p className="mt-1">{descriptionText}</p>}
    </div>
  );
}

export default forwardRef(CInput);
