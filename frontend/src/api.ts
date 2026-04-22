import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Ingrediente {
  id: number;
  nombre: string;
}

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion?: string;
  categorias: Categoria[];
  ingredientes: Ingrediente[];
}
