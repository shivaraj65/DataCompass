import {
  Button,
  Input,
  message,
  Radio,
  RadioChangeEvent,
  Select,
  Tooltip,
  Upload,
  UploadProps,
} from "antd";
import {
  SendOutlined,
  PlusCircleOutlined,
  AudioMutedOutlined,
  AudioOutlined,
  SettingOutlined,
  UpCircleOutlined,
  DownCircleOutlined,
  ProjectOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import styles from "@/styles/containerThemes/home/pages/page1/page1.module.scss";
import React, { useEffect, useState } from "react";
import modelConfig from "@/config.js/modelConfig";
import axios, { AxiosResponse } from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ApiResponse } from "@/redux/asyncApi/chat";

const { TextArea } = Input;

interface props {
  isChatPage: boolean;
  inputValue: string;
  onChangeInputValue: any;
  chatType: string;
  onChatTypeChange: any;
  chatModel: {
    value: string;
    isAvailable: boolean;
  };
  onChangeChatModel: any;
  isSettingsOpen: boolean;
  onChangeSettingsOpen: any;
  chatTemperature: string;
  onChangeChatTemperature: any;
  rag: {
    value: string;
    isAvailable: boolean;
  };
  onChangeRag: any;
  onResetSettings: any;
  onSubmit: any;
}

