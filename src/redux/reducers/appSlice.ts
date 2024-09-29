/**
 * this slice will contain application level data.
 * -> user infos and app info
 */

import {
  userInfotypes,
  appInfotypes,
  signupTypes,
  loginTypes,
  UpdateUserTypes,
} from "@/utils/types/appTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginApi, signupApi, updateUserApi } from "../asyncApi/users";

interface app {
  appInfo: appInfotypes | null;
  // userInfo: userInfotypes | null;
  userInfo:any;
  signup: signupTypes;
  login: loginTypes;
  updateUser: UpdateUserTypes;
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
  login: {
    message: null,
    loading: false,
    error: null,
  },
  updateUser: {
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
    resetLogin(state) {
      state.login = {
        message: null,
        loading: false,
        error: null,
      };
    },
    resetUpdateUser(state) {
      state.updateUser = {
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
      .addCase(signupApi.fulfilled, (state, action: PayloadAction<any>) => {
        state.signup.loading = false;
        state.signup.error = action.payload.error;
        state.signup.message = action.payload.status;
      })
      .addCase(signupApi.rejected, (state, action: PayloadAction<any>) => {
        state.signup.loading = false;
        state.signup.error = action.payload.error || "An error occurred";
      })
      .addCase(loginApi.pending, (state) => {
        state.login.loading = true;
        state.login.error = null;
      })
      .addCase(loginApi.fulfilled, (state, action: PayloadAction<any>) => {
        state.login.loading = false;
        state.login.error = action.payload.error;
        state.login.message = action.payload.status;
        state.userInfo = action.payload.data[0];
      })
      .addCase(loginApi.rejected, (state, action: PayloadAction<any>) => {
        state.login.loading = false;
        state.login.error = action.payload.error || "An error occurred";
      })
      .addCase(updateUserApi.pending, (state) => {
        state.updateUser.loading = true;
        state.updateUser.error = null;
      })
      .addCase(updateUserApi.fulfilled, (state, action: PayloadAction<any>) => {
        state.updateUser.loading = false;
        state.updateUser.error = action.payload.error;
        state.updateUser.message = action.payload.status;
        if (action.payload.data) {
          state.userInfo = action.payload.data;
        }
      })
      .addCase(updateUserApi.rejected, (state, action: PayloadAction<any>) => {
        state.updateUser.loading = false;
        state.updateUser.error = action.payload.error || "An error occurred";
      });
  },
});

export const {
  updateUserInfo,
  updateTheme,
  resetSignup,
  resetLogin,
  resetUpdateUser,
} = appSlice.actions;
export default appSlice.reducer;
