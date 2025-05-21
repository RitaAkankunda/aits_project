import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api"; 

// Login function to authenticate the user
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login/`, {
      email,
      password
    });
    // Assuming the response contains the token
    const { token } = response.data;
    if (token) {
      // Save token to localStorage (or you can use other methods like Context API or Redux)
      localStorage.setItem("authToken", token);
    }
    return response.data; // Return the token and any other data from the response
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

// Utility function to get the stored token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Axios instance with auth token attached to the headers (for future requests)
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Token ${token}`; // Attach token to headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Submit Issue function (use axiosInstance to automatically include the token)
export const submitIssue = async (issueData) => {
  try {
    const response = await axiosInstance.post(`/issues/`, issueData);
    return response.data;
  } catch (error) {
    console.error("Error submitting issue:", error);
    throw error;
  }
};

// Fetch Issues function (use axiosInstance to automatically include the token)
export const fetchIssues = async () => {
  try {
    const response = await axiosInstance.get(`/issues/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching issues:", error);
    throw error;
  }
};
