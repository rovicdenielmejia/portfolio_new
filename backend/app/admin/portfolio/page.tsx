import { Metadata } from 'next'
import AdminLayout from '@/components/AdminLayout'
import PortfolioClient from './PortfolioClient'

export const metadata: Metadata = {
  title: 'Portfolio | Admin',
}

export default function PortfolioPage() {
  return (
    <AdminLayout>
      <PortfolioClient />
    </AdminLayout>
  )
}
