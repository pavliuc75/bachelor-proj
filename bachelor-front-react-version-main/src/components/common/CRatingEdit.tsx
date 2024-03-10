import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import "../../assets/styles/CRatingEdit.css";

interface Props {
  value?: number;
  onUpdate?: (newValue: number) => void;
  className?: string;
}

function CRatingEdit(props: Props) {
  const { value = 0, onUpdate, className = "" } = props;
  const [hoveredValue, setHoveredValue] = useState(-1);

  function handleChangeValue(newValue: number) {
    onUpdate && onUpdate(newValue);
  }

  return (
    <div className={className + " flex flex-col cursor-pointer"}>
      <div className="flex flex-row items-center justify-between">
        <FontAwesomeIcon
          icon={["fas", "star"]}
          className={classNames({
            "text-spun-pearl": value < 1,
            "text-cinder": value >= 1,
            "text-dark-blue": hoveredValue >= 1,
          })}
          onClick={() => handleChangeValue(1)}
          onMouseOver={() => setHoveredValue(1)}
          onMouseLeave={() => setHoveredValue(-1)}></FontAwesomeIcon>
        <FontAwesomeIcon
          icon={["fas", "star"]}
          className={classNames({
            "text-spun-pearl": value < 2,
            "text-cinder": value >= 2,
            "text-dark-blue": hoveredValue >= 2,
          })}
          onClick={() => handleChangeValue(2)}
          onMouseOver={() => setHoveredValue(2)}
          onMouseLeave={() => setHoveredValue(-1)}></FontAwesomeIcon>
        <FontAwesomeIcon
          icon={["fas", "star"]}
          className={classNames({
            "text-spun-pearl": value < 3,
            "text-cinder": value >= 3,
            "text-dark-blue": hoveredValue >= 3,
          })}
          onClick={() => handleChangeValue(3)}
          onMouseOver={() => setHoveredValue(3)}
          onMouseLeave={() => setHoveredValue(-1)}></FontAwesomeIcon>
        <FontAwesomeIcon
          icon={["fas", "star"]}
          className={classNames({
            "text-spun-pearl": value < 4,
            "text-cinder": value >= 4,
            "text-dark-blue": hoveredValue >= 4,
          })}
          onClick={() => handleChangeValue(4)}
          onMouseOver={() => setHoveredValue(4)}
          onMouseLeave={() => setHoveredValue(-1)}></FontAwesomeIcon>
        <FontAwesomeIcon
          icon={["fas", "star"]}
          className={classNames({
            "text-spun-pearl": value < 5,
            "text-cinder": value === 5,
            "text-dark-blue": hoveredValue >= 5,
          })}
          onClick={() => handleChangeValue(5)}
          onMouseOver={() => setHoveredValue(5)}
          onMouseLeave={() => setHoveredValue(-1)}></FontAwesomeIcon>
      </div>
    </div>
  );
}

export default CRatingEdit;
