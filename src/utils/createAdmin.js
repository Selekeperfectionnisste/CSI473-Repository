import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const createAdminAccount = async (adminData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      adminData.email, 
      adminData.password
    );
    
    const user = userCredential.user;

    // Update profile
    await updateProfile(user, {
      displayName: `${adminData.firstName} ${adminData.lastName}`
    });

    // Create admin document in Firestore
    const adminDoc = {
      uid: user.uid,
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      email: adminData.email,
      phone: adminData.phone,
      userType: 'admin',
      status: 'approved', // Auto-approved for admins
      emailVerified: true,
      createdAt: new Date().toISOString(),
      displayName: `${adminData.firstName} ${adminData.lastName}`,
      isSuperAdmin: adminData.isSuperAdmin || false
    };

    await setDoc(doc(db, 'users', user.uid), adminDoc);
    
    console.log('Admin account created successfully:', adminData.email);
    return { success: true, user: adminDoc };
  } catch (error) {
    console.error('Error creating admin account:', error);
    return { success: false, error: error.message };
  }
};

// Run this once to create initial admin
export const initializeDefaultAdmin = async () => {
  const defaultAdmin = {
    firstName: 'System',
    lastName: 'Administrator',
    email: 'admin@neighborhood.com',
    password: 'Admin123!', // Change this after first login
    phone: '+26770000000',
    isSuperAdmin: true
  };

  return await createAdminAccount(defaultAdmin);
};