'use client'

import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './providers'
import Sidebar from './sidebar'
import Header from './header'
import { useRouter } from 'next/navigation'

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: 'var(--bg-primary)'
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '3px solid var(--border)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="admin-layout">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`} 
        style={{ display: 'none' }} />
      
      <main className="admin-main">
        <Header 
          title="Dashboard" 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="admin-content">
          {children}
        </div>
      </main>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  )
}
