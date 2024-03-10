import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface EventState {
  snackbar: {
    message: string | null;
    isShown: boolean;
    type: "error" | "info" | string;
  };
  loadingOverlay: {
    isShown: boolean;
    isInstant: boolean;
  };
}

const initialState: EventState = {
  snackbar: {
    message: null,
    isShown: false,
    type: "info",
  },
  loadingOverlay: {
    isShown: false,
    isInstant: false,
  },
};

export const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    showSnackbar: (state, action: PayloadAction<{ message: string; type: string }>) => {
      state.snackbar = { ...action.payload, isShown: true };
    },
    hideSnackbar: (state) => {
      state.snackbar.isShown = false;
    },
    showLoadingOverlay: (state, action: PayloadAction<{ isInstant: boolean }>) => {
      state.loadingOverlay = { ...action.payload, isShown: true };
    },
    hideLoadingOverlay: (state) => {
      state.loadingOverlay.isShown = false;
    },
  },
});

export const { showSnackbar, hideSnackbar, showLoadingOverlay, hideLoadingOverlay } = eventSlice.actions;

export default eventSlice.reducer;
