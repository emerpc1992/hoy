import React from 'react';
import { Sale } from '../../../../types/sales';
import { Expense } from '../../../../types/expenses';
import { formatCurrency } from '../../../../utils/formatters';

interface ProfitSummaryProps {
  sales: Sale[];
  expenses: Expense[];
  costOfGoodsSold: number;
  totalExpenses: number;
  totalCommissions: number;
  grossProfit: number;
  netProfit: number;
  cashInRegister: number;
}

interface MonthlyData {
  sales: number;
  expenses: number;
  cogs: number;
  grossProfit: number;
  netProfit: number;
}

function calculateMonthlyData(sales: Sale[], expenses: Expense[], costOfGoodsSold: number): Record<string, MonthlyData> {
  const monthlyData: Record<string, MonthlyData> = {};

  // Initialize with sales data
  sales.forEach(sale => {
    if (sale.status === 'cancelled') return;
    
    const date = new Date(sale.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        sales: 0,
        expenses: 0,
        cogs: 0,
        grossProfit: 0,
        netProfit: 0,
      };
    }
    
    monthlyData[monthKey].sales += sale.total;
  });

  // Add expenses data
  expenses.forEach(expense => {
    if (expense.status === 'cancelled') return;
    
    const date = new Date(expense.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        sales: 0,
        expenses: 0,
        cogs: 0,
        grossProfit: 0,
        netProfit: 0,
      };
    }
    
    monthlyData[monthKey].expenses += expense.amount;
  });

  // Calculate COGS proportionally for each month
  Object.keys(monthlyData).forEach(monthKey => {
    const monthData = monthlyData[monthKey];
    const salesRatio = monthData.sales / sales.reduce((sum, sale) => 
      sale.status !== 'cancelled' ? sum + sale.total : sum, 0
    );
    monthData.cogs = costOfGoodsSold * salesRatio;
    monthData.grossProfit = monthData.sales - monthData.cogs;
    monthData.netProfit = monthData.grossProfit - monthData.expenses;
  });

  return monthlyData;
}

function MonthlyBreakdown({ monthlyData }: { monthlyData: Record<string, MonthlyData> }) {
  const sortedMonths = Object.entries(monthlyData)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 3); // Show only last 3 months

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mes</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Ingresos</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Costo de Ventas</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Ganancia Bruta</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Gastos</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Ganancia Neta</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedMonths.map(([monthKey, data]) => {
            const [year, month] = monthKey.split('-');
            const date = new Date(Number(year), Number(month) - 1);
            const grossMargin = (data.grossProfit / data.sales) * 100 || 0;
            const netMargin = (data.netProfit / data.sales) * 100 || 0;

            return (
              <tr key={monthKey}>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                </td>
                <td className="px-4 py-2 text-sm text-green-600 text-right">
                  {formatCurrency(data.sales)}
                </td>
                <td className="px-4 py-2 text-sm text-red-600 text-right">
                  {formatCurrency(data.cogs)}
                </td>
                <td className="px-4 py-2 text-sm text-right">
                  <div className={data.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(data.grossProfit)}
                    <span className="text-xs ml-1">({grossMargin.toFixed(1)}%)</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-sm text-red-600 text-right">
                  {formatCurrency(data.expenses)}
                </td>
                <td className="px-4 py-2 text-sm text-right">
                  <div className={data.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(data.netProfit)}
                    <span className="text-xs ml-1">({netMargin.toFixed(1)}%)</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SummarySection({ 
  totalExpenses, 
  totalCommissions, 
  grossProfit, 
  netProfit, 
  cashInRegister 
}: Pick<ProfitSummaryProps, 'totalExpenses' | 'totalCommissions' | 'grossProfit' | 'netProfit' | 'cashInRegister'>) {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h4 className="text-sm font-medium text-gray-700 mb-4">Resumen General</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-sm text-gray-600">Gastos Totales:</span>
          <p className="text-lg font-medium text-red-600">{formatCurrency(totalExpenses)}</p>
        </div>
        <div>
          <span className="text-sm text-gray-600">Comisiones:</span>
          <p className="text-lg font-medium text-red-600">{formatCurrency(totalCommissions)}</p>
        </div>
        <div>
          <span className="text-sm text-gray-600">Ganancia Bruta:</span>
          <p className={`text-lg font-medium ${grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(grossProfit)}
          </p>
        </div>
        <div>
          <span className="text-sm text-gray-600">Ganancia Neta:</span>
          <p className={`text-lg font-medium ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(netProfit)}
          </p>
        </div>
        <div className="col-span-2">
          <span className="text-sm text-gray-600">Dinero en Caja:</span>
          <p className={`text-lg font-medium ${cashInRegister >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(cashInRegister)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ProfitSummary({
  sales,
  expenses,
  costOfGoodsSold,
  totalExpenses,
  totalCommissions,
  grossProfit,
  netProfit,
  cashInRegister,
}: ProfitSummaryProps) {
  const monthlyData = calculateMonthlyData(sales, expenses, costOfGoodsSold);

  return (
    <div className="space-y-6">
      <MonthlyBreakdown monthlyData={monthlyData} />
      <SummarySection
        totalExpenses={totalExpenses}
        totalCommissions={totalCommissions}
        grossProfit={grossProfit}
        netProfit={netProfit}
        cashInRegister={cashInRegister}
      />
    </div>
  );
}