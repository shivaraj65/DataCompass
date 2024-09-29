import styles from "@/styles/containerThemes/home/pages/page2/page2.module.scss";
import { Badge, Button, Col, Popover, Row } from "antd";
import Image from "next/image";

import Simple from "@/assets/illustrations/simpleChat.png";
import FileChat from "@/assets/illustrations/fileChat.png";
import SqlChat from "@/assets/illustrations/sqlChat.png";

import {
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { getChatMessages } from "@/redux/asyncApi/chat";
import { userInfotypes } from "@/utils/types/appTypes";

const MockData = [
  {
    id: "1",
    title: "Card Title",
    modelName: "GPT 4 Vision",
    chatType: "simple",
  },
  {
    id: "2",
    title: "Card Title",
    modelName: "GPT 4 Vision",
    chatType: "FileUpload",
  },
  {
    id: "3",
    title: "Card Title",
    modelName: "GPT 4 Vision",
    chatType: "SqlChat",
  },
];

interface props {
  userInfo: any;
}

const Page2 = ({ userInfo }: props) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(
      getChatMessages({
        email: userInfo?.email,
      })
    );
  }, []);

  const SettingsContent = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "center",
        gap: "6px",
      }}
    >
      <Button
        // className={styles.settingsBtn}
        type="dashed"
        style={{ padding: "0 8px" }}
        onClick={() => {}}
      >
        <EditOutlined /> Rename
      </Button>
      <Button
        // className={styles.settingsBtn}
        type="dashed"
        style={{ padding: "0 8px" }}
        onClick={() => {}}
        danger
      >
        <DeleteOutlined /> Delete
      </Button>
    </div>
  );

  return (
    <div className={styles.page2Container}>
      <h1 className={styles.title}>Workspace</h1>
      <Row>
        {MockData &&
          MockData.map((item, index) => {
            return (
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={8}
                xl={8}
                key={item.id + index}
                style={{ padding: "8px" }}
              >
                <Badge.Ribbon text={item.chatType} color="#415043">
                  <div className={styles.historyCard}>
                    <div className={styles.innerContainer}>
                      <div className={styles.imageContainer}>
                        <Image
                          className={styles.image}
                          src={
                            item.chatType === "simple"
                              ? Simple
                              : item.chatType === "FileUpload"
                              ? FileChat
                              : item.chatType === "SqlChat"
                              ? SqlChat
                              : Simple
                          }
                          alt=""
                          layout="responsive"
                        />
                      </div>
                      <div className={styles.content}>
                        <p className={styles.cardTitle}>{item.title}</p>
                        <div className={styles.badgeContainer}>
                          <div>
                            <span className={styles.description}>
                              {item.modelName}
                            </span>
                          </div>
                          <div>
                            <Popover
                              content={SettingsContent}
                              title=""
                              trigger="click"
                              placement="bottomLeft"
                            >
                              <Button
                                className={styles.settingsBtn}
                                type="text"
                                style={{ padding: "0 8px" }}
                                onClick={() => {}}
                              >
                                <SettingOutlined />
                              </Button>
                            </Popover>
                          </div>
                        </div>

                        {/* //rename - delete   */}
                      </div>
                    </div>
                  </div>
                </Badge.Ribbon>
              </Col>
            );
          })}
      </Row>
    </div>
  );
};

export default Page2;
