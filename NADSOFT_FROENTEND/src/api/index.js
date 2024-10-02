// api.js
import axios from "axios";

const baseURL = "http://localhost:3000";

const handleApiCall = async (method, endpoint, data = null) => {
  try {
    const url = `${baseURL}${endpoint}`;
    const response = await axios({ method, url, data });
    return response.data;
  } catch (error) {
    console.error("API Request Error:", error.response?.data?.error);
    throw new Error(error.response?.data?.error || "API request failed");
  }
};

export const apiGet = (endpoint) => {
  return handleApiCall("get", endpoint);
};

export const apiPost = (endpoint, data) => {
  return handleApiCall("post", endpoint, data);
};

export const apiPut = (endpoint, data) => {
  return handleApiCall("post", endpoint, data);
};

export const apiDelete = (endpoint) => {
  return handleApiCall("delete", endpoint);
};
