import api from "./axios.config";

export interface HttpConfig {
  params?: Record<string, any>;
  headers?: Record<string, any>;
}

export const httpClient = {
  get: async <T>(url: string, config?: HttpConfig): Promise<T> => {
    const response = await api.get<T>(url, config);
    return response.data;
  },

  post: async <T>(url: string, data?: any, config?: HttpConfig): Promise<T> => {
    const response = await api.post<T>(url, data, config);
    return response.data;
  },

  put: async <T>(url: string, data?: any, config?: HttpConfig): Promise<T> => {
    const response = await api.put<T>(url, data, config);
    return response.data;
  },

  patch: async <T>(url: string, data?: any, config?: HttpConfig): Promise<T> => {
    const response = await api.patch<T>(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config?: HttpConfig): Promise<T> => {
    const response = await api.delete<T>(url, config);
    return response.data;
  },
};
