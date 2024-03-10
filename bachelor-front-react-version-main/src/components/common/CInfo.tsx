import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  text?: string;
  type?: "info" | "success" | "warning" | "error";
  size?: "sm" | "md";
  className?: string;
}

function CInfo(props: Props) {
  const { text, type = "info", size = "md", className = "" } = props;

  function getClassStyling() {
    let baseClasses = className + " border border-spun-pearl border-solid flex inline-flex";
    if (type === "error") {
      baseClasses += " bg-background-error";
    }
    if (type === "warning") {
      baseClasses += " bg-background-warning";
    }
    if (type === "success") {
      baseClasses += " bg-background-success";
    }
    if (size === "sm") {
      baseClasses += " p-1";
    }
    if (size === "md") {
      baseClasses += " p-4";
    }
    return baseClasses;
  }

  return (
    <div className={getClassStyling()}>
      <FontAwesomeIcon icon={["fas", "info"]} className="text-mid-gray mr-3" size="sm"></FontAwesomeIcon>
      <p className="text">{text}</p>
    </div>
  );
}

export default CInfo;
