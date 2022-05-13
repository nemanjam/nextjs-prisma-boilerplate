import axios, { AxiosError } from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// axiosInstance.interceptors.request.use(onSuccess, onError);
// axiosInstance.interceptors.response.use(onSuccess, onError);

export const getAxiosErrorMessage = (error: AxiosError): string => {
  return (error as any).response?.data?.message || error.message;
};

export default axiosInstance;
