import React, { useState } from 'react';
import { SalesReport } from './sales/SalesReport';
import { ExpensesReport } from './expenses/ExpensesReport';
import { CreditsReport } from './credits/CreditsReport';
import { ProfitReport } from './profit/ProfitReport';
import { StaffReport } from './staff/StaffReport';
import { PettyCashReport } from './pettyCash/PettyCashReport';
import { CashRegisterReport } from './cashRegister/CashRegisterReport';
import { DateRangeSelector } from './common/DateRangeSelector';
import { ReportTypeSelector } from './common/ReportTypeSelector';
import { UserRole } from '../../../types/auth';

interface ReportsModuleProps {
  userRole: UserRole;
}

export function ReportsModule({ userRole }: ReportsModuleProps) {
  const [reportType, setReportType] = useState<string>('sales');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0], // First day of current month
    endDate: new Date().toISOString().split('T')[0], // Today
  });

  const renderReport = () => {
    switch (reportType) {
      case 'sales':
        return <SalesReport dateRange={dateRange} />;
      case 'expenses':
        return <ExpensesReport dateRange={dateRange} />;
      case 'credits':
        return userRole === 'admin' ? <CreditsReport dateRange={dateRange} /> : null;
      case 'profit':
        return userRole === 'admin' ? <ProfitReport dateRange={dateRange} /> : null;
      case 'staff':
        return userRole === 'admin' ? <StaffReport dateRange={dateRange} /> : null;
      case 'pettyCash':
        return userRole === 'admin' ? <PettyCashReport dateRange={dateRange} /> : null;
      case 'cashRegister':
        return userRole === 'admin' ? <CashRegisterReport dateRange={dateRange} /> : null;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-800">Reportes Financieros</h2>
          <ReportTypeSelector
            value={reportType}
            onChange={setReportType}
            userRole={userRole}
          />
        </div>
        <DateRangeSelector
          value={dateRange}
          onChange={setDateRange}
        />
      </div>

      {renderReport()}
    </div>
  );
}