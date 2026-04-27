import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey:            'AIzaSyCAkXNtqoBAwA1m8J-cqjqUU8IMZteSOlY',
  authDomain:        'applyai-dab34.firebaseapp.com',
  projectId:         'applyai-dab34',
  storageBucket:     'applyai-dab34.firebasestorage.app',
  messagingSenderId: '171877968146',
  appId:             '1:171877968146:web:751477dd51e029037aebcb',
  measurementId:     'G-GDSMLWQFMN',
}

const app = initializeApp(firebaseConfig)

export const analytics = getAnalytics(app)
export const auth      = getAuth(app)

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

// ── Auth helpers ──────────────────────────────────────────────────────────────

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider)
  return result.user
}

export async function signUpWithEmail(name: string, email: string, password: string): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(cred.user, { displayName: name })
  return cred.user
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}

export type { User }
