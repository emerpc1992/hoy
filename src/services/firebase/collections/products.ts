import { collection } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { Product } from '../../../types/products';
import { saveData, getData, getAllData, updateData, deleteData, queryData } from '../firestore';

const COLLECTION = 'products';

export async function saveProduct(product: Product): Promise<void> {
  await saveData(COLLECTION, product.code, product);
}

export async function getProduct(code: string): Promise<Product | null> {
  return await getData<Product>(COLLECTION, code);
}

export async function getAllProducts(): Promise<Product[]> {
  return await getAllData<Product>(COLLECTION);
}

export async function updateProduct(code: string, data: Partial<Product>): Promise<void> {
  await updateData(COLLECTION, code, data);
}

export async function deleteProduct(code: string): Promise<void> {
  await deleteData(COLLECTION, code);
}

export async function queryProductsByCategory(categoryId: string): Promise<Product[]> {
  const conditions = [
    { field: 'category', operator: '==', value: categoryId }
  ];
  return await queryData<Product>(COLLECTION, conditions);
}

export async function queryLowStockProducts(): Promise<Product[]> {
  const conditions = [
    { field: 'quantity', operator: '<=', value: 'lowStockAlert' }
  ];
  return await queryData<Product>(COLLECTION, conditions, 'quantity', 'asc');
}