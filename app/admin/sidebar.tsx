'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  MessageSquare, 
  Image, 
  Briefcase, 
  FileText, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useAuth } from './providers'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/inquiries', icon: MessageSquare, label: 'Inquiries', badge: 'new' },
  { href: '/admin/portfolio', icon: Image, label: 'Portfolio' },
  { href: '/admin/services', icon: Briefcase, label: 'Services' },
  { href: '/admin/blog', icon: FileText, label: 'Blog' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">R</div>
        <span className="sidebar-brand">Rovic Admin</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          {!collapsed && <div className="nav-section-title">Main</div>}
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="sidebar-footer">
        <button
          onClick={onToggle}
          className="nav-item"
          style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
          <span>Collapse</span>
        </button>
        <button
          onClick={logout}
          className="nav-item"
          style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--danger)' }}
        >
          <LogOut />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
