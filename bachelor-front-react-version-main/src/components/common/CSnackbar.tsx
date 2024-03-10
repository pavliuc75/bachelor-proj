import Snackbar from "@mui/material/Snackbar";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { hideSnackbar } from "../../store/eventSlice";

export function CSnackbar() {
  const { message, isShown, type } = useSelector((state: RootState) => state.event.snackbar);
  const dispatch = useDispatch();

  function handleCloseSnackbar() {
    dispatch(hideSnackbar());
  }

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={isShown}
      autoHideDuration={6000}
      onClose={handleCloseSnackbar}>
      <div
        className={classNames({
          "border border-mid-gray border-solid tracking-[unset] h-16 px-5 py-0 flex items-center c-text-12 text-cinder min-w-[300px]":
            true,
          "bg-background-error": type === "error",
          "bg-white-lilac": type !== "error",
        })}>
        {message}
      </div>
    </Snackbar>
  );
}

export default CSnackbar;
