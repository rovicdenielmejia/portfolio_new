'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

interface Inquiry {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  projectType: string | null
  service: string | null
  budget: string | null
  message: string
  status: string
  source: string | null
  createdAt: string
  updatedAt: string
}

const statusOptions = ['new', 'contacted', 'in_progress', 'completed', 'archived']

export default function InquiriesClient() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  })

  useEffect(() => {
    fetchInquiries()
  }, [pagination.page, statusFilter])

  const fetchInquiries = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', pagination.page.toString())
      params.set('limit', pagination.limit.toString())
      if (statusFilter) params.set('status', statusFilter)

      const res = await fetch(`/api/admin/inquiries?${params}`)
      if (res.ok) {
        const data = await res.json()
        setInquiries(data.inquiries)
        setPagination(prev => ({ ...prev, total: data.total }))
      }
    } catch (error) {
      console.error('Failed to fetch inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        setInquiries(prev => prev.map(i => 
          i.id === id ? { ...i, status } : i
        ))
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(prev => prev ? { ...prev, status } : null)
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const deleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return
    
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setInquiries(prev => prev.filter(i => i.id !== id))
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(null)
        }
      }
    } catch (error) {
      console.error('Failed to delete inquiry:', error)
    }
  }

  const filteredInquiries = inquiries.filter(i => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      i.name.toLowerCase().includes(searchLower) ||
      i.email.toLowerCase().includes(searchLower) ||
      i.message.toLowerCase().includes(searchLower)
    )
  })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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

  const totalPages = Math.ceil(pagination.total / pagination.limit)

  return (
    <div className="animate-fade-in">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Inquiries</h1>
        <p className="admin-page-subtitle">Manage client inquiries and messages.</p>
      </div>

      <div className="glass-card">
        <div className="glass-card-header">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="admin-search" style={{ width: '300px' }}>
              <Search className="admin-search-icon" size={16} />
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search inquiries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="form-select"
              style={{ width: '180px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="glass-card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
              Loading...
            </div>
          ) : filteredInquiries.length > 0 ? (
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{inquiry.name}</div>
                      {inquiry.company && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                          {inquiry.company}
                        </div>
                      )}
                    </td>
                    <td>
                      <a href={`mailto:${inquiry.email}`} style={{ color: 'var(--admin-accent)' }}>
                        {inquiry.email}
                      </a>
                    </td>
                    <td>{inquiry.service || inquiry.projectType || '-'}</td>
                    <td>
                      <select
                        className={`status-select badge ${getStatusBadge(inquiry.status)}`}
                        value={inquiry.status}
                        onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>
                            {status.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                      {formatDate(inquiry.createdAt)}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-ghost btn-icon"
                          onClick={() => setSelectedInquiry(inquiry)}
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn btn-ghost btn-icon"
                          onClick={() => deleteInquiry(inquiry.id)}
                          title="Delete"
                          style={{ color: 'var(--admin-error)' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <Filter className="empty-state-icon" />
              <p className="empty-state-title">No inquiries found</p>
              <p>Inquiries will appear here when submitted.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="glass-card-header" style={{ borderTop: '1px solid var(--admin-border)', justifyContent: 'center' }}>
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={pagination.page === 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`pagination-btn ${pagination.page === page ? 'active' : ''}`}
                  onClick={() => setPagination(prev => ({ ...prev, page }))}
                >
                  {page}
                </button>
              ))}
              <button
                className="pagination-btn"
                disabled={pagination.page === totalPages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedInquiry && (
        <div className="modal-backdrop" onClick={() => setSelectedInquiry(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Inquiry Details</h3>
              <button className="modal-close" onClick={() => setSelectedInquiry(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Name</label>
                <p>{selectedInquiry.name}</p>
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <p><a href={`mailto:${selectedInquiry.email}`} style={{ color: 'var(--admin-accent)' }}>{selectedInquiry.email}</a></p>
              </div>
              {selectedInquiry.phone && (
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <p>{selectedInquiry.phone}</p>
                </div>
              )}
              {selectedInquiry.company && (
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <p>{selectedInquiry.company}</p>
                </div>
              )}
              {selectedInquiry.projectType && (
                <div className="form-group">
                  <label className="form-label">Project Type</label>
                  <p>{selectedInquiry.projectType}</p>
                </div>
              )}
              {selectedInquiry.budget && (
                <div className="form-group">
                  <label className="form-label">Budget</label>
                  <p>{selectedInquiry.budget}</p>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Message</label>
                <p style={{ whiteSpace: 'pre-wrap' }}>{selectedInquiry.message}</p>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  style={{ width: '200px' }}
                  value={selectedInquiry.status}
                  onChange={(e) => {
                    updateStatus(selectedInquiry.id, e.target.value)
                    setSelectedInquiry(prev => prev ? { ...prev, status: e.target.value } : null)
                  }}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Received</label>
                <p style={{ color: 'var(--admin-text-muted)' }}>{formatDate(selectedInquiry.createdAt)}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedInquiry(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
