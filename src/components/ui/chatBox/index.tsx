import styles from "@/styles/containerThemes/home/pages/page1/page1.module.scss";
import { chatItemType } from "@/utils/types/chatTypes";
import { Avatar } from "antd";
import React from "react";

interface props {
  currentChat: chatItemType[] | null;
}

const ChatBox = ({ currentChat = [] }: props) => {
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

                    {item.content && typeof item.content === "string" && (
                      <p className={styles.question}>{item.content}</p>
                    )}
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className={styles.assistantMessageContainer}>
                    <Avatar className={styles.avatarIcon}>A</Avatar>
                    {item.content && typeof item.content === "string" && (
                      <p className={styles.answer}>{item.content}</p>
                    )}
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
