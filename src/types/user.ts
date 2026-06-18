export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  bio?: string;
  title?: string;
  photo?: string;
  github?: string;
  linkedin?: string;
  createdAt: string;
}