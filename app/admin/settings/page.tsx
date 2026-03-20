import { Metadata } from 'next'
import AdminLayout from '@/components/AdminLayout'
import SettingsClient from './SettingsClient'

export const metadata: Metadata = {
  title: 'Settings | Admin',
}

export default function SettingsPage() {
  return (
    <AdminLayout>
      <SettingsClient />
    </AdminLayout>
  )
}
