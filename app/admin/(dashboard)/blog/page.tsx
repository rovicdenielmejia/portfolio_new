'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  Plus,
  Edit2,
  Trash2,
  X,
  Eye,
  Star,
  Calendar,
  Tag,
  Upload,
  Image as ImageIcon
} from 'lucide-react'
import AdminLayout from '../../admin-layout'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage: string | null
  author: string | null
  category: string | null
  tags: string[]
  published: boolean
  featured: boolean
  seoTitle: string | null
  seoDesc: string | null
  order: number
  createdAt: string
  publishedAt: string | null
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [uploading, setUploading] = useState(false)
  const [newTag, setNewTag] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    author: '',
    category: '',
    tags: [] as string[],
    published: false,
    featured: false,
    seoTitle: '',
    seoDesc: '',
    order: 0,
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    try {
      const res = await fetch('/api/blog')
      const data = await res.json()
      setPosts(data)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  function openModal(post?: BlogPost) {
    if (post) {
      setEditingPost(post)
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        content: post.content,
        coverImage: post.coverImage || '',
        author: post.author || '',
        category: post.category || '',
        tags: post.tags || [],
        published: post.published,
        featured: post.featured,
        seoTitle: post.seoTitle || '',
        seoDesc: post.seoDesc || '',
        order: post.order,
      })
    } else {
      setEditingPost(null)
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        coverImage: '',
        author: '',
        category: '',
        tags: [],
        published: false,
        featured: false,
        seoTitle: '',
        seoDesc: '',
        order: 0,
      })
    }
    setShowModal(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const url = editingPost 
        ? `/api/blog/${editingPost.slug}` 
        : '/api/blog'
      const method = editingPost ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setShowModal(false)
        fetchPosts()
      }
    } catch (error) {
      console.error('Failed to save post:', error)
    }
  }

  async function deletePost(slug: string) {
    if (!confirm('Are you sure you want to delete this post?')) return
    try {
      await fetch(`/api/blog/${slug}`, { method: 'DELETE' })
      fetchPosts()
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })
      
      if (res.ok) {
        const data = await res.json()
        setFormData(prev => ({ ...prev, coverImage: data.url }))
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

  function addTag() {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  function removeTag(tag: string) {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  return (
    <AdminLayout>
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Blog</h1>
            <p className="page-subtitle">Create and manage blog posts</p>
          </div>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <Plus size={18} /> New Post
          </button>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {posts.length} post{posts.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <FileText />
              <h3>No blog posts</h3>
              <p>Create your first blog post to get started</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {posts.map((post) => (
                <div 
                  key={post.id}
                  style={{
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <div style={{
                    width: 80,
                    height: 60,
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-primary)',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    {post.coverImage ? (
                      <img 
                        src={post.coverImage} 
                        alt=""
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
                        <ImageIcon size={24} />
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{post.title}</h3>
                      {post.featured && (
                        <Star size={14} style={{ color: 'var(--accent)' }} fill="var(--accent)" />
                      )}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {post.excerpt || 'No excerpt'}
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem',
                      marginTop: '0.5rem',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)'
                    }}>
                      {post.category && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Tag size={12} /> {post.category}
                        </span>
                      )}
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={12} /> 
                        {post.publishedAt 
                          ? new Date(post.publishedAt).toLocaleDateString()
                          : new Date(post.createdAt).toLocaleDateString()
                        }
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <span className={`status-badge ${post.published ? 'published' : 'draft'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                    <div className="actions">
                      <button 
                        className="btn btn-secondary btn-icon btn-sm"
                        onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                        title="View"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        className="btn btn-secondary btn-icon btn-sm"
                        onClick={() => openModal(post)}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        className="btn btn-danger btn-icon btn-sm"
                        onClick={() => deletePost(post.slug)}
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
            <div className="modal" style={{ maxWidth: 700, maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">{editingPost ? 'Edit Post' : 'New Blog Post'}</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body" style={{ maxHeight: 'calc(90vh - 140px)', overflowY: 'auto' }}>
                  <div className="form-group">
                    <label className="form-label">Cover Image</label>
                    <div style={{ 
                      border: '2px dashed var(--border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.5rem',
                      textAlign: 'center',
                      marginBottom: '1rem'
                    }}>
                      {formData.coverImage ? (
                        <div style={{ position: 'relative' }}>
                          <img 
                            src={formData.coverImage} 
                            alt=""
                            style={{ 
                              maxHeight: 150,
                              borderRadius: 'var(--radius-sm)',
                              margin: '0 auto'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))}
                            style={{
                              position: 'absolute',
                              top: 8,
                              right: '50%',
                              transform: 'translateX(50%)',
                              padding: '0.35rem 0.75rem',
                              background: 'var(--danger)',
                              border: 'none',
                              borderRadius: 'var(--radius-sm)',
                              color: 'white',
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <input
                            type="file"
                            id="cover-upload"
                            accept="image/*"
                            onChange={handleCoverUpload}
                            style={{ display: 'none' }}
                          />
                          <label htmlFor="cover-upload" style={{ cursor: 'pointer' }}>
                            <Upload size={24} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                              {uploading ? 'Uploading...' : 'Click to upload cover image'}
                            </div>
                          </label>
                        </>
                      )}
                    </div>
                  </div>

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

                  <div className="form-group">
                    <label className="form-label">Excerpt</label>
                    <textarea
                      className="form-input"
                      rows={2}
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Brief summary for blog listing"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Content *</label>
                    <textarea
                      className="form-input"
                      rows={10}
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your blog post content here..."
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g. Branding, HR"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Author</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.author}
                        onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                        placeholder="Author name"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tags</label>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <input
                        type="text"
                        className="form-input"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addTag()
                          }
                        }}
                      />
                      <button type="button" className="btn btn-secondary" onClick={addTag}>
                        <Plus size={16} />
                      </button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {formData.tags.map((tag, idx) => (
                          <span 
                            key={idx}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '0.8rem',
                              padding: '0.35rem 0.65rem',
                              background: 'var(--bg-glass)',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border)'
                            }}
                          >
                            <Tag size={12} style={{ color: 'var(--accent)' }} />
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: 0,
                                display: 'flex'
                              }}
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">SEO Title</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.seoTitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                        placeholder="Title for search engines"
                      />
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
                    <label className="form-label">SEO Description</label>
                    <textarea
                      className="form-input"
                      rows={2}
                      value={formData.seoDesc}
                      onChange={(e) => setFormData(prev => ({ ...prev, seoDesc: e.target.value }))}
                      placeholder="Description for search engines"
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <label className="form-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.published}
                        onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                      />
                      <span>Published</span>
                    </label>
                    <label className="form-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      />
                      <span>Featured</span>
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingPost ? 'Update' : 'Create'}
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
