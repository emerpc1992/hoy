import { User } from '../../../types/auth';

// Singleton to manage current user state
class AuthState {
  private static instance: AuthState;
  private currentUser: User | null = null;

  private constructor() {}

  static getInstance(): AuthState {
    if (!AuthState.instance) {
      AuthState.instance = new AuthState();
    }
    return AuthState.instance;
  }

  setCurrentUser(user: User | null): void {
    this.currentUser = user;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}

export const authState = AuthState.getInstance();