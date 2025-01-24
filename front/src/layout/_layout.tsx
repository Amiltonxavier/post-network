import { Header } from '@/components/header'
import { useAuth } from '@/hooks/userAuth'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

export default function AppLayout() {

  const { isAuthenticated, getUser } = useAuth();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
      if (!isAuthenticated) {
          getUser()
      }
  }, [])

  if (isAuthenticated)

  return (
    <div className='flex flex-col min-h-screen'>
        <Header />
        <div className='flex-1 flex flex-col px-8 py-5'>
            <Outlet />
        </div>
    </div>
  )
}