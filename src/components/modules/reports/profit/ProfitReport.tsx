import React from 'react';
import { useSales } from '../../../../hooks/useSales';
import { useExpenses } from '../../../../hooks/useExpenses';
import { useProducts } from '../../../../hooks/useProducts';
import { usePettyCash } from '../../../../hooks/usePettyCash';
import { useCredits } from '../../../../hooks/useCredits';
import { useReportCalculations } from '../hooks/useReportCalculations';
import { formatCurrency } from '../../../../utils/formatters';
import { ProfitChart } from './ProfitChart';
import { ProfitSummary } from './ProfitSummary';
import { InventorySummary } from './InventorySummary';

interface ProfitReportProps {
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export function ProfitReport({ dateRange }: ProfitReportProps) {
  const { sales } = useSales();
  const { expenses } = useExpenses();
  const { products } = useProducts();
  const { balance: pettyCashBalance } = usePettyCash();
  const { credits } = useCredits();

  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    endDate.setHours(23, 59, 59);
    return saleDate >= startDate && saleDate <= endDate && sale.status !== 'cancelled';
  });

  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    endDate.setHours(23, 59, 59);
    return expenseDate >= startDate && expenseDate <= endDate && expense.status !== 'cancelled';
  });

  const filteredCredits = credits.filter(credit => {
    const creditDate = new Date(credit.dueDate);
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    endDate.setHours(23, 59, 59);
    return creditDate >= startDate && creditDate <= endDate;
  });

  const {
    totalSales,
    costOfGoodsSold,
    totalExpenses,
    totalCommissions,
    grossProfit,
    netProfit,
    grossProfitMargin,
    netProfitMargin,
    cashInRegister,
  } = useReportCalculations({
    sales: filteredSales,
    expenses: filteredExpenses,
    credits: filteredCredits,
    products,
    pettyCashBalance,
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Ingresos Totales</h3>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalSales)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Costo de Ventas</h3>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(costOfGoodsSold)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Ganancia Bruta</h3>
          <p className={`text-2xl font-bold ${grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(grossProfit)}
          </p>
          <p className="text-sm text-gray-500">Margen: {grossProfitMargin.toFixed(2)}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Ganancia Neta</h3>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(netProfit)}
          </p>
          <p className="text-sm text-gray-500">Margen: {netProfitMargin.toFixed(2)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Valor del Inventario</h3>
          <InventorySummary products={products} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Gráfico de Ganancias</h3>
          <ProfitChart sales={filteredSales} expenses={filteredExpenses} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen Detallado</h3>
        <ProfitSummary 
          sales={filteredSales} 
          expenses={filteredExpenses}
          costOfGoodsSold={costOfGoodsSold}
          totalExpenses={totalExpenses}
          totalCommissions={totalCommissions}
          grossProfit={grossProfit}
          netProfit={netProfit}
          cashInRegister={cashInRegister}
        />
      </div>
    </div>
  );
}