import React, { useState, useEffect } from "react";
import ChatBox from "@/components/ui/chatBox";
import { Input, Alert, Avatar, Button, Modal, Switch, message } from 'antd';
import styles from './page3.module.scss';
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import {
  RobotOutlined,
  UserOutlined,
  SettingOutlined
} from "@ant-design/icons";
import Marquee from 'react-fast-marquee';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

interface props {
  userInfo: any;
}

const { Search } = Input;

const Page3 = ({ userInfo }: props) => {
  const [history, setHistory] = useState<any[]>([
    // {
    //   id: "oihe",
    //   role: "user",
    //   content: "change the background color of the application.",
    //   loading: false,
    //   error: null,
    // },
    // {
    //   id: "oihe",
    //   role: "assistant",
    //   content: `Hang tight! The agent is working on this file **[aeohifowhefoihwe]** as we speak.`,
    //   loading: false,
    //   error: null,
    // },
  ]);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsInfo, setSettingsInfo] = useState({
    model: "gpt-4o-mini",
    projectLocation: "",
    supervised: true,
    temperature: "precise"
  });
  const [inputLocation, setInputLocation] = useState("");
  const [folderStructure, setFolderStructure] = useState(null);

  const [userQuestion, setUserQuestion] = useState("");

  useEffect(
    () => {
      if (!userInfo.llmApiKeys.openai) {
        message.open({
          type: "error",
          content: "Open AI keys are not updated.",
        });
      }
    }, []
  )

  const handleOk = () => {
    if (inputLocation !== "") {
      setSettingsInfo({
        model: "gpt-4o-mini",
        projectLocation: inputLocation,
        supervised: true,
        temperature: "precise"
      })
      setIsSettingsModalOpen(false);
      fetchProjectStructure(inputLocation);
      setInputLocation("");
    } else {
      message.open({
        type: "info",
        content: `Project Location cannot be EMPTY!`,
      });
    }
  }

  const handleCancel = () => {
    setInputLocation("");
    setIsSettingsModalOpen(false);
  }

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

  const fetchProjectStructure = async (path: string) => {
    try {
      const response = await axios.post("/api/getProjectStructureCopilot", {
        path: path,
      });
      setFolderStructure(response.data)
      return response.data;
    } catch (err:any) {
      if (err.response) {
        message.open({
          type: "error",
          content: `Error: ${err.response.data.error}`,
        });
      } else {
        message.open({
          type: "error",
          content: "An unknown error occurred.",
        });
      }
      return null;
    }
  }

  const fetchSpecificFileToModify = async (folderStructure: any) => {
    try {
      const response = await axios.post("/api/getFileToModifyCopilot", {
        folderStructure: folderStructure,
        question: userQuestion,
        model: settingsInfo.model,
        temperature: settingsInfo.temperature
      });
      // console.log("path data", response)
      if (response.status === 200) {
        return response.data ?.result ?.kwargs ?.content;
      } else {
        return null;
      }
    } catch (err:any) {
      if (err.response) {
        message.open({
          type: "error",
          content: `Error: ${err.response.data.error}`,
        });
      } else {
        message.open({
          type: "error",
          content: "An unknown error occurred.",
        });
      }
      return null;
    }
  }

  const fetchUpdatedContent = async (path: string) => {
    try {
      const response = await axios.post("/api/getUpdatedFileContents", {
        question: userQuestion,
        model: settingsInfo.model,
        temperature: settingsInfo.temperature,
        filePath: path
      });
      // console.log("path data", response.data)
      if (response.status === 200) {
        return response.data ?.result ?.kwargs ?.content;
      } else {
        return null;
      }
    } catch (err:any) {
      if (err.response) {
        message.open({
          type: "error",
          content: `Error: ${err.response.data.error}`,
        });
      } else {
        message.open({
          type: "error",
          content: "An unknown error occurred.",
        });
      }
      return null;
    }
  }

  const searchTrigger = async () => {
    if (!userInfo.llmApiKeys.openai) {
      message.open({
        type: "warning",
        content: "Open AI keys are not updated.",
      });
      return;
    }
    if (settingsInfo.projectLocation === "") {
      message.open({
        type: "warning",
        content: "Project Location is not configured in settings",
      });
      return;
    }
    if (userQuestion === "") {
      message.open({
        type: "warning",
        content: "Uh-oh! Got a question for me? Let's hear it!",
      });
      return;
    }

    let updatedHistory = [...history,
    {
      id: await uuidv4(),
      role: "user",
      content: `${userQuestion}`,
      loading: false,
      error: null,
    },
    {
      id: await uuidv4(),
      role: "assistant",
      content: ``,
      loading: true,
      error: null,
    }
    ];
    await setHistory([
      ...updatedHistory
    ])

    const projectStructure = await fetchProjectStructure(settingsInfo.projectLocation)
    console.log('project structure', projectStructure);
    if (projectStructure === null) {
      message.open({
        type: "error",
        content: "Yikes! Couldn't map the project structure. Wanna give it another shot? ",
      });
      return;
    }
    setUserQuestion("");
    //continue to next step...
    const fileFetchPath = await fetchSpecificFileToModify(projectStructure)
    console.log("file location", fileFetchPath);
    // updatedHistory[updatedHistory.length - 1] = {
    //   ...updatedHistory[updatedHistory.length - 1],
    //   content: `Hang tight! The agent is working on this file **[ ${fileFetchPath} ]** as we speak.`
    // }
    // await setHistory(updatedHistory);
    const result = await fetchUpdatedContent(fileFetchPath);
    const dataPrefix = `
**File to update** \n
${fileFetchPath} \n
`;
    // updatedHistory[updatedHistory.length - 1] = {
    //   ...updatedHistory[updatedHistory.length - 1],
    //   content: `${dataPrefix}` + `${result}\n`
    // }

    updatedHistory = await updatedHistory.map((item, index) => {
      if (index === updatedHistory.length - 1) {
        return {
          ...item,
          content: `${dataPrefix}${result}\n`
        };
      }
      return item;
    });
    setHistory(updatedHistory);
  }

  return (
    <div className={styles.page3}>
      <div className={styles.headerContainer}>
        <div className={styles.bannerContainer}>
          <Alert message=
            {
              <Marquee pauseOnHover gradient={false}>
                &nbsp; &nbsp; This feature’s got one RULE: Local Machine Only! 🖥️ Web version? Nope. Nada. Zilch. So, fire up your local setup and let the magic happen!  &nbsp; ----
              </Marquee>
            }
            type="info" showIcon closable />
        </div>
        <Button onClick={() => {
          setInputLocation(settingsInfo.projectLocation);
          setIsSettingsModalOpen(true);
        }}>
          <SettingOutlined />
        </Button>
      </div>
      <div className={styles.chatContainer}>
        {
          history && history.map(
            (item, index) => {
              return (
                <div key={index} className={styles.messageContainer}>
                  <div className={styles.userIconContainer}>
                    {
                      item.role === "user" ?
                        <Avatar style={{ backgroundColor: '#337ab7' }} className={styles.avatarIcon}> <UserOutlined /></Avatar>
                        :
                        <Avatar style={{ backgroundColor: '#8dc572' }} className={styles.avatarIcon}><RobotOutlined /></Avatar>
                    }
                  </div>
                  <div className={styles.messageContainer}>
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
                  </div>
                </div>
              )
            }
          )
        }

      </div>
      <div className={styles.searchBoxContainer}>

        <Search value={userQuestion}
          onChange={(e) => {
            setUserQuestion(e.target.value);
          }}
          onPressEnter={() => {
            console.log("enter triggered")
            searchTrigger();
          }}
          onSearch={() => {
            console.log("enter triggered")
            searchTrigger();
          }}
          placeholder="Ask Copilot Anything" loading={false} enterButton />
      </div>

      <Modal
        title="Chat Settings"
        open={isSettingsModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        footer={null}
      >
        <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
          <div>
            <span>Project Location -</span>
            <Input placeholder="./" variant="filled" value={inputLocation} onChange={(e) => {
              setInputLocation(e.target.value)
            }} />
          </div>
          <div>
            <span>Open.ai Model -</span>
            <Input placeholder="./" variant="filled" value={'gpt-4o-mini'} disabled />
          </div>
          <div>
            <Switch checkedChildren="Supervised" unCheckedChildren="Unsupervised" defaultChecked disabled />
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ flex: 1 }}></div>
            <Button onClick={handleOk}>Submit</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Page3;
