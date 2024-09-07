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
      darkItemBg: "#0e1012",
      itemBg: "#ececec",
      itemSelectedBg: "#f9f9f9",
    },
    Layout: {
      siderBg: "#0e1012",
      lightSiderBg: "#ececec",
    },
    Input:{
      activeBg:"#096a2e1f",
    }
  },
};

export default theme;
