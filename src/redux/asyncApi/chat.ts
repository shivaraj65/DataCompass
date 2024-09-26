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
      const model = state.chat.chatModel.value
      const temperature = state.chat.chatTemperature

      const payload = {
        chatHistory,
        question,
        model,
        temperature
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
          break;
        }

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          chunk.split("\n").forEach((line: string) => {
            if (line) {
              try {
                let newLine: string = line;
                if (line.startsWith("data: ")) {
                  newLine = line.substring(6);
                }
                if (newLine.trim() === "[DONE]") {
                  return;
                } else if (newLine.trim() === "[ERROR]") {
                  return rejectWithValue("ERROR in Streaming");
                } else {
                  try {
                    let parsedData = JSON.parse(newLine);
                    if (parsedData) {
                      dispatch(onStreaming(parsedData?.kwargs?.content || ""));
                      if (parsedData?.kwargs?.usage_metadata) {
                        dispatch(
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
