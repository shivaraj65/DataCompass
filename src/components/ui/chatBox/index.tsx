import styles from "@/styles/containerThemes/home/pages/page1/page1.module.scss";
import { chatItemType } from "@/utils/types/chatTypes";
import { Avatar, message } from "antd";
import React from "react";
import {
  CopyOutlined,
  RedoOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";

interface props {
  currentChat: chatItemType[] | null;
}

const ChatBox = ({ currentChat = [] }: props) => {
  const CopyText = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        () => {
          message.open({
            type: "info",
            content: "Text Copied",
          });
        },
        (err) => {
          message.open({
            type: "warning",
            content: "Failed to Copy",
          });
        }
      );
    } else {
      message.open({
        type: "warning",
        content: "Update your Browser! Unsupport Clipboard API.",
      });
    }
  };
  return (
    <div className={styles.ChatContainer}>
      {currentChat &&
        currentChat.map((item, index) => {
          return (
            <div key={index} style={{ display: "flex" }}>
              {item.role === "user" ? (
                <React.Fragment>
                  <div style={{ flex: 1 }}></div>
                  <div className={styles.userMessageContainer}>
                    <Avatar className={styles.avatarIcon}>S</Avatar>

                    <div className={styles.flexEnd}>
                      {item.content && typeof item.content === "string" && (
                        <React.Fragment>
                          <p className={styles.question}>{item.content}</p>
                          <div className={styles.iconsCont}>
                            <CopyOutlined
                              className={styles.icon}
                              onClick={() => {
                                {
                                  typeof item.content === "string" &&
                                    CopyText(item.content);
                                }
                              }}
                            />
                          </div>
                        </React.Fragment>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className={styles.assistantMessageContainer}>
                    <Avatar className={styles.avatarIcon}>A</Avatar>
                    <div className={styles.flexStart}>
                      {item.content && typeof item.content === "string" && (
                        <React.Fragment>
                          <p className={styles.answer}>{item.content}</p>
                          <div className={styles.iconsCont}>
                            {currentChat.length - 1 === index && (
                              <RedoOutlined className={styles.icon} />
                            )}
                            <CopyOutlined
                              className={styles.icon}
                              onClick={() => {
                                {
                                  typeof item.content === "string" &&
                                    CopyText(item.content);
                                }
                              }}
                            />
                            <ExperimentOutlined className={styles.icon} />
                          </div>
                        </React.Fragment>
                      )}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}></div>
                </React.Fragment>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default ChatBox;
