import { Link } from "react-router-dom";
import { Fragment } from "react";
import CButtonSecondary from "./CButtonSecondary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  directories: { name: string; route?: string }[];
  className?: string;
}

function CPathRepresentation(props: Props) {
  const { directories, className = "" } = props;

  return (
    <div className={className + " flex flex-row items-center"}>
      {directories.map((directory, index) => {
        return (
          <div key={index} className="flex flex-row items-center">
            {index !== directories.length - 1 ? (
              <Fragment>
                <Link to={directory.route || ""}>
                  <CButtonSecondary className="text-left" text={directory.name}></CButtonSecondary>
                </Link>
                {index !== directories.length - 2 ||
                  (directories[directories.length - 1].name && (
                    <FontAwesomeIcon className="mx-2" size="2xs" icon={["fas", "chevron-right"]}></FontAwesomeIcon>
                  ))}
              </Fragment>
            ) : (
              <span className="c-text-12 text-left">{directory.name}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CPathRepresentation;
