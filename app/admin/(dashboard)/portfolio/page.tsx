'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Image, 
  Plus,
  Edit2,
  Trash2,
  Star,
  Eye,
  X,
  Upload,
  GripVertical
} from 'lucide-react'
import AdminLayout from '../../admin-layout'

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
  { value: 'specialized', label: 'Specialized' },
]

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'brand-identity',
    description: '',
    content: '',
    imageUrl: '',
    images: [] as string[],
    featured: false,
    order: 0,
  })

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    try {
      const res = await fetch('/api/portfolio')
      const data = await res.json()
      setItems(data)
    } catch (error) {
      console.error('Failed to fetch items:', error)
    } finally {
      setLoading(false)
    }
  }

  function openModal(item?: PortfolioItem) {
    if (item) {
      setEditingItem(item)
      setFormData({
        title: item.title,
        slug: item.slug,
        category: item.category,
        description: item.description || '',
        content: item.content || '',
        imageUrl: item.imageUrl || '',
        images: item.images || [],
        featured: item.featured,
        order: item.order,
      })
    } else {
      setEditingItem(null)
      setFormData({
        title: '',
        slug: '',
        category: 'brand-identity',
        description: '',
        content: '',
        imageUrl: '',
        images: [],
        featured: false,
        order: 0,
      })
    }
    setShowModal(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const url = editingItem 
        ? `/api/portfolio/${editingItem.slug}` 
        : '/api/portfolio'
      const method = editingItem ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setShowModal(false)
        fetchItems()
      }
    } catch (error) {
      console.error('Failed to save item:', error)
    }
  }

  async function deleteItem(slug: string) {
    if (!confirm('Are you sure you want to delete this item?')) return
    try {
      await fetch(`/api/portfolio/${slug}`, { method: 'DELETE' })
      fetchItems()
    } catch (error) {
      console.error('Failed to delete item:', error)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return

    setUploading(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData()
        formData.append('file', files[i])
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (res.ok) {
          const data = await res.json()
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, data.url],
            imageUrl: prev.imageUrl || data.url,
          }))
        }
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const filteredItems = categoryFilter
    ? items.filter(i => i.category === categoryFilter)
    : items

  return (
    <AdminLayout>
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Portfolio</h1>
            <p className="page-subtitle">Manage your portfolio items</p>
          </div>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <Plus size={18} /> Add Item
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
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="empty-state">
              <Image />
              <h3>No portfolio items</h3>
              <p>Add your first portfolio item to get started</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem'
            }}>
              {filteredItems.map((item) => (
                <div 
                  key={item.id}
                  style={{
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ aspectRatio: '16/10', background: 'var(--bg-primary)', position: 'relative' }}>
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: '100%',
                        color: 'var(--text-muted)'
                      }}>
                        <Image size={40} />
                      </div>
                    )}
                    {item.featured && (
                      <div style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        background: 'var(--accent)',
                        color: 'var(--bg-primary)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        <Star size={12} /> Featured
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <div style={{ 
                      fontSize: '0.7rem',
                      color: 'var(--accent)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.35rem'
                    }}>
                      {categories.find(c => c.value === item.category)?.label || item.category}
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                      {item.title}
                    </h3>
                    {item.description && (
                      <p style={{ 
                        fontSize: '0.85rem', 
                        color: 'var(--text-muted)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {item.description}
                      </p>
                    )}
                    <div style={{ 
                      display: 'flex', 
                      gap: '0.5rem',
                      marginTop: '1rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--border)'
                    }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => openModal(item)}
                        style={{ flex: 1 }}
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteItem(item.slug)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay active" onClick={() => setShowModal(false)}>
            <div className="modal" style={{ maxWidth: 700 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">{editingItem ? 'Edit Portfolio Item' : 'Add Portfolio Item'}</h3>
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
                      <label className="form-label">Display Order</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.order}
                        onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description for the card"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Content</label>
                    <textarea
                      className="form-input"
                      rows={5}
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Detailed content for the portfolio page"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Featured</label>
                    <label className="form-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      />
                      <span>Show this item as featured</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Images</label>
                    <div style={{ 
                      border: '2px dashed var(--border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '2rem',
                      textAlign: 'center',
                      marginBottom: '1rem'
                    }}>
                      <input
                        type="file"
                        id="image-upload"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                        <Upload size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                          {uploading ? 'Uploading...' : 'Click to upload images'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          PNG, JPG, GIF up to 10MB
                        </div>
                      </label>
                    </div>
                    {formData.images.length > 0 && (
                      <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                        gap: '0.5rem'
                      }}>
                        {formData.images.map((img, idx) => (
                          <div key={idx} style={{ position: 'relative' }}>
                            <img 
                              src={img} 
                              alt=""
                              style={{ 
                                width: '100%', 
                                aspectRatio: '1',
                                objectFit: 'cover',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border)'
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                images: prev.images.filter((_, i) => i !== idx),
                                imageUrl: prev.imageUrl === img ? '' : prev.imageUrl
                              }))}
                              style={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                background: 'var(--danger)',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingItem ? 'Update' : 'Create'}
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
