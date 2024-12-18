import { useState, useEffect } from 'react';
import { Appointment } from '../types/appointments';
import { 
  saveAppointment,
  getAllAppointments,
  updateAppointment,
  deleteAppointment,
  queryAppointments
} from '../services/firebase/collections/appointments';
import { useFirestore } from './useFirestore';

export function useAppointments() {
  const { data: appointments, loading, error } = useFirestore<Appointment>('appointments', {
    transform: (data) => ({
      ...data,
      date: data.date.toDate().toISOString()
    })
  });

  const addAppointment = async (appointment: Appointment) => {
    await saveAppointment(appointment);
  };

  const updateAppointmentData = async (code: string, updatedAppointment: Appointment) => {
    await updateAppointment(code, updatedAppointment);
  };

  const deleteAppointmentData = async (code: string) => {
    await deleteAppointment(code);
  };

  const queryAppointmentsByDate = async (startDate: Date, endDate: Date, status?: string) => {
    return await queryAppointments(startDate, endDate, status);
  };

  return {
    appointments,
    loading,
    error,
    addAppointment,
    updateAppointment: updateAppointmentData,
    deleteAppointment: deleteAppointmentData,
    queryAppointmentsByDate,
  };
}