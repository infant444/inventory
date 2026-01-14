export interface User {
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'staff';
  is_active: boolean;
  email_notification: boolean;
  location_ids: string[];
  token?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Location {
  location_id: string;
  location_code: string;
  location_name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  supplier_id: string;
  supplier_name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  gst_number?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  type_id: string;
  type_name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Tax {
  tax_id: string;
  tax_name: string;
  tax_percentage: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Item {
  item_id: string;
  item_code: string;
  item_name: string;
  location_id: string;
  opening_qty: number;
  current_qty: number;
  barcode?: string;
  supplier_id?: string;
  type_id?: string;
  tax_id?: string;
  purchase_price: number;
  tax_percent?: number;
  total_amount?: number;
  created_at: string;
  updated_at: string;
  location?: Location;
  supplier?: Supplier;
  type?: Category;
  tax?: Tax;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateUserRequest {
  full_name: string;
  email: string;
  phone?: string;
  role?: 'admin' | 'manager' | 'staff';
  location_ids?: string[];
}