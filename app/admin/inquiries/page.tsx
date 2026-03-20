import { Metadata } from 'next'
import AdminLayout from '@/components/AdminLayout'
import InquiriesClient from './InquiriesClient'

export const metadata: Metadata = {
  title: 'Inquiries | Admin',
}

export default function InquiriesPage() {
  return (
    <AdminLayout>
      <InquiriesClient />
    </AdminLayout>
  )
}
