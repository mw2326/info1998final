export interface Opportunity {
  id?: string;
  title: string;
  organization?: string;
  description?: string;
  category?: string;
  location?: string;
  date?: string;
  spots?: number;
  url?: string;
  createdAt?: string;
  createdBy?: string;
}

export interface User {
  uid: string;
  email: string;
  name?: string;
  role?: 'student' | 'admin';
}

export interface AuthContextValue {
  user: User | null | undefined;
  token: string | null;
  logout: () => void;
  loading: boolean;
}
