import { User, UserRole } from '../../../types/auth';
import { USERS } from '../../../constants/users';
import { authState } from './state';
import { saveUsers, loadUsers } from '../../../storage/users';

export async function signIn(username: string, password: string): Promise<User> {
  const users = loadUsers() || USERS;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Set current user in auth state
  authState.setCurrentUser(user);
  return user;
}

export async function signOut(): Promise<void> {
  authState.setCurrentUser(null);
}

export async function changePassword(username: string, currentPassword: string, newPassword: string): Promise<void> {
  const currentUser = authState.getCurrentUser();
  
  if (!currentUser) {
    throw new Error('No hay usuario conectado');
  }

  // Only admin can change other users' passwords
  if (username !== currentUser.username && currentUser.role !== 'admin') {
    throw new Error('No tienes permisos para cambiar la contraseña de otro usuario');
  }

  const users = loadUsers() || USERS;
  const userIndex = users.findIndex(u => u.username === username);
  
  if (userIndex === -1) {
    throw new Error('Usuario no encontrado');
  }

  // Verify current password
  if (users[userIndex].password !== currentPassword) {
    throw new Error('La contraseña actual es incorrecta');
  }

  if (newPassword.length < 6) {
    throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
  }

  // Update password in users array
  users[userIndex] = {
    ...users[userIndex],
    password: newPassword
  };

  // Update current user if changing own password
  if (currentUser.username === username) {
    authState.setCurrentUser({
      ...currentUser,
      password: newPassword
    });
  }

  // Save updated users to storage
  saveUsers(users);
}

export async function updateUsername(oldUsername: string, newUsername: string): Promise<void> {
  const currentUser = authState.getCurrentUser();
  
  if (!currentUser) {
    throw new Error('No hay usuario conectado');
  }

  // Only admin can change usernames
  if (currentUser.role !== 'admin') {
    throw new Error('No tienes permisos para cambiar nombres de usuario');
  }

  const users = loadUsers() || USERS;
  const userIndex = users.findIndex(u => u.username === oldUsername);
  
  if (userIndex === -1) {
    throw new Error('Usuario no encontrado');
  }

  // Check if new username already exists
  if (users.some(u => u.username === newUsername)) {
    throw new Error('El nombre de usuario ya existe');
  }

  // Update username
  users[userIndex] = {
    ...users[userIndex],
    username: newUsername
  };

  // Update current user if changing own username
  if (currentUser.username === oldUsername) {
    authState.setCurrentUser({
      ...currentUser,
      username: newUsername
    });
  }

  // Save updated users to storage
  saveUsers(users);
}

export async function getCurrentUser(): Promise<User | null> {
  return authState.getCurrentUser();
}