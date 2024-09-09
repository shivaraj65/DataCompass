import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError, AxiosResponse } from "axios";

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  data: any;
  status: string;
  error: string;
}

export interface LoginData {  
  email: string;
  password: string;
}

export interface LoginResponse {
  data: any;
  status: string;
  error: string;
}

export interface ApiError {
  message: string;
}

export const signupApi = createAsyncThunk<
  SignupResponse,
  SignupData,
  { rejectValue: string }
>("api/signup", async (signupData, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<SignupResponse> =
      await axios.post<SignupResponse>(`/api/signup`, signupData);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    return rejectWithValue(err.response?.data?.message || "An error occurred");
  }
});

export const loginApi = createAsyncThunk<
  LoginResponse,
  LoginData,
  { rejectValue: string }
>("api/login", async (loginData, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<SignupResponse> =
      await axios.post<SignupResponse>(`/api/login`, loginData);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    return rejectWithValue(err.response?.data?.message || "An error occurred");
  }
});
