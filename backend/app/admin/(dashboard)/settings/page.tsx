'use client'

import { useState, useEffect } from 'react'
import { 
  Settings,
  Globe,
  Mail,
  Link as LinkIcon,
  Save,
  Check
} from 'lucide-react'
import AdminLayout from '../../admin-layout'

interface SettingsData {
  siteTitle: string
  siteDescription: string
  metaDescription: string
  contactEmail: string
  phoneNumber: string
  facebookUrl: string
  instagramUrl: string
  linkedinUrl: string
  twitterUrl: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    siteTitle: '',
    siteDescription: '',
    metaDescription: '',
    contactEmail: '',
    phoneNumber: '',
    facebookUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      setSettings({
        siteTitle: data.siteTitle || 'Rovic Mejia Portfolio',
        siteDescription: data.siteDescription || '',
        metaDescription: data.metaDescription || '',
        contactEmail: data.contactEmail || 'rovicdenielmejia@gmail.com',
        phoneNumber: data.phoneNumber || '+639755636276',
        facebookUrl: data.facebookUrl || '',
        instagramUrl: data.instagramUrl || '',
        linkedinUrl: data.linkedinUrl || '',
        twitterUrl: data.twitterUrl || '',
      })
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-state">
          <div className="loading-spinner" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Manage your website settings</p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* General Settings */}
            <div className="glass-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div className="stat-icon primary">
                  <Globe size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>General</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Basic website information</p>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Site Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.siteTitle}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteTitle: e.target.value }))}
                  placeholder="Your website title"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Site Description</label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={settings.siteDescription}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                  placeholder="A brief description of your website"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Meta Description</label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={settings.metaDescription}
                  onChange={(e) => setSettings(prev => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="SEO meta description for search engines"
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Recommended: 150-160 characters
                </p>
              </div>
            </div>

            {/* Contact Settings */}
            <div className="glass-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div className="stat-icon success">
                  <Mail size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Contact</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Contact information displayed on your site</p>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Contact Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settings.phoneNumber}
                    onChange={(e) => setSettings(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="+639123456789"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="glass-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div className="stat-icon info">
                  <LinkIcon size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Social Links</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Your social media profiles</p>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Facebook</label>
                  <input
                    type="url"
                    className="form-input"
                    value={settings.facebookUrl}
                    onChange={(e) => setSettings(prev => ({ ...prev, facebookUrl: e.target.value }))}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Instagram</label>
                  <input
                    type="url"
                    className="form-input"
                    value={settings.instagramUrl}
                    onChange={(e) => setSettings(prev => ({ ...prev, instagramUrl: e.target.value }))}
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">LinkedIn</label>
                  <input
                    type="url"
                    className="form-input"
                    value={settings.linkedinUrl}
                    onChange={(e) => setSettings(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Twitter</label>
                  <input
                    type="url"
                    className="form-input"
                    value={settings.twitterUrl}
                    onChange={(e) => setSettings(prev => ({ ...prev, twitterUrl: e.target.value }))}
                    placeholder="https://twitter.com/yourprofile"
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? (
                  <>
                    <div className="btn-spinner" /> Saving...
                  </>
                ) : saved ? (
                  <>
                    <Check size={18} /> Saved!
                  </>
                ) : (
                  <>
                    <Save size={18} /> Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <style jsx>{`
          .loading-state {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 400px;
          }
          .loading-spinner {
            width: 32px;
            height: 32px;
            border: 3px solid var(--border);
            border-top-color: var(--accent);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          .btn-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid transparent;
            border-top-color: currentColor;
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
