/**
 * this slice will contain CHAT level data.
 * -> chat info
 */

import {
  chatHistoryType,
  chatItemType,
  fileDataType,
} from "@/utils/types/chatTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  chatSave,
  getChatHistory,
  getChatMessages,
  simpleChat,
} from "../asyncApi/chat";

const DummyChat: chatItemType[] = [
  {
    id: "1",
    role: "user",
    content:
      "Hi, I’m trying to connect a new data source to my dashboard. Can you guide me?",
    metrics: null,
    loading: false,
    error: null,
  },
  {
    id: "2",
    role: "assistant",
    content:
      "Of course! What type of data source are you trying to integrate—SQL, CSV, or something else?",
    metrics: null,
    loading: false,
    error: null,
  },
  {
    id: "3",
    role: "user",
    content: "I have an SQL database I want to connect.",
    metrics: null,
    loading: false,
    error: null,
  },
  {
    id: "4",
    role: "assistant",
    content:
      "Great! First, make sure you have the connection details handy, like the server address, username, password, and database name. I can help you set up the connection string if you share those details.",
    metrics: null,
    loading: false,
    error: null,
  },
  {
    id: "5",
    role: "user",
    content: "Here are the details. [Shares information]",
    metrics: null,
    loading: false,
    error: null,
  },
  {
    id: "6",
    role: "assistant",
    content:
      "Perfect! I’ve set up the connection string for you. You just need to test the connection on your dashboard now. If it doesn’t work, I can troubleshoot it further.",
    metrics: null,
    loading: false,
    error: null,
  },
  {
    id: "7",
    role: "user",
    content: "It worked! Thanks for your help.",
    metrics: null,
    loading: false,
    error: null,
  },
  {
    id: "8",
    role: "assistant",
    content:
      "Awesome! Let me know if you need any more assistance setting up queries or visualizations for your data.",
    metrics: null,
    loading: false,
    error: null,
  },
];

export interface chatType {
  //states related to the searchBox..
  inputValue: string;
  chatType: string;
  chatModel: {
    value: string;
    isAvailable: boolean;
  };
  chatTemperature: string;
  rag: {
    value: string;
    isAvailable: boolean;
  };
  file: fileDataType | null;
  currentChat: chatItemType[] | null;
  chatId: string | null;
  chatHistory: chatHistoryType;
  databaseSchema: any;
  //global level loading / error flags...
  loading: boolean;
  error: string | null;
}

