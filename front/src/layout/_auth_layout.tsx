import { Network } from 'lucide-react'
import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className='min-h-screen grid grid-cols-2'>
      <div className='h-full border-r border-foreground/5 bg-muted p-10 text-muted-foreground flex flex-col justify-between'>
        <div className='flex items-center gap-3 text-lg font-medium text-foreground'>
          <Network className='size-5' />
          <span className='font-semibold'>NetTask</span>
        </div>
        <footer className='text-sm'>Painel do parceiro &copy;  - {new Date().getFullYear()}</footer>
      </div>
      <div className='flex flex-col justify-center items-center relative'>
        <Outlet />
      </div>
    </div>
  )
}