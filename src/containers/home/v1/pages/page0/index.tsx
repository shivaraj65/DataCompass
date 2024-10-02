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
import React, { useState } from "react";
import SearchBox from "@/components/ui/searchBox";
import {
  addNewMessage,
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
import { simpleChat } from "@/redux/asyncApi/chat";
import { AppDispatch } from "@/redux/store";
import ContentLoader from "@/components/ui/contentLoader";

interface props {
  chat: chatType;
}

const Page0 = ({ chat }: props) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const onChangeInputValue = (e: any) => {
    // console.log(e.target.value);
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

  const resetInputBox = () => {
    dispatch(setInputValue(""));
  };

  const onSubmit = async () => {
    await dispatch(
      addNewMessage({
        role: "user",
        content: chat.inputValue,
        metrics: {
          model: chat.chatModel,
          temperature: chat.chatTemperature,
        },
      })
    );

    dispatch(simpleChat());
    resetInputBox();
  };

  return (
    <div className={styles.page1Container}>
      {chat.currentChat && chat.currentChat.length > 0 ? (
        <div className={styles.chatPage}>
          <div className={styles.chatHeader}>
            <div className={styles.tagContainer}>
              {chat.chatType && <Tag>{chat.chatType.toUpperCase()}</Tag>}
              {chat.chatModel.value && (
                <Tag>{chat.chatModel.value}</Tag>
              )}
              {chat.chatTemperature && (
                <Tag>{chat.chatTemperature}</Tag>
              )}
              {chat.rag.value && <Tag>{chat.rag.value.toUpperCase()}</Tag>}
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
            onSubmit={onSubmit}
          />
        </div>
      ) : (
        <React.Fragment>
          <ContentLoader/>
        </React.Fragment>
      )}
    </div>
  );
};

export default Page0;
