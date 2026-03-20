'use client'

import { Search, Bell, Menu } from 'lucide-react'
import { useAuth } from './providers'

interface HeaderProps {
  title: string
  onMenuClick: () => void
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  const { user } = useAuth()

  return (
    <header className="admin-header">
      <div className="header-left">
        <button className="header-toggle" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        <h1 className="header-title">{title}</h1>
      </div>

      <div className="header-right">
        <div className="search-box">
          <Search />
          <input type="text" placeholder="Search..." />
        </div>

        <button className="header-btn">
          <Bell size={18} />
          <span className="badge">3</span>
        </button>

        <div className="user-menu">
          <div className="user-avatar">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Admin'}</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  )
}
