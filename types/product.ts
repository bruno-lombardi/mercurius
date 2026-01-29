import { ObjectId } from 'mongodb';

export interface Product {
  _id?: ObjectId | string;
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  image?: string; // Primeiro imagem para listagem
  sold?: boolean;
  condition?: string;
  dimensions?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductApiResponse {
  success: boolean;
  data?: Product | Product[];
  error?: string;
  message?: string;
}
