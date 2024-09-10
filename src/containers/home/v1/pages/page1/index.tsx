import { Button, Input, Radio, RadioChangeEvent, Select, Tag } from "antd";
import {
  SendOutlined,
  PlusCircleOutlined,
  AudioMutedOutlined,
  AudioOutlined,
  SettingOutlined,
  UpCircleOutlined,
  DownCircleOutlined,
} from "@ant-design/icons";
import styles from "@/styles/containerThemes/home/pages/page1/page1.module.scss";
import { useState } from "react";
import SearchBox from "@/components/ui/searchBox";
import {
  chatType,
  resetNewChat,
  setChatModel,
  setChatTemperature,
  setChatType,
  setInputValue,
  setRag,
} from "@/redux/reducers/chatSlice";
import { useDispatch } from "react-redux";
import ChatBox from "@/components/ui/chatBox";

interface props {
  chat: chatType;
}

const Page1 = ({ chat }: props) => {
  const dispatch = useDispatch();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const onChangeInputValue = (e: any) => {
    console.log(e.target.value);
    dispatch(setInputValue(e.target.value));
  };

  const onChatTypeChange = (e: any) => {
    dispatch(setChatType(e.target.value));
  };

  const onChangeChatModel = (model: string) => {
    dispatch(
      setChatModel({
        value: model,
        isAvailable: true,
      })
    );
  };

  const onChangeChatTemperature = (temperature: string) => {
    dispatch(setChatTemperature(temperature));
  };

  const onChangeRag = (rag: string) => {
    dispatch(
      setRag({
        value: rag,
        isAvailable: true,
      })
    );
  };

  const onChangeSettingsOpen = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const onResetSettings = () => {
    dispatch(resetNewChat());
  };

  return (
    <div className={styles.page1Container}>
      {chat.currentChat && chat.currentChat.length > 0 ? (
        <div className={styles.chatPage}>
          <div className={styles.chatHeader}>
            <div className={styles.tagContainer}>
              {chat.chatType && <Tag>{chat.chatType.toUpperCase()}</Tag>}
              {chat.chatModel.value && (
                <Tag>{chat.chatModel.value.toUpperCase()}</Tag>
              )}
              {chat.chatTemperature && (
                <Tag>{chat.chatTemperature.toUpperCase()}</Tag>
              )}
              {chat.rag && <Tag>{chat.rag.value.toUpperCase()}</Tag>}
            </div>
          </div>
          <ChatBox currentChat={chat.currentChat} />

          <SearchBox
            isChatPage={true} 
            inputValue={chat.inputValue}
            onChangeInputValue={onChangeInputValue}
            chatType={chat.chatType}
            onChatTypeChange={onChatTypeChange}
            chatModel={chat.chatModel}
            onChangeChatModel={onChangeChatModel}
            isSettingsOpen={isSettingsOpen}
            onChangeSettingsOpen={onChangeSettingsOpen}
            chatTemperature={chat.chatTemperature}
            onChangeChatTemperature={onChangeChatTemperature}
            rag={chat.rag}
            onChangeRag={onChangeRag}
            onResetSettings={onResetSettings}
          />
        </div>
      ) : (
        <SearchBox
          isChatPage={false}
          inputValue={chat.inputValue}
          onChangeInputValue={onChangeInputValue}
          chatType={chat.chatType}
          onChatTypeChange={onChatTypeChange}
          chatModel={chat.chatModel}
          onChangeChatModel={onChangeChatModel}
          isSettingsOpen={isSettingsOpen}
          onChangeSettingsOpen={onChangeSettingsOpen}
          chatTemperature={chat.chatTemperature}
          onChangeChatTemperature={onChangeChatTemperature}
          rag={chat.rag}
          onChangeRag={onChangeRag}
          onResetSettings={onResetSettings}
        />
      )}
    </div>
  );
};

export default Page1;
