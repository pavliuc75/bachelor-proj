import { Fragment, ReactNode, useState } from "react";
import Menu from "@mui/material/Menu";
import "../../assets/styles/CMenu.css";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  items?: { text?: string; selected?: boolean; function?: () => any }[];
  isRadio?: boolean;
  isCheckbox?: boolean;
  listItemEndSlot?: any;
  isDisabled?: boolean;
  children?: ReactNode;
}

function CMenu(props: Props) {
  const { items, isRadio, isCheckbox, isDisabled, listItemEndSlot, children } = props;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isShown, setIsShown] = useState<boolean>(false);

  function handleActivatorClick(e: any) {
    if (!isDisabled) {
      setAnchorEl(e.currentTarget);
      setIsShown(true);
    }
  }

  function handleClick(item: { name?: string; selected?: boolean; function?: () => any }) {
    // @ts-ignore
    item?.function();
    closeMenu();
  }

  function closeMenu() {
    setIsShown(false);
  }

  return (
    <Fragment>
      <div onClick={handleActivatorClick}>{children}</div>
      <Menu anchorEl={anchorEl} open={isShown} onClose={closeMenu}>
        <ul className="flex flex-col shrink-0">
          {items?.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                handleClick(item);
              }}
              className={classNames({
                "border-none": index === items.length - 1,
                "flex flex-row items-center shrink-0 justify-between hover:bg-background cursor-pointer min-h-[36px] border-b border-solid border-mid-gray px-2":
                  true,
              })}>
              <span
                className={classNames({
                  "mr-3": isRadio || isCheckbox,
                  "c-text-12": true,
                })}>
                {item.text}
              </span>
              {listItemEndSlot ? (
                listItemEndSlot(item)
              ) : isRadio ? (
                <div className="flex flex-row shrink-0 h-4 w-4 items-center justify-center border-solid border border-mid-gray rounded-full">
                  {item.selected ? <div className="bg-mid-gray w-2.5 h-2.5 rounded-full"></div> : <div></div>}
                </div>
              ) : (
                isCheckbox &&
                item.selected && <FontAwesomeIcon icon={["fas", "check"]} className="text-mid-gray"></FontAwesomeIcon>
              )}
            </li>
          ))}
        </ul>
      </Menu>
    </Fragment>
  );
}

export default CMenu;
