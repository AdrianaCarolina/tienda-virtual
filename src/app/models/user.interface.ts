export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'admin';
}

export interface DBUser {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  role: string;
}
