import axios, { type AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  upvotes: number;
  commentCount: number;
  hasUpvoted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  text: string;
  postId: string;
  userId: {
    _id: string;
    name: string;
    avatar: string;
  };
  parentId?: string;
  upvotes: number;
  replyCount: number;
  depth: number;
  hasUpvoted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export const authAPI = {
  register: async (userData: { name: string; email: string; password: string }) => {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/profile');
    return response.data;
  },
};

export const postsAPI = {
  getPosts: async (params?: { limit?: number; skip?: number; sortBy?: string; sortOrder?: string }) => {
    const response = await api.get<ApiResponse<{ posts: Post[]; count: number }>>('/posts', { params });
    return response.data;
  },

  getPostWithComments: async (id: string, params?: { sortBy?: string; sortOrder?: string; limit?: number; skip?: number }) => {
    const response = await api.get<ApiResponse<{ post: Post; comments: Comment[]; commentCount: number }>>(`/posts/${id}/comments`, { params });
    return response.data;
  },

  upvotePost: async (id: string) => {
    const response = await api.post<ApiResponse<{ upvotes: number; hasUpvoted: boolean }>>(`/posts/${id}/upvote`);
    return response.data;
  },
};

export const commentsAPI = {

  createComment: async (commentData: { text: string; postId: string; parentId?: string }) => {
    const response = await api.post<ApiResponse<{ comment: Comment }>>('/comments', commentData);
    return response.data;
  },

  upvoteComment: async (id: string) => {
    const response = await api.post<ApiResponse<{ upvotes: number; hasUpvoted: boolean }>>(`/comments/${id}/upvote`);
    return response.data;
  },
};

export const healthAPI = {
  check: async () => {
    const response = await api.get<ApiResponse>('/health');
    return response.data;
  },
};

export default api;
