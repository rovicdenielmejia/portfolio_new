import { Metadata } from 'next'
import AdminLayout from '@/components/AdminLayout'
import BlogClient from './BlogClient'

export const metadata: Metadata = {
  title: 'Blog | Admin',
}

export default function BlogPage() {
  return (
    <AdminLayout>
      <BlogClient />
    </AdminLayout>
  )
}
