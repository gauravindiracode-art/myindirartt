import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase/config';
import type { AppUser, UserRole } from './types';

const ADMIN_EMAIL = 'gauravsharrma00@gmail.com';
const provider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<AppUser> {
  const result = await signInWithPopup(auth, provider);
  return ensureUserDoc(result.user);
}

export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function ensureUserDoc(user: User): Promise<AppUser> {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
    return {
      uid: user.uid,
      email: data.email,
      displayName: data.displayName,
      photoURL: data.photoURL,
      role: data.role as UserRole,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
    };
  }

  const role: UserRole = user.email === ADMIN_EMAIL ? 'admin' : 'student';
  const newUser: Omit<AppUser, 'uid'> = {
    email: user.email ?? '',
    displayName: user.displayName ?? '',
    photoURL: user.photoURL ?? '',
    role,
    createdAt: new Date(),
  };

  await setDoc(ref, { ...newUser, createdAt: serverTimestamp() });

  return { uid: user.uid, ...newUser };
}

export async function getUserProfile(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    uid,
    email: data.email,
    displayName: data.displayName,
    photoURL: data.photoURL,
    role: data.role,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
  };
}
