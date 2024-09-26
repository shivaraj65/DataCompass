import { Button, Input, Radio, RadioChangeEvent, Select, Tooltip } from "antd";
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
import { useState } from "react";

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
  const [value3, setValue3] = useState("simple");

  const options = [
    { label: "Simple", value: "simple" },
    { label: "RAG", value: "rag" },
    { label: "Data Wizard", value: "data_wizard" },
  ];

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSubmit();
    }
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
            <Radio.Group
              className={styles.chatTypeSelection}
              size="small"
              options={options}
              onChange={onChatTypeChange}
              value={chatType}
              optionType="button"
            />
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

        <div className={styles.flexContainer}>
          <TextArea
            className={styles.inputField}
            placeholder=""
            value={inputValue}
            onChange={onChangeInputValue}
            onKeyDown={handleKeyDown}
            // variant="filled"
            rows={2}
          />
          <Button type="text" size={"small"} className={styles.sendButton}>
            <AudioOutlined />
            {/* <AudioMutedOutlined />  */}
          </Button>
          <Button
            type="text"
            size={"small"}
            className={styles.sendButton}
            onClick={onSubmit}
          >
            <SendOutlined />
          </Button>
        </div>

        {!isChatPage && (
          <div className={styles.flexContainer2}>
            <div className={styles.wrapper}>
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

              {isSettingsOpen && (
                <Select
                  className={styles.ragSelection}
                  size="small"
                  value={rag.value}
                  status={rag.isAvailable ? "" : "error"}
                  onChange={onChangeRag}
                  options={[
                    { value: "in_memory", label: "Memory" },
                    { value: "pinecone", label: "Pinecone" },
                  ]}
                />
              )}
              {isSettingsOpen && (
                <Button
                  type="dashed"
                  size={"small"}
                  className={styles.fileAttach}
                >
                  <PlusCircleOutlined />
                  Attach
                </Button>
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