const initialState: chatType = {
  inputValue: "",
  chatType: "simple",
  chatModel: {
    value: "gpt-4o-mini",
    isAvailable: true,
  },
  chatTemperature: "precise",
  rag: {
    value: "in_memory",
    isAvailable: true,
  },
  file: null,
  currentChat: null,
  chatId: null,
  chatHistory: {
    history: null,
    loading: false,
    error: null,
  },
  databaseSchema:null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setInputValue(state, action: PayloadAction<string>) {
      state.inputValue = action.payload;
    },
    setChatType(state, action: PayloadAction<string>) {
      state.chatType = action.payload;
    },
    setChatModel(state, action: PayloadAction<any>) {
      state.chatModel = action.payload;
    },
    setChatTemperature(state, action: PayloadAction<string>) {
      state.chatTemperature = action.payload;
    },
    setRag(state, action: PayloadAction<any>) {
      state.rag = action.payload;
    },
    resetNewChat(state) {
      state.inputValue = "";
      state.chatType = "simple";
      state.chatModel = {
        value: "gpt-4o-mini",
        isAvailable: true,
      };
      state.chatTemperature = "precise";
      state.rag = {
        value: "in_memory",
        isAvailable: true,
      };
      state.file = null;
      state.currentChat = null;
      state.loading = false;
      state.error = null;
    },
    addNewMessage(state, action) {
      let chatArr = state.currentChat;
      chatArr = [
        ...(chatArr ? chatArr : []),
        {
          id: null,
          role: action.payload.role,
          content: action.payload.content,
          metrics: action.payload.metrics,
          loading: false,
          error: null,
        },
      ];
      state.currentChat = chatArr;
    },
    onStreaming(state, action) {
      let chatArr = state.currentChat;
      if (chatArr && chatArr.length > 0)
        chatArr[chatArr.length - 1].content += action.payload;
    },
    onMetricsCapture(state, action) {
      let chatArr = state.currentChat;
      if (chatArr && chatArr.length > 0)
        chatArr[chatArr.length - 1].metrics = {
          ...chatArr[chatArr.length - 1].metrics,
          ...action.payload,
        };
    },
    onHistorySelect(state, action) {
      state.inputValue = "";
      state.chatType = action.payload.chatType;
      // state.chatModel = { value: action.payload.chatModel, isAvailable: true };
      // state.chatTemperature = action.payload.chatTemperature;
      state.rag = {
        value: action.payload.rag,
        isAvailable: true,
      };
      state.file = action.payload.file;
      state.chatId = action.payload.threadId;
    },
    onDatabaseSchemaChnage(state, action){
        state.databaseSchema = action.payload.schema;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(simpleChat.pending, (state) => {
        let chatArr = state.currentChat;
        if (chatArr && chatArr.length > 0)
          chatArr[chatArr.length - 1].loading = true;
        state.currentChat = chatArr;
      })
      .addCase(simpleChat.fulfilled, (state, action: PayloadAction<any>) => {
        let chatArr = state.currentChat;
        if (chatArr && chatArr.length > 0) {
          chatArr[chatArr.length - 1].error = null;
          chatArr[chatArr.length - 1].loading = false;
          // chatArr[chatArr.length - 1].metrics = action.payload.metrics;
          state.currentChat = chatArr;
        }
      })
      .addCase(simpleChat.rejected, (state, action: PayloadAction<any>) => {
        let chatArr = state.currentChat;
        if (chatArr && chatArr.length > 0)
          chatArr[chatArr.length - 1].error =
            action.payload.error || "An error occurred";
        state.currentChat = chatArr;
      })
      .addCase(chatSave.pending, (state) => {
        let chatArr = state.currentChat;
        if (chatArr && chatArr.length > 0)
          chatArr[chatArr.length - 1].loading = true;
        state.currentChat = chatArr;
      })
      .addCase(chatSave.fulfilled, (state, action: PayloadAction<any>) => {
        let chatArr = state.currentChat;
        if (chatArr && chatArr.length > 0) {
          chatArr[chatArr.length - 1].error = null;
          chatArr[chatArr.length - 1].loading = false;
          // chatArr[chatArr.length - 1].metrics = action.payload.metrics;

          //101 save the thread id, message id to the respective chats.
          state.chatId =
            (action.payload.data?.thread && action.payload.data?.thread.id) ||
            state.chatId;

          chatArr[chatArr.length - 2].id =
            action.payload.data?.chatMessages[1].id ||
            chatArr[chatArr.length - 2].id;

          chatArr[chatArr.length - 1].id =
            action.payload.data?.chatMessages[0].id ||
            chatArr[chatArr.length - 1].id;
        }
        state.currentChat = chatArr;
      })
      .addCase(chatSave.rejected, (state, action: PayloadAction<any>) => {
        let chatArr = state.currentChat;
        if (chatArr && chatArr.length > 0)
          chatArr[chatArr.length - 1].error =
            action.payload.error || "An error occurred";
        state.currentChat = chatArr;
      })
      .addCase(getChatHistory.pending, (state) => {
        state.chatHistory.loading = true;
        state.chatHistory.error = null;
      })
      .addCase(
        getChatHistory.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.chatHistory.history = action.payload.data;
          state.chatHistory.loading = false;
          state.chatHistory.error = null;
        }
      )
      .addCase(getChatHistory.rejected, (state, action: PayloadAction<any>) => {
        state.chatHistory.loading = false;
        state.chatHistory.error = action.payload.error || "An error occurred";
      })
      .addCase(getChatMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getChatMessages.fulfilled,
        (state, action: PayloadAction<any>) => {
          const incomingPayload = action.payload.data;
          let serialisedPayload: chatItemType[] = [];
          incomingPayload.map((item: any) => {
            serialisedPayload.push({
              id: item.id ? item.id : null,
              role: item.role ? item.role : null,
              content: item.context ? item.context : null,
              metrics: item.metrics ? item.metrics : null,
              loading: false,
              error: null,
              threadId: item.threadId,
            });
          });
          state.currentChat = serialisedPayload;
          if (incomingPayload.length > 0) {
            state.chatModel = {
              value:
                incomingPayload[incomingPayload.length - 1].metrics.model.value,
              isAvailable: true,
            };
            state.chatTemperature =
              incomingPayload[incomingPayload.length - 1].metrics.temperature;
          }
        }
      )
      .addCase(
        getChatMessages.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload.error || "An error occurred";
        }
      );
  },
});

export const {
  setInputValue,
  setChatType,
  setChatModel,
  setChatTemperature,
  setRag,
  resetNewChat,
  addNewMessage,
  onStreaming,
  onMetricsCapture,
  onHistorySelect,
  onDatabaseSchemaChnage
} = chatSlice.actions;
export default chatSlice.reducer;
