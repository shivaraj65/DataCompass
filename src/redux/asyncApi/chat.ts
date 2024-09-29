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
  email: string;
}

export interface ChatData {
  // chatHistory: any[];
}

export const simpleChat = createAsyncThunk<any, void, { rejectValue: string }>(
  "api/simpleChat",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const state = getState() as RootState;

      await dispatch(
        addNewMessage({
          role: "assistant",
          content: "",
          metrics: {
            model: "model",
            temperature: "temperature",
          },
        })
      );

      //101 need to change for file uplaod. / multi modal switch...
      const chatHistory =
        state.chat.currentChat &&
        state.chat.currentChat.map((item) => {
          return [item.role, item.content];
        });
      const question =
        state.chat.currentChat &&
        state.chat.currentChat[state.chat.currentChat.length - 1].content;
      const model = state.chat.chatModel.value;
      const temperature = state.chat.chatTemperature;

      const payload = {
        chatHistory,
        question,
        model,
        temperature,
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
  const payload: chatSaveRequest = {
    threadID: state.chat.chatId ? state.chat.chatId : null,
    userId: state.app.userInfo && state.app.userInfo.email,
    title:
      state.chat.currentChat &&
      state.chat.currentChat[state.chat.currentChat.length - 2].content,
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

export const getChatMessages = createAsyncThunk<
  ApiResponse,
  getChatMessagesRequest,
  { rejectValue: string }
>("api/chatHistoryGet", async (getChatMessagesRequest, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.post<ApiResponse>(
      `/api/chatHistoryGet`,
      getChatMessagesRequest
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    return rejectWithValue(err.response?.data?.message || "An error occurred");
  }
});
