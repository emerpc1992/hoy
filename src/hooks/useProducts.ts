import { useState, useEffect } from 'react';
import { Product } from '../types/products';
import {
  saveProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  queryProductsByCategory,
  queryLowStockProducts
} from '../services/firebase/collections/products';
import { useFirestore } from './useFirestore';

export function useProducts() {
  const { data: products, loading, error } = useFirestore<Product>('products');

  const addProduct = async (product: Product) => {
    await saveProduct(product);
  };

  const updateProductData = async (code: string, updatedProduct: Product) => {
    await updateProduct(code, updatedProduct);
  };

  const deleteProductData = async (code: string) => {
    await deleteProduct(code);
  };

  const getProductsByCategory = async (categoryId: string) => {
    return await queryProductsByCategory(categoryId);
  };

  const getLowStockProducts = async () => {
    return await queryLowStockProducts();
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct: updateProductData,
    deleteProduct: deleteProductData,
    getProductsByCategory,
    getLowStockProducts,
  };
}