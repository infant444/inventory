import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.access_token = token;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  createUser: (userData: any) =>
    api.post('/auth/create-user', userData),
  
  updatePassword: (data: any) =>
    api.put('/auth/update-password', data),
  
  logout: (userId: string) =>
    api.get(`/auth/logout/${userId}`),
};

export const userAPI = {
  getUsers: () => api.get('/user/get-all-users'),
  getUserById: (userId: string) => api.get(`/user/get-user/${userId}`),
  updateUser: (userId: string, data: any) => api.put(`/user/update-user/${userId}`, data),
  deleteUser: (userId: string) => api.delete(`/user/delete-user/${userId}`),
  updateUserEmailNotification: (status: boolean) => api.put('/user/update-user-email-notification', { status }),
};

export const locationAPI = {
  createLocation: (data: any) => api.post('/location/create-location', data),
  getAllLocation: () => api.get('/location/get-all-location'),
  getLocationById: (locationId: string) => api.get(`/location/get-location-by-id/${locationId}`),
  updateLocation: (locationId: string, data: any) => api.put(`/location/update-location/${locationId}`, data),
  deleteLocation: (locationId: string) => api.delete(`/location/delete-location/${locationId}`),
  assignLocation: (data: any) => api.post('/location/assign-location', data),
  getUserLocation: () => api.get('/location/get-user-location'),
  getUserLocationById: () => api.get('/location/get-user-location-by-user'),
};

export const supplierAPI = {
  getSuppliers: () => api.get('/supplier/all'),
  getSupplierById: (supplierId: string) => api.get(`/supplier/${supplierId}`),
  createSupplier: (data: any) => api.post('/supplier/create', data),
  updateSupplier: (supplierId: string, data: any) => api.put(`/supplier/update/${supplierId}`, data),
  deleteSupplier: (supplierId: string) => api.delete(`/supplier/delete/${supplierId}`),
};

export const taxAPI = {
  getTaxes: () => api.get('/tax/all'),
  getTaxById: (taxId: string) => api.get(`/tax/get-by-id/${taxId}`),
  createTax: (data: any) => api.post('/tax/create', data),
  updateTax: (taxId: string, data: any) => api.put(`/tax/update/${taxId}`, data),
  deleteTax: (taxId: string) => api.delete(`/tax/delete/${taxId}`),
};

export const categoriesAPI = {
  getCategories: () => api.get('/categories/all'),
  getCategoryById: (categoriesId: string) => api.get(`/categories/get-by-id/${categoriesId}`),
  createCategory: (data: any) => api.post('/categories/create', data),
  updateCategory: (categoriesId: string, data: any) => api.put(`/categories/update/${categoriesId}`, data),
  deleteCategory: (categoriesId: string) => api.delete(`/categories/delete/${categoriesId}`),
};

export default api;