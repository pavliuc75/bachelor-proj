import React, { ButtonHTMLAttributes } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import "../../assets/styles/CButtonSecondary.css";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  iconStart?: IconProp;
  iconEnd?: IconProp;
  size?: "small" | "medium";
  isDisabled?: boolean;
  className?: string;
}

function CButtonSecondary(props: Props) {
  const { text, iconStart, iconEnd, size = "small", isDisabled, className, ...buttonProps } = props;

  function getIconSize() {
    if (size === "small") return "2xs";
    if (size === "medium") return "xs";
  }

  return (
    <button
      {...buttonProps}
      disabled={isDisabled}
      className={classNames({
        "text-mid-gray hover-disabled no-underline": isDisabled,
        [className || ""]: true,
        "flex flex-none items-center tracking-[unset] underline hover:text-dark-blue hover:no-underline": true,
      })}>
      {iconStart && (
        <FontAwesomeIcon
          icon={iconStart}
          className={classNames({ "mr-2": size === "small", "mr-2.5": size === "medium" })}
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
          className={classNames({ "mr-2": size === "small", "mr-2.5": size === "medium" })}
          size={getIconSize()}
        />
      )}
    </button>
  );
}

export default CButtonSecondary;
