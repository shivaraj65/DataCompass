/**
 * this slice will contain application level data.
 * -> user infos and app info
 */

import {
  userInfotypes,
  appInfotypes,
  signupTypes,
} from "@/utils/types/appTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { signupApi } from "../asyncApi/users";

interface app {
  appInfo: appInfotypes | null;
  userInfo: userInfotypes | null;
  signup: signupTypes;
  theme: string;
}

const initialState: app = {
  appInfo: {
    name: "DataCompass",
    logo: "logo/png/logo-no-background.png",
    description:
      "Your ultimate guide in navigating and making sense of complex data landscapes with precision and ease.",
  },
  userInfo: null,
  signup: {
    message: null,
    loading: false,
    error: null,
  },
  theme: "light",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    updateUserInfo(state, action: PayloadAction<userInfotypes>) {
      state.userInfo = action.payload;
    },
    updateTheme(state, action: PayloadAction<string>) {
      state.theme = action.payload;
    },
    resetSignup(state) {
      state.signup = {
        message: null,
        loading: false,
        error: null,
      };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(signupApi.pending, (state) => {
        state.signup.loading = true;
        state.signup.error = null;
      })
      .addCase(signupApi.fulfilled, (state, action) => {
        state.signup.loading = false;
        state.signup.error = action.payload.error;
        state.signup.message = action.payload.status;
      })
      .addCase(signupApi.rejected, (state, action) => {
        state.signup.loading = false;
        state.signup.error = action.payload || "An error occurred";
      });
  },
});

export const { updateUserInfo, updateTheme, resetSignup } = appSlice.actions;
export default appSlice.reducer;
