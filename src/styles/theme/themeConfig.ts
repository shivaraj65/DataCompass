/**
 * antd theme/themeConfig.ts
 */

import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    fontSize: 15,
    colorPrimary: "#7a4fbf",
  },
  components: {
    Menu: {
      darkItemBg: "#0e1012",
      itemBg: "#ececec",
    },
    Layout: {
      siderBg: "#0e1012",
      lightSiderBg: "#ececec",
    },
  },
};

export default theme;
