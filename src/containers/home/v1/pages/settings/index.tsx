import { Breadcrumb, Card, Col, Row } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import styles from "@/styles/containerThemes/home/pages/settings/settings.module.scss";
import React, { useState } from "react";
import { cardItems } from "./screens/settings";

interface props {
  userInfo: any;
}

const Settings = ({ userInfo }: props) => {
  const [breadCrumbList, setBreadCrumbList] = useState<string | null>(null);

  return (
    <div className={styles.settingsPageContainer}>
      <h1 className={styles.title}>Settings</h1>
      {breadCrumbList !== null && (
        <div className={styles.breadCrumbContainer}>
          <Breadcrumb
            items={[
              {
                title: (
                  <div
                    className={styles.breadcrumbItem}
                    onClick={() => {
                      setBreadCrumbList(null);
                    }}
                  >
                    <SettingOutlined />
                  </div>
                ),
              },
              ...(breadCrumbList
                ? [
                    {
                      title: (
                        <div
                          className={styles.breadcrumbItem}
                          onClick={() => {}}
                        >
                          <span>{breadCrumbList}</span>
                        </div>
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </div>
      )}

      {breadCrumbList === null && (
        <Row>
          {cardItems &&
            cardItems.map((item) => {
              if (item.isShow)
                return (
                  <Col span={8} className={styles.settingsCol} key={item.key}>
                    <Card
                      loading={false}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setBreadCrumbList(item.title);
                      }}
                    >
                      <Card.Meta
                        avatar={item.icon ? <item.icon /> : null}
                        title={item.title}
                        description={
                          <>
                            {item?.description?.map((desc, index) => {
                              return <p key={item.key + index}>{desc}</p>;
                            })}
                          </>
                        }
                      />
                    </Card>
                  </Col>
                );
            })}
        </Row>
      )}
      {cardItems &&
        breadCrumbList &&
        cardItems.map((item) => {
          if (item.title === breadCrumbList)
            return React.createElement(item.component);
        })}
    </div>
  );
};

export default Settings;
