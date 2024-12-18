import { useMemo } from 'react';
import { Sale } from '../../../../types/sales';
import { Expense } from '../../../../types/expenses';
import { Credit } from '../../../../types/credits';
import { Product } from '../../../../types/products';
import {
  calculateSalesMetrics,
  calculateExpensesTotal,
  calculateCreditsMetrics,
  calculateCostOfGoodsSold,
  calculateProfitMetrics,
  calculateCashInRegister,
} from '../../../../utils/reports/calculations';

interface UseReportCalculationsProps {
  sales: Sale[];
  expenses: Expense[];
  credits: Credit[];
  products: Product[];
  pettyCashBalance: number;
}

export function useReportCalculations({
  sales,
  expenses,
  credits,
  products,
  pettyCashBalance,
}: UseReportCalculationsProps) {
  return useMemo(() => {
    // Calculate sales metrics
    const salesMetrics = calculateSalesMetrics(sales);
    
    // Calculate expenses total
    const totalExpenses = calculateExpensesTotal(expenses);
    
    // Calculate credits metrics
    const creditsMetrics = calculateCreditsMetrics(credits);
    
    // Calculate cost of goods sold
    const costOfGoodsSold = calculateCostOfGoodsSold(sales, products);
    
    // Calculate profit metrics
    const profitMetrics = calculateProfitMetrics(
      salesMetrics.totalSales,
      costOfGoodsSold,
      totalExpenses,
      salesMetrics.totalCommissions
    );
    
    // Calculate cash in register
    const cashInRegister = calculateCashInRegister(
      salesMetrics.cashSales,
      totalExpenses,
      salesMetrics.totalCommissions,
      pettyCashBalance
    );

    return {
      ...salesMetrics,
      totalExpenses,
      ...creditsMetrics,
      costOfGoodsSold,
      ...profitMetrics,
      cashInRegister,
    };
  }, [sales, expenses, credits, products, pettyCashBalance]);
}