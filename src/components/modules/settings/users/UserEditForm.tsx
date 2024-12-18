import React, { useState } from 'react';
import { User } from '../../../../types/auth';
import { useAuth } from '../../../../hooks/useAuth';

interface UserEditFormProps {
  user: User;
  onSubmit: (updates: Partial<User>) => void;
  onCancel: () => void;
}

export function UserEditForm({ user, onSubmit, onCancel }: UserEditFormProps) {
  const [formData, setFormData] = useState({
    username: user.username,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { updatePassword, currentUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    try {
      const updates: Partial<User> = {};
      
      // Handle username change
      if (formData.username !== user.username) {
        updates.username = formData.username;
      }
      
      // Handle password change
      if (formData.newPassword) {
        // Validate password fields
        if (!formData.currentPassword) {
          setError('Por favor ingrese su contraseña actual');
          return;
        }
        
        if (formData.newPassword !== formData.confirmPassword) {
          setError('Las contraseñas nuevas no coinciden');
          return;
        }

        if (formData.newPassword.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres');
          return;
        }

        // Update password - pass the user's username, not the current user's
        await updatePassword(user.username, formData.currentPassword, formData.newPassword);
        setSuccessMessage('Contraseña actualizada correctamente');
        
        // Clear password fields after successful update
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }

      // Only call onSubmit if there are username updates
      if (Object.keys(updates).length > 0) {
        onSubmit(updates);
        setSuccessMessage('Cambios guardados correctamente');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4 border-t pt-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de Usuario
        </label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
          className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          disabled={currentUser?.role !== 'admin'} // Only admin can change usernames
        />
      </div>

      <div className="space-y-4 border-t pt-4">
        <h4 className="font-medium text-gray-900">Cambiar Contraseña</h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña Actual
          </label>
          <input
            type="password"
            value={formData.currentPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingrese la contraseña actual"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nueva Contraseña
          </label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingrese la nueva contraseña"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar Nueva Contraseña
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Confirme la nueva contraseña"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {successMessage && (
        <p className="text-sm text-green-600">{successMessage}</p>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Guardar Cambios
        </button>
      </div>
    </form>
  );
}