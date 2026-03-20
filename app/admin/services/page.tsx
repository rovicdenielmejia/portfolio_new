import { Metadata } from 'next'
import AdminLayout from '@/components/AdminLayout'
import ServicesClient from './ServicesClient'

export const metadata: Metadata = {
  title: 'Services | Admin',
}

export default function ServicesPage() {
  return (
    <AdminLayout>
      <ServicesClient />
    </AdminLayout>
  )
}
