import styles from "@/styles/containerThemes/home/pages/page1/page1.module.scss";
import { chatItemType } from "@/utils/types/chatTypes";
import { Avatar, message, Image, Modal, Skeleton, Button } from "antd";
import React, { useState } from "react";
import {
  CopyOutlined,
  RedoOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  ConsoleSqlOutlined,
} from "@ant-design/icons";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Input } from "antd";
import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "@/redux/asyncApi/users";

const { TextArea } = Input;

interface props {
  currentChat: chatItemType[] | null;
}

const ChatBox = ({ currentChat = [] }: props) => {
  const chat = useSelector((state: RootState) => state.chat);
  const app = useSelector((state: RootState) => state.app);

  const [modalContent, setModalContent] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sqlModalOpen, setSqlModalOpen] = useState(false);
  const [sqlQuery, setSqlQuery] = useState("");
  const [sqlResult, setSqlResult] = useState<any>(null);
  const [columnNames, setColumnNames] = useState<any>(null);

  const [isOpenMetricsModal, setIsOpenMetricsModal] = useState(false);
  const [metricsData, setMetricsData] = useState<any>(null);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onCloseSqlRunnerModal = () => {
    setColumnNames("");
    setSqlResult(null);
    setSqlQuery("");
    setSqlModalOpen(false);
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

  const queryRunner = async (connectionString: string) => {
    try {
      const payload = {
        connectionString: connectionString,
        sqlQuery: sqlQuery,
      };
      const response: AxiosResponse<ApiResponse> =
        await axios.post<ApiResponse>(`/api/postgresQueryRunner`, payload);
      if (response.data.error) {
        message.error(response.data.error);
      } else if (response.data.data && response.data.status === "success") {
        console.log(response.data.data);
        setSqlResult(response.data.data);
        setColumnNames(
          response.data.data.length > 0
            ? Object.keys(response.data.data[0])
            : []
        );
      }
    } catch (err) {
      message.error(`SQL Runner - Connection Lost`);
    }
  };

  function validateReadOnlyQuery(sqlQuery: string) {
    const forbiddenPattern =
      /^\s*(UPDATE|DELETE|INSERT|ALTER|DROP|TRUNCATE|CREATE|REPLACE)\s+/i;

    if (forbiddenPattern.test(sqlQuery)) {
      // throw new Error("");
      return false;
    }
    return true;
  }

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
                            {/* {currentChat.length - 1 === index && (
                              <RedoOutlined className={styles.icon} />
                            )} */}
                            <CopyOutlined
                              className={styles.icon}
                              onClick={() => {
                                {
                                  typeof item.content === "string" &&
                                    CopyText(item.content);
                                }
                              }}
                            />
                            <ExperimentOutlined
                              className={styles.icon}
                              onClick={() => {
                                setIsOpenMetricsModal(true);
                                setMetricsData(item.metrics);
                              }}
                            />
                            {chat.chatType === "data_wizard" && (
                              <ConsoleSqlOutlined
                                className={styles.icon}
                                onClick={() => {
                                  if (
                                    item &&
                                    typeof item.content === "string"
                                  ) {
                                    const regex = /```sql([\s\S]*?)```/g;
                                    const match = regex.exec(item.content);
                                    if (match) {
                                      const extractedSQL = match[1].trim();
                                      if (
                                        !validateReadOnlyQuery(extractedSQL)
                                      ) {
                                        message.error(
                                          `Only read queries (SELECT) are allowed. Queries that modify data or schema are prohibited.`
                                        );
                                      } else {
                                        setSqlQuery(extractedSQL);
                                        setSqlModalOpen(true);
                                      }
                                    } else {
                                      setSqlQuery("");
                                      message.open({
                                        type: "error",
                                        content: "No SQL Query found!",
                                      });
                                    }
                                  }
                                }}
                              />
                            )}
                          </div>
                        </React.Fragment>
                      )}
                      {item.content == "" && (
                        <Skeleton style={{ width: "100%" }} active />
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

      <Modal
        title="SQL Console"
        centered
        open={sqlModalOpen}
        onOk={() => setSqlModalOpen(false)}
        onCancel={() => onCloseSqlRunnerModal()}
        width={1000}
        maskClosable={false}
        data-theme={"light"}
        footer={null}
      >
        <div>
          {sqlQuery && (
            <TextArea
              style={{ margin: "8px 0 16px" }}
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              placeholder=""
              autoSize={{ minRows: 2, maxRows: 20 }}
            />
          )}
          {!sqlQuery && <div>NO SQL FOUND</div>}

          <Button
            onClick={() => {
              if (app.userInfo.databases.postgres) {
                queryRunner(app.userInfo.databases.postgres);
              } else {
                message.error(`SQL - Connection String missing`);
              }
            }}
          >
            Run Query
          </Button>

          {sqlResult && Array.isArray(sqlResult) && (
            <div style={{ margin: "12px 0" }}>
              <h4>RESULT</h4>
              <div>
                <table>
                  <thead>
                    <tr>
                      {columnNames.map((colName: any, index: any) => (
                        <th key={index}>{colName}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sqlResult && sqlResult.length > 0 ? (
                      sqlResult.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {columnNames.map((colName: any, colIndex: any) => (
                            <td key={colIndex}>{row[colName]}</td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={columnNames.length}>No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div>
            {sqlResult && Array.isArray(sqlResult) && (
              <Button
                onClick={() => {
                  queryRunner(app.userInfo.databases.postgres);

                  // message.error(``);
                }}
              >
                View in Graph
              </Button>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        title="Metrics"
        open={isOpenMetricsModal}
        onOk={() => {
          setIsOpenMetricsModal(false);
          setMetricsData(null);
        }}
        onCancel={() => {
          setIsOpenMetricsModal(false);
          setMetricsData(null);
        }}
        centered
        footer={null}
        data-theme={"light"}
      >
        {metricsData && (
          <table>
            {metricsData.model && (
              <tr>
                <th>Model</th>
                <td>{metricsData.model.value}</td>
              </tr>
            )}
            {metricsData.temperature && (
              <tr>
                <th>Temperature</th>
                <td>{metricsData.temperature}</td>
              </tr>
            )}
            {metricsData.input_tokens && (
              <tr>
                <th>Input Tokens</th>
                <td>{metricsData.input_tokens}</td>
              </tr>
            )}
            {metricsData.output_tokens && (
              <tr>
                <th>Output tokens</th>
                <td>{metricsData.output_tokens}</td>
              </tr>
            )}
            {metricsData.total_tokens && (
              <tr>
                <th>Total Tokens</th>
                <td>{metricsData.total_tokens}</td>
              </tr>
            )}
          </table>
        )}
      </Modal>
    </div>
  );
};

export default ChatBox;
