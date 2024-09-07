/**
 * this slice will contain application level data.
 * -> user infos
 */

import { userInfotypes, appInfotypes } from "@/utils/types/appTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface app {
  appInfo: appInfotypes | null;
  userInfo: userInfotypes | null;
  theme: string;
}

const initialState: app = {
  appInfo:{
    name:"HEXBANE 🐦‍🔥",
    logo:"https://picsum.photos/150/50",
    description:"Hexbane is a development accelerator module to spin up a application in a very quick duration of time.",
  },
  userInfo: null,
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

    // todoAdded(state, action: PayloadAction<{ id: number; text: string }>) {
    //   state.push({
    //     id: action.payload.id,
    //     text: action.payload.text,
    //     completed: false,
    //   });
    // },
    // todoToggled(state, action: PayloadAction<number>) {
    //   const todo = state.find((todo) => todo.id === action.payload);
    //   if (todo) {
    //     todo.completed = !todo.completed;
    //   }
    // },
  },
});

export const { updateUserInfo, updateTheme } = appSlice.actions;
export default appSlice.reducer;
