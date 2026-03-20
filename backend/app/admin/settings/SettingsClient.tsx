'use client'

import { useState, useEffect } from 'react'
import { Save, RefreshCw } from 'lucide-react'

interface Settings {
  siteTitle: string
  siteDescription: string
  contactEmail: string
  facebookUrl: string
  instagramUrl: string
  linkedinUrl: string
  twitterUrl: string
  phoneNumber: string
  address: string
}

export default function SettingsClient() {
  const [settings, setSettings] = useState<Settings>({
    siteTitle: 'Rovic Mejia Portfolio',
    siteDescription: 'Hybrid Creative & Workforce Strategist',
    contactEmail: 'rovicdenielmejia@gmail.com',
    facebookUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    phoneNumber: '',
    address: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
        if (data.settings) {
          const settingsObj: Record<string, string> = {}
          data.settings.forEach((s: { key: string; value: string }) => {
            settingsObj[s.key] = s.value
          })
          setSettings(prev => ({ ...prev, ...settingsObj }))
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        key,
        value
      }))

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsArray })
      })

      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (key: keyof Settings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="admin-page-header">
        <h1 className="admin-page-title">Settings</h1>
        <p className="admin-page-subtitle">Loading...</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Settings</h1>
        <p className="admin-page-subtitle">Manage your site settings and configuration.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid-2">
          <div className="glass-card">
            <div className="glass-card-header">
              <h3 className="glass-card-title">General Settings</h3>
            </div>
            <div className="glass-card-body">
              <div className="form-group">
                <label className="form-label">Site Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.siteTitle}
                  onChange={(e) => handleChange('siteTitle', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Site Description</label>
                <textarea
                  className="form-textarea"
                  value={settings.siteDescription}
                  onChange={(e) => handleChange('siteDescription', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={settings.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="glass-card">
            <div className="glass-card-header">
              <h3 className="glass-card-title">Contact Information</h3>
            </div>
            <div className="glass-card-body">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  value={settings.phoneNumber}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea
                  className="form-textarea"
                  value={settings.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </div>

          <div className="glass-card">
            <div className="glass-card-header">
              <h3 className="glass-card-title">Social Links</h3>
            </div>
            <div className="glass-card-body">
              <div className="form-group">
                <label className="form-label">Facebook</label>
                <input
                  type="url"
                  className="form-input"
                  value={settings.facebookUrl}
                  onChange={(e) => handleChange('facebookUrl', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Instagram</label>
                <input
                  type="url"
                  className="form-input"
                  value={settings.instagramUrl}
                  onChange={(e) => handleChange('instagramUrl', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">LinkedIn</label>
                <input
                  type="url"
                  className="form-input"
                  value={settings.linkedinUrl}
                  onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Twitter</label>
                <input
                  type="url"
                  className="form-input"
                  value={settings.twitterUrl}
                  onChange={(e) => handleChange('twitterUrl', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-secondary" onClick={fetchSettings}>
            <RefreshCw size={18} /> Reset
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <Save size={18} /> {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
