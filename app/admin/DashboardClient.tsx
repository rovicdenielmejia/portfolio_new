'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Image, FileText, TrendingUp, Eye, Mail } from 'lucide-react'

interface Stats {
  totalInquiries: number
  newInquiries: number
  totalPortfolio: number
  totalBlogPosts: number
}

interface RecentInquiry {
  id: string
  name: string
  email: string
  service: string
  status: string
  createdAt: string
}

export default function DashboardClient() {
  const [stats, setStats] = useState<Stats>({
    totalInquiries: 0,
    newInquiries: 0,
    totalPortfolio: 0,
    totalBlogPosts: 0
  })
  const [recentInquiries, setRecentInquiries] = useState<RecentInquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, inquiriesRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/inquiries?limit=5&sort=desc')
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (inquiriesRes.ok) {
        const inquiriesData = await inquiriesRes.json()
        setRecentInquiries(inquiriesData.inquiries || [])
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      new: 'badge-new',
      contacted: 'badge-contacted',
      in_progress: 'badge-in-progress',
      completed: 'badge-completed',
      archived: 'badge-archived'
    }
    return badges[status] || 'badge-new'
  }

  if (loading) {
    return (
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">Loading...</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">Welcome back! Here's an overview of your portfolio.</p>
      </div>

      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-info">
            <span className="stat-label">Total Inquiries</span>
            <span className="stat-value">{stats.totalInquiries}</span>
            <span className="stat-change positive">
              <TrendingUp size={14} /> {stats.newInquiries} new
            </span>
          </div>
          <div className="stat-icon accent">
            <Mail size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-info">
            <span className="stat-label">Portfolio Items</span>
            <span className="stat-value">{stats.totalPortfolio}</span>
            <span className="stat-change positive">
              <TrendingUp size={14} /> Active
            </span>
          </div>
          <div className="stat-icon success">
            <Image size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-info">
            <span className="stat-label">Blog Posts</span>
            <span className="stat-value">{stats.totalBlogPosts}</span>
            <span className="stat-change positive">
              <TrendingUp size={14} /> Published
            </span>
          </div>
          <div className="stat-icon warning">
            <FileText size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-info">
            <span className="stat-label">Page Views</span>
            <span className="stat-value">1,234</span>
            <span className="stat-change positive">
              <TrendingUp size={14} /> +12%
            </span>
          </div>
          <div className="stat-icon accent">
            <Eye size={24} />
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="glass-card">
          <div className="glass-card-header">
            <h3 className="glass-card-title">Recent Inquiries</h3>
              <a href="/admin/inquiries" className="btn btn-ghost btn-sm">
                View All
              </a>
          </div>
          <div className="glass-card-body" style={{ padding: 0 }}>
            {recentInquiries.length > 0 ? (
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInquiries.map((inquiry) => (
                    <tr key={inquiry.id}>
                      <td>
                        <div>{inquiry.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                          {inquiry.email}
                        </div>
                      </td>
                      <td>{inquiry.service || '-'}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(inquiry.status)}`}>
                          {inquiry.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                        {formatDate(inquiry.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <MessageSquare className="empty-state-icon" />
                <p className="empty-state-title">No inquiries yet</p>
                <p>Inquiries will appear here when submitted.</p>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card">
          <div className="glass-card-header">
            <h3 className="glass-card-title">Quick Actions</h3>
          </div>
          <div className="glass-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a href="/admin/portfolio/new" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
                <Image size={18} /> Add Portfolio Item
              </a>
              <a href="/admin/blog/new" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <FileText size={18} /> Create Blog Post
              </a>
              <a href="/admin/services" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <TrendingUp size={18} /> Manage Services
              </a>
              <a href="/" target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                <Eye size={18} /> View Live Site
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
