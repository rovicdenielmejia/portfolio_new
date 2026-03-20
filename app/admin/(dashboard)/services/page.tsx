'use client'

import { useState, useEffect } from 'react'
import { 
  Briefcase, 
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  DollarSign
} from 'lucide-react'
import AdminLayout from '../../admin-layout'

interface Service {
  id: string
  title: string
  slug: string
  category: string
  shortDesc: string | null
  description: string | null
  price: string | null
  features: string[]
  icon: string | null
  order: number
  active: boolean
  createdAt: string
}

const categories = [
  { value: 'brand-strategy', label: 'Brand Strategy' },
  { value: 'hr-strategy', label: 'HR Strategy' },
]

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [newFeature, setNewFeature] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'brand-strategy',
    shortDesc: '',
    description: '',
    price: '',
    features: [] as string[],
    icon: '',
    order: 0,
    active: true,
  })

  useEffect(() => {
    fetchServices()
  }, [])

  async function fetchServices() {
    try {
      const res = await fetch('/api/services')
      const data = await res.json()
      setServices(data)
    } catch (error) {
      console.error('Failed to fetch services:', error)
    } finally {
      setLoading(false)
    }
  }

  function openModal(service?: Service) {
    if (service) {
      setEditingService(service)
      setFormData({
        title: service.title,
        slug: service.slug,
        category: service.category,
        shortDesc: service.shortDesc || '',
        description: service.description || '',
        price: service.price || '',
        features: service.features || [],
        icon: service.icon || '',
        order: service.order,
        active: service.active,
      })
    } else {
      setEditingService(null)
      setFormData({
        title: '',
        slug: '',
        category: 'brand-strategy',
        shortDesc: '',
        description: '',
        price: '',
        features: [],
        icon: '',
        order: 0,
        active: true,
      })
    }
    setShowModal(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const url = editingService 
        ? `/api/services/${editingService.slug}` 
        : '/api/services'
      const method = editingService ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setShowModal(false)
        fetchServices()
      }
    } catch (error) {
      console.error('Failed to save service:', error)
    }
  }

  async function deleteService(slug: string) {
    if (!confirm('Are you sure you want to delete this service?')) return
    try {
      await fetch(`/api/services/${slug}`, { method: 'DELETE' })
      fetchServices()
    } catch (error) {
      console.error('Failed to delete service:', error)
    }
  }

  async function toggleActive(service: Service) {
    try {
      await fetch(`/api/services/${service.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...service, active: !service.active }),
      })
      fetchServices()
    } catch (error) {
      console.error('Failed to toggle service:', error)
    }
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  function addFeature() {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  function removeFeature(index: number) {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const filteredServices = categoryFilter
    ? services.filter(s => s.category === categoryFilter)
    : services

  return (
    <AdminLayout>
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Services</h1>
            <p className="page-subtitle">Manage your service offerings</p>
          </div>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <Plus size={18} /> Add Service
          </button>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <select 
              className="form-input"
              style={{ width: 'auto', padding: '0.5rem 1rem' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="empty-state">
              <Briefcase />
              <h3>No services</h3>
              <p>Add your first service to get started</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredServices.map((service) => (
                <div 
                  key={service.id}
                  style={{
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    opacity: service.active ? 1 : 0.6
                  }}
                >
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(232, 168, 74, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Briefcase size={24} style={{ color: 'var(--accent)' }} />
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{service.title}</h3>
                      <span className={`status-badge ${service.active ? 'active' : 'inactive'}`}>
                        {service.active ? 'Active' : 'Inactive'}
                      </span>
                      <span style={{ 
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        {categories.find(c => c.value === service.category)?.label}
                      </span>
                    </div>
                    
                    {service.shortDesc && (
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        {service.shortDesc}
                      </p>
                    )}

                    {service.price && (
                      <div style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.9rem',
                        color: 'var(--accent)',
                        fontWeight: 600
                      }}>
                        <DollarSign size={14} />
                        {service.price}
                      </div>
                    )}

                    {service.features && service.features.length > 0 && (
                      <div style={{ 
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        marginTop: '0.75rem'
                      }}>
                        {service.features.slice(0, 4).map((feature, idx) => (
                          <span 
                            key={idx}
                            style={{
                              fontSize: '0.75rem',
                              padding: '0.25rem 0.5rem',
                              background: 'var(--bg-primary)',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--text-muted)'
                            }}
                          >
                            {feature}
                          </span>
                        ))}
                        {service.features.length > 4 && (
                          <span style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)'
                          }}>
                            +{service.features.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="actions">
                    <button 
                      className={`btn btn-sm ${service.active ? 'btn-secondary' : 'btn-primary'}`}
                      onClick={() => toggleActive(service)}
                      title={service.active ? 'Deactivate' : 'Activate'}
                    >
                      {service.active ? <X size={14} /> : <Check size={14} />}
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => openModal(service)}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteService(service.slug)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay active" onClick={() => setShowModal(false)}>
            <div className="modal" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">{editingService ? 'Edit Service' : 'Add Service'}</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Title *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.title}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            title: e.target.value,
                            slug: generateSlug(e.target.value)
                          }))
                        }}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Slug</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <select
                        className="form-input"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        required
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Price</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="e.g. Starting at ₱15,000"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Short Description</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.shortDesc}
                      onChange={(e) => setFormData(prev => ({ ...prev, shortDesc: e.target.value }))}
                      placeholder="Brief tagline for cards"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Full Description</label>
                    <textarea
                      className="form-input"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Detailed description for the service page"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Features</label>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <input
                        type="text"
                        className="form-input"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Add a feature"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addFeature()
                          }
                        }}
                      />
                      <button type="button" className="btn btn-secondary" onClick={addFeature}>
                        <Plus size={16} />
                      </button>
                    </div>
                    {formData.features.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {formData.features.map((feature, idx) => (
                          <div 
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.5rem 0.75rem',
                              background: 'var(--bg-glass)',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border)'
                            }}
                          >
                            <Check size={14} style={{ color: 'var(--success)' }} />
                            <span style={{ flex: 1 }}>{feature}</span>
                            <button
                              type="button"
                              onClick={() => removeFeature(idx)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: 4
                              }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Display Order</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.order}
                        onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Active</label>
                      <label className="form-checkbox">
                        <input
                          type="checkbox"
                          checked={formData.active}
                          onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                        />
                        <span>Service is active and visible</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingService ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
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
