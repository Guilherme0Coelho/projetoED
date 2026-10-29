export interface AuthData {
  token: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  category: string | null;
  specs: string | null;
}

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
