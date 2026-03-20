'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Eye, X, ToggleLeft, ToggleRight } from 'lucide-react'

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
  { value: 'hr-strategy', label: 'HR Strategy' }
]

export default function ServicesClient() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'brand-strategy',
    shortDesc: '',
    description: '',
    price: '',
    features: '',
    icon: '',
    order: 0,
    active: true
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/services')
      if (res.ok) {
        const data = await res.json()
        setServices(data)
      }
    } catch (error) {
      console.error('Failed to fetch services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const dataToSend = {
        ...formData,
        features: formData.features.split('\n').filter(f => f.trim())
      }

      const url = editingService 
        ? `/api/services/${editingService.id}`
        : '/api/services'
      const method = editingService ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      })

      if (res.ok) {
        await fetchServices()
        setShowModal(false)
        setEditingService(null)
        setFormData({
          title: '',
          slug: '',
          category: 'brand-strategy',
          shortDesc: '',
          description: '',
          price: '',
          features: '',
          icon: '',
          order: 0,
          active: true
        })
      }
    } catch (error) {
      console.error('Failed to save service:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      title: service.title,
      slug: service.slug,
      category: service.category,
      shortDesc: service.shortDesc || '',
      description: service.description || '',
      price: service.price || '',
      features: service.features.join('\n'),
      icon: service.icon || '',
      order: service.order,
      active: service.active
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setServices(prev => prev.filter(s => s.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete service:', error)
    }
  }

  const toggleActive = async (service: Service) => {
    try {
      const res = await fetch(`/api/services/${service.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...service, active: !service.active })
      })
      if (res.ok) {
        setServices(prev => prev.map(s => 
          s.id === service.id ? { ...s, active: !s.active } : s
        ))
      }
    } catch (error) {
      console.error('Failed to toggle service:', error)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: editingService ? prev.slug : generateSlug(title)
    }))
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = !search || 
      service.title.toLowerCase().includes(search.toLowerCase()) ||
      service.shortDesc?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !categoryFilter || service.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="animate-fade-in">
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="admin-page-title">Services</h1>
          <p className="admin-page-subtitle">Manage your services and pricing.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Service
        </button>
      </div>

      <div className="glass-card">
        <div className="glass-card-header">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="admin-search" style={{ width: '300px' }}>
              <Search className="admin-search-icon" size={16} />
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="form-select"
              style={{ width: '180px' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="glass-card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
              Loading...
            </div>
          ) : filteredServices.length > 0 ? (
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{service.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                        {service.shortDesc?.substring(0, 60)}...
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-new">
                        {categories.find(c => c.value === service.category)?.label || service.category}
                      </span>
                    </td>
                    <td>{service.price || '-'}</td>
                    <td>
                      <button
                        className="btn btn-ghost btn-icon"
                        onClick={() => toggleActive(service)}
                        title={service.active ? 'Deactivate' : 'Activate'}
                      >
                        {service.active ? (
                          <ToggleRight size={24} style={{ color: 'var(--admin-success)' }} />
                        ) : (
                          <ToggleLeft size={24} style={{ color: 'var(--admin-text-muted)' }} />
                        )}
                      </button>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-ghost btn-icon"
                          onClick={() => handleEdit(service)}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn btn-ghost btn-icon"
                          onClick={() => handleDelete(service.id)}
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
              <p className="empty-state-title">No services</p>
              <p>Add your first service to get started.</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: '700px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingService ? 'Edit Service' : 'Add Service'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Slug *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Short Description</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.shortDesc}
                    onChange={(e) => setFormData(prev => ({ ...prev, shortDesc: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="e.g. Starting at ₱5,000"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Order</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.order}
                      onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Features (one per line)</label>
                  <textarea
                    className="form-textarea"
                    value={formData.features}
                    onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                    rows={5}
                    placeholder="Logo design&#10;Brand guidelines&#10;Social media templates"
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                    />
                    Active
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : (editingService ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
