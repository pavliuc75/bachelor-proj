import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CButtonPrimary from "./CButtonPrimary";

interface Props {
  onCurrentPageChanged: (newPage: number) => void;
  currentPage: number;
  totalPages: number;
  className?: string;
}

function CPagination(props: Props) {
  const { onCurrentPageChanged, currentPage, totalPages, className = "" } = props;

  function getPages() {
    let current = currentPage,
      last = totalPages,
      delta = 2,
      left = current - delta,
      right = current + delta + 1,
      range = [],
      rangeWithDots = [],
      l;

    for (let i = 1; i <= last; i++) {
      if (i === 1 || i === last || (i >= left && i < right)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push(-1);
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }

  return (
    <ul className={className + " flex flex-row grow-0 items-center"}>
      <li>
        {currentPage !== 1 && (
          <FontAwesomeIcon
            className="cursor-pointer hover:text-dark-blue mr-2"
            onClick={() => onCurrentPageChanged(currentPage - 1)}
            icon={["fas", "arrow-left"]}></FontAwesomeIcon>
        )}
      </li>
      {getPages().map((page, index) => (
        <li key={index}>
          {page === -1 ? (
            <span className="c-text-14 mx-1">...</span>
          ) : page === currentPage ? (
            <CButtonPrimary className="text-dark-blue border-dark-blue mx-1" text={page + ""}></CButtonPrimary>
          ) : (
            <CButtonPrimary
              text={page + ""}
              className="mx-1"
              onClick={() => onCurrentPageChanged(page)}></CButtonPrimary>
          )}
        </li>
      ))}
      <li>
        {currentPage !== totalPages && (
          <FontAwesomeIcon
            className="cursor-pointer hover:text-dark-blue ml-2"
            onClick={() => onCurrentPageChanged(currentPage + 1)}
            icon={["fas", "arrow-right"]}></FontAwesomeIcon>
        )}
      </li>
    </ul>
  );
}

export default CPagination;
