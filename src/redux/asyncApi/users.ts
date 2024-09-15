import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError, AxiosResponse } from "axios";

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface ApiResponse {
  data: any;
  status: string;
  error: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateUserData {
  id: string;
  name?: string;
  password?: string;
  llmApiKeys?: any;
  databases?: any;
}

export interface ApiError {
  message: string;
}

export const signupApi = createAsyncThunk<
  ApiResponse,
  SignupData,
  { rejectValue: string }
>("api/signup", async (signupData, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.post<ApiResponse>(
      `/api/signup`,
      signupData
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    return rejectWithValue(err.response?.data?.message || "An error occurred");
  }
});

export const loginApi = createAsyncThunk<
  ApiResponse,
  LoginData,
  { rejectValue: string }
>("api/login", async (loginData, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.post<ApiResponse>(
      `/api/login`,
      loginData
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    return rejectWithValue(err.response?.data?.message || "An error occurred");
  }
});

export const updateUserApi = createAsyncThunk<
  ApiResponse,
  UpdateUserData,
  { rejectValue: string }
>("api/updateUser", async (UpdateUserData, { rejectWithValue }) => {
  try {
    console.log("do something");
    const response: AxiosResponse<ApiResponse> = await axios.post<ApiResponse>(
      `/api/updateUsers`,
      UpdateUserData
    );
    console.log("response.data upadate", response.data);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    return rejectWithValue(err.response?.data?.message || "An error occurred");
  }
});
