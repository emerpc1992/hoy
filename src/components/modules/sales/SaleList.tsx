import React, { useState } from 'react';
import { Sale } from '../../../types/sales';
import { SaleCard } from './components/SaleCard';
import { AdminPasswordModal } from '../shared/AdminPasswordModal';
import { CancellationModal } from '../shared/CancellationModal';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { formatDate } from '../../../utils/formatters';

interface SaleListProps {
  sales: Sale[];
  onDelete: (id: string, adminPassword: string) => boolean;
  onCancel: (id: string, reason: string) => void;
}

export function SaleList({ sales, onDelete, onCancel }: SaleListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string>('');
  const [expandedSales, setExpandedSales] = useState<Set<string>>(new Set());

  // Group sales by date
  const groupedSales = sales.reduce((groups, sale) => {
    const date = formatDate(sale.date);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(sale);
    return groups;
  }, {} as Record<string, Sale[]>);

  // Sort dates in reverse chronological order
  const sortedDates = Object.keys(groupedSales).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const handleDeleteAttempt = (password: string) => {
    if (deletingId) {
      const success = onDelete(deletingId, password);
      if (success) {
        setDeletingId(null);
        setPasswordError('');
      } else {
        setPasswordError('Contraseña incorrecta');
      }
    }
  };

  const toggleDateExpansion = (date: string) => {
    const newExpanded = new Set(expandedSales);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedSales(newExpanded);
  };

  if (sales.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No hay ventas registradas</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {sortedDates.map((date) => {
          const isExpanded = expandedSales.has(date);
          const dailySales = groupedSales[date];
          const totalAmount = dailySales.reduce((sum, sale) => 
            sale.status !== 'cancelled' ? sum + sale.total : sum, 0
          );
          
          return (
            <div key={date} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <button
                onClick={() => toggleDateExpansion(date)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                  <div className="text-left">
                    <h3 className="text-lg font-medium text-gray-900">{date}</h3>
                    <p className="text-sm text-gray-500">
                      {dailySales.length} venta{dailySales.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium text-gray-900">
                    {new Intl.NumberFormat('es-ES', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(totalAmount)}
                  </p>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t divide-y">
                  {dailySales.map((sale) => (
                    <div key={sale.id} className="p-4">
                      <SaleCard
                        sale={sale}
                        onCancel={() => setCancellingId(sale.id)}
                        onDelete={() => setDeletingId(sale.id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {deletingId && (
        <AdminPasswordModal
          onConfirm={handleDeleteAttempt}
          onCancel={() => {
            setDeletingId(null);
            setPasswordError('');
          }}
          error={passwordError}
        />
      )}

      {cancellingId && (
        <CancellationModal
          onConfirm={(reason) => {
            onCancel(cancellingId, reason);
            setCancellingId(null);
          }}
          onCancel={() => setCancellingId(null)}
        />
      )}
    </>
  );
}