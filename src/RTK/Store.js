import { configureStore } from "@reduxjs/toolkit";
import responsiveUi from "./ResponseveUi";

export const store = configureStore({
  reducer: { responsiveUi: responsiveUi },
});
