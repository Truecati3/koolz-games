import '@/styles/globals.css'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && router.pathname !== '/login') {
        router.push('/login')
      }
    })
    return () => unsubscribe()
  }, [router])

  return <Component {...pageProps} />
}
