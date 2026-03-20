'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Image, Edit, Trash2, Eye, X, Upload, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface PortfolioItem {
  id: string
  title: string
  slug: string
  category: string
  description: string | null
  content: string | null
  imageUrl: string | null
  images: string[]
  featured: boolean
  order: number
  createdAt: string
}

const categories = [
  { value: 'brand-identity', label: 'Brand Identity' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'social-media', label: 'Social Media' },
  { value: 'event', label: 'Event' },
  { value: 'print', label: 'Print' },
  { value: 'specialized', label: 'Specialized' }
]

export default function PortfolioClient() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'brand-identity',
    description: '',
    content: '',
    imageUrl: '',
    featured: false,
    order: 0
  })

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const fetchPortfolio = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/portfolio')
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch (error) {
      console.error('Failed to fetch portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      const url = editingItem 
        ? `/api/portfolio/${editingItem.id}`
        : '/api/portfolio'
      const method = editingItem ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        await fetchPortfolio()
        setShowModal(false)
        setEditingItem(null)
        setFormData({
          title: '',
          slug: '',
          category: 'brand-identity',
          description: '',
          content: '',
          imageUrl: '',
          featured: false,
          order: 0
        })
      }
    } catch (error) {
      console.error('Failed to save portfolio item:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      slug: item.slug,
      category: item.category,
      description: item.description || '',
      content: item.content || '',
      imageUrl: item.imageUrl || '',
      featured: item.featured,
      order: item.order
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setItems(prev => prev.filter(i => i.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete item:', error)
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
      slug: editingItem ? prev.slug : generateSlug(title)
    }))
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = !search || 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !categoryFilter || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="animate-fade-in">
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="admin-page-title">Portfolio</h1>
          <p className="admin-page-subtitle">Manage your portfolio items.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Item
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
                placeholder="Search portfolio..."
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
          ) : filteredItems.length > 0 ? (
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Featured</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      ) : (
                        <div style={{ 
                          width: '60px', 
                          height: '40px', 
                          background: 'var(--admin-surface)', 
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Image size={16} style={{ color: 'var(--admin-text-muted)' }} />
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{item.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>{item.slug}</div>
                    </td>
                    <td>
                      <span className="badge badge-new">
                        {categories.find(c => c.value === item.category)?.label || item.category}
                      </span>
                    </td>
                    <td>
                      {item.featured ? (
                        <span className="badge badge-completed">Featured</span>
                      ) : (
                        <span style={{ color: 'var(--admin-text-muted)' }}>-</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link 
                          href={`/portfolio/${item.slug}`}
                          target="_blank"
                          className="btn btn-ghost btn-icon"
                          title="View Live"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <button
                          className="btn btn-ghost btn-icon"
                          onClick={() => handleEdit(item)}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn btn-ghost btn-icon"
                          onClick={() => handleDelete(item.id)}
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
              <Image className="empty-state-icon" />
              <p className="empty-state-title">No portfolio items</p>
              <p>Add your first portfolio item to get started.</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: '700px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingItem ? 'Edit Portfolio Item' : 'Add Portfolio Item'}</h3>
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
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Content</label>
                  <textarea
                    className="form-textarea"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={5}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://..."
                  />
                  {formData.imageUrl && (
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="image-preview"
                      style={{ maxWidth: '200px', marginTop: '0.5rem' }}
                    />
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Order</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.order}
                      onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', paddingTop: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      />
                      Featured Item
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={uploading}>
                  {uploading ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
