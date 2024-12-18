import { Sale } from '../../types/sales';
import { Expense } from '../../types/expenses';
import { Credit } from '../../types/credits';
import { Product } from '../../types/products';

export function calculateSalesMetrics(sales: Sale[]) {
  return sales.reduce((acc, sale) => {
    if (sale.status === 'cancelled') return acc;

    return {
      totalSales: acc.totalSales + sale.total,
      cashSales: acc.cashSales + (sale.payment.method === 'cash' ? sale.total : 0),
      cardSales: acc.cardSales + (sale.payment.method === 'card' ? sale.total : 0),
      transferSales: acc.transferSales + (sale.payment.method === 'transfer' ? sale.total : 0),
      totalCommissions: acc.totalCommissions + (sale.staff?.commissionAmount || 0),
    };
  }, {
    totalSales: 0,
    cashSales: 0,
    cardSales: 0,
    transferSales: 0,
    totalCommissions: 0,
  });
}

export function calculateExpensesTotal(expenses: Expense[]) {
  return expenses.reduce((total, expense) => 
    expense.status === 'cancelled' ? total : total + expense.amount, 
    0
  );
}

export function calculateCreditsMetrics(credits: Credit[]) {
  return credits.reduce((acc, credit) => {
    const totalPaid = credit.payments.reduce((sum, payment) => 
      payment.status === 'active' ? sum + payment.amount : sum, 
      0
    );

    return {
      totalAmount: acc.totalAmount + credit.totalAmount,
      totalPaid: acc.totalPaid + totalPaid,
      pendingAmount: acc.pendingAmount + (credit.totalAmount - totalPaid),
    };
  }, {
    totalAmount: 0,
    totalPaid: 0,
    pendingAmount: 0,
  });
}

export function calculateCostOfGoodsSold(sales: Sale[], products: Product[]) {
  return sales.reduce((total, sale) => {
    if (sale.status === 'cancelled') return total;

    return total + sale.products.reduce((productTotal, saleProduct) => {
      const product = products.find(p => p.code === saleProduct.code);
      if (!product) return productTotal;

      return productTotal + (product.costPrice * saleProduct.quantity);
    }, 0);
  }, 0);
}

export function calculateProfitMetrics(
  totalSales: number,
  costOfGoodsSold: number,
  totalExpenses: number,
  totalCommissions: number
) {
  const grossProfit = totalSales - costOfGoodsSold;
  const netProfit = grossProfit - totalExpenses - totalCommissions;
  const grossProfitMargin = (grossProfit / totalSales) * 100 || 0;
  const netProfitMargin = (netProfit / totalSales) * 100 || 0;

  return {
    grossProfit,
    netProfit,
    grossProfitMargin,
    netProfitMargin,
  };
}

export function calculateCashInRegister(
  cashSales: number,
  totalExpenses: number,
  totalCommissions: number,
  pettyCashBalance: number
) {
  return cashSales - totalExpenses - totalCommissions + pettyCashBalance;
}