const SearchBox = ({
  isChatPage,
  inputValue,
  onChangeInputValue,
  chatType,
  onChatTypeChange,
  chatModel,
  onChangeChatModel,
  isSettingsOpen,
  onChangeSettingsOpen,
  chatTemperature,
  onChangeChatTemperature,
  rag,
  onChangeRag,
  onResetSettings,
  onSubmit,
}: props) => {
  const userInfo = useSelector((state: RootState) => state.app.userInfo);

  const [fileUpload, setFileUpload] = useState<any[]>([]);
  const [extractedFileData, setExtractedFileData] = useState<any[]>([]);
  const [stringifiedSchema, setStringifiedSchema] = useState("");

  const options = [
    { label: "Simple", value: "simple" },
    { label: "RAG", value: "rag" },
    { label: "Data Wizard", value: "data_wizard" },
  ];

  const handleKeyDown = async (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();

      let base64FileArr: any[] = [];
      let extractedDataArr: any[] = [];

      const readFileAsBase64 = (file: Blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = function (event: any) {
            resolve(event.target.result);
          };
          reader.onerror = function (error) {
            reject(error);
          };
          reader.readAsDataURL(file);
        });
      };

      for (let i = 0; i < fileUpload.length; i++) {
        try {
          const base64String = await readFileAsBase64(
            fileUpload[i].originFileObj
          );
          base64FileArr.push(base64String);
          //call the api and get extracted data for pdf files only
          const payload = {
            data: base64String,
          };
          if (fileUpload[i].type === "application/pdf") {
            console.log("b64", payload);
            const res = await axios.post("/api/pdfTextExtractor", payload);
            if (!res.data.error) {
              extractedDataArr.push(res.data.data);
            }
          }
        } catch (error) {
          console.error("Error reading file:", error);
        }
      }

      if (
        fileUpload &&
        fileUpload.length > 0 &&
        fileUpload[0].type === "application/pdf"
      ) {
        setExtractedFileData(extractedDataArr);
        //onSibmit change for files
        onSubmit({ dataArr: extractedDataArr, type: "file" });
      } else if (fileUpload && fileUpload.length > 0) {
        onSubmit({ dataArr: base64FileArr, type: "image" });
      } else if(chatType === "data_wizard"){
        onSubmit({schemaString:stringifiedSchema});
      }else{
        onSubmit(null);
      }

      setFileUpload([]);
    }
  };

  useEffect(() => {
    if (!modelConfig[chatModel.value as keyof typeof modelConfig].multimodal) {
      setFileUpload([]);
    }
  }, [chatModel]);

  useEffect(() => {
    if (chatType === "data_wizard") {
      if (userInfo.databases.postgres) {
        fetchSchema(userInfo.databases.postgres);
      } else {
        message.error(
          `Database Connection String is missing. Goto settings -> integrations to update!`
        );
      }
    }
  }, [chatType]);

  const fetchSchema = async (connectionString: string) => {
    try {
      const payload = {
        connectionString: connectionString,
      };
      const response: AxiosResponse<ApiResponse> =
        await axios.post<ApiResponse>(`/api/getPGSchema`, payload);
      if (response.data.error) {
        message.error(response.data.error);
      } else if (response.data.data && response.data.status === "success") {
        console.log(response.data.data);
        const resp = parseDataToString(response.data.data);
        setStringifiedSchema(resp);
        // console.log(resp);   
      }
    } catch (err) {
      message.error(`Database Connection Error`);
    }
  };

  function parseDataToString(data: any): string {
    const result: string[] = [];
  
    for (const [key, value] of Object.entries(data) as [string, any]) {
      const columns = value.map((obj: any) => `${obj.column_name} (${obj.data_type})`).join(", ");
      result.push(`${key}: ${columns}.`);
    }
    return result.join("\n"); 
  }

  const fileUploadProps: UploadProps = {
    beforeUpload: (file: any) => {
      if (chatType === "rag") {
        const fileModelConfig: any[] | null =
          modelConfig[chatModel.value as keyof typeof modelConfig].fileUpload;
        const findTypeInConfig = fileModelConfig
          ? fileModelConfig.includes(file.type)
          : false;
        if (!findTypeInConfig) {
          message.error(
            `${file.name} is not a supported file format. upload PDF only`
          );
        }
        // return findTypeInConfig || Upload.LIST_IGNORE;
        return false;
      } else {
        const imageModelconfig: any[] | null =
          modelConfig[chatModel.value as keyof typeof modelConfig].imageUpload;
        const findTypeInConfig = imageModelconfig
          ? imageModelconfig.includes(file.type)
          : false;
        if (!findTypeInConfig) {
          message.error(
            `${file.name} is not a supported file format. upload only PNG / JPEG only`
          );
        }
        return findTypeInConfig || Upload.LIST_IGNORE;
      }
    },
    onChange: (info) => {
      console.log(info.fileList);
      setFileUpload(info.fileList);
    },
  };

  return (
    <>
      <div
        className={
          isChatPage ? styles.searchContainerChatPage : styles.searchContainer
        }
      >
        {!isChatPage && (
          <p className={styles.searchTitle}>Where knowledge begins</p>
        )}

        {!isChatPage && (
          <div className={styles.topControlsContainer}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Radio.Group
                className={styles.chatTypeSelection}
                size="small"
                options={options}
                onChange={onChatTypeChange}
                value={chatType}
                optionType="button"
              />
              <Select
                className={styles.modelSelection}
                size="small"
                value={chatModel.value}
                status={chatModel.isAvailable ? "" : "error"}
                onChange={onChangeChatModel}
                options={[
                  { value: "gpt-3.5-turbo", label: "GPT 3.5" },
                  { value: "gpt-4o-mini", label: "GPT 4o mini" },
                ]}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              {isSettingsOpen && (
                <Button type="dashed" size={"small"} className={styles.prompt}>
                  Prompt
                  <ProjectOutlined />
                </Button>
              )}
              <Button
                type="dashed"
                size={"small"}
                className={styles.prompt}
                onClick={onResetSettings}
              >
                <ReloadOutlined />
              </Button>
            </div>
          </div>
        )}

        {isChatPage &&
          modelConfig[chatModel.value as keyof typeof modelConfig]
            ?.multimodal && (
            <div
              className={styles.topControlsContainer}
              style={{ display: "flex", flexDirection: "row-reverse" }}
            >
              <Upload {...fileUploadProps} fileList={fileUpload} action={'/api/noop'}>
                <Button
                  type="dashed"
                  size={"small"}
                  className={styles.fileAttach}
                >
                  <PlusCircleOutlined />
                </Button>
              </Upload>
            </div>
          )}

        <div className={styles.flexContainer}>
          <Input
            className={styles.inputField}
            placeholder=""
            value={inputValue}
            onChange={onChangeInputValue}
            onKeyDown={handleKeyDown}
            // variant="filled"
            // rows={1}
          />
          {/* <Button type="text" size={"small"} className={styles.sendButton}>
            <AudioOutlined />
             <AudioMutedOutlined />  
          </Button>  */}
          <Button
            type="text"
            size={"small"}
            className={styles.sendButton}
            onClick={async () => {
              let base64FileArr: any[] = [];

              const readFileAsBase64 = (file: Blob) => {
                return new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = function (event: any) {
                    resolve(event.target.result);
                  };
                  reader.onerror = function (error) {
                    reject(error);
                  };
                  reader.readAsDataURL(file);
                });
              };

              for (let i = 0; i < fileUpload.length; i++) {
                try {
                  const base64String = await readFileAsBase64(
                    fileUpload[i].originFileObj
                  );
                  base64FileArr.push(base64String);
                } catch (error) {
                  console.error("Error reading file:", error);
                }
              }

              onSubmit({ dataArr: base64FileArr, type: "image" });
              setFileUpload([]);
            }}
          >
            <SendOutlined />
          </Button>
        </div>

        {!isChatPage && (
          <div className={styles.flexContainer2}>
            <div className={styles.wrapper}>
              {isSettingsOpen && (
                <Select
                  className={styles.temperatureSelection}
                  size="small"
                  value={chatTemperature}
                  onChange={onChangeChatTemperature}
                  options={[
                    { value: "precise", label: "Precise" },
                    { value: "balanced", label: "Balanced" },
                    { value: "creative", label: "Creative" },
                  ]}
                />
              )}
              {isSettingsOpen &&
                chatType === "rag" &&
                modelConfig[chatModel.value as keyof typeof modelConfig]
                  ?.rag && (
                  <Select
                    className={styles.ragSelection}
                    size="small"
                    value={rag.value}
                    status={rag.isAvailable ? "" : "error"}
                    onChange={(e) => {
                      if (
                        userInfo.rag?.pinecone?.apikey &&
                        userInfo.rag?.pinecone?.index
                      ) {
                        onChangeRag(e);
                      } else {
                        message.error(
                          `Pinecone Keys are not updated in Settings/Integration`
                        );
                      }
                    }}
                    options={[
                      { value: "in_memory", label: "Session" },
                      { value: "pinecone", label: "Pinecone" },
                    ]}
                  />
                )}
              {isSettingsOpen &&
                modelConfig[chatModel.value as keyof typeof modelConfig]
                  ?.multimodal && (
                  <Upload {...fileUploadProps} fileList={fileUpload} action={'/api/noop'}>
                    <Button
                      type="dashed"
                      size={"small"}
                      className={styles.fileAttach}
                    >
                      <PlusCircleOutlined />
                      Attach
                    </Button>
                  </Upload>
                )}
            </div>
            <Tooltip
              placement="bottomRight"
              title={isSettingsOpen ? "hide" : "More Settings"}
            >
              <Button
                type="dashed"
                size={"small"}
                className={styles.morebutton}
                onClick={onChangeSettingsOpen}
              >
                <SettingOutlined />
                {isSettingsOpen ? (
                  <UpCircleOutlined className={styles.arrow} />
                ) : (
                  <DownCircleOutlined className={styles.arrow} />
                )}
              </Button>
            </Tooltip>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBox;
