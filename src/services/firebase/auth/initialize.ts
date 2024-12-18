import { createUser, signIn } from './operations';
import { DEFAULT_USERS } from '../../../constants/users';
import { auth } from '../../../config/firebase';

export async function initializeDefaultUsers() {
  try {
    // Wait for Firebase Auth to initialize
    await new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      });
    });

    // Try to sign in as admin first
    try {
      await signIn(DEFAULT_USERS.admin.email, DEFAULT_USERS.admin.password);
      console.log('Admin user exists and signed in successfully');
      return;
    } catch (error: any) {
      // Only create new user if it doesn't exist
      if (error.code === 'auth/user-not-found') {
        try {
          await createUser(
            DEFAULT_USERS.admin.email,
            DEFAULT_USERS.admin.password,
            DEFAULT_USERS.admin.role
          );
          console.log('Admin user created successfully');
        } catch (createError: any) {
          if (createError.code !== 'auth/email-already-in-use') {
            console.error('Error creating admin user:', createError);
          }
        }
      }
    }

    // Initialize default user if needed
    try {
      await signIn(DEFAULT_USERS.user.email, DEFAULT_USERS.user.password);
      console.log('Default user exists');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        try {
          await createUser(
            DEFAULT_USERS.user.email,
            DEFAULT_USERS.user.password,
            DEFAULT_USERS.user.role
          );
          console.log('Default user created successfully');
        } catch (createError: any) {
          if (createError.code !== 'auth/email-already-in-use') {
            console.error('Error creating default user:', createError);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error initializing users:', error);
  }
}