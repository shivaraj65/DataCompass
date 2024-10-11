import { Avatar, Button, Col, Input, message, Modal, Row, Select } from "antd";
import styles from "@/styles/containerThemes/home/pages/settings/screens/integrations.module.scss";
import { userInfotypes } from "@/utils/types/appTypes";
import { EditOutlined, AppstoreAddOutlined } from "@ant-design/icons";
import { useState } from "react";
import { updateUserApi } from "@/redux/asyncApi/users";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch } from "react-redux";

interface props {
  userInfo: userInfotypes;
}

const modalConfig = [
  {
    title: "Add New OpenAI key",
    type: "LLM",
  },
  {
    title: "Add New Vector DB Connection",
    type: "RAG",
  },
  {
    title: "Add New SQL Connection String",
    type: "SQL",
  },
];

const Integrations = ({ userInfo }: props) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isLLMModalOpen, setIsLLMModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    type: "",
  });

  const [isNewUpdate, setIsNewUpdate] = useState(false);
  const [LLMKey, setLLMKey] = useState("");
  const [ragSelect, setRagSelect] = useState("pinecone");
  const [ragApiKey, setRagApiKey] = useState("");
  const [ragIndexName, setRagIndexName] = useState("");
  const [sqlSelect, setSqlSelect] = useState("postgres");
  const [connectionString, setConnectionString] = useState("");

  const showLLMModal = () => {
    setIsLLMModalOpen(true);
  };

  const handleLLMOk = async () => {
    if (isNewUpdate) {
      if (modalContent.type === "LLM") {
        if (LLMKey.length === 0) {
          message.open({
            type: "warning",
            content: "API Key cannot be empty",
          });
        } else {
          let LLMPayload = {
            id: userInfo.id,
            llmApiKeys: {
              openai: LLMKey,
            },
          };
          await dispatch(updateUserApi(LLMPayload));
          setLLMKey("");
          setIsLLMModalOpen(false);
        }
      } else if (modalContent.type === "RAG") {
        if (ragApiKey.length === 0 || ragIndexName.length === 0) {
          message.open({
            type: "warning",
            content: "API Key or Index cannot be empty",
          });
        } else {
          let RAGPayload = {
            id: userInfo.id,
            rag: {
              pinecone: {
                apikey: ragApiKey,
                index: ragIndexName,
              },
            },
          };
          await dispatch(updateUserApi(RAGPayload));
          setRagApiKey("");
          setRagIndexName("");
          setIsLLMModalOpen(false);
        }
      } else if (modalContent.type === "SQL") {
        if (connectionString.length === 0) {
          message.open({
            type: "warning",
            content: "Connection String cannot be empty",
          });
        } else {
          let sqlPayload = {
            id: userInfo.id,
            databases: {
              postgres: connectionString,
            },
          };
          await dispatch(updateUserApi(sqlPayload));
          setConnectionString("");
          setIsLLMModalOpen(false);
        }
      }
    } else {
      if (modalContent.type === "LLM") {
        if (LLMKey.length === 0) {
          message.open({
            type: "warning",
            content: "API Key cannot be empty",
          });
        } else {
          let LLMPayload = {
            id: userInfo.id,
            llmApiKeys: {
              openai: LLMKey,
            },
          };
          await dispatch(updateUserApi(LLMPayload));
          setLLMKey("");
          setIsLLMModalOpen(false);
        }
      } else if (modalContent.type === "RAG") {
        if (ragApiKey.length === 0 || ragIndexName.length === 0) {
          message.open({
            type: "warning",
            content: "API Key or Index cannot be empty",
          });
        } else {
          let RAGPayload = {
            id: userInfo.id,
            rag: {
              pinecone: {
                apikey: ragApiKey,
                index: ragIndexName,
              },
            },
          };
          await dispatch(updateUserApi(RAGPayload));
          setRagApiKey("");
          setRagIndexName("");
          setIsLLMModalOpen(false);
        }
      } else if (modalContent.type === "SQL") {
        if (connectionString.length === 0) {
          message.open({
            type: "warning",
            content: "Connection String cannot be empty",
          });
        } else {
          let sqlPayload = {
            id: userInfo.id,
            databases: {
              postgres: connectionString,
            },
          };
          await dispatch(updateUserApi(sqlPayload));
          setConnectionString("");
          setIsLLMModalOpen(false);
        }
      }
    }
    setIsNewUpdate(false);
  };

  const handleLLMCancel = () => {
    setIsLLMModalOpen(false);
    setModalContent({
      title: "",
      type: "",
    });
  };

  return (
    <div className={styles.integrationsContainer}>
      <div className={styles.integrationsHeader}>
        {/* <Avatar
          size="large"
          src="https://api.dicebear.com/7.x/miniavs/svg?seed=6"
        /> */}
        <span className={`${styles.userName} light-200`}>
          Integrations & Connected Apps
        </span>
      </div>
      <div className={styles.intagrationsBody}>
        <Row>
          <Col span={12}>
            <div className={`${styles.scrollerContent} bg-primary`}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  margin: "6px 6px 6px 0",
                  fontWeight: 500,
                }}
              >
                <span className={styles.title}>Saved API keys</span>
                <Button
                  onClick={() => {
                    setIsNewUpdate(true);
                    setModalContent(modalConfig[0]);
                    showLLMModal();
                  }}
                >
                  <AppstoreAddOutlined />
                </Button>
              </div>

              <table>
                {userInfo.llmApiKeys &&
                  Object.entries(userInfo.llmApiKeys).map(
                    ([key, value]: any, index) => (
                      <tr key={index}>
                        <td>{key}</td>
                        <td>{value.slice(0, 20) + " ..."}</td>
                        <td>
                          {userInfo.isEditable.llmApiKeys && (
                            <Button
                              className={styles.editButton}
                              type={"text"}
                              style={{ padding: "0 8px" }}
                              onClick={() => {
                                if (value) {
                                  setLLMKey(value);
                                }
                                setModalContent(modalConfig[0]);
                                showLLMModal();
                              }}
                            >
                              <EditOutlined />
                            </Button>
                          )}
                        </td>
                      </tr>
                    )
                  )}
              </table>
            </div>
            <div className={`${styles.scrollerContent} bg-primary`}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  margin: "6px 6px 6px 0",
                  fontWeight: 500,
                }}
              >
                <span className={styles.title}>Saved Vector DB</span>
                <Button
                  onClick={() => {
                    setIsNewUpdate(true);
                    setModalContent(modalConfig[1]);
                    showLLMModal();
                  }}
                >
                  <AppstoreAddOutlined />
                </Button>
              </div>
              <table>
                {userInfo.rag &&
                  Object.entries(userInfo.rag).map(
                    ([key, value]: any, index) => (
                      <tr key={index}>
                        <td>{key}</td>
                        {/* <td>{value.slice(0, 20) + " ..."}</td> */}
                        <td></td>
                        <td>
                          {userInfo.isEditable.rag && (
                            <Button
                              className={styles.editButton}
                              type={"text"}
                              style={{ padding: "0 8px" }}
                              onClick={() => {
                                if (value) {
                                  setRagApiKey(value.apikey);
                                  setRagIndexName(value.index);
                                }
                                setModalContent(modalConfig[1]);
                                showLLMModal();
                              }}
                            >
                              <EditOutlined />
                            </Button>
                          )}
                        </td>
                      </tr>
                    )
                  )}
              </table>
            </div>
          </Col>
          <Col span={12}>
            <div className={`${styles.scrollerContent} bg-primary`}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  margin: "6px 6px 6px 0",
                  fontWeight: 500,
                }}
              >
                <h4 className={styles.title}>Saved Databases</h4>
                <Button
                  onClick={() => {
                    setIsNewUpdate(true);
                    setModalContent(modalConfig[2]);
                    showLLMModal();
                  }}
                >
                  <AppstoreAddOutlined />
                </Button>
              </div>

              <table>
                {Object.entries(userInfo.databases).map(
                  ([key, value]: any, index) => (
                    <tr key={index}>
                      <td>{key}</td>
                      <td>{value.slice(0, 28) + " ..."}</td>
                      <td>
                        {userInfo.isEditable.rag && (
                          <Button
                            className={styles.editButton}
                            type={"text"}
                            style={{ padding: "0 8px" }}
                            onClick={() => {
                              if (value) {
                                setConnectionString(value);
                              }
                              setModalContent(modalConfig[2]);
                              showLLMModal();
                            }}
                          >
                            <EditOutlined />
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </table>
            </div>
          </Col>
        </Row>
      </div>

      <Modal
        title={modalContent && modalContent.title}
        open={isLLMModalOpen}
        onOk={handleLLMOk}
        onCancel={handleLLMCancel}
      >
        <div style={{ margin: "1.5rem 1rem" }}>
          {modalContent.type === "LLM" && (
            <div>
              <label>Enter a new OpenAI key:</label>
              <Input
                value={LLMKey}
                onChange={(e) => {
                  setLLMKey(e.target.value);
                }}
              />
            </div>
          )}

          {modalContent.type === "RAG" && (
            <div>
              <Select
                // defaultValue="pinecone"
                style={{ width: "50%", margin: "0 0 0.5rem" }}
                value={ragSelect}
                onChange={setRagSelect}
                options={[{ value: "pinecone", label: "pinecone" }]}
              />
              <p>Enter Api key: </p>
              <Input
                value={ragApiKey}
                onChange={(e) => {
                  setRagApiKey(e.target.value);
                }}
              />

              <p style={{ marginTop: "8px" }}>Enter Index Name: </p>
              <Input
                value={ragIndexName}
                onChange={(e) => {
                  setRagIndexName(e.target.value);
                }}
              />
            </div>
          )}
          {modalContent.type === "SQL" && (
            <div>
              <Select
                // defaultValue="pinecone"
                style={{ width: "50%", margin: "0 0 0.5rem" }}
                value={sqlSelect}
                onChange={setSqlSelect}
                options={[{ value: "postgres", label: "postgres" }]}
              />
              <p>Enter Connection String: </p>
              <Input
                value={connectionString}
                onChange={(e) => {
                  setConnectionString(e.target.value);
                }}
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Integrations;
