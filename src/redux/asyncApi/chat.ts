import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError, AxiosResponse } from "axios";
import {
  addNewMessage,
  onMetricsCapture,
  onStreaming,
} from "../reducers/chatSlice";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store";

export interface ApiError {
  message: string;
}

export interface ApiResponse {
  data: any;
  status: string;
  error: string;
}

export interface chatSaveRequest {
  threadID?: string | null;
  userId: any;
  title?: any;
  chatType?: string;
  databaseConnection?: string;
  ragType?: string;
  externalRag?: string;
  question: any;
  answer: any;
  metrics: any;
}

export interface getChatMessagesRequest {
  threadId: string;
}

export interface getChatHistoryRequest {
  email: string;
}

export interface ChatData {
  // chatHistory: any[];
}
export interface simpleChatRequest{
  schemaString ?: string;
}

export const simpleChat = createAsyncThunk<any, simpleChatRequest, { rejectValue: string }>(
  "api/simpleChat",
  async (simpleChatRequest, { rejectWithValue, dispatch, getState }) => {
    console.log("simple chat request",simpleChatRequest)
    try {
      const state = getState() as RootState;

      await dispatch(
        addNewMessage({
          role: "assistant",
          content: "",
          metrics: {
            model: state.chat.chatModel,
            temperature: state.chat.chatTemperature,
          },
        })
      );

      //101 need to change for file uplaod. / multi modal switch...
      const chatHistory =
        state.chat.currentChat &&
        state.chat.currentChat.map((item) => {
          return { role: item.role, content: item.content };
        });
      const question =
        state.chat.currentChat &&
        state.chat.currentChat[state.chat.currentChat.length - 1].content;
      const model = state.chat.chatModel.value;
      const temperature = state.chat.chatTemperature;

      //additional parameters for the chat
      const isRag = state.chat.chatType === "rag";
      const ragType = state.chat.rag.value;
      const ragTypeExternal = state.chat.rag.value !== "in_memory";
      const pineconeKey = state.app.userInfo.rag.pinecone;

      const isSQL = state.chat.chatType === "data_wizard";      

      // const schemaString = `sales_table: ordernumber (integer), quantityordered (integer), priceeach (numeric), orderlinenumber (integer), sales (numeric), orderdate (timestamp with time zone), status (character varying), qtr_id (integer), month_id (integer), year_id (integer), productline (character varying), msrp (numeric), productcode (character varying), customername (character varying), phone (character varying), addressline1 (character varying), addressline2 (character varying), city (character varying), state (character varying), postalcode (character varying), country (character varying), territory (character varying), contactlastname (character varying), contactfirstname (character varying), dealsize (character varying).`;

      const payload = {
        chatHistory,
        question,
        model,
        temperature,
        ...(isSQL && simpleChatRequest ? { schemaString:simpleChatRequest.schemaString } : {}),
        ...(isRag && ragTypeExternal ? { pineconeKey } : {}),
      };

      const response = await fetch("/api/simpleChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.body) {
        throw new Error("ReadableStream not supported.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;

      while (!done) {
        const { value, done } = await reader.read();

        if (done) {
          console.log("final done trigger");
          await dispatch(chatSave());
          break;
        }

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          chunk.split("\n").forEach(async (line: string) => {
            if (line) {
              try {
                let newLine: string = line;
                if (line.startsWith("data: ")) {
                  newLine = line.substring(6);
                }
                if (newLine.trim() === "[DONE]") {
                  console.log("done triggered");

                  // return;
                } else if (newLine.trim() === "[ERROR]") {
                  return rejectWithValue("ERROR in Streaming");
                } else {
                  try {
                    let parsedData = JSON.parse(newLine);
                    if (parsedData) {
                      dispatch(onStreaming(parsedData?.kwargs?.content || ""));
                      if (parsedData?.kwargs?.usage_metadata) {
                        await dispatch(
                          onMetricsCapture(parsedData?.kwargs?.usage_metadata)
                        );
                      }
                    }
                  } catch (error) {
                    console.log("Invalid JSON");
                  }
                }
              } catch (error) {
                console.error("Error parsing JSON:", error);
              }
            }
          });
        }
      }
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      return rejectWithValue(
        err.response?.data?.message || "An error occurred"
      );
    }
  }
);

export const chatSave = createAsyncThunk<
  ApiResponse,
  void,
  { rejectValue: string }
>("api/chatSave", async (_, { rejectWithValue, getState }) => {
  const state = getState() as RootState;

  let threadTitle: string = "";
  const parsedContentObj =
    state.chat.currentChat &&
    state.chat.currentChat[state.chat.currentChat.length - 2].content;
  if (parsedContentObj === "string") {
    threadTitle = parsedContentObj;
  } else if (Array.isArray(parsedContentObj) && parsedContentObj.length > 0) {
    threadTitle = parsedContentObj[0].text ? parsedContentObj[0].text : "";
  }

  const payload: chatSaveRequest = {
    threadID: state.chat.chatId ? state.chat.chatId : null,
    userId: state.app.userInfo && state.app.userInfo.email,
    title: threadTitle,
    chatType: state.chat.chatType,
    // databaseConnection: null,
    // ragType: state.chat.rag.value,
    // externalRag:null,
    question:
      state.chat.currentChat &&
      state.chat.currentChat[state.chat.currentChat.length - 2].content,
    answer:
      state.chat.currentChat &&
      state.chat.currentChat[state.chat.currentChat?.length - 1].content,
    metrics:
      (state.chat.currentChat &&
        state.chat.currentChat[state.chat.currentChat?.length - 1].metrics) ||
      {},
  };
  try {
    const response: AxiosResponse<ApiResponse> = await axios.post<ApiResponse>(
      `/api/chatSave`,
      payload
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    return rejectWithValue(err.response?.data?.message || "An error occurred");
  }
});

export const getChatHistory = createAsyncThunk<
  ApiResponse,
  getChatHistoryRequest,
  { rejectValue: string }
>("api/chatHistoryGet", async (getChatHistoryRequest, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.post<ApiResponse>(
      `/api/chatHistoryGet`,
      getChatHistoryRequest
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    return rejectWithValue(err.response?.data?.message || "An error occurred");
  }
});

export const getChatMessages = createAsyncThunk<
  ApiResponse,
  getChatMessagesRequest,
  { rejectValue: string }
>(
  "api/chatMessagesGet",
  async (getChatMessagesRequest, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<ApiResponse> =
        await axios.post<ApiResponse>(
          `/api/chatMessagesGet`,
          getChatMessagesRequest
        );
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      return rejectWithValue(
        err.response?.data?.message || "An error occurred"
      );
    }
  }
);
