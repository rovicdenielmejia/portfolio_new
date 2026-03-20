'use client'

import { useState, useEffect } from 'react'
import { 
  MessageSquare, 
  Eye, 
  Trash2, 
  Plus,
  Filter,
  MoreVertical,
  Check,
  X,
  Clock,
  User,
  Mail,
  Phone,
  Building
} from 'lucide-react'
import AdminLayout from '../../admin-layout'

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
}

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
]

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchInquiries()
  }, [])

  async function fetchInquiries() {
    try {
      const res = await fetch('/api/inquiries')
      const data = await res.json()
      setInquiries(data)
    } catch (error) {
      console.error('Failed to fetch inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      fetchInquiries()
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  async function deleteInquiry(id: string) {
    if (!confirm('Are you sure you want to delete this inquiry?')) return
    try {
      await fetch(`/api/inquiries/${id}`, { method: 'DELETE' })
      fetchInquiries()
    } catch (error) {
      console.error('Failed to delete inquiry:', error)
    }
  }

  function viewDetails(inquiry: Inquiry) {
    setSelectedInquiry(inquiry)
    setShowModal(true)
  }

  const filteredInquiries = statusFilter
    ? inquiries.filter(i => i.status === statusFilter)
    : inquiries

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock size={14} />
      case 'contacted': return <Mail size={14} />
      case 'in_progress': return <Clock size={14} />
      case 'completed': return <Check size={14} />
      case 'archived': return <X size={14} />
      default: return <Clock size={14} />
    }
  }

  return (
    <AdminLayout>
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Inquiries</h1>
            <p className="page-subtitle">Manage client inquiries and messages</p>
          </div>
        </div>

        <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={18} style={{ color: 'var(--text-muted)' }} />
              <select 
                className="form-input"
                style={{ width: 'auto', padding: '0.5rem 1rem' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {filteredInquiries.length} inquiry{filteredInquiries.length !== 1 ? 'ies' : ''}
            </span>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="empty-state">
              <MessageSquare />
              <h3>No inquiries found</h3>
              <p>Inquiries from your website will appear here</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Project Type</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInquiries.map((inquiry) => (
                    <tr key={inquiry.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--accent), #d4923a)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            color: 'var(--bg-primary)'
                          }}>
                            {inquiry.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 500 }}>{inquiry.name}</div>
                            {inquiry.company && (
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {inquiry.company}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: 2 }}>
                            <Mail size={12} style={{ color: 'var(--text-muted)' }} />
                            {inquiry.email}
                          </div>
                          {inquiry.phone && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <Phone size={12} style={{ color: 'var(--text-muted)' }} />
                              {inquiry.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span style={{ 
                          padding: '0.3rem 0.6rem',
                          background: 'var(--bg-glass)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem'
                        }}>
                          {inquiry.projectType || inquiry.service || 'General'}
                        </span>
                      </td>
                      <td>
                        <select
                          className={`status-badge ${inquiry.status}`}
                          value={inquiry.status}
                          onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                          style={{ 
                            cursor: 'pointer',
                            border: 'none',
                            background: 'transparent'
                          }}
                        >
                          {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {new Date(inquiry.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </td>
                      <td>
                        <div className="actions">
                          <button 
                            className="btn btn-secondary btn-icon btn-sm"
                            onClick={() => viewDetails(inquiry)}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className="btn btn-danger btn-icon btn-sm"
                            onClick={() => deleteInquiry(inquiry.id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showModal && selectedInquiry && (
          <div className="modal-overlay active" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Inquiry Details</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <X size={18} />
                </button>
              </div>
              <div className="modal-body">
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--accent), #d4923a)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1.25rem',
                      color: 'var(--bg-primary)'
                    }}>
                      {selectedInquiry.name.charAt(0)}
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{selectedInquiry.name}</h2>
                      <span className={`status-badge ${selectedInquiry.status}`}>
                        {getStatusIcon(selectedInquiry.status)}
                        <span style={{ marginLeft: 6 }}>{selectedInquiry.status.replace('_', ' ')}</span>
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Email</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Mail size={16} style={{ color: 'var(--text-muted)' }} />
                        {selectedInquiry.email}
                      </div>
                    </div>
                    {selectedInquiry.phone && (
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Phone</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Phone size={16} style={{ color: 'var(--text-muted)' }} />
                          {selectedInquiry.phone}
                        </div>
                      </div>
                    )}
                    {selectedInquiry.company && (
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Company</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Building size={16} style={{ color: 'var(--text-muted)' }} />
                          {selectedInquiry.company}
                        </div>
                      </div>
                    )}
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Project Type</label>
                      <div>{selectedInquiry.projectType || selectedInquiry.service || 'General Inquiry'}</div>
                    </div>
                  </div>

                  {selectedInquiry.budget && (
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Budget</label>
                      <div>{selectedInquiry.budget}</div>
                    </div>
                  )}

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Message</label>
                    <div style={{ 
                      padding: '1rem',
                      background: 'var(--bg-glass)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      lineHeight: 1.6
                    }}>
                      {selectedInquiry.message}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Received on {new Date(selectedInquiry.createdAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {selectedInquiry.source && ` from ${selectedInquiry.source}`}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    window.open(`mailto:${selectedInquiry.email}`, '_blank')
                  }}
                >
                  Reply via Email
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .loading-state {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 200px;
          }
          .loading-spinner {
            width: 32px;
            height: 32px;
            border: 3px solid var(--border);
            border-top-color: var(--accent);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </AdminLayout>
  )
}
