/**
 * antd theme/themeConfig.ts
 */

import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    fontSize: 15,
    colorPrimary: "#096a2e",
  },
  components: {
    Menu: {
      darkItemBg: "#2a3b2c",
      itemBg: "#dee9df",
      itemSelectedBg: "#f9f9f9",
    },
    Layout: {
      siderBg: "#2a3b2c",
      lightSiderBg: "#dee9df",
    },
    Input:{
      activeBg:"#096a2e1f",
    }
  },
};

export default theme;
