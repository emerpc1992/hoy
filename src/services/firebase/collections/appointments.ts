import { collection, Timestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { Appointment } from '../../../types/appointments';
import { saveData, getData, getAllData, updateData, deleteData, queryData } from '../firestore';

const COLLECTION = 'appointments';

export async function saveAppointment(appointment: Appointment): Promise<void> {
  await saveData(COLLECTION, appointment.code, {
    ...appointment,
    date: Timestamp.fromDate(new Date(appointment.date))
  });
}

export async function getAppointment(code: string): Promise<Appointment | null> {
  const data = await getData<Appointment>(COLLECTION, code);
  if (!data) return null;
  
  return {
    ...data,
    date: (data.date as unknown as Timestamp).toDate().toISOString()
  };
}

export async function getAllAppointments(): Promise<Appointment[]> {
  const appointments = await getAllData<Appointment>(COLLECTION);
  return appointments.map(appointment => ({
    ...appointment,
    date: (appointment.date as unknown as Timestamp).toDate().toISOString()
  }));
}

export async function updateAppointment(code: string, data: Partial<Appointment>): Promise<void> {
  if (data.date) {
    data.date = Timestamp.fromDate(new Date(data.date)) as any;
  }
  await updateData(COLLECTION, code, data);
}

export async function deleteAppointment(code: string): Promise<void> {
  await deleteData(COLLECTION, code);
}

export async function queryAppointments(
  startDate: Date,
  endDate: Date,
  status?: string
): Promise<Appointment[]> {
  const conditions = [
    { field: 'date', operator: '>=', value: Timestamp.fromDate(startDate) },
    { field: 'date', operator: '<=', value: Timestamp.fromDate(endDate) }
  ];
  
  if (status) {
    conditions.push({ field: 'status', operator: '==', value: status });
  }

  const appointments = await queryData<Appointment>(COLLECTION, conditions, 'date');
  return appointments.map(appointment => ({
    ...appointment,
    date: (appointment.date as unknown as Timestamp).toDate().toISOString()
  }));
}