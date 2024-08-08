import { createSlice } from "@reduxjs/toolkit";

const responsiveUi = createSlice({
  name: "responsiveUi",
  initialState: {
    listIsOpen: true,
    chatIsOpen: false,
    detailIsOpen: false,
    signInIsOpen: false,
  },
  reducers: {
    // @ts-ignore
    toggleListUI: (state) => {
      state.listIsOpen = !state.listIsOpen;
    },
    toggleChatUI: (state) => {
      state.chatIsOpen = !state.chatIsOpen;
    },
    toggleDetailUI: (state) => {
      state.detailIsOpen = !state.detailIsOpen;
    },
    toggleSignInUI: (state) => {
      state.signInIsOpen = !state.signInIsOpen;
    },
  },
});

export const { toggleListUI, toggleChatUI, toggleDetailUI, toggleSignInUI } =
  responsiveUi.actions;

export default responsiveUi.reducer;
