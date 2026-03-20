'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  MessageSquare, 
  Image, 
  Briefcase, 
  FileText, 
  Settings, 
  Menu, 
  Search,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
  { href: '/admin/portfolio', label: 'Portfolio', icon: Image },
  { href: '/admin/services', label: 'Services', icon: Briefcase },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="admin-sidebar-header">
          <Link href="/admin" className="admin-logo">
            <div className="admin-logo-icon">RM</div>
            <span className="admin-logo-text">Dashboard</span>
          </Link>
          <button 
            className="admin-toggle-btn" 
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        
        <nav className="admin-sidebar-nav">
          <div className="admin-nav-section">
            <div className="admin-nav-section-title">Main</div>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon className="admin-nav-icon" size={20} />
                  <span className="admin-nav-label">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <button 
              className="admin-toggle-btn mobile-only" 
              onClick={() => {}}
              aria-label="Toggle menu"
            >
              <Menu size={20} />
            </button>
            <div className="admin-search">
              <Search className="admin-search-icon" size={16} />
              <input 
                type="text" 
                className="admin-search-input" 
                placeholder="Search..."
              />
            </div>
          </div>
          <div className="admin-header-right">
            <div className="admin-user-menu">
              <div className="admin-user-avatar">RM</div>
              <div className="admin-user-info">
                <span className="admin-user-name">Admin</span>
                <span className="admin-user-role">Administrator</span>
              </div>
            </div>
            <Link href="/admin/logout" className="btn btn-ghost btn-icon" title="Logout">
              <LogOut size={18} />
            </Link>
          </div>
        </header>

        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  )
}
