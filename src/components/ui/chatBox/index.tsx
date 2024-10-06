import styles from "@/styles/containerThemes/home/pages/page1/page1.module.scss";
import { chatItemType } from "@/utils/types/chatTypes";
import { Avatar, message, Image, Modal } from "antd";
import React, { useState } from "react";
import {
  CopyOutlined,
  RedoOutlined,
  ExperimentOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface props {
  currentChat: chatItemType[] | null;
}

const ChatBox = ({ currentChat = [] }: props) => {
  const [modalContent, setModalContent] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
                          {typeof item.content === "string" && (
                            <p className={styles.question}>{item.content}</p>
                          )}
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
                      {Array.isArray(item.content) && (
                        <React.Fragment>
                          {item.content.map((it: any, index: number) => {
                            if (it.type === "text" && index === 0) {
                              return (
                                <p
                                  key={JSON.stringify(it)}
                                  className={styles.question}
                                >
                                  {it.text}
                                </p>
                              );
                            }
                            if (it.type === "text" && index !== 0) {
                              return (
                                <p
                                  key={JSON.stringify(it)}
                                  className={styles.question}
                                  style={{
                                    cursor: "pointer",
                                    boxShadow:
                                      "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
                                  }}
                                  onClick={() => {
                                    setModalContent(it.text);
                                    showModal();
                                  }}
                                >
                                  <span> file_Attachment.pdf </span>{" "}
                                  <FileTextOutlined />
                                </p>
                              );
                            }
                            if (it.type === "image_url") {
                              return (
                                <Image
                                  key={JSON.stringify(it)}
                                  style={{ marginTop: "8px" }}
                                  width={200}
                                  src={it.image_url && it.image_url.url}
                                />
                              );
                            }
                          })}
                          <div className={styles.iconsCont}>
                            <CopyOutlined
                              className={styles.icon}
                              onClick={() => {
                                {
                                  Array.isArray(item.content) &&
                                    item.content.map((it) => {
                                      if (
                                        it.type === "text" &&
                                        typeof it.text === "string"
                                      ) {
                                        CopyText(it.text);
                                      }
                                    });
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
                          <p className={styles.answer}>
                            <Markdown
                              remarkPlugins={[remarkGfm]}
                              className={styles.markdown_comp}
                              components={{
                                code(props) {
                                  const { children, className, node, ...rest } =
                                    props;
                                  const match = /language-(\w+)/.exec(
                                    className || ""
                                  );
                                  return match ? (
                                    <SyntaxHighlighter
                                      // {...rest}
                                      language={match[1]}
                                      style={atomDark}
                                    >
                                      {String(children).replace(/\n$/, "")}
                                    </SyntaxHighlighter>
                                  ) : (
                                    <code {...rest} className={className}>
                                      {children}
                                    </code>
                                  );
                                },
                              }}
                            >
                              {item && typeof item.content === "string"
                                ? item.content
                                : null}
                            </Markdown>
                          </p>
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

      <Modal
        title="Extracted File Content"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        footer={null}
      >
        {modalContent && <p>{modalContent}</p>}
      </Modal>
    </div>
  );
};

export default ChatBox;
