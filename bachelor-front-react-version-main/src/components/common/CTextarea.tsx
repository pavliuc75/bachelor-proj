import {
  ChangeEvent,
  forwardRef,
  TextareaHTMLAttributes,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import { stringGeneratorHelper } from "../../utils/stringGeneratorHelper";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: "small" | "medium" | "large";
  labelText?: string;
  rows?: number;
  value?: string;
  errorText?: string;
  lazyValidation?: boolean;
  validateOnBlur?: boolean;
  validatorFunctions?: ((value: string) => { isValid: boolean; errorText: string })[];
  grow?: boolean;
  isDisabled?: boolean;
  onUpdate: (value: string) => void;
  className?: string;
}

function CTextarea(props: Props, ref: any) {
  const {
    size = "medium",
    labelText,
    rows = 5,
    value,
    errorText,
    lazyValidation,
    validateOnBlur = true,
    validatorFunctions = [],
    grow,
    isDisabled,
    onUpdate,
    className,
    ...textareaProps
  } = props;

  const textareaId = useRef(`textarea-${stringGeneratorHelper.getRandomString(5)}`);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [errorTextLocal, setErrorTextLocal] = useState(errorText);

  useImperativeHandle(ref, () => ({ forceFocus, validateInput }));

  useEffect(() => {
    setErrorTextLocal(errorText);
  }, [errorText]);

  function handleInput(e: ChangeEvent<HTMLTextAreaElement>) {
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
    textareaRef.current?.focus();
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

  return (
    <div
      className={classNames({
        "max-w-[384px]": !grow,
        [className || ""]: true,
        "flex flex-none flex-col w-full": true,
      })}>
      {labelText && (
        <label
          htmlFor={textareaId.current}
          className={classNames({
            "c-text-12 mb-0.5": size === "small",
            "c-text-14 mb-0.5": size === "medium",
            "inline-block": true,
          })}>
          {labelText}
        </label>
      )}
      <div className="flex flex-none">
        <textarea
          {...textareaProps}
          value={value || ""}
          disabled={isDisabled}
          ref={textareaRef}
          rows={rows}
          onInput={handleInput}
          onBlur={handleBlur}
          id={textareaId.current}
          className={classNames({
            "px-3 py-2 c-text-14": size === "small",
            "px-4 py-2.5": size === "medium",
            "border-error focus-visible:border-error": errorTextLocal != null,
            "focus-visible:border-dark-blue": errorTextLocal == null,
            "border-spun-pearl focus-visible:border-spun-pearl text-mid-gray": isDisabled,
            "resize-none w-full tracking-[unset] border border-solid border-mid-gray rounded-lg focus-visible:outline-none focus-visible:border-2 placeholder:text-spun-pearl":
              true,
          })}></textarea>
      </div>
      {errorTextLocal && (
        <span
          className={classNames({
            "ml-3": size === "small",
            "ml-4": size === "medium",
            "ml-6": size === "large",
            "block c-text-12 mt-1 text-error ml-4": true,
          })}>
          {errorTextLocal}
        </span>
      )}
    </div>
  );
}

export default forwardRef(CTextarea);
