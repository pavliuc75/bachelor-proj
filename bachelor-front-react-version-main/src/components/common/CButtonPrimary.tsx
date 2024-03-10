import classNames from "classnames";
import "../../assets/styles/CButtonPrimary.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ButtonHTMLAttributes } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  iconStart?: IconProp;
  iconEnd?: IconProp;
  size?: "small" | "medium";
  isDisabled?: boolean;
  className?: string;
}

function CButtonPrimary(props: Props) {
  const { text, iconStart, iconEnd, size = "small", isDisabled, className, ...buttonProps } = props;

  function getIconSize() {
    if (size === "small") return "2xs";
    if (size === "medium") return "xs";
  }

  return (
    <button
      {...buttonProps}
      className={classNames({
        "h-8 px-2": size === "small",
        "h-14 px-5": size === "medium",
        "text-mid-gray hover-is-disabled border-spun-pearl hover:border-spun-pearl": isDisabled,
        [className || ""]: true,
        "flex flex-none items-center tracking-[unset] hover:text-dark-blue hover:border-dark-blue border border-solid border-mid-gray rounded-lg":
          true,
      })}
      disabled={isDisabled}>
      {iconStart && (
        <FontAwesomeIcon
          icon={iconStart}
          className={classNames({ "mr-2": size === "small", "mr-3": size === "medium" })}
          size={getIconSize()}
        />
      )}
      <span
        className={classNames({
          "c-text-12": size === "small",
          "c-text-14": size === "medium",
        })}>
        {text}
      </span>
      {iconEnd && (
        <FontAwesomeIcon
          icon={iconEnd}
          className={classNames({ "ml-2": size === "small", "ml-3": size === "medium" })}
          size={getIconSize()}
        />
      )}
    </button>
  );
}

export default CButtonPrimary;
