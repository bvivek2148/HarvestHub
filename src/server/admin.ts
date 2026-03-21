export async function getFirebaseAdmin() {
  const { initializeApp, getApps, cert } = await import('firebase-admin/app')
  const { getFirestore } = await import('firebase-admin/firestore')
  const { getAuth } = await import('firebase-admin/auth')
  const { getStorage } = await import('firebase-admin/storage')

  if (!getApps().length) {
    const privateKey = (process.env.FIREBASE_ADMIN_PRIVATE_KEY || '').replace(/\\n/g, '\n')
    if (process.env.FIREBASE_ADMIN_PROJECT_ID) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey,
        }),
        storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
      })
    }
  }

  return {
    db: getFirestore(),
    adminAuth: getAuth(),
    adminStorage: getStorage(),
  }
}
