import React, { useState } from "react";
import styles from "@/styles/containerThemes/home/v1.module.scss";
import {
  CompassOutlined,
  EditOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Layout, Menu } from "antd";
import type { RootState } from "../../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import ThemeToggle from "@/components/ui/themeToggle/themeToggle";
import Settings from "./pages/settings";
import Page1 from "./pages/page1";
import Page2 from "./pages/page2";

const { Header, Content, Footer, Sider } = Layout;

const items = [
  {
    key: "page1",
    icon: <EditOutlined />,
    label: "New Chat",
  },
  {
    key: "page2",
    icon: <CompassOutlined />,
    label: "Workspace",
  },
  // {
  //   key: "page3",
  //   icon: <BookOutlined />,
  //   label: "Page 3",
  // },
  {
    key: "page4",
    icon: <SettingOutlined />,
    label: "Settings",
  },
];

const Home = () => {
  const [selectedMenu, setSelectedMenu] = useState<any>({
    key: "page1",
    icon: <SettingOutlined />,
    label: "Settings",
  });

  const theme = useSelector((state: RootState) => state.app.theme);
  const appInfo = useSelector((state: RootState) => state.app.appInfo);
  const userInfo = useSelector((state: RootState) => state.app.userInfo);
  const chat = useSelector((state: RootState) => state.chat);

  const dispatch = useDispatch();

  return (
    <Layout className={`${styles.homeContainer} bg-primary primaryText`}>
      <Sider
        theme={theme === "dark" ? "dark" : "light"}
        className={styles.siderContainer}
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          // console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          // console.log(collapsed, type);
        }}
      >
        <div className={styles.rootFlexCont}>
          <div>
            <div className={styles.logoContainer}>
              {appInfo && <img src={appInfo?.logo} className={styles.logo} />}
            </div>

            <Menu
              theme={theme === "dark" ? "dark" : "light"}
              mode="inline"
              defaultSelectedKeys={[selectedMenu.key]}
              items={items}
              onSelect={(e) => {
                const [selectedItem] = items.filter(
                  (item) => item.key === e.key
                );
                setSelectedMenu(selectedItem || {});
              }}
            />
          </div>

          <div className={styles.footerContainer}>
            <div className={styles.themeToggleContainer}>
              <span className={styles.text}>Theme</span>
              <ThemeToggle />
            </div>

            <div className={styles.flexContainer}>
              <span className={styles.userName}>{userInfo?.name}</span>
              <Button className={styles.logoutButton}>
                <LogoutOutlined />
              </Button>
            </div>
          </div>
        </div>
      </Sider>
      <Layout className={`bg-primary primaryText ${styles.rightContainer}`}>
        {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}

        <div style={{ width: "100%", height: "100%" }}>
          {selectedMenu.key === "page1" && <Page1 chat={chat} />}
          {selectedMenu.key === "page2" && <Page2 userInfo={userInfo}/>}
          {selectedMenu.key === "page4" && <Settings userInfo={userInfo} />}
        </div>

        {/* <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer> */}
      </Layout>
    </Layout>
  );
};

export default Home;
