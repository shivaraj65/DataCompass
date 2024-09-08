import React from "react";
import "@/styles/globals.css";
import theme from "@/styles/theme/themeConfig";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ConfigProvider, message } from "antd";
import type { AppProps } from "next/app";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import "@/styles/theme/appTheme.scss";
import "@/styles/theme/antdOverride.scss";
import "@/styles/theme/globalTheme.scss";
import ThemeWrapper from "@/components/ui/themeWrapper/themeWrapper";

export default function App({ Component, pageProps }: AppProps) {
  message.config({
    top: 20, 
    duration: 2, 
    maxCount: 2, 
  });

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID!}>
      <Provider store={store}>
        <ConfigProvider theme={theme}>
          <ThemeWrapper>
            <Component {...pageProps} />
          </ThemeWrapper>
        </ConfigProvider>
      </Provider>
    </GoogleOAuthProvider>
  );
}
