import React from 'react';
import { Sale } from '../../../../types/sales';
import { SaleHeader } from './SaleHeader';
import { ProductsList } from './ProductsList';
import { SaleActions } from './SaleActions';

interface SaleCardProps {
  sale: Sale;
  onCancel: () => void;
  onDelete: () => void;
}

export function SaleCard({ sale, onCancel, onDelete }: SaleCardProps) {
  return (
    <div className={`${
      sale.status === 'cancelled' ? 'bg-red-50' : 'bg-white'
    } rounded-lg`}>
      <div className="flex justify-between items-start">
        <div>
          <SaleHeader sale={sale} />
        </div>
        <SaleActions
          sale={sale}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      </div>

      <ProductsList products={sale.products} />

      {sale.notes && (
        <div className="mt-4 text-sm">
          <span className="font-medium text-gray-700">Notas:</span>{' '}
          {sale.notes}
        </div>
      )}

      {sale.status === 'cancelled' && sale.cancellationReason && (
        <div className="mt-4 text-sm text-red-600">
          <span className="font-medium">Motivo de cancelación:</span>{' '}
          {sale.cancellationReason}
        </div>
      )}
    </div>
  );
}