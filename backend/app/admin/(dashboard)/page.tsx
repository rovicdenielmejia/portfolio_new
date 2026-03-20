'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  MessageSquare, 
  Image, 
  FileText, 
  TrendingUp,
  ArrowRight,
  Clock,
  Eye
} from 'lucide-react'

interface Stats {
  newInquiries: number
  totalInquiries: number
  portfolioItems: number
  publishedPosts: number
  recentInquiries: Array<{
    id: string
    name: string
    email: string
    projectType: string | null
    status: string
    createdAt: string
  }>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here&apos;s an overview of your portfolio.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">
            <MessageSquare size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.newInquiries || 0}</div>
            <div className="stat-label">New Inquiries</div>
            <div className="stat-change positive">
              <TrendingUp size={14} />
              <span>+12% from last week</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">
            <MessageSquare size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.totalInquiries || 0}</div>
            <div className="stat-label">Total Inquiries</div>
            <div className="stat-change positive">
              <TrendingUp size={14} />
              <span>All time</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">
            <Image size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.portfolioItems || 0}</div>
            <div className="stat-label">Portfolio Items</div>
            <div className="stat-change positive">
              <TrendingUp size={14} />
              <span>+3 this month</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon info">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.publishedPosts || 0}</div>
            <div className="stat-label">Published Posts</div>
            <div className="stat-change positive">
              <TrendingUp size={14} />
              <span>+2 this month</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Recent Inquiries</h2>
            <Link href="/admin/inquiries" className="btn btn-secondary btn-sm">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {stats?.recentInquiries && stats.recentInquiries.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats.recentInquiries.slice(0, 5).map((inquiry) => (
                <div 
                  key={inquiry.id}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem',
                    padding: '0.75rem',
                    background: 'var(--bg-glass)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent), #d4923a)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: 'var(--bg-primary)'
                  }}>
                    {inquiry.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, marginBottom: 2 }}>{inquiry.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {inquiry.projectType || 'General Inquiry'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span className={`status-badge ${inquiry.status}`}>{inquiry.status}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={10} />
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <MessageSquare />
              <h3>No inquiries yet</h3>
              <p>New inquiries will appear here</p>
            </div>
          )}
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Quick Actions</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <Link 
              href="/admin/portfolio/new"
              className="quick-action-card"
            >
              <div className="stat-icon primary">
                <Image size={20} />
              </div>
              <span>Add Portfolio Item</span>
            </Link>

            <Link 
              href="/admin/blog/new"
              className="quick-action-card"
            >
              <div className="stat-icon info">
                <FileText size={20} />
              </div>
              <span>Write Blog Post</span>
            </Link>

            <Link 
              href="/admin/inquiries"
              className="quick-action-card"
            >
              <div className="stat-icon success">
                <MessageSquare size={20} />
              </div>
              <span>View Inquiries</span>
            </Link>

            <Link 
              href="/"
              target="_blank"
              className="quick-action-card"
            >
              <div className="stat-icon warning">
                <Eye size={20} />
              </div>
              <span>View Website</span>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .loading-state {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .quick-action-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: var(--bg-glass);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          transition: all 0.2s ease;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .quick-action-card:hover {
          background: var(--bg-card-hover);
          border-color: var(--border-hover);
          color: var(--text-primary);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  )
}
