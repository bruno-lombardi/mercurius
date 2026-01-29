import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId | string;
  username: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'admin' | 'user';
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserInput {
  username: string;
  email: string;
  name: string;
  password: string;
  role?: 'admin' | 'user';
}
