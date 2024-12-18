import { collection, Timestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { Sale } from '../../../types/sales';
import { saveData, getData, getAllData, updateData, deleteData, queryData } from '../firestore';

const COLLECTION = 'sales';

export async function saveSale(sale: Sale): Promise<void> {
  await saveData(COLLECTION, sale.id, {
    ...sale,
    date: Timestamp.fromDate(new Date(sale.date))
  });
}

export async function getSale(id: string): Promise<Sale | null> {
  const data = await getData<Sale>(COLLECTION, id);
  if (!data) return null;
  
  return {
    ...data,
    date: (data.date as unknown as Timestamp).toDate().toISOString()
  };
}

export async function getAllSales(): Promise<Sale[]> {
  const sales = await getAllData<Sale>(COLLECTION);
  return sales.map(sale => ({
    ...sale,
    date: (sale.date as unknown as Timestamp).toDate().toISOString()
  }));
}

export async function updateSale(id: string, data: Partial<Sale>): Promise<void> {
  if (data.date) {
    data.date = Timestamp.fromDate(new Date(data.date)) as any;
  }
  await updateData(COLLECTION, id, data);
}

export async function deleteSale(id: string): Promise<void> {
  await deleteData(COLLECTION, id);
}

export async function querySalesByDateRange(
  startDate: Date,
  endDate: Date,
  status?: string
): Promise<Sale[]> {
  const conditions = [
    { field: 'date', operator: '>=', value: Timestamp.fromDate(startDate) },
    { field: 'date', operator: '<=', value: Timestamp.fromDate(endDate) }
  ];
  
  if (status) {
    conditions.push({ field: 'status', operator: '==', value: status });
  }

  const sales = await queryData<Sale>(COLLECTION, conditions, 'date');
  return sales.map(sale => ({
    ...sale,
    date: (sale.date as unknown as Timestamp).toDate().toISOString()
  }));
}