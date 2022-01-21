import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// axiosInstance.interceptors.request.use(onSuccess, onError);
// axiosInstance.interceptors.response.use(onSuccess, onError);

export default axiosInstance;
