import api from "./axios.config";

export interface HttpConfig {
  params?: Record<string, any>;
  headers?: Record<string, any>;
}

export interface HttpResponse<T> {
  data: T;
  status: number;
}

export const httpClient = {
  get: async <T>(url: string, config?: HttpConfig): Promise<HttpResponse<T>> => {
    const response = await api.get<T>(url, config);
    return { data: response.data, status: response.status };
  },

  post: async <T>(url: string, data?: any, config?: HttpConfig): Promise<HttpResponse<T>> => {
    const response = await api.post<T>(url, data, config);
    return { data: response.data, status: response.status };
  },

  put: async <T>(url: string, data?: any, config?: HttpConfig): Promise<HttpResponse<T>> => {
    const response = await api.put<T>(url, data, config);
    return { data: response.data, status: response.status };
  },

  patch: async <T>(url: string, data?: any, config?: HttpConfig): Promise<HttpResponse<T>> => {
    const response = await api.patch<T>(url, data, config);
    return { data: response.data, status: response.status };
  },

  delete: async <T>(url: string, config?: HttpConfig): Promise<HttpResponse<T>> => {
    const response = await api.delete<T>(url, config);
    return { data: response.data, status: response.status };
  },
};
