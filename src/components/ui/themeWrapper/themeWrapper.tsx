import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateTheme } from "@/redux/reducers/appSlice";
import { RootState } from "../../../redux/store";

const ThemeWrapper = ({ children }: any) => {
  const [appTheme, setAppTheme] = useState("light");

  const theme = useSelector((state: RootState) => state.app.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedTheme = localStorage.getItem("appTheme");
    if (storedTheme) {
      dispatch(updateTheme(storedTheme));
      setAppTheme(storedTheme);
    }
  }, [theme]);

  return <div data-theme={appTheme}>{children}</div>;
};

export default ThemeWrapper;
