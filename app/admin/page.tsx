import { Metadata } from 'next'
import AdminLayout from '@/components/AdminLayout'
import DashboardClient from './DashboardClient'

export const metadata: Metadata = {
  title: 'Dashboard | Admin',
}

export default function DashboardPage() {
  return (
    <AdminLayout>
      <DashboardClient />
    </AdminLayout>
  )
}
