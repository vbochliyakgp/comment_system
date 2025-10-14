import axios, { type AxiosResponse } from 'axios';

// API base configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage but don't redirect
      // Let the AuthContext handle the authentication state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Types for API responses
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
  downvotes: number;
  commentCount: number;
  hasUpvoted?: boolean;
  hasDownvoted?: boolean;
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
  downvotes: number;
  replyCount: number;
  depth: number;
  isEdited: boolean;
  editedAt?: string;
  hasUpvoted?: boolean;
  hasDownvoted?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth API
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


  logout: async () => {
    const response = await api.post<ApiResponse>('/auth/logout');
    return response.data;
  },
};

// Posts API
export const postsAPI = {
  getPosts: async (params?: { limit?: number; skip?: number; sortBy?: string; sortOrder?: string }) => {
    const response = await api.get<ApiResponse<{ posts: Post[]; count: number }>>('/posts', { params });
    return response.data;
  },

  getPost: async (id: string) => {
    const response = await api.get<ApiResponse<{ post: Post }>>(`/posts/${id}`);
    return response.data;
  },

  getPostWithComments: async (id: string, params?: { sortBy?: string; sortOrder?: string; limit?: number; skip?: number }) => {
    const response = await api.get<ApiResponse<{ post: Post; comments: Comment[]; commentCount: number }>>(`/posts/${id}/comments`, { params });
    return response.data;
  },

  createPost: async (postData: { title: string; content: string; author: string }) => {
    const response = await api.post<ApiResponse<{ post: Post }>>('/posts', postData);
    return response.data;
  },

  updatePost: async (id: string, postData: { title?: string; content?: string }) => {
    const response = await api.put<ApiResponse<{ post: Post }>>(`/posts/${id}`, postData);
    return response.data;
  },

  deletePost: async (id: string) => {
    const response = await api.delete<ApiResponse>(`/posts/${id}`);
    return response.data;
  },

  upvotePost: async (id: string) => {
    const response = await api.post<ApiResponse<{ upvotes: number; downvotes: number; hasUpvoted: boolean }>>(`/posts/${id}/upvote`);
    return response.data;
  },
};

// Comments API
export const commentsAPI = {
  getComments: async (postId: string, params?: { sortBy?: string; sortOrder?: string; limit?: number; skip?: number }) => {
    const response = await api.get<ApiResponse<{ comments: Comment[]; count: number }>>(`/comments/post/${postId}`, { params });
    return response.data;
  },

  createComment: async (commentData: { text: string; postId: string; parentId?: string }) => {
    const response = await api.post<ApiResponse<{ comment: Comment }>>('/comments', commentData);
    return response.data;
  },

  updateComment: async (id: string, commentData: { text: string }) => {
    const response = await api.put<ApiResponse<{ comment: Comment }>>(`/comments/${id}`, commentData);
    return response.data;
  },

  deleteComment: async (id: string) => {
    const response = await api.delete<ApiResponse>(`/comments/${id}`);
    return response.data;
  },

  upvoteComment: async (id: string) => {
    const response = await api.post<ApiResponse<{ upvotes: number; downvotes: number; hasUpvoted: boolean }>>(`/comments/${id}/upvote`);
    return response.data;
  },

  downvoteComment: async (id: string) => {
    const response = await api.post<ApiResponse<{ downvotes: number }>>(`/comments/${id}/downvote`);
    return response.data;
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get<ApiResponse>('/health');
    return response.data;
  },
};

export default api;
